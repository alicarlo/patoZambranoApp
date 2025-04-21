import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageDobPage } from './message-dob.page';

describe('MessageDobPage', () => {
  let component: MessageDobPage;
  let fixture: ComponentFixture<MessageDobPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
