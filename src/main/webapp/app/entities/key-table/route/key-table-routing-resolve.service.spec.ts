import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IKeyTable, KeyTable } from '../key-table.model';
import { KeyTableService } from '../service/key-table.service';

import { KeyTableRoutingResolveService } from './key-table-routing-resolve.service';

describe('KeyTable routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: KeyTableRoutingResolveService;
  let service: KeyTableService;
  let resultKeyTable: IKeyTable | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(KeyTableRoutingResolveService);
    service = TestBed.inject(KeyTableService);
    resultKeyTable = undefined;
  });

  describe('resolve', () => {
    it('should return IKeyTable returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKeyTable = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultKeyTable).toEqual({ id: 'ABC' });
    });

    it('should return new IKeyTable if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKeyTable = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultKeyTable).toEqual(new KeyTable());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as KeyTable })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKeyTable = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultKeyTable).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
