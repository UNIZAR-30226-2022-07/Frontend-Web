import { Carta } from "./carta"

export enum Valor {
  // numbers
  CERO = 0,
  UNO = 1,
  DOS = 2,
  TRES = 3,
  CUATRO = 4,
  CINCO = 5,
  SEIS = 6,
  SIETE = 7,
  OCHO = 8,
  NUEVE = 9,
  // special cards
  DRAW2 = 10,
  REVERSE = 11,
  SKIP = 12,
  WILD = 13,
  DRAW4 = 14,
}

export enum Color {
  ROJO = 1,
  AZUL = 2,
  VERDE = 3,
  AMARILLO = 4,
  INDEFINIDO = 5,
}

export enum Direccion {
  NORMAL = 0,
  INVERSA = 1,
}


export enum Backend_Valor {
  CERO = 0,
  UNO = 1,
  DOS = 2,
  TRES = 3, 
  CUATRO = 4, 
  CINCO = 5, 
  SEIS = 6, 
  SIETE = 7, 
  OCHO = 8, 
  NUEVE = 9, 
  BLOQUEO = 12, 
  MAS_DOS = 10, 
  CAMBIO_SENTIDO = 11, 
  UNDEFINED = 13, 
  MAS_CUATRO = 14
}

export enum Backend_Color {
  ROJO = 1, AMARILLO = 4, AZUL = 2, VERDE = 3, CAMBIO_COLOR = 5
}

  /**
   * Convertidor de backend a frontend. Convierte los valores que vienen de backend en una carta
   * @param color Color que llega de backend
   * @param valor Valor que llega de backend
   * @returns Carta con los valores correctos
  */
export function BTF_carta(color: Backend_Color, valor: Backend_Valor) : Carta {
  return new Carta(valor as number as Valor, color as number as Color) //Un pequeño hack
}

export function isSpecial(value: Valor) {
  return value >= 10
}

export function isWild(value: Valor) {
  return value >= 13
}
// Dada la última carta y la  que se quiere jugar = , devuelve TRUE si es posible jugarla = , sino devuelve FALSE
export function sePuedeJugar(Ultimacarta:Carta, cartaAJugar:Carta) {
  if(isWild(cartaAJugar.value)) {    // ES +4 o CAMBIO DE COLOR. Estas siempre se pueden jugar
    return true;
  }
  else {    //ES ESPECIAL Y TIENE EL MISMO COLOR -> SE PUEDE JUGAR
    if(isSpecial(cartaAJugar.value) && Ultimacarta.color == cartaAJugar.color) {
      return true;
    }
    else if(isSpecial(cartaAJugar.value) && Ultimacarta.color != cartaAJugar.color) {
      return false;
    }
    else {    //NO ES ESPECIAL
      return Ultimacarta.color == cartaAJugar.color || Ultimacarta.value == cartaAJugar.value;
    }
  }
}