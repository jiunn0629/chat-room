import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsProfileComponent } from './friends-profile.component';

describe('FriendsProfileComponent', () => {
  let component: FriendsProfileComponent;
  let fixture: ComponentFixture<FriendsProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsProfileComponent]
    });
    fixture = TestBed.createComponent(FriendsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
