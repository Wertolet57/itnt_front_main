// import { id } from 'vuetify/locale
import { API } from '../main.ts'
// import ComplaintData from "~/helpers/types"

const prefix = '/project'

const getProjectByID = (id: any) => {
    return API.get(`${prefix}/${id}`)
}

const getAllProjects = () => {
    return API.get(`${prefix}/search`)
}
export const getNewProjects = (newProjects: Boolean) => {
    return API.get(`${prefix}/search?${newProjects}`)
}
const getProjectsByValue = (prjValue: any) => {
    return API.get(`${prefix}/search?searchString=${prjValue}`)
}
export const searcgProjects = (params: any) => {
    const queryParams = new URLSearchParams(params).toString();
    return API.get(`${prefix}?${queryParams}`);
}
const getProjectComments = (projectID: number) => {
    return API.get(`${prefix}/projectComments?projectId=${projectID}`)

}
const postProject = (prjInfo: Object) => {
    return API.post(`${prefix}/`, prjInfo)
}

const patchProject = (prjInfo: Object) => {
    return API.patch(`${prefix}/`, prjInfo)
}

const addLike = (projectID: number) => {
    return API.post(`${prefix}/${projectID}/addLike`, projectID)
}
const addComment = (projectID: number, userID: number, message: string) => {
    // const now = new Date();
    // const insertDate = now.toISOString();
    return API.post(`${prefix}/addComment`, {
        // id: id,
        // insertDate: insertDate,
        project: {
            id: projectID
        },
        user: {
            id: userID
        },
        "message": message
    });
};
const addComplaint = (projectId: number, userId: number, complaint: String) => {


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
const addFollow = (projectId: number, userId: number) => {
    return API.post(`${prefix}/addFollow`, {
        project: {
            id: projectId
        },
        "user": {
            "id": userId
        }
    });
}
export const delFollow = (projectId: number, userId: number) => {
    return API.post(`${prefix}/delFollow`, {
        project: {
            id: projectId
        },
        "user": {
            "id": userId
        }
    });
}
const addProjectAvatar = (avatarUrl: FormData, projectID: number) => {
    return API.post(`${prefix}/addProjectAvatar?projectId=${projectID}`, avatarUrl, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


const addProjectFile = (file: FormData, projectID: number, link: String) => {
    return API.post(`${prefix}/addProjectFile?projectId=${projectID}`, link, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
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

const delLike = (projectID: number) => {
    return API.delete(`${prefix}/${projectID}/delLike`)
}

const deleteComment = (projectID: number) => {
    return API.delete(`${prefix}/deleteComment`)
}

export {
    getProjectsByValue, getProjectByID, getAllProjects, addLike, delLike, postProject, patchProject,
    addFollow, addProjectAvatar, addProjectFile, addComment, addComplaint, getProjectComments
    // deleteComment
}
