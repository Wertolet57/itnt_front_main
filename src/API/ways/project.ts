// import { id } from 'vuetify/locale
import { API } from '../main.ts'
// import ComplaintData from "~/helpers/types"

interface ProjectData {
    name: string;
    slogan: string;
    nickName: string;
    activityFields: string[];
    descriptionHeader: string;
    description: string;
    projectStage: string;
    projectRegistrationPlaces: string;
}

const prefix = '/project'
export const postProject = async (projectInfo: ProjectData, avatar: File | Blob, presentation: File | Blob): Promise<any> => {
    const formData = new FormData();

    formData.append('projectSaveRequestDto', JSON.stringify(projectInfo));
    formData.append('avatar', avatar);
    formData.append('presentation', presentation);
    
    return API.post('/project/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': `Bearer ${token}`
        }
    });
};


export const patchProject = (prjInfo: Object) => {
    return API.patch(`${prefix}/`, prjInfo)
}
export const getProjectByID = (id: any) => {
    return API.get(`${prefix}/${id}`)
}
export const addLike = (projectID: number) => {
    return API.post(`${prefix}/${projectID}/addLike`, projectID)
}
export const addUser = (projectID: number, userId: number) => {
    return API.post(`${prefix}/${projectID}/addUser/${userId}`, projectID)
}
export const addVacancy = (
    projectId: number,
    params: {
        archive?: boolean;
        description?: string;
        id?: number;
        offer?: string;
        position?: {
            favourite?: boolean;
            id?: number;
            interestGroup?: {
                color?: string;
                id?: number;
                name?: string;
            };
            name?: string;
        };
    } = {}
) => {
    const queryParts = [];

    if (params.archive !== undefined) queryParts.push(`archive=${params.archive}`);
    if (params.description) queryParts.push(`description=${params.description}`);
    if (params.id) queryParts.push(`id=${params.id}`);
    if (params.offer) queryParts.push(`offer=${params.offer}`);
    if (params.position) {
        if (params.position.favourite !== undefined) queryParts.push(`position.favourite=${params.position.favourite}`);
        if (params.position.id) queryParts.push(`position.id=${params.position.id}`);
        if (params.position.interestGroup) {
            if (params.position.interestGroup.color) queryParts.push(`position.interestGroup.color=${params.position.interestGroup.color}`);
            if (params.position.interestGroup.id) queryParts.push(`position.interestGroup.id=${params.position.interestGroup.id}`);
            if (params.position.interestGroup.name) queryParts.push(`position.interestGroup.name=${params.position.interestGroup.name}`);
        }
        if (params.position.name) queryParts.push(`position.name=${params.position.name}`);
    }

    const queryString = queryParts.join('&');
    const url = `${prefix}/${projectId}/addVacancy${queryString ? `?${queryString}` : ''}`;
    console.log(decodeURIComponent(queryString));

    return API.post(url, '', {
        headers: { 'accept': 'application/json;charset=UTF-8' }
    });
};
export const patchVacancy = (
    projectId: number,
    params: {
        archive?: boolean;
        description?: string;
        id?: number;
        offer?: string;
        position?: {
            favourite?: boolean;
            id?: number;
            interestGroup?: {
                color?: string;
                id?: number;
                name?: string;
            };
            name?: string;
        };
    } = {}
) => {
    const queryParts = [];

    if (params.archive !== undefined) queryParts.push(`archive=${params.archive}`);
    if (params.description) queryParts.push(`description=${params.description}`);
    if (params.id) queryParts.push(`id=${params.id}`);
    if (params.offer) queryParts.push(`offer=${params.offer}`);
    if (params.position) {
        if (params.position.favourite !== undefined) queryParts.push(`position.favourite=${params.position.favourite}`);
        if (params.position.id) queryParts.push(`position.id=${params.position.id}`);
        if (params.position.interestGroup) {
            if (params.position.interestGroup.color) queryParts.push(`position.interestGroup.color=${params.position.interestGroup.color}`);
            if (params.position.interestGroup.id) queryParts.push(`position.interestGroup.id=${params.position.interestGroup.id}`);
            if (params.position.interestGroup.name) queryParts.push(`position.interestGroup.name=${params.position.interestGroup.name}`);
        }
        if (params.position.name) queryParts.push(`position.name=${params.position.name}`);
    }

    const queryString = queryParts.join('&');
    const url = `${prefix}/${projectId}/vacancy${queryString ? `?${queryString}` : ''}`;
    console.log(decodeURIComponent(queryString));

    return API.patch(url, '', {
        headers: { 'accept': 'application/json;charset=UTF-8' }
    });
};
export const delLike = (projectID: number) => {
    return API.delete(`${prefix}/${projectID}/delLike`)
}
export const setNewOwner = (projectID: number, userId: number) => {
    return API.post(`${prefix}/${projectID}/setNewOwner?userId=${userId}`)
}
export const getVacancy = (projectID: number) => {
    return API.get(`${prefix}/${projectID}/vacancy`)
}
export const getVacancyById = (projectId: number, vacancyId: number) => {
    return API.get(`${prefix}/${projectId}/vacancy/${vacancyId}`)
}
export const deleteVacancy = (projectId: number, vacancyId: number) => {
    return API.delete(`${prefix}/${projectId}/vacancy/${vacancyId}`)
}
export const delUser = (projectID: number, userId: number) => {
    return API.delete(`${prefix}/${projectID}/delUser?userId=${userId}`)
}
export const addComment = (postComment: any,) => {
    return API.post(`${prefix}/addComment`, postComment);
};
export const addComplaint = (projectId: number, userId: number, complaint: String) => {
    return API.post(`${prefix}/addComplaint`, {
        "complaintInfo": complaint,
        "project": {
            "id": projectId
        },
        "user": {
            "id": userId
        }
    });
};
export const addFollow = (projectId: number) => {
    return API.post(`${prefix}/addFollow?projectId=${projectId}`,);
}
export const addProjectAvatar = (avatarUrl: FormData, projectID: number) => {
    return API.post(`${prefix}/addProjectAvatar?projectId=${projectID}`, avatarUrl, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
export const addProjectSlide = (file: FormData, projectID: number) => {
    return API.post(`${prefix}/addProjectFile?projectId=${projectID}`, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const addProjectFile = (link: String, projectID: number) => {
    return API.post(`${prefix}/addProjectFile?link=${link}&projectId=${projectID}`,);
};
export const deleteComment = (commentId: number) => {
    return API.delete(`${prefix}/deleteComment?commentId=${commentId}`)
}
export const delFollow = (projectId: number, userId: number) => {
    return API.delete(`${prefix}/delFollow?projectId=${projectId}&userId=${userId}`);
}
export const deleteProjectFile = (id: Number) => {
    return API.delete(`${prefix}/delProjectFile?id=${id}`)
}
export const getProjectComments = (projectID: number) => {
    return API.get(`${prefix}/projectComments?projectId=${projectID}`)
}
export const getProjectFollowers = (projectID: number) => {
    return API.get(`${prefix}/projectFollowers?projectId=${projectID}`)
}

//search
export const getAllProjects = () => {
    return API.get(`${prefix}/search`)
}
export const getNewProjects = (newProjects: Boolean) => {
    return API.get(`${prefix}/search?${newProjects}`)
}
export const getProjectsByValue = (prjValue: any) => {
    return API.get(`${prefix}/search?searchString=${prjValue}`)
}
export const searcgProjects = (params: any) => {
    const queryParams = new URLSearchParams(params).toString();
    return API.get(`${prefix}/search?${queryParams}`);
}

export const getProjectPosts = (projectId: Number) => {
    return API.get(`${prefix}/${projectId}/posts`)
}