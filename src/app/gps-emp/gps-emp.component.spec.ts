import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsEmpComponent } from './gps-emp.component';

describe('GpsEmpComponent', () => {
  let component: GpsEmpComponent;
  let fixture: ComponentFixture<GpsEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
