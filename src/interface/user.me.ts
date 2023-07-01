export interface IUserId {
    userId: number
}

export interface ILoginForm {
    email: string,
    password: string
}

export interface IToken {
    accountId: number,
    accessToken: string,
    refreshToken: string
}

export interface IRegisterForm {
    email: string,
    password: string,
    nickname: string,
    gender: string,
    avatar: string,
}

export interface IAccount {
    friendId: number,
    accountId: number,
    email: string,
    nickname: string,
    gender: string,
    avatar: string,
    role: string,
    state: string
}

export interface IMessagesMe {
    roomId: string,
    accountId: number,
    name: string,
    avatar: string
}

export interface IMessagesMeList {
    roomId: string,
    accountId: number,
    name: string,
    avatar: string,
    type: string,
    createdAt: string
}

export interface IMessageRoom {
    messageId: number,
    senderId: number,
    roomId: string,
    type: string,
    text: string,
    avatar: string,
    createdAt: any
}

export interface IMessage {
    senderId: number,
    roomId: string,
    type: string,
    text: string,
    avatar: string,
    files: any
}

export interface IMessageReceive {
    message: IMessageRoom,
    files: string[]
}

export interface IMembers {
    memberId: number,
    accountId: number,
    groupId: string,
    role: string
}