<template>
    <Header showUserMinify />
    <div class="projectHeader__edit">
        <UiInput v-model="projectName" label="Название проекта*" :required="true" />
        <UiInput v-model="projectSlogan" label="Слоган" :required="true" />
        <UiInput v-model="projectId" label="id проекта" :required="true" />
    </div>
    <v-container>
        <div class="projectCard__editable__tags">
            <p>Ваш проект в трёх словах (теги)*</p>
            <ProjectSkills :is-new-project="true" v-model="projectTags" :readOnly="false"
                @add-skills="handleAddSkills" />
        </div>

        <!-- Описание проекта -->
        <div class="projectCard__editable__info">
            <p>Опишите проект</p>

            <UiInput v-model="projectTitle" label="Заголовок*" />
            <div>
                <UiTextArea v-model="projectDescription" label="Описание проекта*"
                    :rules="[(v:any) => v.length <= 1024 || 'Max 1024 characters']" counter />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postProject } from '~/API/ways/project'
// import { useProjectStore } from '~/store/projectStore'

// const prjStore = useProjectStore()
const snackbarVisible = ref(false)
const router = useRouter()

const projectName = ref('')
const projectSlogan = ref('')
const projectId = ref('itnthub')
const projectTags = ref([])  // Selected skills
const projectTitle = ref('')
const projectDescription = ref('')

const handleAddSkills = (skills:any) => {
    projectTags.value = skills;
};

async function postNewProject() {
    const projectData = {
        name: projectName.value,
        slogan: projectSlogan.value,
        nickName: projectId.value,
        // tags: projectTags.value,  // Используем выбранные навыки здесь
        activityFields: projectTags.value,
        descriptionHeader: projectTitle.value,
        description: projectDescription.value,
        projectStage: 'CUST_DEV',
        projectRegistrationPlaces: 'AMERICA'
    }

    try {
        const response = await postProject(projectData)
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
