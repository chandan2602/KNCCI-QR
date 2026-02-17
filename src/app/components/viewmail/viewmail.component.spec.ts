import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewmailComponent } from './viewmail.component';

describe('ViewmailComponent', () => {
  let component: ViewmailComponent;
  let fixture: ComponentFixture<ViewmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
