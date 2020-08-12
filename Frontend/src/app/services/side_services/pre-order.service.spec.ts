import { TestBed } from '@angular/core/testing';

import { PreOrderService } from './pre-order.service';

describe('PreOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreOrderService = TestBed.get(PreOrderService);
    expect(service).toBeTruthy();
  });
});
