import { NgModule } from '@angular/core';

import {

MatListModule} from '@angular/material/list'
import{
  MatDialogModule
} from '@angular/material/dialog';
import{
  MatButtonModule
}from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon';
import { from } from 'rxjs';
@NgModule({


imports: [

MatListModule,
MatDialogModule,
MatButtonModule,
MatIconModule

],

exports: [

MatListModule,
MatDialogModule,
MatButtonModule,
MatIconModule

]

})

export class MaterialModule {}