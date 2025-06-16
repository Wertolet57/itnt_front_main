import { API } from '../main'
// import ComplaintData from "~/helpers/types"
const prefix = '/user'

interface SearchParams {
    cityId?: number;
    countryId?: number;
    openedForProposition?: boolean;
    searchString?: string;
}
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
export const delFollow = (userId: Number) => {
    return API.delete(`${prefix}/${userId}/delFollow`);
}
export const deleteUserPicture = (id: Number) => {
    return API.delete(`${prefix}/delUserPicture?id=${id}`);
}
export const deleteBackgroundPicture = () => {
    return API.delete(`${prefix}/delBackgroundPicture`);
}
export const deleteAvaPicture = () => {
    return API.delete(`${prefix}/delAvaPicture`);
}
export const getFollowed = () => {
    return API.get(`${prefix}/followed`)
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


export const getUserPosts = (userId: Number)=>{
    return API.get(`${prefix}/${userId}/posts`)
}
export const deleteInterest = (interestId: Number)=>{
    return API.delete(`${prefix}/delUserInterest?interestId=${interestId}`)
}

export const getUserSearch = (params: any = {}) => {
    let queryString = '';
    if (params instanceof URLSearchParams) {
        // Patch: rename tagIds to tags for backend compatibility
        // If tagIds are present, append them as tags
        if (params.has('tagIds')) {
            const tagIds = params.getAll('tagIds');
            params.delete('tagIds');
            tagIds.forEach(id => params.append('tags', id));
        }
        queryString = params.toString();
    } else {
        const queryParams = new URLSearchParams();
        if (params.cityId) queryParams.append('cityId', params.cityId.toString());
        if (params.countryId) queryParams.append('countryId', params.countryId.toString());
        if (params.openedForProposition !== undefined) queryParams.append('openedForProposition', params.openedForProposition.toString());
        if (params.searchString) queryParams.append('searchString', params.searchString);
        // Use 'tags' as parameter name for tag IDs
        if (params.tagIds && Array.isArray(params.tagIds)) {
            params.tagIds.forEach((id: number) => queryParams.append('tags', id));
        }
        queryString = queryParams.toString();
    }
    return API.get(`${prefix}/search?${queryString}`);
};