import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PostassessmentComponent } from './postassessment.component';

describe('PostassessmentComponent', () => {
  let component: PostassessmentComponent;
  let fixture: ComponentFixture<PostassessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostassessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
