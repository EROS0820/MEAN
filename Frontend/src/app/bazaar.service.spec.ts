import { TestBed } from '@angular/core/testing';

import { BazaarService } from './bazaar.service';

describe('BazaarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BazaarService = TestBed.get(BazaarService);
    expect(service).toBeTruthy();
  });
});
