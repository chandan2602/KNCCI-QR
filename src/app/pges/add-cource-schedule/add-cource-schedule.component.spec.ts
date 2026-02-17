import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCourceScheduleComponent } from './add-cource-schedule.component';

describe('AddCourceScheduleComponent', () => {
  let component: AddCourceScheduleComponent;
  let fixture: ComponentFixture<AddCourceScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCourceScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCourceScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
