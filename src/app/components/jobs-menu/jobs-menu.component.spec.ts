import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsMenuComponent } from './jobs-menu.component';

describe('JobsMenuComponent', () => {
  let component: JobsMenuComponent;
  let fixture: ComponentFixture<JobsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
