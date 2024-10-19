<template>
    <div v-if="props.commentObject.message" class="feedCard" :style="{ 'margin-left': computedPaddingLeft + 'px' }">
        <div class="vertical-line" v-if="props.commentObject.deep"></div>
        <div class="text-sm opacity-60" v-if="props.commentObject.replyText">
            {{ props.commentObject.replyText }}
        </div>
        <!-- head -->
        <div class="feedCard__head">
            <div class="d-flex align-center">
                <img class="mr-3" width="30" height="30" src="../assets/demo/ava-small-header.svg" />
                <div>
                    <div class="d-flex">
                        <div class="flex-col">
                            <p class="txt-body3">{{ name || "Загружаем.." }}</p>
                            <p style="color: #9e9e9e" class="txt-cap1">Вдохновитель Dribbble</p>
                        </div>

                        <img class="mx-2" src="../assets/icons/singeDot-gray.svg" />
                        <span style="color: #9e9e9e" class="txt-cap1">{{ formatTime(props.commentObject.insertDate)
                            }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- body -->
        <div class="feedCard__body">
            <p v-html="formattedText"></p>
            <!-- footer -->
            <div class="feedCard__footer">
                <button @click="startReply(props.commentObject, name)"
                    class="feedCard__footer__button">Ответить</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue'
// import UiButton from '../ui-kit/UiButton.vue'
// import { postAddUserPicture } from "~/API/ways/user";
import { getUserByID } from '~/API/ways/user.ts'


const props = defineProps({
    commentObject: {
        type: Object
    }
})
const computedPaddingLeft = computed(() => props.commentObject.deep * 20);
const emit = defineEmits(['startReply']);
function startReply(commentObject: object, name: string) {
    emit('startReply', commentObject, name);

}

let name = ref("")
onMounted(async () => {
    try {
        const response = await getUserByID(props.commentObject.userId);
        let firstName = response.data.object.firstName
        let lastName = response.data.object.lastName ? " " + response.data.object.lastName : ""
        name.value = firstName + lastName
    } catch (e) {
        console.error('Error:', e);
    }
});

const now = new Date();
const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const difference = now.getTime() - time.getTime();
    if (difference < 1 * 60 * 60 * 1000) {
        const hours = Math.floor(difference / (60 * 60 * 1000));
        return `недавно`;
    }
    if (difference < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(difference / (60 * 60 * 1000));
        return `${hours} ч.назад`;
    } else {
        return `${time.getFullYear()} ${time.toLocaleTimeString()}`;
    }
};


const formattedText = ref('');
let highlightedTextWord = props.commentObject.replyUserName

onMounted(() => {
    formattedText.value = props.commentObject.message.replace(highlightedTextWord, `<span style="color:#6659dd">${highlightedTextWord}</span>`);

});


</script>

<style scoped lang="scss">
.vertical-line {
    position: absolute;
    top: 0;
    left: -10px;
    height: calc(100% + 4px);
    background: #726e6e;
    opacity: 0.2;
    width: 2px;
    border-radius: 10px;
}

.feedCard {
    position: relative;
    margin: 0 0 10px 0;
    padding: 18px 14px;
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

        &__subtitle {
            color: #9e9e9e;
            margin-top: 1px;
            text-align: initial;
        }
    }

    &__body {
        text-align: left;

        &__slider {
            display: flex;
            gap: 16px;
            -ms-overflow-style: none;
            /* Internet Explorer 10+ */
            scrollbar-width: none;
            overflow-x: scroll;

            &::-webkit-scrollbar {
                display: none;
                /* Safari and Chrome */
            }
        }
    }

    &__vacancy {
        &__head {
            padding: 10px 20px;
            display: flex;
            gap: 10px;
            align-items: center;
            max-width: fit-content;
            border-radius: 8px;
            background: #e1f5fe;
        }
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        &__button {
            // width: 100%;
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 14.5px 20px;
            // box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.2) inset, 0px 23px 10px -23px rgba(0, 0, 0, 0.15);
            text-align: right;
        }
    }
}

.feedCard__panel :deep() {
    border: 1px solid $def-white;

    .v-expansion-panel__shadow {
        display: none;
    }

    .v-expansion-panel-title__overlay {
        opacity: 0;
    }

    .v-expansion-panel-text__wrapper {
        padding: 23px 20px;
        padding-top: 8px;
    }
}

.v-expansion-panel--active {
    border-radius: 12px !important;
    background: #ffffff;
    border: #c7edff 1px solid !important;
}
</style>
