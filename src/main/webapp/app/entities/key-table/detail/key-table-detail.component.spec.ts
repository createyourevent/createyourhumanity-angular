import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KeyTableDetailComponent } from './key-table-detail.component';

describe('KeyTable Management Detail Component', () => {
  let comp: KeyTableDetailComponent;
  let fixture: ComponentFixture<KeyTableDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyTableDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ keyTable: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(KeyTableDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KeyTableDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load keyTable on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.keyTable).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
