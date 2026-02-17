import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSummeryComponent } from './job-summery.component';

describe('JobSummeryComponent', () => {
  let component: JobSummeryComponent;
  let fixture: ComponentFixture<JobSummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSummeryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
