import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
        this.dialog.open(esperarTokenCorreo);
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
    return this.country == "" || this.username == "" || this.email == "" || this.password == "" || this.confirmPassword == "" || !this.tos 
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
  selector: 'esperarTokenCorreo',
  templateUrl: './esperarTokenCorreo.html',
  styleUrls: ['./register.component.css']
})
export class esperarTokenCorreo {

  token:string = "";
  constructor(public userService: UsersService,public route:Router){}

  mandarCodigo(){
    this.userService.mandarEmail(this.token).subscribe({
      next: (data) => {
        console.log("Ha ido bien");
        this.route.navigateByUrl('/login');
      },error: (e) =>{
        console.log("Token incorrecto");
        console.log(e.message);
      }
      

    })


    }
  

}