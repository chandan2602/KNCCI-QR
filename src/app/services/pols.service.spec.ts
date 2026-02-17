import { TestBed } from '@angular/core/testing';

import { PolsService } from './pols.service';

describe('PolsService', () => {
  let service: PolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
