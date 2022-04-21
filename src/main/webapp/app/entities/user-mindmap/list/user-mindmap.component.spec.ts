import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserMindmapService } from '../service/user-mindmap.service';

import { UserMindmapComponent } from './user-mindmap.component';

describe('UserMindmap Management Component', () => {
  let comp: UserMindmapComponent;
  let fixture: ComponentFixture<UserMindmapComponent>;
  let service: UserMindmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserMindmapComponent],
    })
      .overrideTemplate(UserMindmapComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserMindmapComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserMindmapService);

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
    expect(comp.userMindmaps?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
