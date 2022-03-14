import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RegisterComponent } from './register.component';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all form elements', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('#register-btn');
    expect(btn.innerHTML).toBe('Registrarse');
    const input1 = fixture.debugElement.nativeElement.querySelector('#password-input');
    expect(input1.innerHTML).toBe('');
    const input2 = fixture.debugElement.nativeElement.querySelector('#email-input');
    expect(input2.innerHTML).toBe('');
    const input3 = fixture.debugElement.nativeElement.querySelector('#confirmPassword-input');
    expect(input3.innerHTML).toBe('');
  });

  it('form is empty and ready at the load of the page', () => {
    expect(component.email).toEqual("");
    expect(component.password).toEqual("");
    expect(component.confirmPassword).toEqual("");
    const btn = fixture.debugElement.nativeElement.querySelector('#register-btn');
    expect(btn.disabled).toBeTruthy();
  });
});
