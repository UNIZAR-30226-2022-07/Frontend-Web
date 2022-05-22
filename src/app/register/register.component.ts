import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //Form
  username: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  country: string = "";
  tos: boolean = false;
  
  //Error handling
  passwordError: boolean = false;
  serviceError: boolean = false;
  serviceErrorMessage: string = "";
  userError: boolean = false;
  userErrorMessage: string = "";

  constructor(public userService: UsersService, public router: Router, public dialog:MatDialog) { }

  ngOnInit(): void {
  }

  //Metodo ejecutado al presionar el boton "registrarse"
  register_button() {
    if(this.password != this.confirmPassword) {
      this.passwordError = true;
      return;
    }
    this.passwordError = false;
    const user = { username: this.username, email: this.email, pais: this.country, password: this.password };
     this.userService.register(user).subscribe({
      next: (v) => {
        console.log("Ha ido bien");
        this.dialog.open(esperarTokenCorreo,
          {
            data: this.username,
          });
      },
      error: (e) => {
        if (e.error.message != undefined) {
          console.error(e);
          this.userError = true;
          this.userErrorMessage = e.error.message;
        }
        else {
          console.error(e);
          this.serviceError = true;
          this.serviceErrorMessage = e.message;
        }
      }
    });
  }

  //Devuelve false si se puede hacer click en el boton register. True en caso contrario 
  validate() {
    return this.country == "" || this.username == "" || this.email == "" || this.password == "" || this.confirmPassword == ""
  }

  abrirEsperarToken(){
    this.dialog.open(esperarTokenCorreo); 
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
  selector: 'esperarTokenCorreo',
  templateUrl: './esperarTokenCorreo.html',
  styleUrls: ['./register.component.css']
})
export class esperarTokenCorreo {

  token:string = "";
  nombre : string = "";
  usuarioVacio:boolean = false;
  tokenVacio:boolean = false;
  tokenIncorrecto:boolean = false;
  constructor(public userService: UsersService,public route:Router,public dialogRef: MatDialogRef<esperarTokenCorreo>, public snackBar:MatSnackBar){}

  mandarCodigo(){
    this.userService.mandarEmail(this.nombre,this.token).subscribe({
      next: (data) => {
        console.log("Ha ido bien");
        this.dialogRef.close();
        this.route.navigateByUrl('/login');
        this.snackBar.open("Cuenta activada con éxito",'',{duration: 4000});
      },error: (e) =>{
        console.log("Token incorrecto");
        if( this.nombre == ""){
          this.usuarioVacio = true;
        }else if(this.token == ""){
          this.tokenVacio = true;
        }
        else{
          this.tokenIncorrecto = true;
        }
        console.log(e.message);
      }
      

    })


    }
  

}