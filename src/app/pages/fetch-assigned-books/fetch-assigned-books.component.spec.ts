import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FetchAssignedBooksComponent } from './fetch-assigned-books.component';

describe('FetchAssignedBooksComponent', () => {
  let component: FetchAssignedBooksComponent;
  let fixture: ComponentFixture<FetchAssignedBooksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchAssignedBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchAssignedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
