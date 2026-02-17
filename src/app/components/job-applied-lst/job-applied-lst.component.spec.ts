import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAppliedLstComponent } from './job-applied-lst.component';

describe('JobAppliedLstComponent', () => {
  let component: JobAppliedLstComponent;
  let fixture: ComponentFixture<JobAppliedLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAppliedLstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobAppliedLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
