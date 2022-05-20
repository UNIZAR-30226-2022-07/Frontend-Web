import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaPrivadaComponent } from './partida-privada.component';

describe('PartidaPrivadaComponent', () => {
  let component: PartidaPrivadaComponent;
  let fixture: ComponentFixture<PartidaPrivadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartidaPrivadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidaPrivadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
