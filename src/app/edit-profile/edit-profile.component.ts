


import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

import { UsersService } from '../users.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  name: string;
  pais: string;
  constructor(public UsersService: UsersService, public router:Router, public dialog:MatDialog) {
    this.name = "";
    this.pais = "";
   }

  ngOnInit(): void {
  }


  change_name(): void{
    this.UsersService.changeName(this.name).subscribe({
      next: (data) => {
        console.log("el nombre es " + this.name);
        this.router.navigate(['/login']);
      },error:(data) => {
        console.log(" Ha ido mal");
      }
    })
  }

  change_country(): void{
    this.UsersService.changeCountry(this.pais).subscribe({
      next: (data) => {
        console.log("el nombre del pais es " + this.pais);
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
    "Afganistán",
    "Albania",
    "Alemania",
    "Andorra",
    "Angola",
    "Anguila",
    "Antártida",
    "Antigua y Barbuda",
    "Arabia Saudita",
    "Argelia",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaiyán",
    "Bélgica",
    "Bahamas",
    "Bahrein",
    "Bangladesh",
    "Barbados",
    "Belice",
    "Benín",
    "Bhután",
    "Bielorrusia",
    "Birmania",
    "Bolivia",
    "Bosnia y Herzegovina",
    "Botsuana",
    "Brasil",
    "Brunéi",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Camboya",
    "Camerún",
    "Canadá",
    "Chad",
    "Chile",
    "China",
    "Chipre",
    "Ciudad del Vaticano",
    "Colombia",
    "Comoras",
    "República del Congo",
    "República Democrática del Congo",
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
    "Emiratos Árabes Unidos",
    "Eritrea",
    "Eslovaquia",
    "Eslovenia",
    "España",
    "Estados Unidos de América",
    "Estonia",
    "Etiopía",
    "Filipinas",
    "Finlandia",
    "Fiyi",
    "Francia",
    "Gabón",
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
    "Haití",
    "Honduras",
    "Hong kong",
    "Hungría",
    "India",
    "Indonesia",
    "Irán",
    "Irak",
    "Irlanda",
    "Isla Bouvet",
    "Isla de Man",
    "Isla de Navidad",
    "Isla Norfolk",
    "Islandia",
    "Islas Bermudas",
    "Islas Caimán",
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
    "Islas Salomón",
    "Islas Turcas y Caicos",
    "Islas Ultramarinas Menores de Estados Unidos",
    "Islas Vírgenes Británicas",
    "Islas Vírgenes de los Estados Unidos",
    "Israel",
    "Italia",
    "Jamaica",
    "Japón",
    "Jersey",
    "Jordania",
    "Kazajistán",
    "Kenia",
    "Kirguistán",
    "Kiribati",
    "Kuwait",
    "Líbano",
    "Laos",
    "Lesoto",
    "Letonia",
    "Liberia",
    "Libia",
    "Liechtenstein",
    "Lituania",
    "Luxemburgo",
    "México",
    "Mónaco",
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
    "Omán",
    "Países Bajos",
    "Pakistán",
    "Palau",
    "Palestina",
    "Panamá",
    "Papúa Nueva Guinea",
    "Paraguay",
    "Perú",
    "Polinesia Francesa",
    "Polonia",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reino Unido",
    "República Centroafricana",
    "República Checa",
    "República Dominicana",
    "República de Sudán del Sur",
    "Reunión",
    "Ruanda",
    "Rumanía",
    "Rusia",
    "Sahara Occidental",
    "Samoa",
    "Samoa Americana",
    "San Bartolomé",
    "San Cristóbal y Nieves",
    "San Marino",
    "San Martín (Francia)",
    "San Pedro y Miquelón",
    "San Vicente y las Granadinas",
    "Santa Elena",
    "Santa Lucía",
    "Santo Tomé y Príncipe",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leona",
    "Singapur",
    "Sint Maarten",
    "Siria",
    "Somalia",
    "Sri lanka",
    "Sudáfrica",
    "Sudán",
    "Suecia",
    "Suiza",
    "Surinám",
    "Svalbard y Jan Mayen",
    "Swazilandia",
    "Tayikistán",
    "Tailandia",
    "Taiwán",
    "Tanzania",
    "Territorio Británico del Océano Índico",
    "Territorios Australes y Antárticas Franceses",
    "Timor Oriental",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad y Tobago",
    "Tunez",
    "Turkmenistán",
    "Turquía",
    "Tuvalu",
    "Ucrania",
    "Uganda",
    "Uruguay",
    "Uzbekistán",
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