import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidencePage } from './evidence.page';

describe('EvidencePage', () => {
  let component: EvidencePage;
  let fixture: ComponentFixture<EvidencePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
