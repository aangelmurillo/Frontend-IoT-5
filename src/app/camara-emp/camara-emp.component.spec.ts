import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamaraEmpComponent } from './camara-emp.component';

describe('CamaraEmpComponent', () => {
  let component: CamaraEmpComponent;
  let fixture: ComponentFixture<CamaraEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamaraEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamaraEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
