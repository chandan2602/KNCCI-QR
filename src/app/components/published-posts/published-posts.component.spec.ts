import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublishedPostsComponent } from './published-posts.component';

describe('PublishedPostsComponent', () => {
  let component: PublishedPostsComponent;
  let fixture: ComponentFixture<PublishedPostsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
