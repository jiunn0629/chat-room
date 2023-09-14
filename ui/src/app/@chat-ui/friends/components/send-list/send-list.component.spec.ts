import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendListComponent } from './send-list.component';

describe('SnedListComponent', () => {
  let component: SendListComponent;
  let fixture: ComponentFixture<SendListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendListComponent]
    });
    fixture = TestBed.createComponent(SendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
