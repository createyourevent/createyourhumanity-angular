import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormulaDataDetailComponent } from './formula-data-detail.component';

describe('FormulaData Management Detail Component', () => {
  let comp: FormulaDataDetailComponent;
  let fixture: ComponentFixture<FormulaDataDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaDataDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ formulaData: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FormulaDataDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FormulaDataDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load formulaData on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.formulaData).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
