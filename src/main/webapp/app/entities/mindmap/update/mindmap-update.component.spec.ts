import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MindmapService } from '../service/mindmap.service';
import { IMindmap, Mindmap } from '../mindmap.model';

import { MindmapUpdateComponent } from './mindmap-update.component';

describe('Mindmap Management Update Component', () => {
  let comp: MindmapUpdateComponent;
  let fixture: ComponentFixture<MindmapUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mindmapService: MindmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MindmapUpdateComponent],
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
      .overrideTemplate(MindmapUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MindmapUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mindmapService = TestBed.inject(MindmapService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mindmap: IMindmap = { id: 'CBA' };

      activatedRoute.data = of({ mindmap });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(mindmap));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mindmap>>();
      const mindmap = { id: 'ABC' };
      jest.spyOn(mindmapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindmap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mindmap }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(mindmapService.update).toHaveBeenCalledWith(mindmap);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mindmap>>();
      const mindmap = new Mindmap();
      jest.spyOn(mindmapService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindmap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mindmap }));
      saveSubject.complete();

      // THEN
      expect(mindmapService.create).toHaveBeenCalledWith(mindmap);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mindmap>>();
      const mindmap = { id: 'ABC' };
      jest.spyOn(mindmapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindmap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mindmapService.update).toHaveBeenCalledWith(mindmap);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
