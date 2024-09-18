<template>
    <div class="comment">
        <button @click="showReplyForm = !showReplyForm">Reply</button>

        <div v-if="showReplyForm">
            <input v-model="replyMessage" placeholder="Your reply" />
            <button @click="submitReply">Submit</button>
        </div>

        <div class="replies" v-if="comment.childNodes && comment.childNodes.length">
            <ReplyFeedItem v-for="child in comment.childNodes" :key="child?.id" v-if="child && child.id" :comment="child"
                @reply="emitReply" />
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import ReplyFeedItem from "../feed/ReplyFeedItem.vue"

const props = defineProps({
    comment: Object,
});

const showReplyForm = ref(false);
const replyMessage = ref('');

const emitReply = (childId, message) => {
    emit('reply', childId, message);
};

const submitReply = () => {
    emit('reply', comment.id, replyMessage.value);
    showReplyForm.value = false;
    replyMessage.value = '';
};

  
</script>
<style>
{/* <template>
    <div>
      <!-- Input для комментария -->
      <input v-model="commentText" placeholder="Напишите комментарий..." />
  
      <!-- Кнопка для отправки комментария -->
      <button @click="pushComment">Отправить комментарий</button>
  
      <!-- Показ родительского комментария -->
      <div v-for="(comment, index) in comments" :key="comment.id" class="comment">
        <p>{{ comment.message }} (Глубина: {{ comment.deep }})</p>
  
        <!-- Показ дочерних комментариев (ответов) -->
        <div v-if="comment.childNodes.length > 0" class="replies">
          <div v-for="(reply, i) in comment.childNodes" :key="reply.id">
            <p>{{ reply.message }} (Ответ на: {{ comment.message }}) (Глубина: {{ reply.deep }})</p>
          </div>
        </div>
  {{ comment }}
        <!-- Кнопка для ответа на комментарий -->
        <button  @click="startReply(comment)">Ответить</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import {addComment} from "../../API/ways/post"
  // Список всех комментариев
  const comments = ref([]);
  
  // Текст комментария
  const commentText = ref('');
  
  // ID родительского комментария, если есть
  let parentId = null;
  
  // Начало ответа на комментарий
  const startReply = (comment) => {
    parentId = comment.id; // Устанавливаем родительский комментарий для ответа
    commentText.value = '';
    
    // Очищаем поле ввода для нового комментария
  };
  
  // Функция для отправки комментария
  const pushComment = async () => {
    const postComment = {
      childNodes: [],
      deep: parentId ? findCommentById(parentId).deep + 1 : 0, // Если есть родитель, увеличиваем глубину
      post: { id: 5 }, // Пример идентификатора поста
      user: { id: localStorage.getItem("userId") }, // ID пользователя
      message: commentText.value, // Текст комментария
    };
  
    if (parentId) {
      // Если есть родительский комментарий, добавляем комментарий как ответ
      const parentComment = findCommentById(parentId);
      parentComment.childNodes.push(postComment);
    } else {
      // Иначе добавляем как родительский комментарий
      comments.value.push(postComment);
    }
  
    try {
      // Отправка комментария на сервер (упрощенный пример)
      const response = await addComment(postComment);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  
    // Очищаем поле и сбрасываем состояние после отправки комментария
    commentText.value = '';
    parentId = null;
  };
  
  // Функция для поиска комментария по ID
  const findCommentById = (id) => {
    return comments.value.find(comment => comment.id === id);
  };
  
//   // Пример асинхронной функции для отправки комментария (эмуляция API)
//   const addComment = async (comment) => {
//     // Эмуляция запроса к серверу с задержкой
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ data: { object: comment } });
//       }, 1000);
//     });
//   };
  </script>
  
  <style scoped>
  .comment {
    margin-bottom: 1rem;
  }
  .replies {
    margin-left: 20px;
  }
  </style> */}</style>