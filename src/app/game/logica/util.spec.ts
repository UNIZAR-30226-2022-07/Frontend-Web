import * as Util from './util';

describe('Util', () => {
  it('should convert correctly', () => {
    let c1 = Util.BTF_carta(Util.Backend_Color.AMARILLO,Util.Backend_Valor.CINCO);
    let c2 = Util.BTF_carta(Util.Backend_Color.INDEFINIDO,Util.Backend_Valor.DRAW4);
    let c3 = Util.BTF_carta(Util.Backend_Color.INDEFINIDO,Util.Backend_Valor.WILD);

    expect((c1.color == Util.Color.AMARILLO) && (c1.value == Util.Valor.CINCO)).toBeTruthy();
    console.log(c1);
    expect((c2.color == Util.Color.INDEFINIDO) && (c2.value == Util.Valor.DRAW4)).toBeTruthy();
    console.log(c2);
    expect((c3.color == Util.Color.INDEFINIDO) && (c3.value == Util.Valor.WILD)).toBeTruthy();
    console.log(c3);
  });
});
