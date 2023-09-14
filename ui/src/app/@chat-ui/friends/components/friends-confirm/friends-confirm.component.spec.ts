import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsConfirmComponent } from './friends-confirm.component';

describe('FriendsConfirmComponent', () => {
  let component: FriendsConfirmComponent;
  let fixture: ComponentFixture<FriendsConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsConfirmComponent]
    });
    fixture = TestBed.createComponent(FriendsConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
