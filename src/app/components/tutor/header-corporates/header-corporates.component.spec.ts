import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCorporatesComponent } from './header-corporates.component';

describe('HeaderCorporatesComponent', () => {
  let component: HeaderCorporatesComponent;
  let fixture: ComponentFixture<HeaderCorporatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderCorporatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCorporatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
