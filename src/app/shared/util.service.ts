import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  async confusionMatrix(model: tf.Sequential, features: number[], target: number[], dataMean: tf.Tensor, dataStd: tf.Tensor) {

    const predictions: any = [];



    // const promessas = features.map(async (elem: any) => {
    //   const aux = await this.predict_normalized(model, [...elem], dataMean, dataStd);

    //   let respose;

    //   if (aux < 0.5)
    //     respose = 0;
    //   else
    //     respose = 1;

    //   // console.log(respose);

    //   predictions.push(respose)
    // });

    // Promise.all(promessas);
    for (let elem of features) {

      const aux_2: any = elem;

      const aux = await this.predict_normalized(model, aux_2, dataMean, dataStd);

      let respose;

      if (aux < 0.5)
        respose = 0;
      else
        respose = 1;

      // console.log(respose);

      predictions.push(respose)

    }

    console.log(predictions.length);
    console.log(target.length);


    // Defining predictions, labels and 
    // numClasses
    const lab = tf.tensor1d(target, 'int32');
    const pred = tf.tensor1d(predictions, 'int32');
    const num_Cls = 2;

    // // Calling tf.confusionMatrix() method
    const output = tf.math.confusionMatrix(lab, pred, num_Cls);

    // // Printing output
    // output.print();

    // const labels = tf.tensor1d([0, 1, 0, 1, 0, 1], 'int32');
    // const predictions = tf.tensor1d([0, 1, 0, 1, 0, 1], 'int32');
    // const numClasses = 2;
    // const out = tf.math.confusionMatrix(labels, predictions, numClasses);
    // out.print();

    return output.dataSync();

  }

  async predict_normalized(model: tf.Sequential, value: number[], dataMean: tf.Tensor, dataStd: tf.Tensor) {
    const prediction = await model.predict(this.normalizeTensor(tf.tensor2d([[...value]]), dataMean, dataStd)) as tf.Tensor;

    const prediction_value = prediction.dataSync()[0];

    return prediction_value;
  }



  determineMeanAndStddev(data: tf.Tensor) {
    const dataMean = data.mean(0);
    // TODO(bileschi): Simplify when and if tf.var / tf.std added to the API.
    const diffFromMean = data.sub(dataMean);
    const squaredDiffFromMean = diffFromMean.square();
    const variance = squaredDiffFromMean.mean(0);
    const dataStd = variance.sqrt();
    return { dataMean, dataStd };
  }

  normalizeTensor(data: tf.Tensor, dataMean: tf.Tensor, dataStd: tf.Tensor) {
    return data.sub(dataMean).div(dataStd);
  }


  shuffle(data: any, target: any) {
    let counter = data.length;
    let temp = 0;
    let index = 0;
    while (counter > 0) {
      index = (Math.random() * counter) | 0;
      counter--;
      // data:
      temp = data[counter];
      data[counter] = data[index];
      data[index] = temp;
      // target:
      temp = target[counter];
      target[counter] = target[index];
      target[index] = temp;
    }
  };

}
