import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingJobViewComponent } from './posting-job-view.component';

describe('PostingJobViewComponent', () => {
  let component: PostingJobViewComponent;
  let fixture: ComponentFixture<PostingJobViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingJobViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingJobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
