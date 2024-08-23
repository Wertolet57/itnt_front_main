import { API } from '../main'

const prefix = '/main'

const getPostComments = ( pageNumber: number, pageSize: number, postId: number) => {
    
    return API.get(`${prefix}/post/comments?pageNumber=${pageNumber}&pageSize=${pageSize}&postId=${postId}`)

}

const addComment = (postComment: object) => {
    console.log(postComment);
    return API.post(`${prefix}/post/addComment`, postComment);
};


export { addComment, getPostComments}
