import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidaTorneoComponent } from './partida-torneo.component';

describe('PartidaTorneoComponent', () => {
  let component: PartidaTorneoComponent;
  let fixture: ComponentFixture<PartidaTorneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartidaTorneoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidaTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
