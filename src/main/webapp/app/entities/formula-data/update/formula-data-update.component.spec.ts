import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FormulaDataService } from '../service/formula-data.service';
import { IFormulaData, FormulaData } from '../formula-data.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FormulaDataUpdateComponent } from './formula-data-update.component';

describe('FormulaData Management Update Component', () => {
  let comp: FormulaDataUpdateComponent;
  let fixture: ComponentFixture<FormulaDataUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formulaDataService: FormulaDataService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FormulaDataUpdateComponent],
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
      .overrideTemplate(FormulaDataUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormulaDataUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formulaDataService = TestBed.inject(FormulaDataService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const formulaData: IFormulaData = { id: 'CBA' };
      const user: IUser = { id: '72f045a4-7a0f-465b-9a39-6ff41df811ee' };
      formulaData.user = user;

      const userCollection: IUser[] = [{ id: '10a85f48-cd08-4bf4-aa81-f158992497d2' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ formulaData });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const formulaData: IFormulaData = { id: 'CBA' };
      const user: IUser = { id: 'c61e0135-4f21-4be4-b0d0-bf788c9f1e0b' };
      formulaData.user = user;

      activatedRoute.data = of({ formulaData });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(formulaData));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormulaData>>();
      const formulaData = { id: 'ABC' };
      jest.spyOn(formulaDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formulaData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formulaData }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(formulaDataService.update).toHaveBeenCalledWith(formulaData);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormulaData>>();
      const formulaData = new FormulaData();
      jest.spyOn(formulaDataService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formulaData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formulaData }));
      saveSubject.complete();

      // THEN
      expect(formulaDataService.create).toHaveBeenCalledWith(formulaData);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormulaData>>();
      const formulaData = { id: 'ABC' };
      jest.spyOn(formulaDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formulaData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formulaDataService.update).toHaveBeenCalledWith(formulaData);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
