import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IVisibilityStatus, VisibilityStatus } from '../visibility-status.model';
import { VisibilityStatusService } from '../service/visibility-status.service';

import { VisibilityStatusRoutingResolveService } from './visibility-status-routing-resolve.service';

describe('VisibilityStatus routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: VisibilityStatusRoutingResolveService;
  let service: VisibilityStatusService;
  let resultVisibilityStatus: IVisibilityStatus | undefined;

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
    routingResolveService = TestBed.inject(VisibilityStatusRoutingResolveService);
    service = TestBed.inject(VisibilityStatusService);
    resultVisibilityStatus = undefined;
  });

  describe('resolve', () => {
    it('should return IVisibilityStatus returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVisibilityStatus = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultVisibilityStatus).toEqual({ id: 'ABC' });
    });

    it('should return new IVisibilityStatus if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVisibilityStatus = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultVisibilityStatus).toEqual(new VisibilityStatus());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as VisibilityStatus })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVisibilityStatus = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultVisibilityStatus).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
