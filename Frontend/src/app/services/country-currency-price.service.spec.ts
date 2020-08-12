import { TestBed } from '@angular/core/testing';

import { CountryCurrencyPriceService } from './country-currency-price.service';

describe('CountryCurrencyPriceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountryCurrencyPriceService = TestBed.get(CountryCurrencyPriceService);
    expect(service).toBeTruthy();
  });
});
