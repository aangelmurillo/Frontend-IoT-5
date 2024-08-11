import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdverdComponent } from './dialog-adverd.component';

describe('DialogAdverdComponent', () => {
  let component: DialogAdverdComponent;
  let fixture: ComponentFixture<DialogAdverdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAdverdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAdverdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
