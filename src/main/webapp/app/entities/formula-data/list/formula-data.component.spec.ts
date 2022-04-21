import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormulaDataService } from '../service/formula-data.service';

import { FormulaDataComponent } from './formula-data.component';

describe('FormulaData Management Component', () => {
  let comp: FormulaDataComponent;
  let fixture: ComponentFixture<FormulaDataComponent>;
  let service: FormulaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FormulaDataComponent],
    })
      .overrideTemplate(FormulaDataComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormulaDataComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FormulaDataService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.formulaData?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
