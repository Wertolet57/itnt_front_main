import { API } from '../main'
// import ComplaintData from "~/helpers/types"
const prefix = '/main'

export const addPost = (description: String, descriptionHeader: String, authorProject: any, authorUser: any) => {
    let requestBody = {
        "authorProject": {
            "id": authorProject
        },
        "authorUser": {
            "id": authorUser
        },
        description,
        descriptionHeader,
    };
    return API.post(`${prefix}/addPost`, requestBody);
}
export const getPost = () => {
    return API.get(`${prefix}/getPosts`);
}
export const addLikes = (postId: number) => {
    return API.post(`${prefix}/${postId}/addLike`, postId)
}
export const delLikes = (postId: number) => {
    return API.delete(`${prefix}/${postId}/delLike`)
}
export const addComplaint = (postId: number, userId: number, complaint: String) => {
    return API.post(`${prefix}/addComplaint`, {
        "complaintInfo": complaint,
        "post": {
            "id": postId
        },
        "user": {
            "id": userId
        }
    });
};