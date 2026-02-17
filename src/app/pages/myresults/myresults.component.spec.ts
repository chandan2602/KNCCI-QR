import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyresultsComponent } from './myresults.component';

describe('MyresultsComponent', () => {
  let component: MyresultsComponent;
  let fixture: ComponentFixture<MyresultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
