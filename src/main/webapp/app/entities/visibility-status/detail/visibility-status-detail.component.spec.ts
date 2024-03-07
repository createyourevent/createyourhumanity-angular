import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VisibilityStatusDetailComponent } from './visibility-status-detail.component';

describe('VisibilityStatus Management Detail Component', () => {
  let comp: VisibilityStatusDetailComponent;
  let fixture: ComponentFixture<VisibilityStatusDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisibilityStatusDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ visibilityStatus: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(VisibilityStatusDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VisibilityStatusDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load visibilityStatus on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.visibilityStatus).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
