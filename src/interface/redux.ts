import { IMessagesMe } from "./user.me";

export interface IAction {
    type: string,
    payload: string;
}

export interface IActionRoom {
    type: string,
    payload: IMessagesMe;
}

export interface IActionBoolean {
    type: string,
    payload: string;
}
  
export interface IStore {
    profileState: boolean,
    addFriendState: boolean,
    chooseRoomState: string,
    roomState: IMessagesMe,
    receiveState: boolean,
}