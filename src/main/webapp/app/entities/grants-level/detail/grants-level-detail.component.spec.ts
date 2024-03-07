import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrantsLevelDetailComponent } from './grants-level-detail.component';

describe('GrantsLevel Management Detail Component', () => {
  let comp: GrantsLevelDetailComponent;
  let fixture: ComponentFixture<GrantsLevelDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrantsLevelDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grantsLevel: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(GrantsLevelDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrantsLevelDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grantsLevel on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grantsLevel).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
