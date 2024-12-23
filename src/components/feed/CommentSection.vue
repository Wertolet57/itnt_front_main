<template>
  <div class=" comments-section mx-4 mb-[100px]">
    <div class="form  py-4">
      <div v-if="replyingTo !== null" class="replying-to">
        <p>Ответ на: {{ replyingTo.message }}</p>
        <button @click="cancelReply" class="cancel-reply">✕</button>
      </div>
      <div class="text-comment">
        <textarea v-model="commentText" :placeholder="replyingTo === null ? 'Ваш комментарий' : 'Ваш ответ'"></textarea>
        <button @click="submitComment"><img :src="chat" alt="Отправить"></button>
      </div>
    </div>

    <div v-for="comment in comments" :key="comment.id" class="">
      <div class="comment rounded-[12px]">
        <div class=" comment-content">
          <div class="comment-content__header">
            <img :src="comment.user.pictureUrl ? `${baseURL}/${comment.user.pictureUrl}` : defAva" alt="">
            <div :class="['title', { 'title-center': !comment.user.nickName }]">
              <p class="bold-title">{{ comment.user.firstName }}</p>
              <p v-if="comment.user.nickName" class="gray-title">{{ comment.user.nickName }}</p>
            </div>
  
          </div>
          <div class="comment-content__body">
            <p>{{ comment.message }}</p>
  
          </div>
          <div class="comment-content__footer">
            <span>{{ formatDate(comment.insertDate) }}</span>
            <button @click="replyTo(comment)">Ответить</button>
          </div>
        </div>
      </div>
      <div v-if="comment.childNodes && comment.childNodes.length > 0"  class="ml-1 flex flex-col items-center w-full">
        <div v-for="reply in comment.childNodes" :key="reply.id" class="w-full flex flex-row items-center">
          <div class="rounded-[100%] w-2 h-2 bg-[#29B6F6] mr-3"></div>
            <div class="comment w-full" style="border-top-left-radius: 0;border-top-right-radius: 12px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
            <div class="comment-content">
            <div class="comment-content__header">
              <img :src="reply.user.pictureUrl ? `${baseURL}/${comment.user.pictureUrl}` : defAva" alt="">
              <div :class="['title', { 'title-center': !reply.user.nickName }]">
                <p class="bold-title">{{ reply.user.firstName }}</p>
                <p v-if="reply.user.nickName" class="gray-title">{{ reply.user.nickName }}</p>
              </div>
    
            </div>
            <div class="comment-content__body">
              <p>{{ reply.message }}</p>
    
            </div>
            <div class="comment-content__footer">
              <span>{{ formatDate(reply.insertDate) }}</span>
              <button @click="replyTo(reply)">Ответить</button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { addComment, getPostComments } from '../../API/ways/post';
import chat from '../../assets/icons/chat.svg';
import defAva from "../../assets/demo/defAva.svg"

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
const submitComment = async () => {
  if (!commentText.value.trim()) return;

  const newComment = {
    message: commentText.value,
    post: { id: props.postId },
    user: { id: props.userId },
    parentNode: replyingTo.value ? { id: replyingTo.value.id } : null,
  };

  try {
    const response = await addComment(newComment);

    if (replyingTo.value) {
      const parentComment = comments.value.find(comment => comment.id === replyingTo.value.id);
      if (parentComment) {
        if (!Array.isArray(parentComment.replies)) {
          parentComment.replies = [];
        }
        parentComment.replies.push(response.data);
      }
    } else {
      comments.value.push(response.data);
    }

    commentText.value = '';
  } catch (error) {
    console.error('Ошибка при отправке комментария:', error);
  } finally {
    replyingTo.value = null;
    await loadComments(); // Перезагрузка комментариев
  }
};
const replyTo = (comment) => {
  replyingTo.value = comment;
};

const cancelReply = () => {
  replyingTo.value = null;
};

const loadComments = async () => {
  try {
    const response = await getPostComments(props.postId);
    comments.value = Array.isArray(response.data.object) ? response.data.object : [];
  } catch (error) {
    console.error('Ошибка при загрузке комментариев:', error);
  }
};
function formatDate(inputDate) {
    const date = new Date(inputDate);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60)) % 60;

        if (diffHours > 0) {
            return `${diffHours}ч назад`;
        } else {
            return `${diffMinutes}м назад`;
        }
    } else if (isYesterday) {
        return `Вчера в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} в ${hours}:${minutes}`;
    }
}
const baseURL = 'https://itnt.store/files';
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
    padding: 8px;
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
  // border-radius: 12px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
}

.title-center {
  justify-content: center;
}

.comment-content {
  &__header {
    display: flex;
    flex-direction: row;

    img {
      border: 3px solid rgb(199, 237, 255);
      border-radius: 100%;
      width: 40px;
      height: 40px;
    }

    .title {
      padding-left: 14px;
      display: flex;
      flex-direction: column;

      .bold-title {
        color: rgb(38, 50, 56);
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 1%;
        text-align: left;
      }

      .gray-title {
        color: rgb(158, 158, 158);
        font-size: 13px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 1%;
        text-align: left;
      }
    }
  }

  &__body {
    margin-top: 12px;
    color: rgb(38, 50, 56);
    font-size: 15px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 1%;
    text-align: left;
  }

  &__footer {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    color: rgb(158, 158, 158);
    font-size: 13px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 1%;
    text-align: left;
  }
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