import { Carta } from "./carta";

export class Mano {
  cartas: Carta[] = [];

  tieneCarta(card: Carta) {
    if (!card) return false;

    return this.cartas.some(
      (c) => c.value === card.value && c.color === card.color,
    );
  }

  borrarCarta(card: Carta) {
    if (!this.tieneCarta(card)) return;

    const i = this.cartas.findIndex(
      (c) => c.value === card.value && c.color === card.color,
    );
    this.cartas.splice(i, 1);
  }

  length() {
    return this.cartas.length
  }
}
