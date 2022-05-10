import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFriends, Friends } from '../friends.model';

import { FriendsService } from './friends.service';

describe('Friends Service', () => {
  let service: FriendsService;
  let httpMock: HttpTestingController;
  let elemDefault: IFriends;
  let expectedResult: IFriends | IFriends[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FriendsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      connectDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          connectDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Friends', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          connectDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          connectDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Friends()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Friends', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          connectDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          connectDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Friends', () => {
      const patchObject = Object.assign(
        {
          connectDate: currentDate.format(DATE_TIME_FORMAT),
        },
        new Friends()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          connectDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Friends', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          connectDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          connectDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Friends', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFriendsToCollectionIfMissing', () => {
      it('should add a Friends to an empty array', () => {
        const friends: IFriends = { id: 'ABC' };
        expectedResult = service.addFriendsToCollectionIfMissing([], friends);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friends);
      });

      it('should not add a Friends to an array that contains it', () => {
        const friends: IFriends = { id: 'ABC' };
        const friendsCollection: IFriends[] = [
          {
            ...friends,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, friends);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Friends to an array that doesn't contain it", () => {
        const friends: IFriends = { id: 'ABC' };
        const friendsCollection: IFriends[] = [{ id: 'CBA' }];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, friends);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friends);
      });

      it('should add only unique Friends to an array', () => {
        const friendsArray: IFriends[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'b2cf090e-58dd-453e-ae2a-4563c9810fce' }];
        const friendsCollection: IFriends[] = [{ id: 'ABC' }];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, ...friendsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const friends: IFriends = { id: 'ABC' };
        const friends2: IFriends = { id: 'CBA' };
        expectedResult = service.addFriendsToCollectionIfMissing([], friends, friends2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friends);
        expect(expectedResult).toContain(friends2);
      });

      it('should accept null and undefined values', () => {
        const friends: IFriends = { id: 'ABC' };
        expectedResult = service.addFriendsToCollectionIfMissing([], null, friends, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friends);
      });

      it('should return initial array if no Friends is added', () => {
        const friendsCollection: IFriends[] = [{ id: 'ABC' }];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, undefined, null);
        expect(expectedResult).toEqual(friendsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
