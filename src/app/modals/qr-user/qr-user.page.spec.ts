import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrUserPage } from './qr-user.page';

describe('QrUserPage', () => {
  let component: QrUserPage;
  let fixture: ComponentFixture<QrUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
