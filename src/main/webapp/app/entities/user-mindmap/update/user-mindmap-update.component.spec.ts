import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserMindmapService } from '../service/user-mindmap.service';
import { IUserMindmap, UserMindmap } from '../user-mindmap.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserMindmapUpdateComponent } from './user-mindmap-update.component';

describe('UserMindmap Management Update Component', () => {
  let comp: UserMindmapUpdateComponent;
  let fixture: ComponentFixture<UserMindmapUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userMindmapService: UserMindmapService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserMindmapUpdateComponent],
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
      .overrideTemplate(UserMindmapUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserMindmapUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userMindmapService = TestBed.inject(UserMindmapService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userMindmap: IUserMindmap = { id: 'CBA' };
      const user: IUser = { id: '614817e6-8bdd-4bf4-b9bd-10bbc1cc6d9a' };
      userMindmap.user = user;

      const userCollection: IUser[] = [{ id: '63ba1a05-ff54-4894-8647-c0517737778f' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userMindmap });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userMindmap: IUserMindmap = { id: 'CBA' };
      const user: IUser = { id: '2a55404a-919b-46cd-b52d-47998005aa2d' };
      userMindmap.user = user;

      activatedRoute.data = of({ userMindmap });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userMindmap));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserMindmap>>();
      const userMindmap = { id: 'ABC' };
      jest.spyOn(userMindmapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userMindmap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userMindmap }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userMindmapService.update).toHaveBeenCalledWith(userMindmap);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserMindmap>>();
      const userMindmap = new UserMindmap();
      jest.spyOn(userMindmapService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userMindmap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userMindmap }));
      saveSubject.complete();

      // THEN
      expect(userMindmapService.create).toHaveBeenCalledWith(userMindmap);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserMindmap>>();
      const userMindmap = { id: 'ABC' };
      jest.spyOn(userMindmapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userMindmap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userMindmapService.update).toHaveBeenCalledWith(userMindmap);
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
