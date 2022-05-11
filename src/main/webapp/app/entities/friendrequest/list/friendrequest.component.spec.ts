import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FriendrequestService } from '../service/friendrequest.service';

import { FriendrequestComponent } from './friendrequest.component';

describe('Friendrequest Management Component', () => {
  let comp: FriendrequestComponent;
  let fixture: ComponentFixture<FriendrequestComponent>;
  let service: FriendrequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FriendrequestComponent],
    })
      .overrideTemplate(FriendrequestComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendrequestComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FriendrequestService);

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
    expect(comp.friendrequests?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
