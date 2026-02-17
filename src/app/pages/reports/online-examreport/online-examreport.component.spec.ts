import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineExamreportComponent } from './online-examreport.component';

describe('OnlineExamreportComponent', () => {
  let component: OnlineExamreportComponent;
  let fixture: ComponentFixture<OnlineExamreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineExamreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineExamreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
