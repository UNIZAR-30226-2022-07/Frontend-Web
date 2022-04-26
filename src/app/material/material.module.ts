import { NgModule } from '@angular/core';

import { MatListModule } from '@angular/material/list'
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule }from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  imports: [
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
  ],

  exports: [
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
  ]
})

export class MaterialModule {}