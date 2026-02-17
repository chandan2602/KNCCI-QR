import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipSummaryComponent } from './internship-summary.component';

describe('InternshipSummaryComponent', () => {
  let component: InternshipSummaryComponent;
  let fixture: ComponentFixture<InternshipSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternshipSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
