import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TutoreMenuComponent } from './tutore-menu.component';

describe('TutoreMenuComponent', () => {
  let component: TutoreMenuComponent;
  let fixture: ComponentFixture<TutoreMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoreMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoreMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
