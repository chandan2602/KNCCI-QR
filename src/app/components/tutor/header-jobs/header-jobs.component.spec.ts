import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderJobsComponent } from './header-jobs.component';

describe('HeaderJobsComponent', () => {
  let component: HeaderJobsComponent;
  let fixture: ComponentFixture<HeaderJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
