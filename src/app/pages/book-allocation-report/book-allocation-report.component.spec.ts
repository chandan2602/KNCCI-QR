import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BookAllocationReportComponent } from './book-allocation-report.component';

describe('BookAllocationReportComponent', () => {
  let component: BookAllocationReportComponent;
  let fixture: ComponentFixture<BookAllocationReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BookAllocationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAllocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
