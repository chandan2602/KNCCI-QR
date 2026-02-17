import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMasterAssessmentComponent } from './add-master-assessment.component';

describe('AddMasterAssessmentComponent', () => {
  let component: AddMasterAssessmentComponent;
  let fixture: ComponentFixture<AddMasterAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMasterAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasterAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
