import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IKeyTable, KeyTable } from '../key-table.model';

import { KeyTableService } from './key-table.service';

describe('KeyTable Service', () => {
  let service: KeyTableService;
  let httpMock: HttpTestingController;
  let elemDefault: IKeyTable;
  let expectedResult: IKeyTable | IKeyTable[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KeyTableService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      key: 'AAAAAAA',
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

    it('should create a KeyTable', () => {
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

      service.create(new KeyTable()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KeyTable', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          key: 'BBBBBB',
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

    it('should partial update a KeyTable', () => {
      const patchObject = Object.assign(
        {
          created: currentDate.format(DATE_TIME_FORMAT),
        },
        new KeyTable()
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

    it('should return a list of KeyTable', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          key: 'BBBBBB',
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

    it('should delete a KeyTable', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addKeyTableToCollectionIfMissing', () => {
      it('should add a KeyTable to an empty array', () => {
        const keyTable: IKeyTable = { id: 'ABC' };
        expectedResult = service.addKeyTableToCollectionIfMissing([], keyTable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(keyTable);
      });

      it('should not add a KeyTable to an array that contains it', () => {
        const keyTable: IKeyTable = { id: 'ABC' };
        const keyTableCollection: IKeyTable[] = [
          {
            ...keyTable,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addKeyTableToCollectionIfMissing(keyTableCollection, keyTable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KeyTable to an array that doesn't contain it", () => {
        const keyTable: IKeyTable = { id: 'ABC' };
        const keyTableCollection: IKeyTable[] = [{ id: 'CBA' }];
        expectedResult = service.addKeyTableToCollectionIfMissing(keyTableCollection, keyTable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(keyTable);
      });

      it('should add only unique KeyTable to an array', () => {
        const keyTableArray: IKeyTable[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '810ac0a8-3b68-4186-9ab9-28b022110678' }];
        const keyTableCollection: IKeyTable[] = [{ id: 'ABC' }];
        expectedResult = service.addKeyTableToCollectionIfMissing(keyTableCollection, ...keyTableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const keyTable: IKeyTable = { id: 'ABC' };
        const keyTable2: IKeyTable = { id: 'CBA' };
        expectedResult = service.addKeyTableToCollectionIfMissing([], keyTable, keyTable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(keyTable);
        expect(expectedResult).toContain(keyTable2);
      });

      it('should accept null and undefined values', () => {
        const keyTable: IKeyTable = { id: 'ABC' };
        expectedResult = service.addKeyTableToCollectionIfMissing([], null, keyTable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(keyTable);
      });

      it('should return initial array if no KeyTable is added', () => {
        const keyTableCollection: IKeyTable[] = [{ id: 'ABC' }];
        expectedResult = service.addKeyTableToCollectionIfMissing(keyTableCollection, undefined, null);
        expect(expectedResult).toEqual(keyTableCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
