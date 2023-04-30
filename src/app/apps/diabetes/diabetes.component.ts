import { Component, OnInit } from '@angular/core';


//TensorFlow.js
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { UtilService } from 'src/app/shared/util.service';



//Link for Google Sheet for loading the dataset
const csvUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIscV53ecu0x-apaqh1Sk3ED3qlVdMLxh9AcPdhDPH2VNogn-kKfAP8j9MYKWk7_inouIR9dFMDaUe/pub?gid=0&single=true&output=csv';


@Component({
  selector: 'app-diabetes',
  templateUrl: './diabetes.component.html',
  styleUrls: ['./diabetes.component.scss']
})
export class DiabetesComponent implements OnInit {

  confusion = { tp: 0, fp: 0, fn: 0, tn: 0 }

  prediction_value: any;
  value!: any;

  //Random samples for final test
  class_zero_sample: any = [];
  class_one_sample: any = [];

  dataset: any;

  accurracy!: string

  showTraining = true;

  model: any;

  training = false;

  constructor(private util: UtilService) { }


  ngOnInit(): void {
    this.loadData();
    if (this.showTraining)
      this.visualizeDataset();
    this.defineAndTrainModel();

  }

  dataMean!: any;
  dataStd!: any;

  /**Training */
  async defineAndTrainModel() {
    this.training = true;

    const numberEpochs = 100;

    // numOfFeatures is the number of column or features minus the label column
    const numOfFeatures = (await this.dataset.columnNames()).length - 1;
    const trainingSurface = { name: 'Loss and MSE', tab: 'Training' };
    // Define the model.

    const features: any = [];
    const target: any = [];


    await this.dataset.forEachAsync((e: any) => {
      // Extract the features from the dataset
      // If the label is 0, add the features to the "classZero" array

      //One random sample of each
      if ((e.ys.diabetes === 0) && (Math.random() < 0.5))
        this.class_zero_sample = Object.values(e.xs);

      if ((e.ys.diabetes === 1) && (Math.random() < 0.5))
        this.class_one_sample = Object.values(e.xs)


      features.push(Object.values(e.xs));
      target.push(e.ys.diabetes);


    });

    this.util.shuffle(features, target);

    const features_tensor_raw = tf.tensor2d(features, [features.length, numOfFeatures]);
    const target_tensor = tf.tensor2d(target, [target.length, 1])

    //mean and std
    let { dataMean, dataStd } = this.util.determineMeanAndStddev(features_tensor_raw);

    this.dataMean = dataMean;
    this.dataStd = dataStd;

    const features_tensor_normalized = this.util.normalizeTensor(features_tensor_raw, dataMean, dataStd);

    const model = tf.sequential();

    // Add a Dense layer to the Sequential model

    //Input layer
    model.add(
      tf.layers.dense({
        inputShape: [numOfFeatures],
        units: 50,
        activation: 'relu',
      })
    );

    //Output Layer
    model.add(
      tf.layers.dense(
        { units: 1, activation: 'sigmoid' }
      ));


    model.compile({
      optimizer: tf.train.adam(),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    // Print the summary to console
    model.summary();

    if (this.showTraining) {// Fit the model
      await model.fit(features_tensor_normalized, target_tensor, {
        batchSize: 40,
        epochs: numberEpochs,
        validationSplit: 0.2,

        callbacks: [
          // Show on a tfjs-vis visor the loss and accuracy values at the end of each epoch.
          tfvis.show.fitCallbacks(trainingSurface, ['loss', 'acc', "val_loss", "val_acc"], {
            callbacks: ['onEpochEnd'],
          }),
          {
            // Print to console the loss value at the end of each epoch.
            onEpochEnd: async (epoch: any, logs: any) => {
              // console.log(`${epoch}:${logs.loss}`);
              // console.log(logs);

              this.accurracy = `${logs.val_acc * 100}%`;

            },
          },
          {
            onTrainEnd: async () => {
              // console.log('Training has ended.');
              this.training = false;
            },
          },
        ],
      });


    } else {
      // Fit the model
      await model.fit(features_tensor_normalized, target_tensor, {
        batchSize: 40,
        epochs: numberEpochs,
        validationSplit: 0.2,
        callbacks: [

          {
            // Print to console the loss value at the end of each epoch.
            onEpochEnd: async (epoch: any, logs: any) => {
              this.accurracy = `${logs.val_acc * 100}%`;
            },
          },

          {
            onTrainEnd: async () => {
              // console.log('Training has ended.');
              this.training = false;
            },
          }


        ],

      });
    }
    // // Output value should be near 0.
    // (model.predict(tf.tensor2d([[...this.class_zero_sample]])) as tf.Tensor).print();
    // // Output value should be near 1.
    // (model.predict(tf.tensor2d([[...this.class_one_sample]])) as tf.Tensor).print();


    // Output value should be near 0.
    (model.predict(this.util.normalizeTensor(tf.tensor2d([[...this.class_zero_sample]]), dataMean, dataStd)) as tf.Tensor).print();

    // Output value should be near 1.
    (model.predict(this.util.normalizeTensor(tf.tensor2d([[...this.class_one_sample]]), dataMean, dataStd)) as tf.Tensor).print();

    this.model = model;

    const aux_confusion = await this.util.confusionMatrix(model, features, target, this.dataMean, this.dataStd);


    // console.log(aux_confusion);

    this.confusion.tp = aux_confusion[0] / 10;
    this.confusion.fp = aux_confusion[1] / 10;
    this.confusion.fn = aux_confusion[2] / 10;
    this.confusion.tn = aux_confusion[3] / 10;

    console.log(this.confusion);






  }

  async predict() {

    this.prediction_value = await this.util.predict_normalized(this.model, [this.value], this.dataMean, this.dataStd);
  }



  /**Load dataset from link */
  loadData() {
    // Our target variable (what we want to predict) is the column 'label' (wow, very original),
    // so we specify it in the configuration object as the label
    this.dataset = tf.data.csv(csvUrl, {
      columnConfigs: {
        diabetes: {
          isLabel: true,
        },
      },
    });
  }


  async visualizeDataset() {
    // tfjs-vis surface's names and tabs
    const dataSurface = { name: 'Diabetes prediction dataset (Kaggle)', tab: 'Charts' };
    const classZero: any = [];
    const classOne: any = [];


    await this.dataset.forEachAsync((e: any) => {
      // Extract the features from the dataset
      const features = { x: e.xs.HbA1c_level, y: e.ys.diabetes };
      // If the label is 0, add the features to the "classZero" array
      if (e.ys.diabetes === 0) {
        classZero.push(features);
      } else if (e.ys.diabetes === 1) {
        classOne.push(features);
      }
    });

    // Specify the name of the labels. This will show up in the chart's legend.
    const series = ['No diabetes', 'Diabetes'];
    const dataToDraw = { values: [classZero, classOne], series };

    tfvis.render.scatterplot(dataSurface, dataToDraw, {
      xLabel: 'HbA1c level',
      yLabel: 'Diabetes',
      zoomToFit: true,
    });
  }

}
