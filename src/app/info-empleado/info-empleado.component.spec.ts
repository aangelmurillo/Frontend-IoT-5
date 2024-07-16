import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEmpleadoComponent } from './info-empleado.component';

describe('InfoEmpleadoComponent', () => {
  let component: InfoEmpleadoComponent;
  let fixture: ComponentFixture<InfoEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoEmpleadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
