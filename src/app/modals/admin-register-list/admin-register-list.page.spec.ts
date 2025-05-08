import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRegisterListPage } from './admin-register-list.page';

describe('AdminRegisterListPage', () => {
  let component: AdminRegisterListPage;
  let fixture: ComponentFixture<AdminRegisterListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegisterListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
