import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddpolComponent } from './addpol.component';

describe('AddpolComponent', () => {
  let component: AddpolComponent;
  let fixture: ComponentFixture<AddpolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
