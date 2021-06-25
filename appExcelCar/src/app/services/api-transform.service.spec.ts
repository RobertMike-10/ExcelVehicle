import { TestBed } from '@angular/core/testing';

import { ApiTransformService } from './api-transform.service';

describe('ApiTransformService', () => {
  let service: ApiTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
