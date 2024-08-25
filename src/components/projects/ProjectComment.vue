<template>
    <Header showID showUserMinify />
    <!-- <ProjectHeader  commentText :prj-name="data.name" :prjID="data.id" :prj-slogan="data.slogan" /> -->
    <!-- <div v-for="(comment, index) in comments" :key="comment.id" class="mx-4">
        <div class="feedCard mx-4" v-if="comment.isReply && index < 2 || showAllComments">
            <div class="feedCard__head">
                <div class="d-flex align-center">
                    <img class="mr-3" width="30" height="30" src="../../assets/demo/ava-small-header.svg" />
                    <div>
                        <div class="flex flex-col items-start">
                            <p class="txt-body3">Save and Brave</p>
                            <span style="color: #9e9e9e" class="txt-cap1">slogan</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="feedCard__body">
                <p class="txt-cap1">
                    {{ comment.text }}
                </p>
            </div>
            <div class="feedCard__footer">
                <span style="color: #9e9e9e" class="txt-cap1">{{ $t('feed.time') }}</span>
                <button style="color: #9e9e9e" class="txt-cap1" @click="startReply(comment)">Ответить</button>
            </div>
        </div>
        <div class="feedCard" v-else>
            <div class="feedCard__head">
                <div class="d-flex align-center">
                    <img class="mr-3" width="30" height="30" src="../../assets/demo/ava-small-header.svg" />
                    <div>
                        <div class="flex flex-col items-start">
                            <p class="txt-body3">Save and Brave</p>
                            <span style="color: #9e9e9e" class="txt-cap1">slogan</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="feedCard__body">
                <p class="txt-cap1">
                    {{ comment.text }}
                </p>
            </div>
            <div class="feedCard__footer">

                <span style="color: #9e9e9e" class="txt-cap1">{{ $t('feed.time') }}</span>
                <button style="color: #9e9e9e" class="txt-cap1" @click="startReply(comment)">Ответить</button>
            </div>
        </div>
    </div> -->

    <div class="mx-4 comments">
        <div v-for="(comment, index) in visibleComments">
            <Comment v-if="index < commentIndex" @startReply="startReply" :commentObject="comment"/>
        </div>

        <button @click="loadСomments"
            v-if="comments.length > countCommentsBetweenClosings && commentIndex < comments.length">показать
            еще</button>
    </div>
    <!-- <Comments @startReply="startReply" :comment="true" :id="'12'" :subName="'Вдохновитель Dribbble'" :message="'Идея интересная, но как будете привлекать инвестиции? У нас сейчас без чёткого плана никуда!'" />
    <Comments @startReply="startReply" :nestingDepth="1":comment="true" :id="'12'" :subName="'Вдохновитель Dribbble'" :message="'Приветствую! Идея интересная, но как будете привлекать инвестиции? У нас сейчас без чёткого плана никуда!'" /> -->

    <!-- <div v-if="!allCommentsShown" @click="showMoreComments" class="showMore mx-4">
        <button class="text-[#29B6F6] ml-4">Показать еще</button>
        <button class="bg-[#E1F5FE] rounded-[8px] px-[8px] gap-1 py-[2px] flex justify-center">
           <p class="pl-[2px] text-[#1769AA]"> {{ remainingComments }}</p>
            <v-icon color="#1769AA" :icon="'mdi-chevron-down'"></v-icon>
        </button>
    </div> -->

    <div class="input">
        <div class="reply p-2" v-if="replyToComment != ''">
            <img class="rotate-180" width="30" height="30" src="../../assets/icons/reply.svg" />
            
            <img class="mx-2" width="30" height="30" src="../../assets/demo/ava-small-header.svg" />

            <p class="reply__text">{{ replyToComment }}</p>
            <!-- <p>{{ replyToComment.text }}</p> -->
            <img @click="clearReplyText" class="cursor-pointer clear" src="../../assets/icons/close-black.svg" alt="">
        </div>
        <div class="input-container">
            <input @keyup.enter="pushComment" type="text" v-model="commentText" placeholder="Ваш комментарий..." />

            <button @click="pushComment"><img :src="send" alt=""></button>
        </div>
    </div>

</template>

<script setup lang="ts">

import Header from '~/components/Header.vue';
import ProjectHeader from '~/components/projects/ProjectHeader.vue';
import { ref, onMounted, computed } from 'vue';
import { getPostComments, addComment } from '~/API/ways/main.ts'
import { getUserByID } from '~/API/ways/user.ts'

import { useRoute } from 'vue-router'
import Comment from '~/components/Comment.vue'
import send from "~/assets/icons/chat.svg"
import { log } from 'console';
const countCommentsBetweenClosings = 3
let commentIndex = ref(countCommentsBetweenClosings)
let data = ref({})
const route = useRoute()
const commentText = ref('');
const comments = ref([]);
let replyToComment = ref("");
let replyUserName = ref()
let parentId = ""
let visibleComments = ref([])
let postID = ref(2)


