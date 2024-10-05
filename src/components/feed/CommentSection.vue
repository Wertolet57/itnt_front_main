<template>
    <!-- <div class="" v-for="commentA in comments">
      {{ commentA.childNodes }}
    </div> -->
    <div class="comments-section mb-[90px]">
      <div class="form py-4">
        <div v-if="replyingTo !== null" class="replying-to">
          <div class="flex flex-row">
            <img :src="reply" alt="">
            <img class="mx-3" width="" height="" src="../../assets/demo/ava-small-header.svg" />
            {{ getCommentById(replyingTo)?.message }}
          </div>
          <button @click="cancelReply" class="cancel-reply">✕</button>
        </div>
        <div class="text-comment">
          <textarea v-model="commentText" :placeholder="replyingTo === null ? 'Ваш комментарий' : 'Ваш ответ'"></textarea>
          <button v-if="replyingTo !== null" @click="submitReply"><img :src="chat" alt=""></button>
          <button v-else @click="submitComment"><img :src="chat" alt=""></button>
        </div>
      </div>
  
      <div v-for="comment in comments" :key="comment?.id" class="mx-4">
        <div v-if="comment.deep === 0" class="comment">
          <div class="feedCard__head mb-[12px]">
            <div class="d-flex align-center">
              <span class="image-border">
                <img class="mr-3" width="30" height="30" src="../../assets/demo/ava-small-header.svg" />
              </span>
              <div>
                <div class="d-flex">
                  <div class="flex-col">
                    <p class="txt-body3">Загружаем</p>
                    <p style="color: #9e9e9e" class="txt-cap1">Вдохновитель Dribbble</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p>{{ comment?.message }}</p>
          <div style="color: #9e9e9e" class="mt-[12px] flex flex-row justify-between txt-cap1">
            <span>{{ comment.insertDate }}</span>
            <button @click="replyTo(comment?.id)">Ответить</button>
          </div>
  
          <div v-if="replyingTo === comment?.id">
            <form @submit.prevent="submitReply(comment)">
              <textarea v-model="replyText" placeholder="Ответить на комментарий"></textarea>
              <button type="submit">Отправить ответ</button>
            </form>
          </div>
  
          <div v-for="reply in comment?.childNodes" :key="reply?.id" class="reply">
            <p>{{ reply?.message }}</p>
          </div>
        </div>
        <div v-if="comment.deep !== 0" class="flex items-center flex-row">
          <span class="circle">
          </span>
          <div class="comment-reply w-full">
            <div class="feedCard__head mb-[12px]">
              <div class="d-flex align-center">
                <span class="image-border">
                  <img class="mr-3" width="30" height="30" src="../../assets/demo/ava-small-header.svg" />
                </span>
                <div>
                  <div class="d-flex">
                    <div class="flex-col">
                      <p class="txt-body3">Загружаем</p>
                      <p style="color: #9e9e9e" class="txt-cap1">Вдохновитель Dribbble</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p>{{ comment?.message }}</p>
            <div style="color: #9e9e9e" class="mt-[12px] flex flex-row justify-between txt-cap1">
              <span>{{ comment.insertDate }}</span>
              <button @click="replyTo(comment?.id)">Ответить</button>
            </div>
  
            <!-- <div v-if="replyingTo === comment?.id">
              <form @submit.prevent="submitReply(comment)">
                <textarea v-model="replyText" placeholder="Ответить на комментарий"></textarea>
                <button type="submit">Отправить ответ</button>
              </form>
            </div>
  
            <div v-for="reply in comment?.childNodes" :key="reply?.id" class="reply">
              <p>{{ reply?.message }}</p>
            </div> -->
          </div>
        </div>
  
      </div>
  
    </div>
  </template>
  
  <script setup>
  import reply from '../../assets/reply.svg'
  import chat from '../../assets/icons/chat.svg';
  import { ref, onMounted, computed } from 'vue';
  import { addComment, getPostComments } from '../../API/ways/post';
  const props = defineProps({
    postId: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  });
  
  const comments = ref([]);
  const commentText = ref('');
  const replyingTo = ref(null);
  
  const getCommentById = (id) => {
    return comments.value.find(comment => comment.id === id);
  };
  
  const submitComment = async () => {
    if (!commentText.value.trim()) return;
  
    const newComment = {
      message: commentText.value,
      post: {
        id: props.postId,
      },
      user: {
        id: props.userId,
      },
      childNodes: [],
      deep: replyingTo.value === null ? 0 : 1
    };
  
    try {
      const response = await addComment(newComment);
      if (replyingTo.value === null) {
        if (Array.isArray(comments.value)) {
          comments.value.push(response.data);
        } else {
          console.error('comments.value is not an array:', comments.value);
          comments.value = [response.data];
        }
      } else {
        const parentComment = getCommentById(replyingTo.value);
        if (parentComment) {
          if (!Array.isArray(parentComment.childNodes)) {
            parentComment.childNodes = [];
          }
          parentComment.childNodes.push(response.data);
        }
      }
      commentText.value = '';
      replyingTo.value = null;
    } catch (error) {
      console.error('Ошибка при отправке комментария:', error);
    }
  };
  const submitReply = async () => {
    if (!commentText.value.trim() || replyingTo.value === null) return;
  
    const newReply = {
      message: commentText.value,
      post: {
        id: props.postId,
      },
      user: {
        id: props.userId,
      },
      deep: 1
    };
  
    try {
      const response = await addComment(newReply);
      const parentComment = getCommentById(replyingTo.value);
      if (parentComment) {
        if (!Array.isArray(parentComment.childNodes)) {
          parentComment.childNodes = [];
        }
        parentComment.childNodes.push(response.data);
        // Обновляем родительский комментарий в основном массиве
        const index = comments.value.findIndex(c => c.id === parentComment.id);
        if (index !== -1) {
          comments.value[index] = { ...parentComment };
        }
      }
      commentText.value = '';
      replyingTo.value = null;
    } catch (error) {
      console.error('Ошибка при отправке ответа:', error);
    }
  };
  const replyTo = (commentId) => {
    replyingTo.value = commentId;
  };
  
  const cancelReply = () => {
    replyingTo.value = null;
  };
  
  const loadComments = async () => {
    try {
      const response = await getPostComments(props.postId);
      if (Array.isArray(response.data.object)) {
        comments.value = response.data.object;
      } else {
        console.error('Полученные данные не являются массивом:', response.data);
        comments.value = [];
      }
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error);
      comments.value = [];
    }
  };
  
  onMounted(loadComments);
  </script>
  
  <style scoped lang="scss">
  .form {
    background-color: white;
    position: fixed;
    padding: 8px 0 4px 0;
    bottom: 0px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    left: 0px;
    right: 0px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  
    .replying-to {
      margin: 0px 8px;
      padding: 8px ;
      // border-radius: 8px;
      font-size: 0.9em;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #9E9E9E;
      .cancel-reply {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
        color: #666;
      }
    }
  
    .text-comment {
      margin: 0px 12px;
      box-shadow: none;
      box-sizing: border-box;
      border-radius: 12px;
      border: 1px solid rgb(158, 158, 158);
      padding: 2px 12px 0 0;
      display: flex;
      justify-content: space-between;
    }
  
    textarea {
      display: flex;
      width: 100%;
      padding: 14px 16px 2px 16px;
      outline: none;
      color: black;
    }
  
    .text-comment:focus-within {
      outline: 2px solid rgb(41, 182, 246);
      border: none;
    }
  }
  
  .image-border img {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    border: 3px solid rgb(199, 237, 255);
  }
  
  .comments-section {
    position: relative;
    margin-top: 20px;
  }
  
  .comment,
  .comment-reply {
    background: #ffffff;
    margin-bottom: 15px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  }
  
  .reply {
    margin-left: 20px;
    padding: 5px;
    border-left: 2px solid #ddd;
  }
  
  .circle {
    background-color: rgb(41, 182, 246);
    width: 6px;
    height: 6px;
    padding: 0;
    border: 1px solid rgb(41, 182, 246);
    border-radius: 50%;
    margin: 0 15px 0 0px;
  }
  </style>