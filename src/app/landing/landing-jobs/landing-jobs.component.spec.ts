import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingJobsComponent } from './landing-jobs.component';

describe('LandingJobsComponent', () => {
  let component: LandingJobsComponent;
  let fixture: ComponentFixture<LandingJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
