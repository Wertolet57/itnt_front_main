<template>
    <Header showUserMinify />
    <div class="projectHeader__edit">
        <div class="avatar-uploader">
            <div class="avatar-" @click="triggerFileInput">
                <img v-if="avatarPreview" :src="avatarPreview" alt="Аватар" />
                <img src="@/assets/img/regSteps/addProfilePic.svg" v-else />
            </div>
            <input ref="fileInput" type="file" accept="image/*" @change="onAvatarChange" class="hidden-input" />
        </div>
        <UiInput v-model="projectName" label="Название проекта*" :required="true" ref="projectNameRef" />
        <UiInput v-model="projectSlogan" label="Слоган*" :required="true" ref="projectSloganRef" />
        <!-- <UiInput v-model="projectId" label="id проекта*" :required="true" ref="projectIdRef" /> -->
        <div class="project-id-input">
            <span class="prefix">{{ defaultPrefix }}</span>
            <input type="text" v-model="editableValue" @input="syncValue" class="editable-input" />
        </div>
    </div>
    <div class="mx-4">

    </div>
    <v-container>
        <div class="projectCard__editable__tags">
            <p>Ваш проект в трёх словах (теги)*</p>
            <ProjectSkills :tags="projectTags" :is-new-project="true" v-model="projectTags" :readOnly="false"
                @add-skills="handleAddSkills" />
        </div>

        <!-- Описание проекта -->
        <div class="projectCard__editable__info">
            <p>Опишите проект</p>

            <UiInput v-model="projectTitle" label="Заголовок*" :required="true" ref="projectTitleRef" />
            <div>
                <UiTextArea v-model="projectDescription" label="Описание проекта*"
                    :rules="[(v) => v.length <= 900 || 'Max 1024 characters']" counter ref="projectDescriptionRef" />

                <UiPrompt :projectCard="true">
                    Текст, выделенный зелёным цветом, будет отображаться на мини-карточке проекта в разных
                    местах приложения, где пространство ограничено. А полное описание будет отображаться на странице
                    вашего проекта.
                </UiPrompt>
            </div>
        </div>
        <div class="">
            <UiButton @click="postNewProject" class="mt-12" bgColor="blue">Опубликовать проект</UiButton>
        </div>
        <v-snackbar v-model="snackbarVisible" min-width="270px" max-height="46px" :timeout="3000" color="white"
            rounded="lg">
            <div class="flex flex-row justify-between items-center">
                Проект создан
            </div>
        </v-snackbar>
    </v-container>
    <Footer />
</template>

<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import UiButton from '~/components/ui-kit/UiButton.vue'
import UiInput from '~/components/ui-kit/UiInput.vue'
import UiPrompt from '~/components/ui-kit/UiPrompt.vue'
import UiTextArea from '~/components/ui-kit/UiTextArea.vue'
import ProjectSkills from "~/components/projects/ProjectSkills.vue"
// import ProjectAddPhoto from "../../components/projects/ProjectAddPhoto.vue"
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postProject } from '~/API/ways/project'

const snackbarVisible = ref(false)
const router = useRouter()

const projectName = ref('')
const projectSlogan = ref('')
const projectId = ref('https://itnt.store/')
const projectTags = ref([])
const projectTitle = ref('')
const projectDescription = ref('')
const avatarFile = ref(null);
const avatarPreview = ref('');
const fileInput = ref(null);
const defaultPrefix = "https://itnt.store/";
const placeholder = "Введите дополнительный текст...";

// Хранит изменяемую часть текста
const editableValue = ref("");

// Синхронизация значения
function syncValue(event) {
    editableValue.value = event.target.value;
}
const triggerFileInput = () => {
    fileInput.value.click();
};
function onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
        avatarFile.value = file;
        avatarPreview.value = URL.createObjectURL(file);
    }
}
//
const projectNameRef = ref(null)
const projectSloganRef = ref(null)
const projectIdRef = ref(null)
const projectTitleRef = ref(null)
const projectDescriptionRef = ref(null)
function scrollToEmptyInput() {
    if (!projectName.value) {
        projectNameRef.value.$el.scrollIntoView({ behavior: 'smooth' })
        return
    }
    if (!projectSlogan.value) {
        projectSloganRef.value.$el.scrollIntoView({ behavior: 'smooth' })
        return
    }
    if (!projectId.value) {
        projectIdRef.value.$el.scrollIntoView({ behavior: 'smooth' })
        return
    }
    if (!projectTitle.value) {
        projectTitleRef.value.$el.scrollIntoView({ behavior: 'smooth' })
        return
    }
    if (!projectDescription.value) {
        projectDescriptionRef.value.$el.scrollIntoView({ behavior: 'smooth' })
        return
    }
}
const handleAddSkills = (skills: any) => {
    projectTags.value = skills;
};

async function postNewProject() {
    if (!projectName.value || !projectSlogan.value || !projectId.value || !projectTitle.value || !projectDescription.value) {
        scrollToEmptyInput()
        return
    }
    const projectData = {
        name: projectName.value,
        slogan: projectSlogan.value,
        nickName: projectId.value,
        // tags: projectTags.value, 
        activityFields: projectTags.value,
        descriptionHeader: projectTitle.value,
        description: projectDescription.value,
        projectStage: 'CUST_DEV',
        projectRegistrationPlaces: 'AMERICA'
    }

    try {
        const response = await postProject(projectData, avatarFile.value, avatarFile.value)
        console.log(response)
        snackbarVisible.value = true

        setTimeout(() => {
            router.push('/me')
        }, 3000)
    } catch (e) {
        console.error('Error creating project:', e)
    }
}
console.log(projectTags)
</script>


<style lang="scss" scoped>
.project-id-input {
    display: flex;
    align-items: center;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px;
}

.prefix {
    color: #323232;
    user-select: none;
}

.editable-input {
    border: none;
    outline: none;
    flex-grow: 1;
    padding-left: 1px;
}

.avatar-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.avatar-circle {
    width: 15vw;
    height: 15vh;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.2s ease;
}

.avatar-circle:hover {
    border-color: #aaa;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-circle span {
    font-size: 2rem;
    color: #aaa;
}

.hidden-input {
    display: none;
}

.projectHeader {
    width: 100%;
    padding-top: 18px;

    &__edit {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 20px;
    }
}

.projectCard {
    &__editable {
        &__pics {
            p {
                margin-bottom: 18px;
            }

            &__grid {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }

            &__adder {
                height: 106px;
                width: 73px;
                background: $def-white;
                border-radius: 12px;
                align-items: center;
                justify-content: center;
                display: flex;
            }
        }

        &__tags {
            margin-top: 43px;
            margin-bottom: 48px;

            p {
                margin-bottom: 16px;
            }
        }

        &__info {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }
}

.input-file {
    min-width: 228px;
    min-height: 320px;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -12%);
    position: absolute;
    opacity: 0;
}

.ava {
    display: flex;
    padding: 0 0 0 20px;
    justify-content: start;

    img {
        aspect-ratio: 110 / 106;
        max-width: 20%;
        height: auto;
        border-radius: 100%;
    }
}
</style>
