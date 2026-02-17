import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourceScheduleComponent } from './cource-schedule.component';

describe('CourceScheduleComponent', () => {
  let component: CourceScheduleComponent;
  let fixture: ComponentFixture<CourceScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourceScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourceScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
