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
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { from } from 'rxjs';
@NgModule({


imports: [

MatListModule,
MatDialogModule,
MatButtonModule,
MatIconModule,
MatToolbarModule,
MatDividerModule

],

exports: [

MatListModule,
MatDialogModule,
MatButtonModule,
MatIconModule,
MatToolbarModule,
MatDividerModule

]

})

export class MaterialModule {}