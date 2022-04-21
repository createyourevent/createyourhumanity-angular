import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MindmapDetailComponent } from './mindmap-detail.component';

describe('Mindmap Management Detail Component', () => {
  let comp: MindmapDetailComponent;
  let fixture: ComponentFixture<MindmapDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MindmapDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mindmap: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(MindmapDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MindmapDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mindmap on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mindmap).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
