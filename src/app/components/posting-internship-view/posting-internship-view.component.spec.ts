import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingInternshipViewComponent } from './posting-internship-view.component';

describe('PostingInternshipViewComponent', () => {
  let component: PostingInternshipViewComponent;
  let fixture: ComponentFixture<PostingInternshipViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingInternshipViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingInternshipViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
