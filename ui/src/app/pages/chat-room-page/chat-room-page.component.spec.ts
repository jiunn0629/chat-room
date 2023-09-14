import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomPageComponent } from './chat-room-page.component';

describe('ChatRoomPageComponent', () => {
  let component: ChatRoomPageComponent;
  let fixture: ComponentFixture<ChatRoomPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomPageComponent]
    });
    fixture = TestBed.createComponent(ChatRoomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
