import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VisibilityStatusService } from '../service/visibility-status.service';
import { IVisibilityStatus, VisibilityStatus } from '../visibility-status.model';

import { VisibilityStatusUpdateComponent } from './visibility-status-update.component';

describe('VisibilityStatus Management Update Component', () => {
  let comp: VisibilityStatusUpdateComponent;
  let fixture: ComponentFixture<VisibilityStatusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let visibilityStatusService: VisibilityStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VisibilityStatusUpdateComponent],
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
      .overrideTemplate(VisibilityStatusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VisibilityStatusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    visibilityStatusService = TestBed.inject(VisibilityStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const visibilityStatus: IVisibilityStatus = { id: 'CBA' };

      activatedRoute.data = of({ visibilityStatus });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(visibilityStatus));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VisibilityStatus>>();
      const visibilityStatus = { id: 'ABC' };
      jest.spyOn(visibilityStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visibilityStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visibilityStatus }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(visibilityStatusService.update).toHaveBeenCalledWith(visibilityStatus);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VisibilityStatus>>();
      const visibilityStatus = new VisibilityStatus();
      jest.spyOn(visibilityStatusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visibilityStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visibilityStatus }));
      saveSubject.complete();

      // THEN
      expect(visibilityStatusService.create).toHaveBeenCalledWith(visibilityStatus);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VisibilityStatus>>();
      const visibilityStatus = { id: 'ABC' };
      jest.spyOn(visibilityStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visibilityStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(visibilityStatusService.update).toHaveBeenCalledWith(visibilityStatus);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
