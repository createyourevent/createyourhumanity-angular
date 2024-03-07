import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrantsLevelService } from '../service/grants-level.service';
import { IGrantsLevel, GrantsLevel } from '../grants-level.model';

import { GrantsLevelUpdateComponent } from './grants-level-update.component';

describe('GrantsLevel Management Update Component', () => {
  let comp: GrantsLevelUpdateComponent;
  let fixture: ComponentFixture<GrantsLevelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grantsLevelService: GrantsLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrantsLevelUpdateComponent],
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
      .overrideTemplate(GrantsLevelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrantsLevelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grantsLevelService = TestBed.inject(GrantsLevelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grantsLevel: IGrantsLevel = { id: 'CBA' };

      activatedRoute.data = of({ grantsLevel });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grantsLevel));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrantsLevel>>();
      const grantsLevel = { id: 'ABC' };
      jest.spyOn(grantsLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grantsLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grantsLevel }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grantsLevelService.update).toHaveBeenCalledWith(grantsLevel);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrantsLevel>>();
      const grantsLevel = new GrantsLevel();
      jest.spyOn(grantsLevelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grantsLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grantsLevel }));
      saveSubject.complete();

      // THEN
      expect(grantsLevelService.create).toHaveBeenCalledWith(grantsLevel);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrantsLevel>>();
      const grantsLevel = { id: 'ABC' };
      jest.spyOn(grantsLevelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grantsLevel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grantsLevelService.update).toHaveBeenCalledWith(grantsLevel);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
