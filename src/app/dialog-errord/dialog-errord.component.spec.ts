import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogErrordComponent } from './dialog-errord.component';

describe('DialogErrordComponent', () => {
  let component: DialogErrordComponent;
  let fixture: ComponentFixture<DialogErrordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogErrordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogErrordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
