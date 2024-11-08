<script lang="ts">
export default {
    name: 'UserProject',
}
</script>

<template>
    <div class="topModal" v-click-outside="onClickOutside">

        <div class="modal__list modalList">
            <template v-if="props.project?.owner.id == userID" v-for="item in modalItemsEdit" :key="id">
                <div @click="item.func" class="modal__list__item">
                    <img :src="item.icon" alt="" />
                    <p class="txt-body1">{{ item.name }}
                    </p>
                </div>
            </template>
            <template v-else-if="props.project?.owner.id !== userID" v-for="item in modalItems" :key="id">
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
import complain from "~/assets/icons/coplain.svg"
import share from "~/assets/project_modal/share.svg"
import vallet from "../assets/demo/vallet.svg"
import edit from '../assets/edit_icon.svg'
import { postAddComplaint } from "~/API/ways/user"
import { defineEmits } from 'vue';
import { modalActionsList } from '~/helpers/types'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/store/user'
const props = defineProps({
    project: {
        type: Object
    },
})
const userID = localStorage.getItem("userId")
const user = useUserStore()
const router = useRouter()
const emit = defineEmits(['close'])
function onClickOutside() {
    user.userObj.topModalState = false
    emit('close')
}
async function sendComplaint() {
    try {
        const response = await postAddComplaint(Number(localStorage.getItem("userId")), Number(props.project?.id), 'some text');
        console.log('Жалоба успешно отправлена:', response);
    } catch (error) {
        console.error('Ошибка отправки жалобы:', error);
    }
}

const modalItems: modalActionsList[] = [
    {
        name: 'Связаться с представителем',
        icon: msg_route,
        func: () => {
            emit('close')
            router.push(`/messenger/chat/${props.project?.id}`)
        }

    },
    {
        name: 'Поделиться проектом',
        icon: share,
        func: () => {
            try {
                navigator.share({
                    title: 'ITNT',
                    text: 'Откройте для себя ITNT.',
                    url: 'https://itnt.store/project/' + props.project?.id,
                })
            } catch (error) {
                console.log('error :' + error)
            }
        },
    },
    {
        name: 'Как инвестировать в проект (от $100)',
        icon: vallet,
        func: () => sendComplaint()
    },
    {
        name: 'Сообщить о нарушении',
        icon: complain,
        func: () => sendComplaint()
    },

]
const modalItemsEdit: modalActionsList[] = [
    {
        name: 'Редактировать проект',
        icon: edit,
        func: () => {
            emit('close');
            router.push(`/project/${props.project?.id}/edit`);
        },

    },
    {
        name: 'Поделиться проектом',
        icon: share,
        func: () => {
            try {
                navigator.share({
                    title: 'ITNT',
                    text: 'Откройте для себя ITNT.',
                    url: 'https://itnt.store/project/' + props.project?.id,
                })
            } catch (error) {
                console.log('error :' + error)
            }
        },
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
