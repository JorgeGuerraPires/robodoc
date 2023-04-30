import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AngularmaterialModule } from './shared/angularmaterial/angularmaterial.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CentralcardComponent } from './components/centralcard/centralcard.component';
import { DiabetesComponent } from './apps/diabetes/diabetes.component';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    CentralcardComponent,
    DiabetesComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularmaterialModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
