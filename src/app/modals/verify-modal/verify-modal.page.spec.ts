import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyModalPage } from './verify-modal.page';

describe('VerifyModalPage', () => {
  let component: VerifyModalPage;
  let fixture: ComponentFixture<VerifyModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
