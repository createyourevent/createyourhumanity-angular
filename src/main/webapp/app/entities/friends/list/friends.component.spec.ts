import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FriendsService } from '../service/friends.service';

import { FriendsComponent } from './friends.component';

describe('Friends Management Component', () => {
  let comp: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let service: FriendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FriendsComponent],
    })
      .overrideTemplate(FriendsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FriendsService);

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
    expect(comp.friends?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
