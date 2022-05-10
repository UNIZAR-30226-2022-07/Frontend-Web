import { Component, OnInit } from '@angular/core';


import { RankingService } from '../ranking.service';

export class infoClasificacion{
  nombre : string ;
  puntos : string ;
  pais : string;

  constructor(){
    this.nombre = "";
    this.puntos = "";
    this.pais = "";

  }
 
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  
  cuerpo_mensaje  : string = "";
  
  dataAmigos: Array<infoClasificacion> = [];
  dataGlobal: Array<infoClasificacion> = [];
  dataNacional: Array<infoClasificacion> = [];
  
  


  displayedColumns = ['No.', 'Nombre', 'Puntos'];
  
  constructor(public RankingService : RankingService) {
   
   }

  parsearJSON(msg:any, data:Array<infoClasificacion>): void{
    this.cuerpo_mensaje = msg.split("\,");
    console.log("El mensaje es " + this.cuerpo_mensaje);

    let config : infoClasificacion;
    const msg_nombre = typeof this.cuerpo_mensaje?.[0] === 'string' ? this.cuerpo_mensaje[0].substring(2, this.cuerpo_mensaje[0].length) : '';

    const msg_pais = typeof this.cuerpo_mensaje?.[2] === 'string' ? this.cuerpo_mensaje[2].substring(0, this.cuerpo_mensaje[2].length -1) : '';
    config = {
      
      nombre : msg_nombre,
      puntos : this.cuerpo_mensaje[1],
      pais : msg_pais,

    }
    data.push(config);
    // Se separa dentro por comas ya que el JSON los trata como campos del tipo (nombre,puntos,pais)
    for (let n = 3; n< this.cuerpo_mensaje.length; n = n+3) {
      
      console.log("tamaño " + this.cuerpo_mensaje.length);

     
      
      let config : infoClasificacion;

      const msg_nombre = typeof this.cuerpo_mensaje?.[n] === 'string' ? this.cuerpo_mensaje[n].substring(1, this.cuerpo_mensaje[n].length) : '';
      const msg_pais = typeof this.cuerpo_mensaje?.[n+2] === 'string' ? this.cuerpo_mensaje[n+2].substring(0, this.cuerpo_mensaje[n].length -1) : '';
      config = {
        
        nombre : msg_nombre,
        puntos : this.cuerpo_mensaje[n+1],
        pais : msg_pais,

      }
      
      data.push(config);
    }
  }

  ngOnInit(): void {
    //Pruebas
    
  
    // AMIGOS
    this.RankingService.friendsRanking().subscribe({
      next: (data) => {

        const msg = data.message;
        this.parsearJSON(msg,this.dataAmigos);


      },
      error: (e) =>{
        console.log("No ha cargado amigos");
      }
    })
  

    //NACIONAL
    this.RankingService.NacionalRanking().subscribe({
      next: (data) => {

        
        const msg = data.message;



        this.cuerpo_mensaje = msg.split("\,");
        console.log("El mensaje es " + this.cuerpo_mensaje);
    
        let config : infoClasificacion;
        const msg_nombre = typeof this.cuerpo_mensaje?.[0] === 'string' ? this.cuerpo_mensaje[0].substring(2, this.cuerpo_mensaje[0].length) : '';
    
        let puntos:any = this.cuerpo_mensaje[1].split("\"");
        config = {
          
          nombre : msg_nombre,
          puntos : puntos[0],
          pais : "",
    
        }
        this.dataNacional.push(config);
        // Se separa dentro por comas ya que el JSON los trata como campos del tipo (nombre,puntos,pais)
        for (let n = 2; n< this.cuerpo_mensaje.length; n = n+2) {
          
          console.log("tamaño " + this.cuerpo_mensaje.length);
    
         
          
          let config : infoClasificacion;
    
          const msg_nombre = typeof this.cuerpo_mensaje?.[n] === 'string' ? this.cuerpo_mensaje[n].substring(1, this.cuerpo_mensaje[n].length) : '';
          if ( n+1 == this.cuerpo_mensaje.length - 1){
              let puntos: any = this.cuerpo_mensaje[n+1].substring(1,length -2);
          }else{
            let puntos:any = this.cuerpo_mensaje[n+1].split("\"");

          }
          config = {
            
            nombre : msg_nombre,
            puntos : puntos[0],
            pais : "",
    
          }
          
          this.dataNacional.push(config);
        }



        console.log("Ha cargado amigos por pais");
        console.log("Mensaje recibido:" + data);
        console.log("Mensaje recibido:" + msg);

       

      },
      error: (e) =>{
        console.log("No ha cargado amigos");
      }
    })


    this.RankingService.GlobalRanking().subscribe({
      next: (data) => {

        
        const msg = data.message;



        console.log("Ha cargado todos los usuarios");
        console.log("Mensaje recibido:" + data);
        console.log("Mensaje recibido:" + msg);

        this.parsearJSON(msg,this.dataGlobal);

      },
      error: (e) =>{
        console.log("No ha cargado amigos");
      }
    })

    //this.dataAmigos = [{nombre:"cesar", puntos:30}, {nombre:"victor",puntos:18},{nombre:"marcos",puntos:10},{nombre:"carla",puntos:8},{nombre:"cesar", puntos:30}, {nombre:"victor",puntos:18},{nombre:"marcos",puntos:10},{nombre:"cesar", puntos:30}, {nombre:"victor",puntos:18},{nombre:"marcos",puntos:10}];
   // this.dataNacional = [{nombre:"Lacasta", puntos:300}, {nombre:"Luismi",puntos:180},{nombre:"javivi23",puntos:100},{nombre:"elMosco",puntos:80}];
    //this.dataGlobal = [{nombre:"faker", puntos:3000000}, {nombre:"will smith",puntos:1800},{nombre:"reventaoDelUno",puntos:1000},{nombre:"test",puntos:800}];
  }

}
