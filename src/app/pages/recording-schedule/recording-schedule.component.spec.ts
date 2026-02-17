import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecordingScheduleComponent } from './recording-schedule.component';

describe('RecordingScheduleComponent', () => {
  let component: RecordingScheduleComponent;
  let fixture: ComponentFixture<RecordingScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
