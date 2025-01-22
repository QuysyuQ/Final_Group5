import { TestBed } from '@angular/core/testing';

import { PayToMoneyService } from './pay-to-money.service';

describe('PayToMoneyService', () => {
  let service: PayToMoneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayToMoneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
