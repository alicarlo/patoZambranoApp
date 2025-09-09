import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserInsumoPage } from './add-user-insumo.page';

describe('AddUserInsumoPage', () => {
  let component: AddUserInsumoPage;
  let fixture: ComponentFixture<AddUserInsumoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserInsumoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
