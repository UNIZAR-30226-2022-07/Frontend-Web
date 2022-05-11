import { Jugador } from './jugador';
import { Mano } from './mano';

describe('Jugador', () => {
  let service: Jugador;

  it('should create an instance', () => {
    service = new Jugador("Test name",new Mano([]))
    expect(service).toBeTruthy();
    expect(service.nombre).toEqual("Test name");
  });
});
