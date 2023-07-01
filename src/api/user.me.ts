import axios from "axios";
import { HOST } from "../static/common/Constant";
import { IAccount, ILoginForm, IMessageReceive, IMessageRoom, IMessagesMeList, IRegisterForm, IToken } from "../interface/user.me";

export const initAccount: IAccount = {
    friendId: 0,
    accountId: 0,
    email: "",
    nickname: "",
    gender: "",
    avatar: "",
    role: "",
    state: ""
}

export const initMessagesMe: IMessagesMeList[] = [{
    roomId: "",
    accountId: 0,
    name: "",
    avatar: "",
    type: "",
    createdAt: ""
}]

export const initMessagesInfo: IMessagesMeList = {
    roomId: "",
    accountId: 0,
    name: "",
    avatar: "",
    type: "",
    createdAt: ""
}

export const initMessagesRoom: IMessageRoom = {
    messageId: 0,
    senderId: 0,
    roomId: "",
    type: "",
    text: "",
    avatar: "",
    createdAt: ""
}

export const initMessageReceive: IMessageReceive[] = [{
    message: initMessagesRoom,
    files: []
}]

export async function onLogin(form: ILoginForm): Promise<boolean> {
    return axios({
        method: 'POST',
        url: `${HOST}/api/pub/login`,
        data: form
    })
    .then(res => {
        const token: IToken = res.data;
        localStorage.setItem('accountId', `${token.accountId}`);
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('refreshToken', token.refreshToken);
        return true;
    })
    .catch(err => {
        throw new Error(err.response.data.message);
    });
}

export async function onRegister(form: IRegisterForm): Promise<boolean> {
    return axios({
        method: 'POST',
        url: `${HOST}/api/pub/register`,
        data: form
    })
    .then(() => {
        return true;
    })
    .catch(err => {
        console.log(err.response.data);
        throw new Error(err.response.data.message);
    });
}

export async function accountById(userId: number): Promise<IAccount> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts/${userId}`,
    })
    .then((res) => {
        return res.data as IAccount;
    })
    .catch(err => {
        throw new Error(err.response.data.message);
    });
}

export async function accountMe(): Promise<IAccount> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts/me`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then((res) => {
        return res.data as IAccount;
    })
    .catch(err => {
        throw new Error(err.response.data.message);
    });
}

export async function messagesMe(accountId: number): Promise<IMessagesMeList[]> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts/${accountId}/messages`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then((res) => {
        console.log(res.data)
        return res.data as IMessagesMeList[];
    })
    .catch(err => {
        throw new Error(err.response.data.message);
    });
}

export async function messagesRoom(roomId: string): Promise<IMessageReceive[]> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts/room/${roomId}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then((res) => {
        return res.data as IMessageReceive[];
    })
    .catch(err => {
        throw new Error(err.response.data.message);
    });
}