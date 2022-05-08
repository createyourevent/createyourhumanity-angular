import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { KeyTableService } from '../service/key-table.service';

import { KeyTableComponent } from './key-table.component';

describe('KeyTable Management Component', () => {
  let comp: KeyTableComponent;
  let fixture: ComponentFixture<KeyTableComponent>;
  let service: KeyTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KeyTableComponent],
    })
      .overrideTemplate(KeyTableComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KeyTableComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KeyTableService);

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
    expect(comp.keyTables?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
