import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturaEmpComponent } from './temperatura-emp.component';

describe('TemperaturaEmpComponent', () => {
  let component: TemperaturaEmpComponent;
  let fixture: ComponentFixture<TemperaturaEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperaturaEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperaturaEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
