import axios from "axios";
import { HOST } from "../static/common/Constant";

export async function onSaveFile(file: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    return axios({
        method: 'POST',
        url: `${HOST}/api/files/image`,
        data: formData
    })
    .then(res => {
        return res.data;
    })
    .catch(err => {
        throw new Error(err.response.data.message);
    })
}

export async function onSaveFiles(files: Blob[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((img) => formData.append("image", img));
    return axios({
        method: 'POST',
        url: `${HOST}/api/files`,
        data: formData
    })
    .then(res => {
        return res.data;
    })
    .catch(err => {
        throw new Error(err.response.data.message);
    })
}