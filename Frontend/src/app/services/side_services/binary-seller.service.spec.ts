import { TestBed } from '@angular/core/testing';

import { BinarySellerService } from './binary-seller.service';

describe('BinarySellerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BinarySellerService = TestBed.get(BinarySellerService);
    expect(service).toBeTruthy();
  });
});
