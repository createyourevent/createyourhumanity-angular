import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GrantsLevelService } from '../service/grants-level.service';

import { GrantsLevelComponent } from './grants-level.component';

describe('GrantsLevel Management Component', () => {
  let comp: GrantsLevelComponent;
  let fixture: ComponentFixture<GrantsLevelComponent>;
  let service: GrantsLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GrantsLevelComponent],
    })
      .overrideTemplate(GrantsLevelComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrantsLevelComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GrantsLevelService);

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
    expect(comp.grantsLevels?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
