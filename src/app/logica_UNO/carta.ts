import * as util from "./util";

export class Carta {
  private _value!: util.Valor; 
  private _color!: util.Color;

  constructor(value: util.Valor, color: util.Color) {
    if (util.isWild(value) && color === util.Color.INDEFINIDO) {
      throw Error('Solo las cartas wild (+4 o cambio de color) pueden ser inicializadas sin color.');
    }

    this.value = value;
    this.color = color;
  }

  get value() {
    return this._value;
  }

  set value(value: util.Valor) {
    if (this._value !== undefined && !util.isWild(this._value))
      throw new Error('El valor de las cartas no se puede cambiar.');
    this._value = value;
  }

  get color() {
    return this._color;
  }


  set color(color: util.Color) {
    if (this._color === util.Color.INDEFINIDO && !util.isWild(this._value))
      throw new Error('Solo puedes cambiar el color de una carta wild (+4 o cambio de color)');
    
    this._color = color;
  }

}

