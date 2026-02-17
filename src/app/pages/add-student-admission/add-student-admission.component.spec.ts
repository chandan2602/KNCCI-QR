import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddStudentAdmissionComponent } from './add-student-admission.component';

describe('AddStudentAdmissionComponent', () => {
  let component: AddStudentAdmissionComponent;
  let fixture: ComponentFixture<AddStudentAdmissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentAdmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
