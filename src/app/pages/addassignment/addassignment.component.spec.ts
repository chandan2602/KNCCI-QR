import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddassignmentComponent } from './addassignment.component';

describe('AddassignmentComponent', () => {
  let component: AddassignmentComponent;
  let fixture: ComponentFixture<AddassignmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
