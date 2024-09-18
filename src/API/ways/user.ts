import UserFollowed from '~/pages/profile/UserFollowed.vue';
import { API } from '../main'
// import ComplaintData from "~/helpers/types"
const prefix = '/user'

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
    return API.post('/main/addPost', requestBody);
}
export const getPost = () => {
    return API.get('/main/getPosts');
}
export const getUser = () => {
    return API.get(`${prefix}/`);
}
export const getUserSearch = () => {
    return API.get(`${prefix}/search`);
}
export const patchUser = (data: Object) => {
    return API.patch(`${prefix}/`, data)
}

export const getUserByID = (id: Number) => {
    if (id) {
        return API.get(`${prefix}/${id}`)
    } else {
        return API.get(`${prefix}/`)
    }
}
export const postAddComplaint = (id: number, userId: number, complaint: String) => {
    return API.post(`${prefix}/${id}/addComplaint`, {
        "complaintInfo": complaint,
        "targetUser": {
            "id": id
        },
        "user": {
            "id": userId
        }
    });
};
export const addFollow = (userId: Number) => {
    return API.post(`${prefix}/${userId}/addFollow`);
}
export const postAddBackgroundPicture = (file: FormData) => {
    return API.post(`${prefix}/addBackgroundPicture`, file, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const postAddUserPicture = (file: FormData, mainPicture: boolean) => {
    return API.post(`${prefix}/addUserPicture?mainPicture=${mainPicture}`, file, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const delFollow = (userFollowerId: number, userId: Number) => {
    return API.delete(`${prefix}/delFollow?userFollowerId=${userFollowerId}&userId=${userId}`);
}
export const deleteUserPicture = (id: Number) => {
    return API.delete(`${prefix}/delUserPicture?id=${id}`);
}
export const getFollowed = () => {
    return API.get(`${prefix}/followed`)
}
export const searcgUsers = (params: any) => {
    const queryParams = new URLSearchParams(params).toString();
    return API.get(`${prefix}/search?${queryParams}`);
}
export const postUserLoginCode = (phone: String) => {
    return API.post(`${prefix}/loginCode`, {
        login: phone,
    })
}
export const getUserProjects = (projectId: Number) => {
    return API.get(`${prefix}/project/${projectId}`)
}
export const postAnonimProjects = (isAnonymous: Boolean, projectId: Number) => {
    return API.post(`${prefix}/project/${projectId}/anonymous?isAnonymous=${isAnonymous}`)
}
export const postMenuProjects = (isInQuickMenu: Boolean, projectId: Number) => {
    return API.post(`${prefix}/project/${projectId}/quick_menu?isInQuickMenu=${isInQuickMenu}`)
}

export const postUserConfirm = (phone: String, token: String) => {
    return API.post(`${prefix}/loginCodeConfirmation`, {
        login: phone,
        confirmToken: token,
    })
}
// PUT
export const putUser = (user: Object) => {
    return API.put(`${prefix}/`, { user })
}