export interface AddFriendReq {
    email: string;
    invitationMessage: string;
}

export interface AddFriendRes {
    id: string;
    email: string;
    username: string;
    photo: any;
    status: string;
    invitationMessage: string;
}

export interface Friend {
    id: string;
    friendId: string;
    friendName: string;

}