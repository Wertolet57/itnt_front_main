<template>
    <Header :messenger="true" showUserMinify showID />
    <ProfileHeader :me="true" v-model:bg-pic="fullBannerUrl" v-model:ava-pic="fullAvatarUrl" />
    <v-container>
        <div class="userEdit my-4">
            <UiInput v-model="user.firstName" class="mb-4" :label="$t('user-edit.name')" :required="true" ref="firstNameRef" />
            <UiInput v-model="user.lastName" class="mb-4" :label="$t('user-edit.second-name')" :required="true" ref="lastNameRef" />
            <div class="custom-select">
                <select placeholder="123" v-model="user.country" @change="onCountryChange" ref="countryRef">
                    <option disabled value="">Выберите страну</option>
                    <option v-for="country in countries" :key="country.id" :value="country">
                        {{ country.name }}
                    </option>
                </select>
            </div>
            <div class="custom-select mb-6">
                <select class="mt-4" v-model="user.city" ref="cityRef">
                    <option disabled value="">Выберите город</option>
                    <option v-for="city in filteredCities" :key="city.id" :value="city">
                        {{ city.name }}
                    </option>
                </select>
            </div>

            <div class="props mb-12">
                <div class="props__inner" :class="{ 'props__inner--selected': user.openedForProposition === false }">
                    <label>
                        <input type="radio" v-model="user.openedForProposition" :value="false" />
                        <v-icon icon="mdi-check" v-if="user.openedForProposition === false" class="checkmark" />
                        <p>{{$t('user.not-interested')}}</p>
                    </label>
                </div>
                <div class="props__inner" :class="{ 'props__inner--selected': user.openedForProposition === true }">
                    <label>
                        <input type="radio" v-model="user.openedForProposition" :value="true" />
                        <v-icon icon="mdi-check" v-if="user.openedForProposition === true" class="checkmark" />
                        <p>{{$t('user.interested')}}</p>
                    </label>
                </div>
            </div>
            <div class="about">
                <UiTextArea v-model="user.fullDescription" :label="$t('user-edit.about')"
                    :rules="[(v) => v.length <= 300 || 'Max 300 characters']" ref="fullDescriptionRef" />
            </div>
            <div class="userEdit__components">
                <UiSkills @update-skills="updateUserSkills" :skillList="userInfo.interests" />
                <ProjectsList showAdder class="mt-12 mb-8" :projects="user.projects" />
            </div>
            <UiAgree @click="changeUser" />
        </div>
        <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" color="error">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue';
import ProfileHeader from '~/components/profile/ProfileHeader.vue';
import ProjectsList from '~/components/profile/ProjectsList.vue';
import UiSkills from '~/components/ui-kit/UiSkills.vue';
import UiAgree from '~/components/ui-kit/UiAgree.vue';
import UiTextArea from '~/components/ui-kit/UiTextArea.vue';
import UiInput from '~/components/ui-kit/UiInput.vue';
import { ref, onMounted, computed } from 'vue';
import { patchUser, getUserByID } from '~/API/ways/user';
import { getPostByUser } from '~/API/ways/post';
import { useRouter } from 'vue-router';
import { getCountryList, getCityList } from '../../API/ways/dictionary';

const router = useRouter();

interface User {
    id: string | null;
    city: string | City;
    country: string | Country;
    firstName: string;
    lastName: string;
    nickName: string;
    fullDescription: string;
    pictureUrl: string;
    projects: any[];
    backgroundPictureUrl: string;
    openedForProposition: boolean;
}

const user = ref<User>({
    id: localStorage.getItem('userId'),
    city: '',
    country: '',
    firstName: '',
    lastName: '',
    nickName: '',
    fullDescription: '',
    pictureUrl: '',
    projects: [],
    backgroundPictureUrl: '',
    openedForProposition: false
});

const posts = ref();
const cities = ref<City[]>([]);
const countries = ref<Country[]>([]);
const selectedCountryId = ref<number | null>(null);

const fullAvatarUrl = ref('');
const fullBannerUrl = ref('');

interface UserInfo {
    interests: any[];
    [key: string]: any;
}

let userInfo = ref<UserInfo>({ interests: [] });

const fetchUserInfo = async () => {
    await getUserByID(Number(localStorage.getItem("userId"))).then((response) => {
        try {
            userInfo.value = response.data.object;
            console.log(userInfo.value)
        } catch (e) {
            console.error('text error:', e);
        }
    })
};

const updateUserSkills = async (newSkills: any) => {
    userInfo.value.interests = newSkills;
    await fetchUserInfo();
};

