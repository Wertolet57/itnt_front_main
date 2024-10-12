import { API } from '../main'
// import ComplaintData from "~/helpers/types"
const prefix = '/main'

export const addPostUser = (description: String, descriptionHeader: String, authorUser: any, backgroundPictureUrl: String, pictureUrl: String) => {
    let requestBody = {
        "authorProject": {
            "id": 0
        },
        "authorUser": {
            "id": authorUser
        },
        description,
        descriptionHeader,
        backgroundPictureUrl,
        pictureUrl

    };
    return API.post(`${prefix}/addPost`, requestBody);
}
export const addPostProject = (description: String, descriptionHeader: String, authorProject: any, backgroundPictureUrl: any, pictureUrl: any) => {
    let requestBody = {
        "authorProject": {
            "id": authorProject
        },
        "authorUser": {
            "id": ''
        },
        description,
        descriptionHeader,
        backgroundPictureUrl,
        pictureUrl

    };
    return API.post(`${prefix}/addPost`, requestBody);
}
export const getPost = () => {
    return API.get(`${prefix}/getPosts`);
}
export const getPostByUser = (userId: Number) => {
    return API.get(`${prefix}/user/${userId}/posts`)
}
export const getPostByProject = (projectId: Number) => {
    return API.get(`${prefix}/project/${projectId}/posts`)
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
export const addComment = (postComment: any,) => {
    return API.post(`${prefix}/post/addComment`, postComment);
};
export const getProjectWeek = () => {
    return API.get(`${prefix}/project/week`)
}
export const getProjectMonth = () => {
    return API.get(`${prefix}/project/month`)
}
export const getProjectYear = () => {
    return API.get(`${prefix}/project/year`)
}
export const getProjectFresh = () => {
    return API.get(`${prefix}/project/fresh`)
}

export const getPostComments = (postId: number) => {
    return API.get(`${prefix}/post/comments?postId=${postId}`)
}

export const getPostById = (postId: number) => {
    return API.get(`${prefix}/post/${postId}`)
}
export const patchPost = (description: String, descriptionHeader: String, backgroundPictureUrl: any, id: any) => {
    let requestBody = {
        description,
        descriptionHeader,
        backgroundPictureUrl,
        id
    };
    return API.patch(`${prefix}/post`, requestBody);
}

export const addPostFile = (file: FormData, postId: number) => {
    return API.post(`${prefix}/post/addPostFile?postId=${postId}`, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const delPost = (postId: number) => {
    return API.delete(`${prefix}/delPost?postId=${postId}`)
}
export const delPostFile = (Id: number) => {
    return API.delete(`${prefix}/post/delPostFile?id=${Id}`)
}
