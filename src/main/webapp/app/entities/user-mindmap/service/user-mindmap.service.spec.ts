import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserMindmap, UserMindmap } from '../user-mindmap.model';

import { UserMindmapService } from './user-mindmap.service';

describe('UserMindmap Service', () => {
  let service: UserMindmapService;
  let httpMock: HttpTestingController;
  let elemDefault: IUserMindmap;
  let expectedResult: IUserMindmap | IUserMindmap[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserMindmapService);
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

    it('should create a UserMindmap', () => {
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

      service.create(new UserMindmap()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserMindmap', () => {
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

    it('should partial update a UserMindmap', () => {
      const patchObject = Object.assign({}, new UserMindmap());

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

    it('should return a list of UserMindmap', () => {
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

    it('should delete a UserMindmap', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserMindmapToCollectionIfMissing', () => {
      it('should add a UserMindmap to an empty array', () => {
        const userMindmap: IUserMindmap = { id: 'ABC' };
        expectedResult = service.addUserMindmapToCollectionIfMissing([], userMindmap);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userMindmap);
      });

      it('should not add a UserMindmap to an array that contains it', () => {
        const userMindmap: IUserMindmap = { id: 'ABC' };
        const userMindmapCollection: IUserMindmap[] = [
          {
            ...userMindmap,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addUserMindmapToCollectionIfMissing(userMindmapCollection, userMindmap);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserMindmap to an array that doesn't contain it", () => {
        const userMindmap: IUserMindmap = { id: 'ABC' };
        const userMindmapCollection: IUserMindmap[] = [{ id: 'CBA' }];
        expectedResult = service.addUserMindmapToCollectionIfMissing(userMindmapCollection, userMindmap);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userMindmap);
      });

      it('should add only unique UserMindmap to an array', () => {
        const userMindmapArray: IUserMindmap[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '269ef8b1-cfa9-47e6-9806-76055c3e1dba' }];
        const userMindmapCollection: IUserMindmap[] = [{ id: 'ABC' }];
        expectedResult = service.addUserMindmapToCollectionIfMissing(userMindmapCollection, ...userMindmapArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userMindmap: IUserMindmap = { id: 'ABC' };
        const userMindmap2: IUserMindmap = { id: 'CBA' };
        expectedResult = service.addUserMindmapToCollectionIfMissing([], userMindmap, userMindmap2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userMindmap);
        expect(expectedResult).toContain(userMindmap2);
      });

      it('should accept null and undefined values', () => {
        const userMindmap: IUserMindmap = { id: 'ABC' };
        expectedResult = service.addUserMindmapToCollectionIfMissing([], null, userMindmap, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userMindmap);
      });

      it('should return initial array if no UserMindmap is added', () => {
        const userMindmapCollection: IUserMindmap[] = [{ id: 'ABC' }];
        expectedResult = service.addUserMindmapToCollectionIfMissing(userMindmapCollection, undefined, null);
        expect(expectedResult).toEqual(userMindmapCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
