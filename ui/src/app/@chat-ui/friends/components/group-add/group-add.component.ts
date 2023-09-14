import {Component, ElementRef, inject, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddFriendRes} from "../../defitiions/friends-defition";
import {ChatRoomService} from "../../../../shared/services/chat-room.service";
import {first} from "rxjs";
import {SnackbarService} from "../../../../shared/services/snackbar.service";

@Component({
    selector: 'app-group-add',
    templateUrl: './group-add.component.html',
    styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {
    private chatRoomService: ChatRoomService = inject(ChatRoomService);
    private snackbarService: SnackbarService = inject(SnackbarService);
    private dialogRef: MatDialogRef<GroupAddComponent> = inject(MatDialogRef);
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    public form: FormGroup | undefined;
    public friendsList: AddFriendRes[] = [];
    public members: AddFriendRes[] = [];
    public selectedImg: string | ArrayBuffer | null | undefined = '';
    @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement> = {} as ElementRef<HTMLInputElement>;

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { friendsList: AddFriendRes[] }
    ) {
        this.friendsList = data.friendsList;
    }

    ngOnInit() {
        this.onInitForm();
    }

    private onInitForm() {
        this.form = this.fb.group({
            photo: [null, [Validators.required]],
            name: ['', [Validators.required]],
            membersId: [null, [Validators.required]],
            type: ['group', [Validators.required]]
        });
    }

    public onSelectGroupPhoto(event: any) {
        const photo = event.target.files[0];
        if (!photo) {
            return;
        };
        if (photo instanceof Blob) {
            this.onReadImage(photo);
        };

    }

    private onReadImage(file: Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectedImg = e.target?.result as string;
            this.form?.controls['photo'].setValue(this.selectedImg);
        };
        reader.readAsDataURL(file);
    }

    public onRemove(member: any) {
        const i = this.members.indexOf(member);
        if (i === -1) {
            return;
        };
        this.members.splice(i, 1);
    }

    public onSelect(event: MatAutocompleteSelectedEvent) {
        if (this.onCheckIsInMembers(event.option.value)) {
            return;
        };
        this.members.push(event.option.value);
        this.memberInput.nativeElement.value = '';
    }

    public onAdd(event: MatChipInputEvent) {
        const value = (event.value || '').trim();
        if (!value) {
            return;
        };
        const i = this.friendsList.findIndex((friend: any) => friend['name'] === value)
        if (i === -1) {
            return;
        };
        if (this.onCheckIsInMembers(this.friendsList[i])) {
            event.chipInput!.clear();
            return;
        };
        this.members.push(this.friendsList[i]);
        event.chipInput!.clear();
    }

    private onCheckIsInMembers(friend: any): boolean {
        return this.members.indexOf(friend) !== -1;
    }

    public onSubmit() {
        const membersId = this.members.map(member => {
            return member.id;
        });
        this.form?.controls['membersId'].setValue(membersId);
        this.form?.markAllAsTouched();
        if (this.form?.invalid) {
            return;
        };
        this.form?.controls['membersId'].setValue([...membersId, localStorage.getItem('userID')!]);
        this.chatRoomService.createChatRoom(this.form?.value).pipe(first()).subscribe({
            next: res=> {
                if (res.isSuccess) {
                    this.snackbarService.open('建立成功', '',this.snackbarService.snackbarSuccessConfig);
                    this.dialogRef.close({refresh: true});
                };
            },
            error: err => {
                console.log(err);
            }
        })
    }
}
