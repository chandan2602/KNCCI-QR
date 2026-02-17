import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourceCategoryComponent } from './cource-category.component';

describe('CourceCategoryComponent', () => {
  let component: CourceCategoryComponent;
  let fixture: ComponentFixture<CourceCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourceCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
