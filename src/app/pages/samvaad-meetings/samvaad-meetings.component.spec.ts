import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SamvaadMeetingsComponent } from './samvaad-meetings.component';

describe('SamvaadMeetingsComponent', () => {
  let component: SamvaadMeetingsComponent;
  let fixture: ComponentFixture<SamvaadMeetingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SamvaadMeetingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamvaadMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
