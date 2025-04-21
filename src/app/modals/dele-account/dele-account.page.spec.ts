import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleAccountPage } from './dele-account.page';

describe('DeleAccountPage', () => {
  let component: DeleAccountPage;
  let fixture: ComponentFixture<DeleAccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
