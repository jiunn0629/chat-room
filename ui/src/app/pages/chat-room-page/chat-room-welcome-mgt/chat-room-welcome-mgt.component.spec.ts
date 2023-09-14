import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomWelcomeMgtComponent } from './chat-room-welcome-mgt.component';

describe('ChatRoomWelcomeMgtComponent', () => {
  let component: ChatRoomWelcomeMgtComponent;
  let fixture: ComponentFixture<ChatRoomWelcomeMgtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomWelcomeMgtComponent]
    });
    fixture = TestBed.createComponent(ChatRoomWelcomeMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
