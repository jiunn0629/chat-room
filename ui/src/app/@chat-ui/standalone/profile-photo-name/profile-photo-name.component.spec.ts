import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePhotoNameComponent } from './profile-photo-name.component';

describe('ProfilePhotoNameComponent', () => {
  let component: ProfilePhotoNameComponent;
  let fixture: ComponentFixture<ProfilePhotoNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfilePhotoNameComponent]
    });
    fixture = TestBed.createComponent(ProfilePhotoNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
