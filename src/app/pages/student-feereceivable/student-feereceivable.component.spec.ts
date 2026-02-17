import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentFeereceivableComponent } from './student-feereceivable.component';

describe('StudentFeereceivableComponent', () => {
  let component: StudentFeereceivableComponent;
  let fixture: ComponentFixture<StudentFeereceivableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFeereceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFeereceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
