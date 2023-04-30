import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentralcardComponent } from './components/centralcard/centralcard.component';
import { DiabetesComponent } from './apps/diabetes/diabetes.component';

const routes: Routes = [{ "path": "tools", component: CentralcardComponent },
{ "path": "tools/diabetes", component: DiabetesComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
