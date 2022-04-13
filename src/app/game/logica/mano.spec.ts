import { Carta } from './carta';
import { Mano } from './mano';
import * as util from "./util";

describe('Mano', () => {
  let service: Mano;

  beforeEach(() => {
    service = new Mano();
  });

  it('should create a correct instance', () => {
    expect(service).toBeTruthy();
    expect(service.length()).toEqual(0);
  });

  it('should add a card', () => {
    //La mano esta vacia
    expect(service.length()).toEqual(0);
    expect(service.has(new Carta(util.Valor.CERO,util.Color.AZUL))).toBeFalsy();
    //Se añade la carta
    service.add(new Carta(util.Valor.CERO,util.Color.AZUL));
    //La mano contiene la carta
    expect(service.length()).toEqual(1);
    expect(service.has(new Carta(util.Valor.CERO,util.Color.AZUL))).toBeTruthy();
  });

  it('should remove a card', () => {
    //Se añade la carta
    service.add(new Carta(util.Valor.CERO,util.Color.AZUL));
    //Se borra la carta
    service.remove(new Carta(util.Valor.CERO,util.Color.AZUL))
    //La mano esta vacia
    expect(service.length()).toEqual(0);
    expect(service.has(new Carta(util.Valor.CERO,util.Color.AZUL))).toBeFalsy();
  });
});
