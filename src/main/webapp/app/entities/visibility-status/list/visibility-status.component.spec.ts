import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VisibilityStatusService } from '../service/visibility-status.service';

import { VisibilityStatusComponent } from './visibility-status.component';

describe('VisibilityStatus Management Component', () => {
  let comp: VisibilityStatusComponent;
  let fixture: ComponentFixture<VisibilityStatusComponent>;
  let service: VisibilityStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VisibilityStatusComponent],
    })
      .overrideTemplate(VisibilityStatusComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VisibilityStatusComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VisibilityStatusService);

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
    expect(comp.visibilityStatuses?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
