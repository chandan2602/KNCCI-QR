import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsInCompanyLstComponent } from './jobs-in-company-lst.component';

describe('JobsInCompanyLstComponent', () => {
  let component: JobsInCompanyLstComponent;
  let fixture: ComponentFixture<JobsInCompanyLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsInCompanyLstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsInCompanyLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
