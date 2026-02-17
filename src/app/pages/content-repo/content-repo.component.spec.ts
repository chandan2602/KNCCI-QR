import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentRepoComponent } from './content-repo.component';

describe('ContentRepoComponent', () => {
  let component: ContentRepoComponent;
  let fixture: ComponentFixture<ContentRepoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRepoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
