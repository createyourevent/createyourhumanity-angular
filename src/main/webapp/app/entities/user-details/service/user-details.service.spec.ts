import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserDetails, UserDetails } from '../user-details.model';

import { UserDetailsService } from './user-details.service';

describe('UserDetails Service', () => {
  let service: UserDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IUserDetails;
  let expectedResult: IUserDetails | IUserDetails[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      points: 0,
      address: 'AAAAAAA',
      dob: currentDate,
      created: currentDate,
      modified: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dob: currentDate.format(DATE_TIME_FORMAT),
          created: currentDate.format(DATE_TIME_FORMAT),
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a UserDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          dob: currentDate.format(DATE_TIME_FORMAT),
          created: currentDate.format(DATE_TIME_FORMAT),
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dob: currentDate,
          created: currentDate,
          modified: currentDate,
        },
        returnedFromService
      );

      service.create(new UserDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          points: 1,
          address: 'BBBBBB',
          dob: currentDate.format(DATE_TIME_FORMAT),
          created: currentDate.format(DATE_TIME_FORMAT),
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dob: currentDate,
          created: currentDate,
          modified: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserDetails', () => {
      const patchObject = Object.assign({}, new UserDetails());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dob: currentDate,
          created: currentDate,
          modified: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          points: 1,
          address: 'BBBBBB',
          dob: currentDate.format(DATE_TIME_FORMAT),
          created: currentDate.format(DATE_TIME_FORMAT),
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dob: currentDate,
          created: currentDate,
          modified: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a UserDetails', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserDetailsToCollectionIfMissing', () => {
      it('should add a UserDetails to an empty array', () => {
        const userDetails: IUserDetails = { id: 'ABC' };
        expectedResult = service.addUserDetailsToCollectionIfMissing([], userDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userDetails);
      });

      it('should not add a UserDetails to an array that contains it', () => {
        const userDetails: IUserDetails = { id: 'ABC' };
        const userDetailsCollection: IUserDetails[] = [
          {
            ...userDetails,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, userDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserDetails to an array that doesn't contain it", () => {
        const userDetails: IUserDetails = { id: 'ABC' };
        const userDetailsCollection: IUserDetails[] = [{ id: 'CBA' }];
        expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, userDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userDetails);
      });

      it('should add only unique UserDetails to an array', () => {
        const userDetailsArray: IUserDetails[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '080ae0d4-1fe3-4557-a6c6-56ec58c084d3' }];
        const userDetailsCollection: IUserDetails[] = [{ id: 'ABC' }];
        expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, ...userDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userDetails: IUserDetails = { id: 'ABC' };
        const userDetails2: IUserDetails = { id: 'CBA' };
        expectedResult = service.addUserDetailsToCollectionIfMissing([], userDetails, userDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userDetails);
        expect(expectedResult).toContain(userDetails2);
      });

      it('should accept null and undefined values', () => {
        const userDetails: IUserDetails = { id: 'ABC' };
        expectedResult = service.addUserDetailsToCollectionIfMissing([], null, userDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userDetails);
      });

      it('should return initial array if no UserDetails is added', () => {
        const userDetailsCollection: IUserDetails[] = [{ id: 'ABC' }];
        expectedResult = service.addUserDetailsToCollectionIfMissing(userDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(userDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
