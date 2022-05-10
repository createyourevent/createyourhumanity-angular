import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserDetailsDetailComponent } from './user-details-detail.component';

describe('UserDetails Management Detail Component', () => {
  let comp: UserDetailsDetailComponent;
  let fixture: ComponentFixture<UserDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userDetails: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(UserDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userDetails).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
