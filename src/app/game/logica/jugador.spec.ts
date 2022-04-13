import { Jugador } from './jugador';

describe('Jugador', () => {
  let service: Jugador;

  it('should create an instance', () => {
    service = new Jugador("Test name")
    expect(service).toBeTruthy();
    expect(service.nombre).toEqual("Test name");
  });
});
