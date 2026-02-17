import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveJobsInternshipsComponent } from './approve-jobs-internships.component';

describe('ApproveJobsInternshipsComponent', () => {
  let component: ApproveJobsInternshipsComponent;
  let fixture: ComponentFixture<ApproveJobsInternshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveJobsInternshipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveJobsInternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
