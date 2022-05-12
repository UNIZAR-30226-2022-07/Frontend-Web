import { Carta } from "./carta";

export class Mano {
  private cartas: Carta[] = [];
  constructor(c: Carta[]) {this.cartas = c;}

  has(card: Carta) {
    if (!card) return false;

    return this.cartas.some(
      (c) => c.value === card.value && c.color === card.color,
    );
  }

  remove(card: Carta) {
    if (!this.has(card)) return;

    const i = this.cartas.findIndex(
      (c) => c.value === card.value && c.color === card.color,
    );
    this.cartas.splice(i, 1);
  }

  length() : number {
    return this.cartas.length;
  }

  add(card: Carta) {
    this.cartas.push(card);
  }

  set(n: number) {
    this.cartas = Array(n);
  }

  getArray() {
    return this.cartas;
  }
}
