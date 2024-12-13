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

    <div v-for="comment in comments" :key="comment.id" class="comment">
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
          <span>{{ comment.insertDate }}</span>
          <button @click="replyTo(comment)">Ответить</button>
        </div>
        <div v-if="comment.parentNode && comment.parentNode.length > 0" class="replies">
          <div v-for="reply in comment.parentNode" :key="reply.id" class="reply">
            <p>{{ reply.message }}</p>
            <div class="reply-meta">
              <span>{{ reply.insertDate }}</span>
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
    parentNode: replyingTo?.id ? replyingTo : null,
  };

  try {
    const response = await addComment(newComment);

    if (replyingTo) {
      const parentComment = comments.value.find(comment => comment.id === replyingTo.id);
      if (parentComment) {
        if (!Array.isArray(parentComment.parentNode)) {
          parentComment.parentNode = [];
        }
        parentComment.parentNode.push(response.data);
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
  border-radius: 12px;
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
      height:40px;
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