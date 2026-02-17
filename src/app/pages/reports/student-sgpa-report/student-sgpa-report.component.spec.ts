import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentSGPAReportComponent } from './student-sgpa-report.component';

describe('StudentSGPAReportComponent', () => {
  let component: StudentSGPAReportComponent;
  let fixture: ComponentFixture<StudentSGPAReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSGPAReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSGPAReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
