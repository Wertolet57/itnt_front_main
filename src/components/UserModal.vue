<script lang="ts">
export default {
    name: 'UserModal',
}
</script>

<template>
    <div class="topModal" v-click-outside="onClickOutside">

        <div class="modal__list modalList">
            <template v-for="item in modalItems" :key="id">
                <div @click="item.func" class="modal__list__item">
                    <img :src="item.icon" alt="" />
                    <p :class="item.name === 'Сообщить о нарушении' && 'error-txt'" class="txt-body1">{{ item.name }}
                    </p>
                </div>
            </template>

        </div>
    </div>
</template>

<script setup lang="ts">
import msg_route from "~/assets/icons/msg_psuh.svg"
import block from "~/assets/icons/block.svg"
import complain from "~/assets/icons/coplain.svg"
import share from "~/assets/project_modal/share.svg"

import { postAddComplaint } from "~/API/ways/user"
import { defineEmits } from 'vue';

import { modalActionsList } from '~/helpers/types'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/store/user'

const props = defineProps({
    userID: Number
})
const user = useUserStore()
const router = useRouter()
const emit = defineEmits(['close'])
function onClickOutside() {
    user.userObj.topModalState = false
    emit('close')
}
async function sendComplaint() {
    try {
        const response = await postAddComplaint(Number(localStorage.getItem("userId")), Number(props.userID), 'some text');
        console.log('Жалоба успешно отправлена:', response);
    } catch (error) {
        console.error('Ошибка отправки жалобы:', error);
    }
}

const modalItems: modalActionsList[] = [
    {
        name: 'Написать сообщение',
        icon: msg_route,
        func: () => {
            emit('close')
            router.push(`/messenger/chat/${props.userID}`)
        }

    },
    {
        name: 'Поделиться этим профилем',
        icon: share,
        func: () => {
            try {
                navigator.share({
                    title: 'ITNT',
                    text: 'Откройте для себя ITNT.',
                    url: 'https://itnt.store/user/' + props.userID,
                })
            } catch (error) {
                console.log('error :' + error)
            }
        },
    },
    {
        name: 'Заблокировать',
        icon: block,
        // route: '/me/edit',
    },
    {
        name: 'Сообщить о нарушении',
        icon: complain,
        func: () => sendComplaint()
        // route: '/me/edit'
    },
]
</script>

<style lang="scss" scoped>
.topModal {
    position: fixed;
    background: $def-white;
    padding: 20px 25px;
    border-radius: 0px 0px 20px 20px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    top: $header-hight;
    z-index: 9999;
    width: 100%;
    animation: 0.3s show ease;
}

.modalList {
    margin-top: 24px;
}

@keyframes show {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>
