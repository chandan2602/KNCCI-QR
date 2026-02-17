import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeeReceivableComponent } from './fee-receivable.component';

describe('FeeReceivableComponent', () => {
  let component: FeeReceivableComponent;
  let fixture: ComponentFixture<FeeReceivableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
