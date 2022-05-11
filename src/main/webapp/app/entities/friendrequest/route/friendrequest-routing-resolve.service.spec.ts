import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFriendrequest, Friendrequest } from '../friendrequest.model';
import { FriendrequestService } from '../service/friendrequest.service';

import { FriendrequestRoutingResolveService } from './friendrequest-routing-resolve.service';

describe('Friendrequest routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FriendrequestRoutingResolveService;
  let service: FriendrequestService;
  let resultFriendrequest: IFriendrequest | undefined;

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
    routingResolveService = TestBed.inject(FriendrequestRoutingResolveService);
    service = TestBed.inject(FriendrequestService);
    resultFriendrequest = undefined;
  });

  describe('resolve', () => {
    it('should return IFriendrequest returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFriendrequest = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultFriendrequest).toEqual({ id: 'ABC' });
    });

    it('should return new IFriendrequest if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFriendrequest = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFriendrequest).toEqual(new Friendrequest());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Friendrequest })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFriendrequest = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultFriendrequest).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
