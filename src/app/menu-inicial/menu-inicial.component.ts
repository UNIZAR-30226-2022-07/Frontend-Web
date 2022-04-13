
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';



@Component({
  selector: 'app-menu-inicial',
  templateUrl: './menu-inicial.component.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class MenuInicialComponent implements OnInit {

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogContent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }
    openNotis(){
      const dialogRef = this.dialog.open(NotisContent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      })
    }


}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./menu-inicial.component.css']
})
export class DialogContent {}

@Component({
  selector: 'notis-content',
  templateUrl: 'notis-content.html' ,
  styleUrls: ['./menu-inicial.component.css']
})
export class NotisContent {}