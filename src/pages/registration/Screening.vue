<template>
  <Header showLogo />
  <div class="flex flex-row m-4 justify-between gap-2">
    <div v-if="pageStep === 1" class="hidden"></div>
    <div v-else v-for="step in totalSteps" :key="step" class="progress-bar"
      :class="{ 'cursor-not-allowed': step > maxReachedStep }" @click="setPageStep(step)"
      :style="getProgressBarStyle(step)">
      <div :style="{ width: pageStep >= step ? '100%' : '0%', transition: 'width 0.5s ease' }" class="progress-fill">
      </div>
    </div>
  </div>

  <v-col>
    <!-- Step 1 -->
    <div v-if="pageStep === 1" class="screening__first">
      <UiInput v-model="user.firstName" placeholder="Представьтесь" label="Как другим участникам вас называть?"
        prepend-icon="account-outline" />
      <UiButton :is-disabled="user.firstName?.length < 2" @click="nextStep" bgColor="blue">Продолжить</UiButton>
    </div>

    <!-- Step 2 -->
    <div v-if="pageStep === 2">
      <p class="text-center">{{ user.firstName }}, хотите выглядеть особенно?</p>
      <div class="back w-full upload-wrapper mx-auto">
        <!-- <v-file-input @change="handleFileAva" accept="image/*" class="input-file bg-black" /> -->
        <img @click="uploadAva" v-if="userInfo.pictureUrl == null || ''" src="@/assets/img/regSteps/addProfilePic.svg" class="rounded-circle cursor-pointer mx-auto" />
        <input type="file" ref="avaFleInput" style="display: none;" @change="handleFileAva">
        <img v-if="userInfo.pictureUrl !== null || ''" :src="fullAvatarUrl" class="rounded-circle img mx-auto" />
      </div>
      <UiButton @click="nextStep" class="mt-6" bgColor="blue">{{ user.pictureUrl ? 'Продолжить' : 'Выбрать аватар' }}
      </UiButton>
      <UiButton @click="nextStep" class="mt-4" bgColor="def">Пропустить</UiButton>
    </div>

    <!-- Step 3 -->
    <div v-if="pageStep === 3">
      <p class="text-center">Откуда вы?</p>
      <v-select v-model="user.country" :items="countryList" label="Страна" />
      <v-select v-model="user.city" :items="cityList" :disabled="!user.country" label="Выберите город" />
      <UiButton @click="nextStep" class="mt-6" bgColor="blue">Продолжить</UiButton>
      <UiButton @click="nextStep" class="mt-4" bgColor="def">Пропустить</UiButton>
    </div>

    <!-- Step 4 -->
    <div v-if="pageStep === 4">
      <UiPrompt class="mb-4">Если пользователи и владельцы проектов будут сразу понимать, какими навыками обладает собеседник -
        общаться станет удобнее.</UiPrompt>
      <UiSkills @update-skills="updateUserSkills" :skillList="userInfo.interests" />
      <UiButton @click="saveProfile" class="mt-6" bgColor="blue">Продолжить</UiButton>
      <UiButton @click="saveProfile" class="mt-6" bgColor="def">Пропустить</UiButton>
    </div>

    <!-- Loading and Checkmark -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader"></div>
    </div>
    <div v-if="showCheckmark" class="checkmark-overlay">
      <img src="/src/assets/LoadingIcon.svg" />
    </div>
  </v-col>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from '~/components/ui-kit/UiButton.vue';
import UiInput from '~/components/ui-kit/UiInput.vue';
import UiPrompt from '~/components/ui-kit/UiPrompt.vue';
import UiSkills from '~/components/ui-kit/UiSkills.vue';
import { getUserByID, postAddUserPicture, patchUser } from '~/API/ways/user';

// Variables and state
const router = useRouter();
const totalSteps = 4;
const pageStep = ref(1);
const maxReachedStep = ref(4);
const isLoading = ref(false);
const userInfo = ref({ interests: [] });
const showCheckmark = ref(false);
const user = ref({
    id: localStorage.getItem('userId'),
    city: '',
    country: '',
    firstName: '',
    lastName: '',
    nickName: '',
    fullDescription: '',
});const countryList = ref([]);
const cityList = ref([]);

// Fetch country list on mount
onMounted(async () => {
  const response = await getCountryList();
  countryList.value = response.data;
});

// Handlers
const setPageStep = (step: number) => {
  if (step <= maxReachedStep.value) pageStep.value = step;
};

const nextStep = () => pageStep.value++;

const getProgressBarStyle = (step: number) => ({
  width: '24%',
  height: '10px',
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  boxShadow: step <= maxReachedStep.value ? '0 1px 4px rgba(0, 0, 0, 0.2)' : '',
});

const avaFleInput = ref<HTMLInputElement | null>(null);
const uploadedAvaImageUrl = ref<string>('');
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
        const response = await postAddUserPicture(formData, true);
        await getUserByIDApi()
      } catch (error) {
        console.error('error:', error);
      }
    };
  }
}

const uploadAva = async () => {
  await getUserByIDApi()
  avaFleInput.value?.click();
}
const saveProfile = async () => {
  isLoading.value = true;
  try {
    await patchUser(user.value);
    isLoading.value = false;
    showCheckmark.value = true;
    setTimeout(() => {
      showCheckmark.value = false;
      router.push('/me');
    }, 1500);
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};

const updateUserSkills = async (newSkills: any) => {
  userInfo.value.interests = newSkills;
  await getUserByIDApi();
};

// Fetch user data by ID
const getUserByIDApi = async () => {
  const response = await getUserByID(Number(localStorage.getItem('userId')));
  userInfo.value = response.data.object;
};
onMounted(getUserByIDApi);

const baseURL ='https://itnt.store/';

const fullAvatarUrl = computed(() => {
    return userInfo.value.pictureUrl ? `${baseURL}files/${userInfo.value.pictureUrl}` : '';
});
</script>

<style lang="scss" scoped>
.img {
  max-width: 208px;
  min-width: 208px;
  max-height: 208px;
  min-height: 208px;
  object-fit: cover;
}

.progress-bar {
  height: 10px;
  background-color: white;
}

.progress-fill {
  height: 100%;
  background-color: #29b6f6;
}

.screening__first {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loader-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkmark-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>