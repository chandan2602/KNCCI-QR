import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoursewiseperformanceReportComponent } from './coursewiseperformance-report.component';

describe('CoursewiseperformanceReportComponent', () => {
  let component: CoursewiseperformanceReportComponent;
  let fixture: ComponentFixture<CoursewiseperformanceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursewiseperformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursewiseperformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
