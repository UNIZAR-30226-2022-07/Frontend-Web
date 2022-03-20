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

export function isSpecial(value: Valor) {
  return value >= 10
}

export function isWild(value: Valor) {
  return value >= 13
}
