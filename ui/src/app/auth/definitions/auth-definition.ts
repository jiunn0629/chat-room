export interface RegisterReq {
    username: string;
    email: string;
    password: string;
}

export interface RegisterRes {
    id: string;
    username: string;
    email: string;
}

export interface LoginReq {
    email: string;
    password: string;
}

export interface LoginRes {
    token: string;
    id: string;
    username: string;
}