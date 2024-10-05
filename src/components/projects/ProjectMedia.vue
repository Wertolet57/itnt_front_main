<template>
    <div class="projectMedia">
        <div class="flex justify-between ">
            <div class="d-flex mb-3 align-center">
                <p style="color: #263238" class="txt-cap2 mr-2">Вложенные файлы и ссылки</p>
                <div class="txt-body1" style="color: #9e9e9e"> {{filteredFiles.length}} / 6</div>
            </div>
            <!-- <div v-if="props.readOnly === false" @click=""class="mr-4">
                edit
            </div> -->
        </div>
        <div class="projectMedia__list" v-if="props.readOnly === true">
            <!-- READONLY -->

            <div v-for="(file, index) in filteredFiles" :key="index" class="">
                <div class="" v-if="file.pictureUrl == null || ''">

                </div>
                <div v-else class="projectMedia__item">
                    <div style="gap: 10px" class="d-flex align-center">
                        <img src="../../assets/icons/media/video.svg" />
                        <p style="color: #9e9e9e" class="txt-cap1 cursor-pointer">
                            <a :href="sanitizeUrl(file.pictureUrl)" target="_blank"
                                rel="noopener noreferrer">перейти</a>
                        </p>
                    </div>
                    <p style="color: #29b6f6" class="txt-cap1">{{ sanitizeUrl(truncateUrl(file.pictureUrl)) }}</p>
                </div>
            </div>
            <!-- EDITABLE -->
        </div>
        <div class="projectMedia__list" v-if="props.readOnly === false">
            <div v-for="(file, index) in filteredFiles" :key="index" class="">
                <div v-if="file.pictureUrl == null || ''">
                </div>
                <div v-else class="projectMedia__item">
                    <!-- <button @click="deleteLinks(file.id)">
                        {{ file.id }}
                    </button> -->
                    <div style="gap: 10px" class="d-flex align-center">
                        <img src="../../assets/icons/media/video.svg" />
                        <p style="color: #9e9e9e" class="txt-cap1 cursor-pointer">
                            <a :href="sanitizeUrl(file.pictureUrl)" target="_blank"
                                rel="noopener noreferrer">перейти</a>
                        </p>
                    </div>
                    <p style="color: #29b6f6" class="txt-cap1">{{ sanitizeUrl(truncateUrl(file.pictureUrl)) }}</p>
                </div>
            </div>

            <div v-if="filteredFiles.length < 6" @click="mediaState.open()" class="projectMedia__item projectMedia__item--adder cursor-pointer">
                <v-progress-circular v-if="loading" width="2" class="loading mx-auto text-center mt-2" color="active"
                    indeterminate></v-progress-circular>
                <div v-else-if="uploadedFile">
                    <img :src="uploadedFile" alt="Uploaded file" />
                </div>
                <v-icon v-else icon="mdi-plus" />

                <vue-bottom-sheet ref="mediaState">
                    <div class="mx-5 mb-10">
                        <p class="txt-body1 mb-12">
                            Добавьте ссылку на видео-хостинг или загрузите файл в удобное облако и прикрепите ссылку на
                            него.
                        </p>
                        <UiInput v-model="link" id="linkInput" label="Ссылка*" />
                        <UiInput label="Описание ссылки*" class="my-8" />
                        <div @click="mediaState.close()">
                            <UiButton @click="submitProjectLink" bgColor="blue">Добавить</UiButton>
                        </div>
                    </div>
                </vue-bottom-sheet>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import UiInput from '../ui-kit/UiInput.vue'
import UiButton from '../ui-kit/UiButton.vue'
import { addProjectFile } from '~/API/ways/project';
import { useRoute } from 'vue-router'
import { getProjectByID ,deleteProjectFile} from '~/API/ways/project.ts'
const router = useRoute()
const uploadedFile = ref<string | null>(null)
const link = ref('') 
let data = ref([])
const loading = ref(false)
const submitProjectLink = async () => {
    loading.value = true;
    setTimeout(async () => {
        try {
            const response = await addProjectFile(link.value, Number(router.params.ID));
            console.log('Файл успешно добавлен', response);
            mediaState.value = false;
            await getProjectByIDAPi();
        } catch (error) {
            console.error('Ошибка при добавлении файла', error);
        } finally {
            loading.value = false;
        }
    }, 3000);
};
const deleteLinks = async(fileID:Number)=>{
    try {
        await deleteProjectFile(fileID)
    } catch (error) {
        
    }
}
const filteredFiles = computed(() => {
    return data.value.filter(file => file.pictureUrl && file.pictureUrl.includes('https'));
});
const mediaState = ref(false)
const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false,
    },
    files: {
        type: Array,
        default: () => []
    },
})
const getProjectByIDAPi = async () => {
    await getProjectByID(router.params.ID).then((response) => {
        try {
            data.value = response.data.object.projectFiles
        } catch (e) {
            console.error('error:', e)
        }
    })
}
onMounted(getProjectByIDAPi)
function sanitizeUrl(url: string | null | undefined): string {
    if (!url) {
        return ''; // Возвращаем пустую строку или можно указать другой текст по умолчанию
    }
    return url.startsWith(',') ? url.slice(1).trim() : url.trim();
}

function truncateUrl(url) {
    if (!url) return 'Без названия'
    return url.length > 20 ? url.substring(0, 20) + '...' : url
}
</script>

<style lang="scss" scoped>
.projectMedia {
    &__list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    &__item {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px 10px 20px 20px;
        max-width: 161px;
        width: 100%;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

        &--adder {
            align-items: center;
            justify-content: center;
            height: 109px;
        }
    }
}
</style>
