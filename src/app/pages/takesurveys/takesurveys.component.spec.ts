import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TakesurveysComponent } from './takesurveys.component';

describe('TakesurveysComponent', () => {
  let component: TakesurveysComponent;
  let fixture: ComponentFixture<TakesurveysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TakesurveysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakesurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
