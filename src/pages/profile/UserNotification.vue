<template>
    <Header showID showUserMinify showControlDots />
    <div class="m-4 flex flex-col gap-4">
        <div class="flex justify-center m">
            <div class="date mb-4 rounded-xl d-inline-block ">{{ $t('feed.today') }}</div>
        </div>
        <!-- <FeedPanels :notification="true" />
        <!-- <FeedPanels :notification="true" />
        <FeedPanels :reply="true" />
        <FeedPanels :default="true" />
        <FeedPanels :default="true" /> -->

        <FeedPanels v-for="message in messages" :key="message.id" :messageObject="message" /> 

    
    </div>

    <Footer />
</template>

<script setup lang="ts">
// ui-kit
import FeedPanels from '~/components/feed/FeedPanels.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

import { onMounted, ref } from 'vue'
import { getUserNotifications, getProjectPropositions,getUserProjectPropositions, getUserPropositions } from '~/API/ways/notifications'


interface Message {
  userId: number;
  id: number;
  date: string;
  type: string;
}

interface ReplyMessage extends Message {
  messages: { userId: number; date: string; message: string; }[];
}

interface NewCommentsMessage extends Message {
  comments: { userId: number; date: string; message: string; }[];
}

interface InvitationToProjectMessage extends Message {
  message: string;
}

interface WantJoinTeamMessage extends Message {
  potentialParticipants: { userId: number; date: string; message: string; }[];
}

type MessageItem = ReplyMessage | NewCommentsMessage | InvitationToProjectMessage | WantJoinTeamMessage;

// const messages = ref([])
const messages = ref<MessageItem[]>([
  {
    userId: 1,
    id: 1,
    date: "2024-05-27T09:32:23",
    type: 'reply',
    messages: [
      {userId: 1, date: "2024-05-27T09:32:23", message: "@realthomashardy, Проверь личку, скинул тебе ссылку, отпишись ;)   А то иногда ссылка почему то не доходит 🤔" }
    ]
  },
  {
    userId: 2,
    id: 2,
    date: "2024-05-27T09:32:23",
    type: 'newComments',
    messages: [
      {userId: 1, date: "2024-05-27T09:32:23", message: "Друзья, очень органично смотрятся иконки, но цвет, как..." },
      {userId: 2, date: "2024-05-27T09:32:23", message: "На ближайшем Synergy общался с Тарантино, нереально крутой чу..." }
    ]
  },
  {
    userId: 3,
    id: 3,
    date: "2024-05-27T09:32:23",
    type: 'invitationToProject',

    message: "Здравствуйте, Том! Нам кажется, вы то самое, недостающее звено в нашей команде. Мы сосредоточены на самых крупных проектах Англии и нам очень импонируют ваши методы работы.  Будем рады видеть в наших рядах! P.S. У нас есть шляпы с полями и Томпсоны 🙄"
  },
  {
    userId: 4,
    id: 4,
    date: "2024-05-27T09:32:23",
    type: 'wantJoinTeam',
    messages: [
      {userId: 1, date: "2024-05-27T09:32:23", message: "Здравствуйте! Кажется я тот, кого вы ищете!" },
      {userId: 2, date: "2024-05-27T09:32:23", message: "На ближайшем Synergy общался с Тарантино, нереально крутой чу..." }
    ]
  },
]);
const userNotifications = ref([])

onMounted(async () => {
    //есть 6 ответов в id 1
    await getUserNotifications(1).then((response) => {
        try {
            let data = response.data.object
            userNotifications.value = data
            console.log(data);
            
        } catch (e) {
            console.error('text error:', e)
        }
    })
    // console.log('response', userNotifications._rawValue)

})
</script>
<style scoped lang="scss">
.searchProjectCard {
    padding: 16px 14px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        &__subtitle {
            color: #9e9e9e;
            margin-top: 1px;
            text-align: initial;
            text-wrap: balance;
        }
    }

    &__body {
        &__slider {
            display: flex;
            gap: 11px;
            -ms-overflow-style: none;
            /* Internet Explorer 10+ */
            scrollbar-width: none;
            overflow-x: scroll;

            &::-webkit-scrollbar {
                display: none;
                /* Safari and Chrome */
            }
        }

        &__info {
            &__title {
                margin-top: 24px;
                margin-bottom: 12px;
            }
        }
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &__button {
            padding: 17px 20px;
            font-size: 13px;
            font-weight: 400;
            line-height: 14px;
            box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.2) inset, 0px 23px 10px -23px rgba(0, 0, 0, 0.15);
        }
    }
}

.date {
    display: flex;
    justify-content: center;
    width: 100px;
    background: rgba(224, 224, 224, 0.5);
    font-size: 13px !important;
    letter-spacing: 0.01em !important;
    padding: 6px 20px;
    line-height: 14px;
}
</style>