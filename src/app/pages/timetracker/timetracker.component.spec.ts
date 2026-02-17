import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetrackerComponent } from './timetracker.component';

describe('TimetrackerComponent', () => {
  let component: TimetrackerComponent;
  let fixture: ComponentFixture<TimetrackerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
