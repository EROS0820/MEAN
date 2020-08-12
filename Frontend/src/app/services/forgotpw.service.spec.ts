import { TestBed } from '@angular/core/testing';

import { ForgotpwService } from './forgotpw.service';

describe('ForgotpwService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForgotpwService = TestBed.get(ForgotpwService);
    expect(service).toBeTruthy();
  });
});
