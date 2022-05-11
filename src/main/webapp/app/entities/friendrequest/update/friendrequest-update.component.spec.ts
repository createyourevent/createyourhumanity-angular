import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FriendrequestService } from '../service/friendrequest.service';
import { IFriendrequest, Friendrequest } from '../friendrequest.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FriendrequestUpdateComponent } from './friendrequest-update.component';

describe('Friendrequest Management Update Component', () => {
  let comp: FriendrequestUpdateComponent;
  let fixture: ComponentFixture<FriendrequestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let friendrequestService: FriendrequestService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FriendrequestUpdateComponent],
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
      .overrideTemplate(FriendrequestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendrequestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    friendrequestService = TestBed.inject(FriendrequestService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const friendrequest: IFriendrequest = { id: 'CBA' };
      const user: IUser = { id: 'e030c718-21d8-484c-a816-3705e5e8502d' };
      friendrequest.user = user;

      const userCollection: IUser[] = [{ id: '84670917-aa38-48a9-a337-a504742604a4' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ friendrequest });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const friendrequest: IFriendrequest = { id: 'CBA' };
      const user: IUser = { id: 'b2af42eb-3d1f-4b92-a4c1-d3d1f815bb15' };
      friendrequest.user = user;

      activatedRoute.data = of({ friendrequest });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(friendrequest));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Friendrequest>>();
      const friendrequest = { id: 'ABC' };
      jest.spyOn(friendrequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friendrequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friendrequest }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(friendrequestService.update).toHaveBeenCalledWith(friendrequest);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Friendrequest>>();
      const friendrequest = new Friendrequest();
      jest.spyOn(friendrequestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friendrequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friendrequest }));
      saveSubject.complete();

      // THEN
      expect(friendrequestService.create).toHaveBeenCalledWith(friendrequest);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Friendrequest>>();
      const friendrequest = { id: 'ABC' };
      jest.spyOn(friendrequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friendrequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(friendrequestService.update).toHaveBeenCalledWith(friendrequest);
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
