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