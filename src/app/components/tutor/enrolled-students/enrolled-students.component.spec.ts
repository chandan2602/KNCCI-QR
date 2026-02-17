import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnrolledStudentsComponent } from './enrolled-students.component';

describe('EnrolledStudentsComponent', () => {
  let component: EnrolledStudentsComponent;
  let fixture: ComponentFixture<EnrolledStudentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolledStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolledStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
