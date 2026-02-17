import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LibraryManagementSystemComponent } from './library-management-system.component';

describe('LibraryManagementSystemComponent', () => {
  let component: LibraryManagementSystemComponent;
  let fixture: ComponentFixture<LibraryManagementSystemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryManagementSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryManagementSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
