import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentRepoAddComponent } from './content-repo-add.component';

describe('ContentRepoAddComponent', () => {
  let component: ContentRepoAddComponent;
  let fixture: ComponentFixture<ContentRepoAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRepoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRepoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
