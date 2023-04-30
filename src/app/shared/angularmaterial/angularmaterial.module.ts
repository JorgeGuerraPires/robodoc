import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';

const angularmaterial = [MatInputModule, MatToolbarModule, MatIconModule, MatCardModule, MatButtonModule, MatTooltipModule, MatGridListModule]

@NgModule({
  imports: [...angularmaterial],
  exports: [...angularmaterial]
})
export class AngularmaterialModule { }
