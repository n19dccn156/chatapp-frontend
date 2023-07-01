import avatar from '../image/avatar.png';

export const HOST = "http://10.252.1.252:8111";
export const WS_HOST = "ws://10.252.1.252:8111/ws";
export const AVATAR = avatar;
export const WIDTH_ITEM = 80;
export const WIDTH_CELL = 64;
export const HEIGHT_CELL = window.innerHeight/12;
export const HEIGHT = window.innerHeight;



export function SOCKET_MESSAGE_URL(room: string) {
    return `${HOST}/topic/${room}`;
}