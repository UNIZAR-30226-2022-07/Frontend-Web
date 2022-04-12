import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorneoEsperaComponent } from './torneo-espera.component';

describe('TorneoEsperaComponent', () => {
  let component: TorneoEsperaComponent;
  let fixture: ComponentFixture<TorneoEsperaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorneoEsperaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TorneoEsperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
