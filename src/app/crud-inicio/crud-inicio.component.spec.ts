import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudInicioComponent } from './crud-inicio.component';

describe('CrudInicioComponent', () => {
  let component: CrudInicioComponent;
  let fixture: ComponentFixture<CrudInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
