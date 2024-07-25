import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensoresEmpComponent } from './sensores-emp.component';

describe('SensoresEmpComponent', () => {
  let component: SensoresEmpComponent;
  let fixture: ComponentFixture<SensoresEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensoresEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensoresEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