// Функция для загрузки городов по стране
const fetchCities = async (countryId: number) => {
    try {
        const response = await getCityList(countryId, 0);
        cities.value = response.data.object;
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
};

interface Country {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    country: Country;
}

onMounted(async () => {
    try {
        const countryResp = await getCountryList();
        countries.value = countryResp.data.object;
        const response = await getUserByID(Number(localStorage.getItem('userId')));
        user.value = {
            ...user.value,
            ...response.data.object
        };

        if (user.value.country && typeof user.value.country === 'object') {
            selectedCountryId.value = (user.value.country as Country).id;
            await fetchCities((user.value.country as Country).id);
        }
        if (!user.value.country) {
            user.value.country = '';
        }
        if (!user.value.city) {
            user.value.city = '';
        }

        // Update image URLs
        fullAvatarUrl.value = user.value.pictureUrl ? `${baseURL}files/${user.value.pictureUrl}` : '';
        fullBannerUrl.value = user.value.backgroundPictureUrl ? `${baseURL}files/${user.value.backgroundPictureUrl}` : '';

    } catch (e) {
        console.error('Error fetching user data or countries:', e);
    }
});

const filteredCities = computed(() => {
    return cities.value.filter(city => city.country && city.country.id === selectedCountryId.value);
});

const onCountryChange = async () => {
    if (user.value.country && typeof user.value.country === 'object') {
        selectedCountryId.value = (user.value.country as Country).id;
        await fetchCities((user.value.country as Country).id);
    }
};

const snackbar = ref({
    show: false,
    message: '',
    timeout: 3000
});

const showSnackbar = (message: string) => {
    snackbar.value.message = message;
    snackbar.value.show = true;
};

const changeUser = async () => {
    if (!user.value.firstName || !user.value.lastName || !user.value.country || !user.value.city) {
        showSnackbar('Заполните обязательные поля');
        return;
    }

    try {
        await patchUser(user.value);
        router.push('/me');
    } catch (e) {
        console.error('Error updating user:', e);
    }
};

const baseURL = 'https://itnt.store/';
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
        border: 1.5px solid #29b6f6;
        border-radius: 8px;
        gap: 9px;

        &__title {
            color: #29b6f6;
        }
    }
}

.userEdit {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;

    &__components {
        display: flex;
        flex-direction: column;
        gap: 48px;
        margin-top: 48px;
    }
}

.about {
    position: relative;
    height: auto;
}

.about-before {
    position: absolute;
    bottom: -37px;
    right: 10px;
}

.custom-select select {
  appearance: none;
  width: 100%;
  font-size: 1.15rem;
  padding: 0.8em 0px 0.8em 1em;
  background-color: #fafafa;
  border: 1px solid #caced1;
  border-radius: 8px;
  color: #000; 
  cursor: pointer;
}
.custom-select option:disabled {
  color: #9e9e9e !important;
}
.props {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
    gap: 20px;

    &__inner {
        width: 50%;
        border-radius: 12px;
        background: #fff;
        padding: 20px 7px;
        border: 1px solid #dcdcdc;
        transition: border-color 0.3s, box-shadow 0.3s;
        cursor: pointer;

        label {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    }

    input {
        display: none;
    }

    .props__inner--selected {
        border-color: #29B6F6;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }

    .checkmark {
        font-size: 18px;
        color: #29B6F6;
        margin-right: 5px;
    }
}

.select-wrapper {
    position: relative;
    width: 300px;
}

select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    font-size: 16px;
}

.select-wrapper::after {
    content: "\25BC";
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
}

select:focus {
    outline: none;
    border-color: #0099ff;
}

.ui-skills {
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

    &__head {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 17.5px;
        gap: 25px;
    }

    &__btn {
        display: flex;
        align-items: center;
        background: $primary;
        color: white;
        max-width: 133px;
        width: 100%;
        justify-content: center;
        padding: 5px 10px 5px 12px;
        gap: 4px;
        border-radius: 100px;
    }
}

details {
    position: relative;
}

details[open] {
    z-index: 1;
}

summary {
    padding: 1rem;
    cursor: pointer;
    border-radius: 5px;
    background-color: #ddd;
    list-style: none;
}

summary::-webkit-details-marker {
    display: none;
}

details[open] summary:before {
    content: '';
    display: block;
    width: 100vw;
    height: 100vh;
    background: transparent;
    position: fixed;
    top: 0;
    left: 0;
}

summary:after {
    content: '';
    display: inline-block;
    float: right;
    width: .5rem;
    height: .5rem;
    border-bottom: 1px solid currentColor;
    border-left: 1px solid currentColor;
    border-bottom-left-radius: 2px;
    transform: rotate(45deg) translate(50%, 0%);
    transform-origin: center center;
    transition: transform ease-in-out 100ms
}

summary:focus {
    outline: none;
}

details[open] summary:after {
    transform: rotate(-45deg) translate(0%, 0%);
}

ul {
    width: 100%;
    background: #ddd;
    position: absolute;
    top: calc(100% + .5rem);
    left: 0;
    padding: 1rem;
    margin: 0;
    box-sizing: border-box;
    border-radius: 5px;
    max-height: 200px;
    overflow-y: auto;
}

li {
    margin: 0;
    padding: 1rem 0;
    border-bottom: 1px solid #ccc;
}

li:first-child {
    padding-top: 0;
}

li:last-child {
    padding-bottom: 0;
    border-bottom: none;
}

/* FAKE SELECT */

summary.radios {
    counter-reset: radios;
}

summary.radios:before {
    content: var(--selection);
}

input[type=radio] {
    counter-increment: radios;
    appearance: none;
    display: none;
}

input[type=radio]:checked {
    display: inline;
    --display: block;
}

input[type=radio]:after {
    content: attr(title);
    display: inline;
    font-size: 1rem;
}

ul.list {
    counter-reset: labels;
}

label {
    width: 100%;
    display: flex;
    cursor: pointer;
    justify-content: space-between;
}

label span {
    --display: none;
    display: var(--display);
    width: 1rem;
    height: 1rem;
    border: 1px solid #727272;
    border-radius: 3px;
}
</style>