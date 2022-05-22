


import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

import { UsersService } from '../users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  name: string;
  pais: string;
  constructor(public UsersService: UsersService, public router:Router, public dialog:MatDialog, public snackBar:MatSnackBar) {
    this.name = "";
    this.pais = "";
   }

  ngOnInit(): void {
  }


  change_name(): void{
    this.UsersService.changeName(this.name).subscribe({
      next: (data) => {
        console.log("el nombre es " + this.name);
        this.snackBar.open("Nombre cambiado con éxito",'',{duration: 4000});
        this.router.navigate(['/login']);
      },error:(data) => {
        console.log(" Ha ido mal");
      }
    })
  }

  change_country(): void{
    this.UsersService.changeCountry(this.pais).subscribe({
      next: (data) => {
        this.snackBar.open("País cambiado con éxito",'',{duration: 4000});
        this.router.navigate(['/login']);
      },error:(data) => {
        console.log(" Ha ido mal");
      }
    })
  }


  openMensajeBorrar(){
    const dialogRef2 = this.dialog.open(ConfirmarBorrar,
      {
      });
  }

  public paises = [
    "Afganistan",
    "Albania",
    "Alemania",
    "Andorra",
    "Angola",
    "Anguila",
    "Antartida",
    "Antigua y Barbuda",
    "Arabia Saudita",
    "Argelia",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaiyan",
    "Belgica",
    "Bahamas",
    "Bahrein",
    "Bangladesh",
    "Barbados",
    "Belice",
    "Benin",
    "Bhutan",
    "Bielorrusia",
    "Birmania",
    "Bolivia",
    "Bosnia y Herzegovina",
    "Botsuana",
    "Brasil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Camboya",
    "Camerun",
    "Canada",
    "Chad",
    "Chile",
    "China",
    "Chipre",
    "Ciudad del Vaticano",
    "Colombia",
    "Comoras",
    "Republica del Congo",
    "Republica Democratica del Congo",
    "Corea del Norte",
    "Corea del Sur",
    "Costa de Marfil",
    "Costa Rica",
    "Croacia",
    "Cuba",
    "Curazao",
    "Dinamarca",
    "Dominica",
    "Ecuador",
    "Egipto",
    "El Salvador",
    "Emiratos arabes Unidos",
    "Eritrea",
    "Eslovaquia",
    "Eslovenia",
    "Espana",
    "Estados Unidos de America",
    "Estonia",
    "Etiopia",
    "Filipinas",
    "Finlandia",
    "Fiyi",
    "Francia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Ghana",
    "Gibraltar",
    "Granada",
    "Grecia",
    "Groenlandia",
    "Guadalupe",
    "Guam",
    "Guatemala",
    "Guayana Francesa",
    "Guernsey",
    "Guinea",
    "Guinea Ecuatorial",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong kong",
    "Hungria",
    "India",
    "Indonesia",
    "Iran",
    "Irak",
    "Irlanda",
    "Isla Bouvet",
    "Isla de Man",
    "Isla de Navidad",
    "Isla Norfolk",
    "Islandia",
    "Islas Bermudas",
    "Islas Caiman",
    "Islas Cocos (Keeling)",
    "Islas Cook",
    "Islas de Åland",
    "Islas Feroe",
    "Islas Georgias del Sur y Sandwich del Sur",
    "Islas Heard y McDonald",
    "Islas Maldivas",
    "Islas Malvinas",
    "Islas Marianas del Norte",
    "Islas Marshall",
    "Islas Pitcairn",
    "Islas Salomon",
    "Islas Turcas y Caicos",
    "Islas Ultramarinas Menores de Estados Unidos",
    "Islas Virgenes Britanicas",
    "Islas Virgenes de los Estados Unidos",
    "Israel",
    "Italia",
    "Jamaica",
    "Japon",
    "Jersey",
    "Jordania",
    "Kazajistan",
    "Kenia",
    "Kirguistan",
    "Kiribati",
    "Kuwait",
    "Libano",
    "Laos",
    "Lesoto",
    "Letonia",
    "Liberia",
    "Libia",
    "Liechtenstein",
    "Lituania",
    "Luxemburgo",
    "Mexico",
    "Monaco",
    "Macao",
    "Macedônia",
    "Madagascar",
    "Malasia",
    "Malawi",
    "Mali",
    "Malta",
    "Marruecos",
    "Martinica",
    "Mauricio",
    "Mauritania",
    "Mayotte",
    "Micronesia",
    "Moldavia",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Noruega",
    "Nueva Caledonia",
    "Nueva Zelanda",
    "Oman",
    "Paises Bajos",
    "Pakistan",
    "Palau",
    "Palestina",
    "Panama",
    "Papua Nueva Guinea",
    "Paraguay",
    "Peru",
    "Polinesia Francesa",
    "Polonia",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reino Unido",
    "Republica Centroafricana",
    "Republica Checa",
    "Republica Dominicana",
    "Republica de Sudan del Sur",
    "Reunion",
    "Ruanda",
    "Rumania",
    "Rusia",
    "Sahara Occidental",
    "Samoa",
    "Samoa Americana",
    "San Bartolome",
    "San Cristobal y Nieves",
    "San Marino",
    "San Martin (Francia)",
    "San Pedro y Miquelon",
    "San Vicente y las Granadinas",
    "Santa Elena",
    "Santa Lucia",
    "Santo Tome y Principe",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leona",
    "Singapur",
    "Sint Maarten",
    "Siria",
    "Somalia",
    "Sri lanka",
    "Sudafrica",
    "Sudan",
    "Suecia",
    "Suiza",
    "Surinam",
    "Svalbard y Jan Mayen",
    "Swazilandia",
    "Tayikistan",
    "Tailandia",
    "Taiwan",
    "Tanzania",
    "Territorio Britanico del Oceano indico",
    "Territorios Australes y Antarticas Franceses",
    "Timor Oriental",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad y Tobago",
    "Tunez",
    "Turkmenistan",
    "Turquia",
    "Tuvalu",
    "Ucrania",
    "Uganda",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Wallis y Futuna",
    "Yemen",
    "Yibuti",
    "Zambia",
    "Zimbabue",
  ]


}



@Component({
  selector: 'ConfirmarBorrar',
  templateUrl: 'ConfirmarBorrar.html',
  styleUrls: ['./edit-profile.component.css']
})
export class ConfirmarBorrar {


  constructor(public UsersService: UsersService, public router:Router, public dialog:MatDialog ){
   }

  ngOnInit(): void {
  }


  
  remove_account(): void{
    this.UsersService.removeAccount().subscribe({
      next:(data) => {
        console.log("Cuenta borrada");
        this.router.navigate(['/login']);
      },error: (e) => {
        console.log("Ha ido mal");
      }
    })
  }
}