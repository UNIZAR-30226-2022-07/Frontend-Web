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
import {MatTableModule} from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

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
    MatTableModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRadioModule,
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
    MatTableModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRadioModule,
  ]
})

export class MaterialModule {}