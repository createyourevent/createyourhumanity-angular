import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KeyTableService } from '../service/key-table.service';
import { IKeyTable, KeyTable } from '../key-table.model';

import { KeyTableUpdateComponent } from './key-table-update.component';

describe('KeyTable Management Update Component', () => {
  let comp: KeyTableUpdateComponent;
  let fixture: ComponentFixture<KeyTableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let keyTableService: KeyTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KeyTableUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(KeyTableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KeyTableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    keyTableService = TestBed.inject(KeyTableService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const keyTable: IKeyTable = { id: 'CBA' };

      activatedRoute.data = of({ keyTable });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(keyTable));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KeyTable>>();
      const keyTable = { id: 'ABC' };
      jest.spyOn(keyTableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ keyTable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: keyTable }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(keyTableService.update).toHaveBeenCalledWith(keyTable);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KeyTable>>();
      const keyTable = new KeyTable();
      jest.spyOn(keyTableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ keyTable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: keyTable }));
      saveSubject.complete();

      // THEN
      expect(keyTableService.create).toHaveBeenCalledWith(keyTable);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KeyTable>>();
      const keyTable = { id: 'ABC' };
      jest.spyOn(keyTableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ keyTable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(keyTableService.update).toHaveBeenCalledWith(keyTable);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
