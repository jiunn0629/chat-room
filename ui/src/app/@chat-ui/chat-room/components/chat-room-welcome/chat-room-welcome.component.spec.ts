import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomWelcomeComponent } from './chat-room-welcome.component';

describe('ChatRoomWelcomeComponent', () => {
  let component: ChatRoomWelcomeComponent;
  let fixture: ComponentFixture<ChatRoomWelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomWelcomeComponent]
    });
    fixture = TestBed.createComponent(ChatRoomWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
