import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewDiscussionComponent } from './view-discussion.component';

describe('ViewDiscussionComponent', () => {
  let component: ViewDiscussionComponent;
  let fixture: ComponentFixture<ViewDiscussionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
