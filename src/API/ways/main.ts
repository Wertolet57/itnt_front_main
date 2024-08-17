import { API } from '../main'

const prefix = '/main'

const getPostComments = ( pageNumber: number, pageSize: number, postId: number) => {
    
    return API.get(`${prefix}/post/comments?pageNumber=${pageNumber}&pageSize=${pageSize}&postId=${postId}`)

}

const addComment = (message: string, user, parentNode, parentId) => {
    

    return API.post(`${prefix}/post/addComment`, {
        'post': parentId,
        'message': message,
        'user': user,
        'parentNode': parentNode
    });
};

// const addComment = (childNodes: [any], deep: number, id: number, userID: number, message: string) => {
    

//     return API.post(`${prefix}/post/addComment`, {
//         childNodes: childNodes,
//         deep: deep,
//         id: id,

//         user: {
//             id: userID
//         },
//         "message": message
//     });
// };
export { addComment, getPostComments}
