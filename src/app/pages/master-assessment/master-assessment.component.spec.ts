import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MasterAssessmentComponent } from './master-assessment.component';

describe('MasterAssessmentComponent', () => {
  let component: MasterAssessmentComponent;
  let fixture: ComponentFixture<MasterAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
