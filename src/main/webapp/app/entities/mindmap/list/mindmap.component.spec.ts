import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MindmapService } from '../service/mindmap.service';

import { MindmapComponent } from './mindmap.component';

describe('Mindmap Management Component', () => {
  let comp: MindmapComponent;
  let fixture: ComponentFixture<MindmapComponent>;
  let service: MindmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MindmapComponent],
    })
      .overrideTemplate(MindmapComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MindmapComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MindmapService);

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
    expect(comp.mindmaps?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
