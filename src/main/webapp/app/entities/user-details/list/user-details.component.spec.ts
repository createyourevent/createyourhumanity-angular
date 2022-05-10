import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserDetailsService } from '../service/user-details.service';

import { UserDetailsComponent } from './user-details.component';

describe('UserDetails Management Component', () => {
  let comp: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let service: UserDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserDetailsComponent],
    })
      .overrideTemplate(UserDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserDetailsService);

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
    expect(comp.userDetails?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
