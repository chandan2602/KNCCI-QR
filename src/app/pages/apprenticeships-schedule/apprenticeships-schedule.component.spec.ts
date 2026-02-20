import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipsScheduleComponent } from './apprenticeships-schedule.component';

describe('ApprenticeshipsScheduleComponent', () => {
  let component: ApprenticeshipsScheduleComponent;
  let fixture: ComponentFixture<ApprenticeshipsScheduleComponent>;

  beforeEach(async) {
    await TestBed.configureTestingModule({
      declarations: [ ApprenticeshipsScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenticeshipsScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
