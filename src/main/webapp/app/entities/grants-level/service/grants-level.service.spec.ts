import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGrantsLevel, GrantsLevel } from '../grants-level.model';

import { GrantsLevelService } from './grants-level.service';

describe('GrantsLevel Service', () => {
  let service: GrantsLevelService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrantsLevel;
  let expectedResult: IGrantsLevel | IGrantsLevel[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrantsLevelService);
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

    it('should create a GrantsLevel', () => {
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

      service.create(new GrantsLevel()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GrantsLevel', () => {
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

    it('should partial update a GrantsLevel', () => {
      const patchObject = Object.assign(
        {
          created: currentDate.format(DATE_TIME_FORMAT),
        },
        new GrantsLevel()
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

    it('should return a list of GrantsLevel', () => {
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

    it('should delete a GrantsLevel', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrantsLevelToCollectionIfMissing', () => {
      it('should add a GrantsLevel to an empty array', () => {
        const grantsLevel: IGrantsLevel = { id: 'ABC' };
        expectedResult = service.addGrantsLevelToCollectionIfMissing([], grantsLevel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grantsLevel);
      });

      it('should not add a GrantsLevel to an array that contains it', () => {
        const grantsLevel: IGrantsLevel = { id: 'ABC' };
        const grantsLevelCollection: IGrantsLevel[] = [
          {
            ...grantsLevel,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addGrantsLevelToCollectionIfMissing(grantsLevelCollection, grantsLevel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GrantsLevel to an array that doesn't contain it", () => {
        const grantsLevel: IGrantsLevel = { id: 'ABC' };
        const grantsLevelCollection: IGrantsLevel[] = [{ id: 'CBA' }];
        expectedResult = service.addGrantsLevelToCollectionIfMissing(grantsLevelCollection, grantsLevel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grantsLevel);
      });

      it('should add only unique GrantsLevel to an array', () => {
        const grantsLevelArray: IGrantsLevel[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '31f1ca28-b200-45b8-b5b0-b2b528a388f5' }];
        const grantsLevelCollection: IGrantsLevel[] = [{ id: 'ABC' }];
        expectedResult = service.addGrantsLevelToCollectionIfMissing(grantsLevelCollection, ...grantsLevelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grantsLevel: IGrantsLevel = { id: 'ABC' };
        const grantsLevel2: IGrantsLevel = { id: 'CBA' };
        expectedResult = service.addGrantsLevelToCollectionIfMissing([], grantsLevel, grantsLevel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grantsLevel);
        expect(expectedResult).toContain(grantsLevel2);
      });

      it('should accept null and undefined values', () => {
        const grantsLevel: IGrantsLevel = { id: 'ABC' };
        expectedResult = service.addGrantsLevelToCollectionIfMissing([], null, grantsLevel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grantsLevel);
      });

      it('should return initial array if no GrantsLevel is added', () => {
        const grantsLevelCollection: IGrantsLevel[] = [{ id: 'ABC' }];
        expectedResult = service.addGrantsLevelToCollectionIfMissing(grantsLevelCollection, undefined, null);
        expect(expectedResult).toEqual(grantsLevelCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
