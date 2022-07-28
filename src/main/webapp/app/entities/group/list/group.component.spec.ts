import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GroupService } from '../service/group.service';

import { GroupComponent } from './group.component';

describe('Group Management Component', () => {
  let comp: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;
  let service: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GroupComponent],
    })
      .overrideTemplate(GroupComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GroupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GroupService);

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
    expect(comp.groups?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
