import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BookAllocationViewReportComponent } from './book-allocation-view-report.component';

describe('BookAllocationViewReportComponent', () => {
  let component: BookAllocationViewReportComponent;
  let fixture: ComponentFixture<BookAllocationViewReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BookAllocationViewReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAllocationViewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
