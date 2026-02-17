import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourceAssignTrainerComponent } from './cource-assign-trainer.component';

describe('CourceAssignTrainerComponent', () => {
  let component: CourceAssignTrainerComponent;
  let fixture: ComponentFixture<CourceAssignTrainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourceAssignTrainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourceAssignTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
