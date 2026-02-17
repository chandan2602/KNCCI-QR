import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubscriptionTaskComponent } from './subscription-task.component';

describe('SubscriptionTaskComponent', () => {
  let component: SubscriptionTaskComponent;
  let fixture: ComponentFixture<SubscriptionTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
