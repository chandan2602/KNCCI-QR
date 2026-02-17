import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubmitassignmentsComponent } from './submitassignments.component';

describe('SubmitassignmentsComponent', () => {
  let component: SubmitassignmentsComponent;
  let fixture: ComponentFixture<SubmitassignmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitassignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitassignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
