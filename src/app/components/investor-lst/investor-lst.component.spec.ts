import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorLstComponent } from './investor-lst.component';

describe('InvestorLstComponent', () => {
  let component: InvestorLstComponent;
  let fixture: ComponentFixture<InvestorLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorLstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
