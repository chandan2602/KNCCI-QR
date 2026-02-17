import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FounderMenuComponent } from './founder-menu.component';

describe('FounderMenuComponent', () => {
  let component: FounderMenuComponent;
  let fixture: ComponentFixture<FounderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FounderMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FounderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
