import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbienteEmpComponent } from './ambiente-emp.component';

describe('AmbienteEmpComponent', () => {
  let component: AmbienteEmpComponent;
  let fixture: ComponentFixture<AmbienteEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbienteEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbienteEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
