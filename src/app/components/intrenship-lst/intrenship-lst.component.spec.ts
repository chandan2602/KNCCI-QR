import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntrenshipLstComponent } from './intrenship-lst.component';

describe('IntrenshipLstComponent', () => {
  let component: IntrenshipLstComponent;
  let fixture: ComponentFixture<IntrenshipLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntrenshipLstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntrenshipLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
