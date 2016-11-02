/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TenKFtService } from './ten-k-ft.service';

describe('Service: TenKFt', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenKFtService]
    });
  });

  it('should ...', inject([TenKFtService], (service: TenKFtService) => {
    expect(service).toBeTruthy();
  }));
});
