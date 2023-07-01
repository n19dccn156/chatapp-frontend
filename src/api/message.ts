import axios from "axios";
import { HOST } from "../static/common/Constant";
import { IMembers, IMessagesMeList } from "../interface/user.me";

export const initMembers: IMembers[] = [{
    memberId: 0,
    accountId: 0,
    groupId: "",
    role: ""
}]

export interface IVideoRoomResponse {
    room: string
}

export async function imagesInRoom(roomId: string): Promise<string[]> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts/room/${roomId}/images`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
    .then((res) => {
        return res.data as string[];
    })
    .catch(err => {
        console.log(err);
        throw new Error(err.response.data.message);
    });
}

export async function getMessageInfo(roomId: string): Promise<IMessagesMeList> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts/${localStorage.getItem('accountId')}/room/${roomId}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
    .then((res) => {
        return res.data as IMessagesMeList;
    })
    .catch(err => {
        console.log(err);
        throw new Error(err.response.data.message);
    });
}

export async function membersInRoom(roomId: string): Promise<IMembers[]> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts/room/${roomId}/members`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
    .then((res) => {
        return res.data as IMembers[];
    })
    .catch(err => {
        console.log(err);
        throw new Error(err.response.data.message);
    });
}

// export function videoCall(): IVideoRoomResponse {
//     const link = axios({
//         method: 'GET',
//         url: `https://10.252.2.0:8000/create`
//     })
//     .then((res) => {
//         return res.data as IVideoRoomResponse;
//     })
//     .catch(err => {
//         console.log(err);
//         throw new Error(err.response.data.message);
//     });
//     return link;
// }