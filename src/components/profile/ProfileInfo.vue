<template>
    <div v-if="props.profile || readOnly" class="flex flex-row justify-between">
        <div class="userInfo">
            <div class="userInfo__head">
                <h2 class="mb-1">{{ fullName }}</h2>
                <p class="txt-body1">{{ props.country }} {{ props.city }}</p>
            </div>

            <div v-if="props.proposition"
                 class="userInfo__status">
                <p class="userInfo__status__title txt-body1">{{ $t('open') }}</p>
                <img src="@/assets/icons/footer/message.svg" alt="Открыт к предложениям" />
            </div>
            <div v-show="props.proposition && props.profile" @click="router.push(`/messenger/chat/${currentUserId}`)" class="send">
                <button >
                    <div class="svg-wrapper-1">
                        <div class="svg-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path fill="currentColor"
                                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z">
                                </path>
                            </svg>
                        </div>
                    </div>
                    <span>Send</span>
                </button>
            </div>

            <div v-if="readOnly" class="userInfo__body mb-[24px]">
                <div class="txt-body1">{{ props.userDescription }}</div>
            </div>
        </div>

        <div v-if="props.profile" @click="toggleFollow"
            class="bg-white cursor-pointer p-[10px] max-h-[48px] rounded-[12px] shadow-md">
            <img :src="isFollowed ? star : follow" :alt="isFollowed ? 'Отписаться' : 'Подписаться'" />
        </div>

        <v-snackbar v-model="snackbarVisible" :timeout="3000" color="white" rounded="lg">
            {{ snackbarMessage }}
        </v-snackbar>
    </div>

    <div v-else class="userEdit mt-4">
        <UiInput v-model="userObj.firstName" class="mb-4" label="Имя" required />
        <UiInput v-model="userObj.lastName" class="mb-4" label="Фамилия" required />
        <v-select v-model="userObj.country" :items="Object.keys(list)" label="Страна" class="mb-2" />
        <v-select v-model="userObj.city" :items="list[userObj.country] || []" :disabled="!userObj.country"
            label="Выберите город" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute , useRouter} from 'vue-router';
import { addFollow, delFollow, getFollowed } from "@/API/ways/user";
import follow from "@/assets/modal_icon/follow.svg";
import star from "@/assets/modal_icon/star-filled.svg";
import Arr from '@/helpers/set';
import UiInput from "@/components/ui-kit/UiInput.vue";

const props = defineProps({
    profile: Boolean,
    readOnly: Boolean,
    userId: Number,
    userName: String,
    userSurname: String,
    userDescription: String,
    country: String,
    city: String,
    proposition: Boolean,
});

const route = useRoute();
const router = useRouter();
const list = ref(Arr);
const snackbarVisible = ref(false);
const snackbarMessage = ref('');
const followeds = ref([]);
const userObj = ref({ firstName: '', lastName: '', country: '', city: '' });

const currentUserId = computed(() => {
    if (props.userId) {
        return props.userId;
    }
    const parts = route.path.split('/');
    const lastPart = parts[parts.length - 1];
    console.log('Route path:', route.path, 'Last part:', lastPart);
    return lastPart && !isNaN(Number(lastPart)) ? Number(lastPart) : null;
});

const fullName = computed(() => `${props.userName} ${props.userSurname}`);
const location = computed(() => `${props.country} ${props.city}`);

const isFollowed = computed(() => {
    if (!currentUserId.value) {
        console.log('No valid user ID found');
        return false;
    }
    const result = followeds.value.some(follower => follower.id === currentUserId.value);
    console.log('isFollowed:', result, 'currentUserId:', currentUserId.value, 'followeds:', followeds.value);
    return result;
});

async function toggleFollow() {
    if (!currentUserId.value) {
        console.error('No valid user ID to toggle follow');
        return;
    }
    try {
        console.log('Toggling follow. Current state:', isFollowed.value, 'for user ID:', currentUserId.value);
        if (isFollowed.value) {
            await delFollow(currentUserId.value);
            snackbarMessage.value = 'Вы отписались';
        } else {
            await addFollow(currentUserId.value);
            snackbarMessage.value = 'Вы подписались';
        }
        snackbarVisible.value = true;
        await fetchFolloweds();
    } catch (error) {
        console.error('Ошибка при изменении подписки:', error);
    }
}

async function fetchFolloweds() {
    try {
        const response = await getFollowed();
        followeds.value = response.data.object;
        console.log('Fetched followeds:', followeds.value);
    } catch (error) {
        console.error('Ошибка при получении подписок:', error);
    }
}

onMounted(() => {
    fetchFolloweds();
    console.log('Component mounted. Current user ID:', currentUserId.value);
});

watch(currentUserId, (newVal) => {
    console.log('currentUserId changed:', newVal);
    if (newVal) {
        fetchFolloweds();
    }
});
</script>

<style lang="scss" scoped>
.userInfo {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 24px;

    &__status {
        padding: 5.5px 14px;
        align-items: center;
        display: flex;
        max-width: fit-content;
        border: 1.5px solid $primary;
        border-radius: 8px;
        gap: 9px;

        &__title {
            color: $primary;
        }
    }
}

.send {
    button {
        outline:none;
        font-family: inherit;
        font-size: 20px;
        background: $primary;
        color: white;
        padding: 0.3em 0.8em;
        padding-left: 0.9em;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.2s;
        cursor: pointer;
    }

    button span {
        display: block;
        margin-left: 0.3em;
        transition: all 0.3s ease-in-out;
    }

    button svg {
        display: block;
        transform-origin: center center;
        transition: transform 0.3s ease-in-out;
    }

    button:hover .svg-wrapper {
        animation: fly-1 0.6s ease-in-out infinite alternate;
    }

    button:hover svg {
        transform: translateX(1.2em) rotate(45deg) scale(1.1);
    }

    button:hover span {
        transform: translateX(5em);
    }

    button:active {
        transform: scale(0.95);
    }

    @keyframes fly-1 {
        from {
            transform: translateY(0.1em);
        }

        to {
            transform: translateY(-0.1em);
        }
    }

}
</style>