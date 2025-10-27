import { TestBed } from '@angular/core/testing';

import { Back4app } from './back4app';

describe('Back4app', () => {
  let service: Back4app;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Back4app);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
