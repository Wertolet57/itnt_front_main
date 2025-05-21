<template>
    <div v-if="props.readOnly" class="userPics">
        <div class="userPics__bg">
            <div v-if="props.bgPic == null || props.bgPic == ''" class=""></div>
            <img v-else v-show="props.bgPic" :src="props.bgPic" alt="User background picture">
        </div>
        <div v-if="props.me === true" class="userPics__ava">
            <div v-if="props.avaPic == null || props.avaPic == ''" class="">
                <img class="def" :src="ava" @click="uploadAva">
                <div @click="uploadAva" class="refresh">
                    <img class="" src="../../assets/demo/refresh.svg" alt="">
                </div>
                <input type="file" ref="avaFleInput" style="display: none;" @change="handleFileAva">
            </div>
            <img v-else v-show="props.avaPic" :src="props.avaPic" alt="User avatar">
        </div>
        <div v-if="props.me === false" class="userPics__ava">
            <img v-if="props.avaPic == null || props.avaPic == ''" class="def" :src="ava">
            <img v-else v-show="props.avaPic" :src="props.avaPic" alt="User avatar">
        </div>
    </div>

    <div v-else class="userPics">
        <div v-if="props.bgPic" class="userPics__bg">
            <img @click="openBgModal" :src="props.bgPic" />
        </div>
        <div v-else class="userPics__upload">
            <input type="file" ref="bgFileInput" style="display: none;" @change="handleFileInputChange">
            <button class=" userPics__btn" @click="uploadBg">
                <img src="/src/assets/Profile/icons.svg" alt="">
            </button>
        </div>

        <v-dialog v-model="bgModal" width="100%">
            <v-card class="ui-skills__search p-4">
                <p>
                    <span>Изменение фонового изображения</span>
                </p>
                <div class="ui-skills__search__actions">
                    <UiButton @click="removeBackgroundPicture(id)" bgColor="smOutlined" isSmall>Удалить</UiButton>
                    <div class="p-0 flex w-full justify-end">
                        <UiButton @click="uploadBg" bgColor="smOutlined" isSmall>Заменить</UiButton>
                        <input type="file" ref="bgFileInput" style="display: none;" @change="handleFileInputChange">
                    </div>
                </div>
            </v-card>
        </v-dialog>

        <div v-if="props.avaPic" class="userPics__ava">
            <img @click="openAvaModal" :src="props.avaPic" />
        </div>
        <div v-else class="userPics__ava">
            <img class="def" :src="ava" @click="uploadAva">
            <div class="refresh">
                <img class="" src="../../assets/demo/refresh.svg" alt="">
            </div>
            <input type="file" ref="avaFleInput" style="display: none;" @change="handleFileAva">
        </div>
        <v-dialog v-model="avaModal" width="100%">
            <v-card class="ui-skills__search p-4">
                <p>
                    <span>Изменение аватарки</span>
                </p>
                <div class="ui-skills__search__actions">
                    <UiButton @click="removeBackgroundPicture(id)" bgColor="smOutlined" isSmall>Удалить</UiButton>
                    <div class="p-0 flex w-full justify-end">
                        <UiButton @click="uploadAva" bgColor="smOutlined" isSmall>Заменить</UiButton>
                        <input type="file" ref="avaFleInput" style="display: none;" @change="handleFileAva">
                    </div>
                </div>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbarVisible" min-width="270px" max-height="46px" :timeout="3000" color="white"
            rounded="lg">
            <div class="flex flex-row justify-between items-center">
                Изображение добавлено
            </div>
        </v-snackbar>

    </div>
</template>

<script setup lang="ts">
import ava from "../../assets/demo/defAva.svg"
import { ref } from 'vue'
import { postAddUserPicture, postAddBackgroundPicture, deleteUserPicture, getUserByID } from '~/API/ways/user';
import UiButton from '../ui-kit/UiButton.vue';
import { onMounted } from "vue";
const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false,
    },
    me: {
        type: Boolean,
        default: false,
    },
    bgPic: {
        type: String,
    },
    avaPic: {
        type: String,
        default: ava
    }
})

