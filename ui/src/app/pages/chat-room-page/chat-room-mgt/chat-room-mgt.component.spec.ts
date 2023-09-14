import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomMgtComponent } from './chat-room-mgt.component';

describe('ChatRoomMgtComponent', () => {
  let component: ChatRoomMgtComponent;
  let fixture: ComponentFixture<ChatRoomMgtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomMgtComponent]
    });
    fixture = TestBed.createComponent(ChatRoomMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
