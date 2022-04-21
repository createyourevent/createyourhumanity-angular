import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserMindmapDetailComponent } from './user-mindmap-detail.component';

describe('UserMindmap Management Detail Component', () => {
  let comp: UserMindmapDetailComponent;
  let fixture: ComponentFixture<UserMindmapDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMindmapDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userMindmap: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(UserMindmapDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserMindmapDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userMindmap on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userMindmap).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
