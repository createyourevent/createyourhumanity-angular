import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FriendsDetailComponent } from './friends-detail.component';

describe('Friends Management Detail Component', () => {
  let comp: FriendsDetailComponent;
  let fixture: ComponentFixture<FriendsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ friends: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FriendsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FriendsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load friends on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.friends).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
