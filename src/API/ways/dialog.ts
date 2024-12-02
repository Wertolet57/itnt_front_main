import { API } from '../main'
const prefix = '/dialog'

const sendMessage = (dialogId: number, project: Object) => {
    return API.post(`${prefix}/${dialogId}/message`, project);
};
const createDialog = (Id: any) => {
    return API.post(`${prefix}/`, {
        "dialogType": "GROPE",
        'users': [{
            'id': Id
        }
        ],
    });
}
const getDialog = () => {
    return API.get(`${prefix}/`)
}
const getDialogMessages = (dialogId: number) => {
    return API.get(`${prefix}/${dialogId}/message/list`)
}
const getDialogByID = (id: number) => {
    return API.get(`${prefix}/${id}`)
}

export { getDialog, getDialogMessages, getDialogByID, sendMessage, createDialog }
