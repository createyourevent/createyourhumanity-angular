import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMindmap, Mindmap } from '../mindmap.model';

import { MindmapService } from './mindmap.service';

describe('Mindmap Service', () => {
  let service: MindmapService;
  let httpMock: HttpTestingController;
  let elemDefault: IMindmap;
  let expectedResult: IMindmap | IMindmap[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MindmapService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      text: 'AAAAAAA',
      modified: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Mindmap', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          modified: currentDate,
        },
        returnedFromService
      );

      service.create(new Mindmap()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mindmap', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          text: 'BBBBBB',
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          modified: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mindmap', () => {
      const patchObject = Object.assign(
        {
          text: 'BBBBBB',
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        new Mindmap()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          modified: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mindmap', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          text: 'BBBBBB',
          modified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
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

    it('should delete a Mindmap', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMindmapToCollectionIfMissing', () => {
      it('should add a Mindmap to an empty array', () => {
        const mindmap: IMindmap = { id: 'ABC' };
        expectedResult = service.addMindmapToCollectionIfMissing([], mindmap);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mindmap);
      });

      it('should not add a Mindmap to an array that contains it', () => {
        const mindmap: IMindmap = { id: 'ABC' };
        const mindmapCollection: IMindmap[] = [
          {
            ...mindmap,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addMindmapToCollectionIfMissing(mindmapCollection, mindmap);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mindmap to an array that doesn't contain it", () => {
        const mindmap: IMindmap = { id: 'ABC' };
        const mindmapCollection: IMindmap[] = [{ id: 'CBA' }];
        expectedResult = service.addMindmapToCollectionIfMissing(mindmapCollection, mindmap);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mindmap);
      });

      it('should add only unique Mindmap to an array', () => {
        const mindmapArray: IMindmap[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'd0430179-7205-43b6-a067-b0a038c73e63' }];
        const mindmapCollection: IMindmap[] = [{ id: 'ABC' }];
        expectedResult = service.addMindmapToCollectionIfMissing(mindmapCollection, ...mindmapArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mindmap: IMindmap = { id: 'ABC' };
        const mindmap2: IMindmap = { id: 'CBA' };
        expectedResult = service.addMindmapToCollectionIfMissing([], mindmap, mindmap2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mindmap);
        expect(expectedResult).toContain(mindmap2);
      });

      it('should accept null and undefined values', () => {
        const mindmap: IMindmap = { id: 'ABC' };
        expectedResult = service.addMindmapToCollectionIfMissing([], null, mindmap, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mindmap);
      });

      it('should return initial array if no Mindmap is added', () => {
        const mindmapCollection: IMindmap[] = [{ id: 'ABC' }];
        expectedResult = service.addMindmapToCollectionIfMissing(mindmapCollection, undefined, null);
        expect(expectedResult).toEqual(mindmapCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