const avaModal = ref(false)
const bgModal = ref(false)
const snackbarVisible = ref(false)

function openAvaModal() {
    avaModal.value = true
}
function openBgModal() {
    bgModal.value = true
}
const bgFileInput = ref<HTMLInputElement | null>(null);
const uploadedBgImageUrl = ref<string>('');

const avaFleInput = ref<HTMLInputElement | null>(null);
const uploadedAvaImageUrl = ref<string>('');

const handleFileInputChange = async () => {
    const files = bgFileInput.value?.files;
    if (files && files.length > 0) {
        const selectedFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
            uploadedBgImageUrl.value = reader.result as string;
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                await postAddBackgroundPicture(formData);
            } catch (error) {
                console.error('error:', error);
            }
        };
    }
    await getUserByIDApi()
    bgModal.value = false
    snackbarVisible.value = true
}
const handleFileAva = async () => {
    const files = avaFleInput.value?.files;
    if (files && files.length > 0) {
        const selectedFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
            uploadedAvaImageUrl.value = reader.result as string;
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                await postAddUserPicture(formData, true);
            } catch (error) {
                console.error('error:', error);
            }
        };
        await getUserByIDApi()
    }
    avaModal.value = false
    snackbarVisible.value = true
}

const uploadBg = async () => {
    await getUserByIDApi()
    bgFileInput.value?.click();
}

const uploadAva = async () => {
    await getUserByIDApi()
    avaFleInput.value?.click();
}

const id = ref<number>(0);

const removeBackgroundPicture = async (id: Number) => {
    try {
        await deleteUserPicture(id);
        console.log("Изображение успешно удалено");

        // searchModalState.value = false;
    } catch (error) {
        console.error("Произошла ошибка при удалении изображения", error);
    }
};
const getUserByIDApi = async () => {
    try {
        const response = await getUserByID(Number(localStorage.getItem("userId")))
        console.log(response);

    } catch (error) {

    }
}
onMounted(getUserByIDApi)
</script>

<style lang="scss" scoped>
.def {
    position: relative;
    overflow: hidden;
    /* Обрезает все, что выходит за границы */
}

.userPics {
    position: relative;
    margin-bottom: 32px;
    background-size: cover;
    height: auto;
    background-position: center;

    .refresh {
        background-color: rgba(200, 200, 200, 1);
        /* Soft grey color with some transparency */
        width: 80%;
        height: 18%;
        border-bottom-left-radius: 100%;
        border-bottom-right-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0.1px;
        left: 50%;
        transform: translateX(-50%);
        border: none;
    }


    .refresh img {
        width: 12px;
        height: 12px;
        padding: 0;
        margin-bottom: 2px;

        &:hover {
            opacity: 0.5;
        }
    }

    &__bg {
        width: 100%;
        background-size: cover;
        background-position: center;
        min-height: 117px;
        max-height: 117px;

        img {
            width: 100%;
            min-height: 117px;
            max-height: 117px;
        }
    }


    &__ava {
        position: absolute;
        left: 52%;
        top: 33px;
        overflow: hidden;
        /* Обрезает все, что выходит за границы */

        transform: translateX(-50%);
        width: 104px;
        height: 104px;
        background-size: cover;
        background-position: center;
        border-radius: 100%;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.5);

        img {
            // border: 1.5px solid #e0e0e0;
            border-radius: 100%;
            cursor: pointer;
            width: 104px;
            height: 104px;
        }
    }

    &__upload {
        align-items: end;
        justify-content: end;
        padding: 10px 20px;
        display: flex;
        height: 120px;
    }

    &__uploadEdit {
        width: 100vw;
        display: flex;

        img {
            height: 100px;
            width: 100%;
        }
    }

    &__btn {
        position: absolute;
        top: 100px;
        right: 7%;
        background-color: white;
        padding: 7px;
        width: 30px;
        height: 30px;
        border-radius: 4px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }

}
</style>