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
                <input type="file" ref="avaFleInput" style="display: none;" accept="image/*" @change="handleFileAva">
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
            <input type="file" id="bgFileInput" style="display: none;" accept="image/*, image/heic" @change="handleFileInputChange">
            <label for="bgFileInput" class=" userPics__btn">
                <img src="/src/assets/Profile/icons.svg" alt="Upload">
            </label>
        </div>

        <v-dialog v-model="bgModal" width="100%">
            <v-card class="ui-skills__search p-4">
                <p>
                    <span>Изменение фонового изображения</span>
                </p>
                <div class="ui-skills__search__actions">
                    <UiButton @click="removeBackgroundPicture()" bgColor="smOutlined" isSmall>Удалить</UiButton>
                    <div class="p-0 flex w-full justify-end">
                        <UiButton bgColor="smOutlined" isSmall><label for="bgFileInput1">Заменить</label></UiButton>
                        <input type="file" id="bgFileInput1" style="display: none;" accept="image/*" @change="handleFileInputChange">
                    </div>
                </div>
            </v-card>
        </v-dialog>

        <div v-if="props.avaPic" class="userPics__ava">
            <img @click="openAvaModal" :src="props.avaPic" />
        </div>
        <div v-else class="userPics__ava">
            <label for="avaFileInput">
                <img class="def" :src="ava">
            </label>
            <div class="refresh">
                <img class="" src="../../assets/demo/refresh.svg" alt="">
            </div>
            <input type="file" id="avaFileInput" style="display: none;" accept="image/*" @change="handleFileAva">
        </div>
        <v-dialog v-model="avaModal" width="100%">
            <v-card class="ui-skills__search p-4">
                <p>
                    <span>Изменение аватарки</span>
                </p>
                <div class="ui-skills__search__actions">
                    <UiButton @click="removeAvaPicture()" bgColor="smOutlined" isSmall>Удалить</UiButton>
                    <div class="p-0 flex w-full justify-end">
                        <UiButton bgColor="smOutlined" isSmall><label for="avaFleInput">Заменить</label></UiButton>
                        <input type="file" id="avaFleInput" style="display: none;" accept="image/*" @change="handleFileAva">
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
import { postAddUserPicture, postAddBackgroundPicture, deleteAvaPicture, deleteBackgroundPicture, getUserByID } from '~/API/ways/user';
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

const emit = defineEmits(['update:bgPic', 'update:avaPic'])

const avaModal = ref(false)
const bgModal = ref(false)
const snackbarVisible = ref(false)
const baseURL = 'https://itnt.store/';

function openAvaModal() {
    avaModal.value = true
}
function openBgModal() {
    bgModal.value = true
}

const uploadAva = () => {
    const input = document.getElementById('avaFileInput') as HTMLInputElement;
    if (input) {
        input.click();
    }
}

const handleFileInputChange = async (event: Event) => {    
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const selectedFile = input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            await postAddBackgroundPicture(formData);
            const response = await getUserByIDApi();
            if (response?.data?.object?.backgroundPictureUrl) {
                emit('update:bgPic', `${baseURL}files/${response.data.object.backgroundPictureUrl}`);
            }
        } catch (error) {
            console.error('error:', error);
        }
    };
    bgModal.value = false;
    console.log("Изображение успешно обновлено");
    snackbarVisible.value = true;
}

const handleFileAva = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const selectedFile = input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            await postAddUserPicture(formData, true);
            const response = await getUserByIDApi();
            if (response?.data?.object?.pictureUrl) {
                emit('update:avaPic', `${baseURL}files/${response.data.object.pictureUrl}`);
            }
        } catch (error) {
            console.error('error:', error);
        }
    };
    avaModal.value = false;
    snackbarVisible.value = true;
}

const removeAvaPicture = async () => {
    try {
        await deleteAvaPicture();
        const response = await getUserByIDApi();
        if (response?.data?.object?.pictureUrl) {
            emit('update:avaPic', `${baseURL}files/${response.data.object.pictureUrl}`);
        } else {
            emit('update:avaPic', '');
        }
        console.log("Изображение успешно удалено");
        avaModal.value = false;
    } catch (error) {
        console.error("Произошла ошибка при удалении изображения", error);
    }
};

const removeBackgroundPicture = async () => {
    try {
        await deleteBackgroundPicture();
        const response = await getUserByIDApi();
        if (response?.data?.object?.backgroundPictureUrl) {
            emit('update:bgPic', `${baseURL}files/${response.data.object.backgroundPictureUrl}`);
        } else {
            emit('update:bgPic', '');
        }
        console.log("Изображение успешно удалено");
        bgModal.value = false;
    } catch (error) {
        console.error("Произошла ошибка при удалении изображения", error);
    }
};

const getUserByIDApi = async () => {
    try {
        const response = await getUserByID(Number(localStorage.getItem("userId")))
        return response;
    } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        return null;
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

.hidden-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
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