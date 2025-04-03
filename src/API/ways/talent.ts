import { API } from '../main'
const prefix = '/talant'

interface TalentData {
    id: number;
    description: string;
    talantDevelopmentInfo: string;
    alreadyPurchased: number;
    amountAttracted: number;
    minContribution: number;
    shareForSale: number;
}

export const postTalent = async (talentInfo: TalentData): Promise<any> => {
    return API.post(`${prefix}/`, talentInfo);
};

export const patchTalent = (talentInfo: Object) => {
    return API.patch(`${prefix}/`, talentInfo)
}

export const getTalentByID = (id: any) => {
    return API.get(`${prefix}/${id}`)
}
export const deleteTalent = (id: any) => {
    return API.delete(`${prefix}/${id}`)
}

export const addUser = (talentID: number, userId: number) => {
    return API.post(`${prefix}/${talentID}/addUser/${userId}`, talentID)
}
export const deleteUser = (talentID: number, userId: number) => {
    return API.delete(`${prefix}/${talentID}/delUser?userId=${userId}`)
}

export const addTalentAvatar = (talentID: number, file: File | Blob) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post(`${prefix}/addTalantAvatar?talantId=${talentID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

export const addTalentFile = (talentID: number, file: File | Blob, link: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('link', link);
    return API.post(`${prefix}/addTalantFile?talantId=${talentID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

export const deleteTalentFile = (fileId: number) => {
    return API.delete(`${prefix}/delTalantFile/${fileId}`)
}

export const getTalentSearch = (newTalant: boolean, searchString: string) => {
    return API.get(`${prefix}/search`, {
        params: {
            newTalant,
            searchString
        }
    });
}