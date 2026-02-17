import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentRegistrationApprovalComponent } from './student-registration-approval.component';

describe('StudentRegistrationApprovalComponent', () => {
  let component: StudentRegistrationApprovalComponent;
  let fixture: ComponentFixture<StudentRegistrationApprovalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRegistrationApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRegistrationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
