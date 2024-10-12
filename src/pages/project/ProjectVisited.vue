<template>
    <Header class="relative z-9" showID show-user-minify />
    <ProjectHeader :prjAva="fullAvatarUrl" readOnly :prj-name="data.name" :prjID="data.id" :prj-slogan="data.slogan" />
    <div class="cards-switch-wrapper">
        <div class="cards" v-if="showCard">
            <div class="card red">
                <p class="tip">Теперь описание проекта, инвестиции и блог будут в отдельных вкладках, чтобы на экране
                    была только интересующая вас информация</p>
                <div class="">

                </div>
            </div>
        </div>
        <div class="mx-[16px] ">
            <UiSwitch class="cursor-pointer z-1000 relative switch " @change-value="projectsType = $event"
                :items="['Блог проекта', 'Описание', 'Инвестиции']" />
        </div>
    </div>
    <div v-if="showOverlay" class="overlay"></div>
    <v-container>
        <div v-show="projectsType === 1" class="">
            <ProjectCard readOnly class="mt-12" :prj-desc-body="data.description"
                :prj-desc-head="data.descriptionHeader" />
            <ProjectTeam :team="data.users" class="mt-12" readOnly />
            <ProjectVacancys class="mt-12" readOnly />
            <ProjectStage :stage="data.projectStage" readOnly />
            <ProjectMedia class="mt-12" readOnly />
            <vue-bottom-sheet :click-to-close="true" :background-scrollable="false" ref="modalState">
                <div class="min-h-[350px]">
                    <div class="searchTeammateModal__items">
                        <UiPost :prj-auth="true" v-model:description-header="postData.descriptionHeader"
                            @postSuccess="closeModal" v-model:description="postData.description"
                            :author-user="postData.authorUser" :author-project="postData.authorProject" card />
                    </div>
                </div>
            </vue-bottom-sheet>
        </div>
        <div v-show="projectsType === 0" class="my-[48px]">
            <h1>Что у меня нового:</h1>
            <UiInput @click="modalState.open()" label="Расскажите, чем запомнился день" />
        </div>
        <div v-show="projectsType === 0" v-if="posts" v-for="(post, index) in posts " :key="index">
            <ProjectBlog :blog-data="post" user-type="me" withoutBg feedCardType="newProjectStage" />
        </div>
        <div v-show="projectsType === 2" class="">
            <ProjectInvest />
        </div>
    </v-container>
    <Footer class="relative z-9" />
</template>

<script setup lang="ts">
import ProjectInvest from "../../components/projects/ProjectInvesting.vue"
import UiSwitch from "../../components/ui-kit/UiSwitch.vue"
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import ProjectStage from '~/components/projects/ProjectStage.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { getProjectByID } from '~/API/ways/project.ts'
import { useRoute } from 'vue-router'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { getPostByProject } from '~/API/ways/post';
let data = ref({})
const projectsType = ref(0)
const route = useRoute()
const showOverlay = ref(true)
const showCard = ref(true)
onMounted(async () => {
    setTimeout(() => {
        showCard.value = false;
        showOverlay.value = false;
    }, 15000);
})
const modalState = ref(null);
const closeModal = () => {
    if (modalState.value) {
        modalState.value.close();
    }
};
onMounted(async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object
        } catch (e) {
            console.error('error:', e)
        }
    })
})
let posts = ref()
onMounted(async () => {
    try {
        const response = await getPostByProject(Number(route.params.ID));
        posts.value = response.data.object
        console.log(response);
    } catch (e) {
        console.error('error:', e);
    }
});
const postData = ref({
    descriptionHeader: '',
    description: '',
    authorProject: route.params.ID,
});
const baseURL ='https://itnt.store/';

const fullAvatarUrl = computed(() => {
    return data.value.avatarUrl ? `${baseURL}files/${data.value.avatarUrl}` : '';
});
console.log(data);
console.log(fullAvatarUrl)
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import UiInput from '../../components/ui-kit/UiInput.vue'
import UiPost from '../../components/ui-kit/UiPost.vue'
import ProjectHeader from '~/components/projects/ProjectHeader.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import ProjectMedia from '~/components/projects/ProjectMedia.vue'
import ProjectTeam from '~/components/projects/ProjectTeam.vue'
import ProjectVacancys from '~/components/projects/ProjectVacancys.vue'
</script>

<style lang="scss">
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999;
}

.cards-switch-wrapper {
    position: relative;
    z-index: 1000;
}

.cards {
    position: absolute;
    top: -120px;
    /* Поднимаем блок cards на 20px выше */
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 1000;

    /* gap: 15px; */
    @media (max-width: 425px) {
        top: -170px;
    }

    @media (max-width: 320px) {
        top: -220px;
    }
}

.cards .red {
    background-color: #29B6F6;
    padding: 18px 18px 40px 18px;
}

.cards .card {
    display: flex;
    border-radius: 20px 20px 4px 20px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    min-height: 100px;
    color: white;
    cursor: pointer;
    margin: 0px 16px;
    transition: 400ms;
}

.card {
    animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.8);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.cards .card p.tip {
    font-size: 1em;
    font-weight: 700;
    text-align: left;
}

.cards .card:hover {
    transform: scale(0.9, 0.9);
}

.cards:hover>.card:not(:hover) {
    filter: blur(10px);
    transform: scale(1.1, 1.1);
}
</style>