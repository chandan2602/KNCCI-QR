import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExamresultComponent } from './examresult.component';

describe('ExamresultComponent', () => {
  let component: ExamresultComponent;
  let fixture: ComponentFixture<ExamresultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
