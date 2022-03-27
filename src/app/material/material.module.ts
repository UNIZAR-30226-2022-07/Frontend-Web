import { NgModule } from '@angular/core';

import {

MatListModule} from '@angular/material/list'
import{
  MatDialogModule
} from '@angular/material/dialog';
import{
  MatButtonModule
}from '@angular/material/button'
import { from } from 'rxjs';
@NgModule({


imports: [

MatListModule,
MatDialogModule,
MatButtonModule

],

exports: [

MatListModule,
MatDialogModule,
MatButtonModule

]

})

export class MaterialModule {}