import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddsurveyquestionComponent } from './addsurveyquestion.component';

describe('AddsurveyquestionComponent', () => {
  let component: AddsurveyquestionComponent;
  let fixture: ComponentFixture<AddsurveyquestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsurveyquestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsurveyquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
