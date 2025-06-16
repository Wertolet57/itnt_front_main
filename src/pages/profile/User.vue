<template>
    <Header showID :showUserMinify="true" />
    <!-- {{events}} -->
    <ProfileHeader :me="true" :read-only="true" v-model:bg-pic="fullBannerUrl" v-model:ava-pic="fullAvatarUrl" />
    <v-container>
        <ProfileInfo :proposition="userInfo.openedForProposition" :user-description="userInfo.fullDescription"
            :user-name="userInfo.firstName ? userInfo.firstName : ''" :city="userInfo.city ? userInfo.city.name : ''"
            :country="userInfo.country ? userInfo.country.name : ''" :user-surname="userInfo.lastName ? userInfo.lastName : ''"
            :read-only="true" />
        <UiSkills @update-skills="updateUserSkills" :skillList="userInfo.interests" />
        <v-container>
            <UiButton class="mt-4" @click="$router.push('/project/new')" bgColor="blue">{{ $t('create') }}</UiButton>
        </v-container>
        <v-bottom-sheet inset v-model="isBottomSheetOpen" :click-to-close="true" :background-scrollable="false">
            <div class="max-h-[650px] overflow-y-auto">
                <div class="searchTeammateModal__items">
                    <UiPost :user-auth="true" v-model:description-header="postData.descriptionHeader"
                        v-model:description="postData.description" :author-project="postData?.authorProject"
                        :author-user="postData?.authorUser" @postSuccess="closeBottomSheet" card />
                </div>
            </div>
        </v-bottom-sheet>
        <ProjectsList class="mt-12" :projects="userInfo.projects" />
        
        <!-- Talent Data -->
       <!-- <div v-if="talant" class="mt-12"> -->
          <!--  <ProjectInvest -->
           <!--     :minContribution="talant.minContribution" -->
               <!-- :shareForSale="talant.shareForSale" -->
               <!-- :amountAttracted="talant.amountAttracted" -->
               <!-- :alreadyPurchased="talant.alreadyPurchased" -->
           <!-- /> -->
       <!-- </div> -->

        <v-container>
            <div class="my-[48px]">
                <p>{{ $t('Post.new') }}</p>
                <UiInput :required="false" @click="openBottomSheet" :label="$t('Post.day')" />
            </div>        
        </v-container>
       
        <div v-if="posts" v-for="post in posts" :key="post.id">
            <ProjectBlog :delete="() => deletePost(post.id)" :blog-data="post" user-type="me"
                :authorID="post.authorUser.id" :author="post.authorUser.firstName" feedCardType="newProjectStage" />
        </div>
        <!-- <ProjectInvest /> -->
    </v-container>
    <Footer />
</template>

<script setup lang="ts">
import ProjectInvest from "../../components/projects/ProjectInvesting.vue"
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import UiPost from '~/components/ui-kit/UiPost.vue'
import UiButton from '~/components/ui-kit/UiButton.vue'
import UiInput from '~/components/ui-kit/UiInput.vue'
import UiSkills from '~/components/ui-kit/UiSkills.vue'
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import ProjectsList from '~/components/profile/ProjectsList.vue'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import { getUserByID, getUserPosts } from '~/API/ways/user.ts'
import { isAuth } from '~/helpers/routerHandler'
import { delPost } from "../../API/ways/post"
import { onMounted, ref, computed } from 'vue';
import { postProject , getEvents } from "~/API/ways/post";
import { getTalentByID, getTalentSearch } from '../../API/ways/talent'
let posts = ref();
const postData = ref({
    descriptionHeader: '',
    description: '',
    authorProject: null,
    authorUser: localStorage.getItem('userId'),
});
const events = ref()
async function feedEvents() {
    try {
        const response = await getEvents()
        events.value = response.data
    } catch (error) {
        
    }
}
const isBottomSheetOpen = ref(false);
const closeBottomSheet = async () => {
    await postProject(postData.value, )
    isBottomSheetOpen.value = false;
    await getPosts()
};
const openBottomSheet = async () => {
    isBottomSheetOpen.value = true;
};
const getPosts = async () => {
    try {
        const data = await getUserPosts(Number(localStorage.getItem('userId')));
        posts.value = data.data.object;
    } catch (error) {
        console.error(error);
    }
};
const deletePost = async (postID: number) => {
    try {
        await delPost(postID)
        await getPosts()
    } catch (error) {
        console.error('Ошибка при удалении поста:', error)
    }
}
onMounted(getPosts);
// const modalState = ref(null);

