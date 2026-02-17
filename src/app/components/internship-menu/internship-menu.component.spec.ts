import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipMenuComponent } from './internship-menu.component';

describe('InternshipMenuComponent', () => {
  let component: InternshipMenuComponent;
  let fixture: ComponentFixture<InternshipMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternshipMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
