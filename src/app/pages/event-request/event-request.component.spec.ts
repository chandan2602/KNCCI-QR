import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventRequestComponent } from './event-request.component';

describe('EventRequestComponent', () => {
  let component: EventRequestComponent;
  let fixture: ComponentFixture<EventRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
