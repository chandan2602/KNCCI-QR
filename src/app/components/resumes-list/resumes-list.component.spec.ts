import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumesListComponent } from './resumes-list.component';

describe('ResumesListComponent', () => {
  let component: ResumesListComponent;
  let fixture: ComponentFixture<ResumesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
