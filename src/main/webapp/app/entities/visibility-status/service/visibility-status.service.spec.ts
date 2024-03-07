import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVisibilityStatus, VisibilityStatus } from '../visibility-status.model';

import { VisibilityStatusService } from './visibility-status.service';

describe('VisibilityStatus Service', () => {
  let service: VisibilityStatusService;
  let httpMock: HttpTestingController;
  let elemDefault: IVisibilityStatus;
  let expectedResult: IVisibilityStatus | IVisibilityStatus[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VisibilityStatusService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      map: 'AAAAAAA',
      created: currentDate,
      modified: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
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

    it('should create a VisibilityStatus', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          created: currentDate.format(DATE_TIME_FORMAT),
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          created: currentDate,
          modified: currentDate,
        },
        returnedFromService
      );

      service.create(new VisibilityStatus()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VisibilityStatus', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          map: 'BBBBBB',
          created: currentDate.format(DATE_TIME_FORMAT),
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
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

    it('should partial update a VisibilityStatus', () => {
      const patchObject = Object.assign(
        {
          created: currentDate.format(DATE_TIME_FORMAT),
        },
        new VisibilityStatus()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
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

    it('should return a list of VisibilityStatus', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          map: 'BBBBBB',
          created: currentDate.format(DATE_TIME_FORMAT),
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
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

    it('should delete a VisibilityStatus', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVisibilityStatusToCollectionIfMissing', () => {
      it('should add a VisibilityStatus to an empty array', () => {
        const visibilityStatus: IVisibilityStatus = { id: 'ABC' };
        expectedResult = service.addVisibilityStatusToCollectionIfMissing([], visibilityStatus);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(visibilityStatus);
      });

      it('should not add a VisibilityStatus to an array that contains it', () => {
        const visibilityStatus: IVisibilityStatus = { id: 'ABC' };
        const visibilityStatusCollection: IVisibilityStatus[] = [
          {
            ...visibilityStatus,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addVisibilityStatusToCollectionIfMissing(visibilityStatusCollection, visibilityStatus);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VisibilityStatus to an array that doesn't contain it", () => {
        const visibilityStatus: IVisibilityStatus = { id: 'ABC' };
        const visibilityStatusCollection: IVisibilityStatus[] = [{ id: 'CBA' }];
        expectedResult = service.addVisibilityStatusToCollectionIfMissing(visibilityStatusCollection, visibilityStatus);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(visibilityStatus);
      });

      it('should add only unique VisibilityStatus to an array', () => {
        const visibilityStatusArray: IVisibilityStatus[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '5ce748fe-da66-4bff-8067-5418726848af' }];
        const visibilityStatusCollection: IVisibilityStatus[] = [{ id: 'ABC' }];
        expectedResult = service.addVisibilityStatusToCollectionIfMissing(visibilityStatusCollection, ...visibilityStatusArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const visibilityStatus: IVisibilityStatus = { id: 'ABC' };
        const visibilityStatus2: IVisibilityStatus = { id: 'CBA' };
        expectedResult = service.addVisibilityStatusToCollectionIfMissing([], visibilityStatus, visibilityStatus2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(visibilityStatus);
        expect(expectedResult).toContain(visibilityStatus2);
      });

      it('should accept null and undefined values', () => {
        const visibilityStatus: IVisibilityStatus = { id: 'ABC' };
        expectedResult = service.addVisibilityStatusToCollectionIfMissing([], null, visibilityStatus, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(visibilityStatus);
      });

      it('should return initial array if no VisibilityStatus is added', () => {
        const visibilityStatusCollection: IVisibilityStatus[] = [{ id: 'ABC' }];
        expectedResult = service.addVisibilityStatusToCollectionIfMissing(visibilityStatusCollection, undefined, null);
        expect(expectedResult).toEqual(visibilityStatusCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
