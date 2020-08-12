import { TestBed } from '@angular/core/testing';

import { GenealogyTreeService } from './genealogy-tree.service';

describe('GenealogyTreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenealogyTreeService = TestBed.get(GenealogyTreeService);
    expect(service).toBeTruthy();
  });
});
