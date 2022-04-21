import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IUserMindmap, UserMindmap } from '../user-mindmap.model';
import { UserMindmapService } from '../service/user-mindmap.service';

import { UserMindmapRoutingResolveService } from './user-mindmap-routing-resolve.service';

describe('UserMindmap routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: UserMindmapRoutingResolveService;
  let service: UserMindmapService;
  let resultUserMindmap: IUserMindmap | undefined;

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
    routingResolveService = TestBed.inject(UserMindmapRoutingResolveService);
    service = TestBed.inject(UserMindmapService);
    resultUserMindmap = undefined;
  });

  describe('resolve', () => {
    it('should return IUserMindmap returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserMindmap = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultUserMindmap).toEqual({ id: 'ABC' });
    });

    it('should return new IUserMindmap if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserMindmap = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultUserMindmap).toEqual(new UserMindmap());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserMindmap })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUserMindmap = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultUserMindmap).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
