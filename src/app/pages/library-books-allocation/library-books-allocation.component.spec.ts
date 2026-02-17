import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LibraryBooksAllocationComponent } from './library-books-allocation.component';

describe('LibraryBooksAllocationComponent', () => {
  let component: LibraryBooksAllocationComponent;
  let fixture: ComponentFixture<LibraryBooksAllocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryBooksAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryBooksAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
