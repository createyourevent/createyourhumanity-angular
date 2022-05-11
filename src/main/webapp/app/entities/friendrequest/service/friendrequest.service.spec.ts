import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFriendrequest, Friendrequest } from '../friendrequest.model';

import { FriendrequestService } from './friendrequest.service';

describe('Friendrequest Service', () => {
  let service: FriendrequestService;
  let httpMock: HttpTestingController;
  let elemDefault: IFriendrequest;
  let expectedResult: IFriendrequest | IFriendrequest[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FriendrequestService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      requestDate: currentDate,
      requestUserId: 'AAAAAAA',
      info: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          requestDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Friendrequest', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          requestDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          requestDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Friendrequest()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Friendrequest', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          requestDate: currentDate.format(DATE_TIME_FORMAT),
          requestUserId: 'BBBBBB',
          info: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          requestDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Friendrequest', () => {
      const patchObject = Object.assign(
        {
          requestUserId: 'BBBBBB',
          info: 'BBBBBB',
        },
        new Friendrequest()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          requestDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Friendrequest', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          requestDate: currentDate.format(DATE_TIME_FORMAT),
          requestUserId: 'BBBBBB',
          info: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          requestDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Friendrequest', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFriendrequestToCollectionIfMissing', () => {
      it('should add a Friendrequest to an empty array', () => {
        const friendrequest: IFriendrequest = { id: 'ABC' };
        expectedResult = service.addFriendrequestToCollectionIfMissing([], friendrequest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friendrequest);
      });

      it('should not add a Friendrequest to an array that contains it', () => {
        const friendrequest: IFriendrequest = { id: 'ABC' };
        const friendrequestCollection: IFriendrequest[] = [
          {
            ...friendrequest,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addFriendrequestToCollectionIfMissing(friendrequestCollection, friendrequest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Friendrequest to an array that doesn't contain it", () => {
        const friendrequest: IFriendrequest = { id: 'ABC' };
        const friendrequestCollection: IFriendrequest[] = [{ id: 'CBA' }];
        expectedResult = service.addFriendrequestToCollectionIfMissing(friendrequestCollection, friendrequest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friendrequest);
      });

      it('should add only unique Friendrequest to an array', () => {
        const friendrequestArray: IFriendrequest[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '56925546-1012-4e63-8931-26f1d099cbc4' }];
        const friendrequestCollection: IFriendrequest[] = [{ id: 'ABC' }];
        expectedResult = service.addFriendrequestToCollectionIfMissing(friendrequestCollection, ...friendrequestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const friendrequest: IFriendrequest = { id: 'ABC' };
        const friendrequest2: IFriendrequest = { id: 'CBA' };
        expectedResult = service.addFriendrequestToCollectionIfMissing([], friendrequest, friendrequest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friendrequest);
        expect(expectedResult).toContain(friendrequest2);
      });

      it('should accept null and undefined values', () => {
        const friendrequest: IFriendrequest = { id: 'ABC' };
        expectedResult = service.addFriendrequestToCollectionIfMissing([], null, friendrequest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friendrequest);
      });

      it('should return initial array if no Friendrequest is added', () => {
        const friendrequestCollection: IFriendrequest[] = [{ id: 'ABC' }];
        expectedResult = service.addFriendrequestToCollectionIfMissing(friendrequestCollection, undefined, null);
        expect(expectedResult).toEqual(friendrequestCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
