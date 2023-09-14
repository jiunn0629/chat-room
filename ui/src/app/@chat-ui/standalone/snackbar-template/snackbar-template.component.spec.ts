import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarTemplateComponent } from './snackbar-template.component';

describe('SnackbarTemplateComponent', () => {
  let component: SnackbarTemplateComponent;
  let fixture: ComponentFixture<SnackbarTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SnackbarTemplateComponent]
    });
    fixture = TestBed.createComponent(SnackbarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
