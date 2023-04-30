import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralcardComponent } from './centralcard.component';

describe('CentralcardComponent', () => {
  let component: CentralcardComponent;
  let fixture: ComponentFixture<CentralcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
