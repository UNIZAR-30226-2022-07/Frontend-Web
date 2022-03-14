import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ HttpClientTestingModule,
                 RouterTestingModule
               ]
    })
    .compileComponents();
    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all form elements', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('#login-btn');
    expect(btn.innerHTML).toBe('Iniciar sesion');
    const input1 = fixture.debugElement.nativeElement.querySelector('#password-input');
    expect(input1.innerHTML).toBe('');
    const input2 = fixture.debugElement.nativeElement.querySelector('#email-input');
    expect(input2.innerHTML).toBe('');
  });

  it('form is empty and ready at the load of the page', () => {
    expect(component.email).toEqual("");
    expect(component.password).toEqual("");
    const btn = fixture.debugElement.nativeElement.querySelector('#login-btn');
    expect(btn.disabled).toBeTruthy();
  });
});