const startReply = (replyComment: object, name: string) => {
    commentText.value = ""
    replyUserName.value = name
    
    commentText.value += replyUserName.value + ", "
    parentId = replyComment.id
    if (replyComment.message.length > 40) {
        replyToComment.value = replyComment.message.substring(0, 80) + '...';
    } else {
        replyToComment.value = replyComment.message;
    }
}

const clearReplyText = () => {
    parentId = ""
    replyToComment.value = ""
    replyUserName.value = ""
}



const pushComment = async () => {

    if (commentText.value) {
        try {
            let id = new Date().toISOString()
            let parentComment = findCommentById(parentId)
            let deep = parentId == "" ?  0 : parentComment.deep + 1
            let insertDate =  new Date().toISOString()
            let message = commentText.value

            const newComment = {
                id: id,
                message: message,
                parentId: parentId,
                insertDate: insertDate,
                userId: localStorage.getItem('userId'),
                deep: deep,
                commentsAboveThisDepth: 0,
                replyUserName: replyUserName.value,
                replyText: replyToComment.value
            };
            


            let indexParent = getIndexCommentById(parentId)
            if (parentId == "") {
                comments.value.push(newComment)
            } else {
                let curDepth = newComment.deep
                let i = indexParent + 1
                for (; i < comments.value.length; i++) {
                    if (curDepth > comments.value[i].deep) {
                        break
                    }
                }
                
                comments.value.splice(i , 0, newComment);
            }


            if (comments.value.length <= commentIndex.value) {
                visibleComments.value = comments.value
            }
            commentText.value = '';
            replyToComment.value = "";
            parentId = ""

            let user =  await getUserByID(Number(localStorage.getItem("userId")))
            user = user.data.object
            let postComment = {

                'id': 0,
                'message': message,
                'user': user
            }
            const response = await addComment(postComment);

        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    }
}

const loadСomments = () => {
    commentIndex.value += countCommentsBetweenClosings
    visibleComments.value = comments.value.slice(0, commentIndex.value)
}
interface Comment {
    id: string;
    message: string;
    parentId?: string | null;
    insertDate: string;
    userId: string;
    deep?: number;
    childrenCount: number
}


function getIndexCommentById(id: string): number {
    return comments.value.findIndex(comment => comment.id === id);
}
function findCommentById(id: string): Comment | undefined {
    return comments.value.find(comment => comment.id === id);
}



onMounted(async () => {
  try {
    let response = await getPostComments(3, 4, postID.value);
    // comments.value = response.data.object;
    response = response.data.object;


        comments.value = response
        visibleComments.value = comments.value
    
  } catch (e) {
    console.error('Error:', e);
  }
});

// const remainingComments = computed(() => prjComments.value.length - displayedComments.value.length);
// onMounted(async () => {
//     await getPostComments(route.params.ID).then((response) => {
//         try {
//             prjComments.value = response.data.object;
//             displayedComments.value = prjComments.value.slice(0, 5);
//         } catch (e) {
//             console.error('error:', e);
//         }
//     });
// });
</script>
<style scoped lang="scss">
.comments {
    display: flex;
    flex-direction: column;
    padding: 0 0 80px 0;
}

.input {
    position: fixed;
    bottom: 0px;
    left: 0;
    right: 0;
    background-color: white;
    padding: 10px;

    .reply {
        display: flex;

        .reply__text {
            color: #9e9e9e;
            width: 80%;
            display: flex;
            align-items: center;
        }
    }

    .input-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        margin-bottom: 10px;
        padding: 10px;

        input {
            width: 100%;
            outline: none;

        }
    }
}

.showMore {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 16px 14px;
    margin-bottom: 4px;
    border-radius: 0 0 12px 12px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    gap: 16px;
}

// .feedCard {
//     padding: 16px 14px;
//     margin-bottom: 4px;
//     border-radius: 12px;
//     background: #fff;
//     box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
//     display: flex;
//     flex-direction: column;
//     gap: 16px;

//     &__head {
//         display: flex;
//         align-items: center;
//         justify-content: space-between;

//         &__subtitle {
//             color: #9e9e9e;
//             margin-top: 1px;
//             text-align: initial;
//         }
//     }

//     &__body {
//         text-align: left;

//         &__slider {
//             display: flex;
//             gap: 16px;
//             -ms-overflow-style: none;
//             /* Internet Explorer 10+ */
//             scrollbar-width: none;
//             overflow-x: scroll;

//             &::-webkit-scrollbar {
//                 display: none;
//                 /* Safari and Chrome */
//             }
//         }
//     }

//     &__vacancy {
//         &__head {
//             padding: 10px 20px;
//             display: flex;
//             gap: 10px;
//             align-items: center;
//             max-width: fit-content;
//             border-radius: 8px;
//             background: #e1f5fe;
//         }
//     }

//     &__footer {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;

//         &__button {
//             padding: 14.5px 20px;
//             box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.2) inset, 0px 23px 10px -23px rgba(0, 0, 0, 0.15);
//         }
//     }
// }</style>