import { Carta } from './carta';
import * as util from './util';

describe('util', () => {
  it('BTF should convert correctly', () => {
    let c1 = util.BTF_carta(util.Backend_Color.AMARILLO,util.Backend_Valor.CINCO);
    let c2 = util.BTF_carta(util.Backend_Color.INDEFINIDO,util.Backend_Valor.DRAW4);
    let c3 = util.BTF_carta(util.Backend_Color.INDEFINIDO,util.Backend_Valor.WILD);

    expect((c1.color == util.Color.AMARILLO) && (c1.value == util.Valor.CINCO)).toBeTruthy();
    console.log(c1);
    expect((c2.color == util.Color.INDEFINIDO) && (c2.value == util.Valor.DRAW4)).toBeTruthy();
    console.log(c2);
    expect((c3.color == util.Color.INDEFINIDO) && (c3.value == util.Valor.WILD)).toBeTruthy();
    console.log(c3);
  });

  it('FTB should convert correctly', () => {
    let c1 = util.FTB_carta(new Carta(util.Valor.CINCO,util.Color.AMARILLO));
    let c2 = util.FTB_carta(new Carta(util.Valor.DRAW4,util.Color.INDEFINIDO));
    let c3 = util.FTB_carta(new Carta(util.Valor.WILD,util.Color.INDEFINIDO));

    expect((c1.col == util.Backend_Color.AMARILLO) && (c1.num == util.Backend_Valor.CINCO)).toBeTruthy();
    console.log(c1);
    expect((c2.col == util.Backend_Color.INDEFINIDO) && (c2.num == util.Backend_Valor.DRAW4)).toBeTruthy();
    console.log(c2);
    expect((c3.col == util.Backend_Color.INDEFINIDO) && (c3.num == util.Backend_Valor.WILD)).toBeTruthy();
    console.log(c3);
  });
});
