import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseshAssigntrainersComponent } from './coursesh-assigntrainers.component';

describe('CourseshAssigntrainersComponent', () => {
  let component: CourseshAssigntrainersComponent;
  let fixture: ComponentFixture<CourseshAssigntrainersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseshAssigntrainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseshAssigntrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
