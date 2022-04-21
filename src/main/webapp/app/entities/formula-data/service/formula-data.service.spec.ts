import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFormulaData, FormulaData } from '../formula-data.model';

import { FormulaDataService } from './formula-data.service';

describe('FormulaData Service', () => {
  let service: FormulaDataService;
  let httpMock: HttpTestingController;
  let elemDefault: IFormulaData;
  let expectedResult: IFormulaData | IFormulaData[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FormulaDataService);
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

    it('should create a FormulaData', () => {
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

      service.create(new FormulaData()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FormulaData', () => {
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

    it('should partial update a FormulaData', () => {
      const patchObject = Object.assign(
        {
          created: currentDate.format(DATE_TIME_FORMAT),
        },
        new FormulaData()
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

    it('should return a list of FormulaData', () => {
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

    it('should delete a FormulaData', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFormulaDataToCollectionIfMissing', () => {
      it('should add a FormulaData to an empty array', () => {
        const formulaData: IFormulaData = { id: 'ABC' };
        expectedResult = service.addFormulaDataToCollectionIfMissing([], formulaData);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formulaData);
      });

      it('should not add a FormulaData to an array that contains it', () => {
        const formulaData: IFormulaData = { id: 'ABC' };
        const formulaDataCollection: IFormulaData[] = [
          {
            ...formulaData,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addFormulaDataToCollectionIfMissing(formulaDataCollection, formulaData);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FormulaData to an array that doesn't contain it", () => {
        const formulaData: IFormulaData = { id: 'ABC' };
        const formulaDataCollection: IFormulaData[] = [{ id: 'CBA' }];
        expectedResult = service.addFormulaDataToCollectionIfMissing(formulaDataCollection, formulaData);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formulaData);
      });

      it('should add only unique FormulaData to an array', () => {
        const formulaDataArray: IFormulaData[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '06978235-1906-47d4-9d17-4207091a2ab1' }];
        const formulaDataCollection: IFormulaData[] = [{ id: 'ABC' }];
        expectedResult = service.addFormulaDataToCollectionIfMissing(formulaDataCollection, ...formulaDataArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formulaData: IFormulaData = { id: 'ABC' };
        const formulaData2: IFormulaData = { id: 'CBA' };
        expectedResult = service.addFormulaDataToCollectionIfMissing([], formulaData, formulaData2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formulaData);
        expect(expectedResult).toContain(formulaData2);
      });

      it('should accept null and undefined values', () => {
        const formulaData: IFormulaData = { id: 'ABC' };
        expectedResult = service.addFormulaDataToCollectionIfMissing([], null, formulaData, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formulaData);
      });

      it('should return initial array if no FormulaData is added', () => {
        const formulaDataCollection: IFormulaData[] = [{ id: 'ABC' }];
        expectedResult = service.addFormulaDataToCollectionIfMissing(formulaDataCollection, undefined, null);
        expect(expectedResult).toEqual(formulaDataCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
