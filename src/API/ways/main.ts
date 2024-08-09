import { API } from '../main'

const prefix = '/main'

const getPostComments = (projectID: number) => {
    console.log("getPostComments");
    
    // return API.get(`${prefix}/getPostComments?projectId=${projectID}`)

}

const addComment = (postID: number, userID: number, message: string) => {
    console.log("!!!");
    

    return API.post(`${prefix}/post/addComment`, {

        post: {
            id: postID
        },
        user: {
            id: userID
        },
        "message": message
    });
};


export { addComment, getPostComments}
