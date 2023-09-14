import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FriendsService} from "../../services/friends.service";
import {AddFriendReq} from "../../defitiions/friends-defition";
import {ToastService} from "../../../../shared/services/toast.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-friends-add',
  templateUrl: './friends-add.component.html',
  styleUrls: ['./friends-add.component.scss']
})
export class FriendsAddComponent implements OnInit {

  public form: FormGroup | undefined;
  private fb: FormBuilder = inject(FormBuilder);
  private friendsService: FriendsService = inject(FriendsService);
  private toastService: ToastService = inject(ToastService);
  private dialogRef: MatDialogRef<FriendsAddComponent> = inject(MatDialogRef);
  
  ngOnInit() {
    this.onInitForm();
  }

  private onInitForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      invitationMessage: ['']
    });
  }

  public onSubmit() {
    this.form?.markAllAsTouched();
    if (this.form?.invalid) {
      return;
    };
    this.friendsService.addFriend(localStorage.getItem('userID')!, this.form?.value).subscribe({
      next: res => {
        this.toastService.showSuccess({title: "成功", text: "添加成功，請等候對方回應"});

        this.dialogRef.close({refresh: true});
      },
      error: err => {
        this.toastService.showError(err);
      }
    });
  }

}
