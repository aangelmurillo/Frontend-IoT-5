import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVeriComponent } from './dialog-veri.component';

describe('DialogVeriComponent', () => {
  let component: DialogVeriComponent;
  let fixture: ComponentFixture<DialogVeriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVeriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogVeriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
