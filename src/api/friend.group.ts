import axios from "axios";
import { IAccount } from "../interface/user.me";
import { HOST } from "../static/common/Constant";

export async function searchEmail(email: string): Promise<IAccount> {
    return axios({
        method: 'GET',
        url: `${HOST}/api/accounts`,
        params: {
            "email": email
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
    .then((res) => {
        console.log(res);
        return res.data as IAccount;
    })
    .catch(err => {
        console.log(err);
        throw new Error(err.response.data.message);
    });
}