isAuth();
let userInfo = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: {name: ''},
    country: {name: ''},
    pictureUrl: null,
    backgroundPictureUrl: null,
    fullDescription: '',
    openedForProposition: false,
    interests: [],
    projects: [],
    talant: null,
});
const talant = ref({
    minContribution: 0,
    shareForSale: 0,
    amountAttracted: 0,
    alreadyPurchased: 0
})
const fetchUserInfo = async () => {
    await getUserByID(Number(localStorage.getItem("userId"))).then((response) => {
        try {
            userInfo.value = response.data.object;
            talant.value = userInfo.value.talant || null
            console.log(userInfo.value)
        } catch (e) {
            console.error('text error:', e);
        }
    })
}
const updateUserSkills = async (newSkills: any) => {
    userInfo.value.interests = newSkills;
    await fetchUserInfo();
};
const talents = ref([]);
const talentDetails = ref([]);
const userTalentId = ref(null);

const getTalentSearchApi = async () => {
    try {
        const response = await getTalentSearch();
        talents.value = response.data?.object.content || [];
        const userId = Number(localStorage.getItem("userId"));
        const userTalents = talents.value.filter(talent => talent.owner?.id === userId);

        // Fetch detailed information for each talent
        const detailsPromises = userTalents.map(talent => getTalentByID(talent.id));
        const detailsResponses = await Promise.all(detailsPromises);

        talentDetails.value = detailsResponses.map(response => response.data?.object || {});
        console.log('Talent details:', talentDetails.value);
    } catch (error) {
        console.error('Error getting talents:', error);
    }
};

// const userTalents = computed(() => talentDetails.value || []);
const baseURL = 'https://itnt.store/';

const fullAvatarUrl = ref('');
const fullBannerUrl = ref('');

onMounted(async () => {
    try {
        const response = await getUserByID(Number(localStorage.getItem("userId")));
        if (response?.data?.object) {
            const userData = response.data.object;
            fullAvatarUrl.value = userData.pictureUrl ? `${baseURL}files/${userData.pictureUrl}` : '';
            fullBannerUrl.value = userData.backgroundPictureUrl ? `${baseURL}files/${userData.backgroundPictureUrl}` : '';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    await fetchUserInfo();
    await feedEvents();
    getTalentSearchApi();
});
</script>

<style scoped lang="scss">
.form-group {
    position: relative;
    max-width: 300px;
    margin-bottom: 40px;
}

label {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 16px;
    color: black;
    background-color: #FAFAFA;
    padding: 0 0px;
    transition: 0.2s ease;
    z-index: 1;
    pointer-events: none;
    /* Отключаем события для label, чтобы не мешать кликам по select */
}

select option:first-child {
    display: none;
}

select {
    appearance: none;
    background-color: #FAFAFA;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 15px 10px;
    font-size: 16px;
    width: 100%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
}

select:focus {
    border-color: #007bff;
    outline: none;
}

select:focus+label,
/* Когда select в фокусе, label поднимается */
select:not([value=""]):valid+label {
    /* Когда значение выбрано, label поднимается */
    top: -12px;
    left: 8px;
    font-size: 16px;
    color: #007bff;
    z-index: 2;
    /* Убираем z-index после перемещения, чтобы label не закрывал select */
}

/* Стрелка для select */
select {
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23000000' d='M12 15.5l7-7H5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px top 50%;
    background-size: 16px;
}
.projectInvesting {
    &__body {
        border-radius: 12px;
        background: #fff;
        padding: 30px 20px 40px 20px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }
}

.comment {
    border-radius: 2px 12px 12px 12px;
    // background-color: #9A9A9A;
    padding: 20px;
}
</style>
