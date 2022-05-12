import { Carta } from "./carta"

export enum Valor {
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
CERO = "CERO",
UNO = "UNO",
DOS = "DOS",
TRES = "TRES",
CUATRO = "CUATRO",
CINCO = "CINCO",
SEIS = "SEIS",
SIETE = "SIETE",
OCHO = "OCHO",
NUEVE = "NUEVE",
DRAW2 = "MAS_DOS",
REVERSE = "CAMBIO_SENTIDO",
SKIP = "BLOQUEO",
WILD = "CAMBIO_COLOR",
DRAW4 = "MAS_CUATRO",
}

export enum Backend_Color {
  ROJO = "ROJO", AMARILLO = "AMARILLO", AZUL = "AZUL", VERDE = "VERDE", INDEFINIDO = "UNDEFINED"
}

export enum Reglas {
  CERO_SWITCH = "CERO_SWITCH",
  CRAZY_7 = "CRAZY_7",
  PROGRESSIVE_DRAW = "PROGRESSIVE_DRAW",
  CHAOS_DRAW = "CHAOS_DRAW",
  BLOCK_DRAW = "BLOCK_DRAW",
  REPEAT_DRAW = "REPEAT_DRAW" 
}
  /**
   * Convertidor de backend a frontend. Convierte los valores que vienen de backend en una carta
   * @param color Color que llega de backend
   * @param valor Valor que llega de backend
   * @returns Carta con los valores correctos
  */
export function BTF_carta(color: Backend_Color, valor: Backend_Valor) : Carta {
  return new Carta(Object.values(Valor).indexOf(Object.keys(Backend_Valor)[Object.values(Backend_Valor).indexOf(valor)]),Object.values(Color).indexOf(Object.keys(Backend_Color)[Object.values(Backend_Color).indexOf(color)])+1) //Un pequeño hack
}

export function FTB_carta(c:Carta) {
  return {
    numero: Object.values(Backend_Valor)[Object.keys(Backend_Valor).indexOf(Valor[c.value] as Backend_Valor)],
    color: Object.values(Backend_Color)[Object.keys(Backend_Color).indexOf(Color[c.color] as Backend_Color)]
  }
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
  else {
    //TODO: Checkear reglas custom
    return Ultimacarta.color == cartaAJugar.color || Ultimacarta.value == cartaAJugar.value;
  }
}