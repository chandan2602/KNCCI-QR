import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourcesessionsComponent } from './courcesessions.component';

describe('CourcesessionsComponent', () => {
  let component: CourcesessionsComponent;
  let fixture: ComponentFixture<CourcesessionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourcesessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourcesessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
