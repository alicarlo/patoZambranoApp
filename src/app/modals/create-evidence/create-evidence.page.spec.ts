import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEvidencePage } from './create-evidence.page';

describe('CreateEvidencePage', () => {
  let component: CreateEvidencePage;
  let fixture: ComponentFixture<CreateEvidencePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEvidencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
