import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TakepolsComponent } from './takepols.component';

describe('TakepolsComponent', () => {
  let component: TakepolsComponent;
  let fixture: ComponentFixture<TakepolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TakepolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakepolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
