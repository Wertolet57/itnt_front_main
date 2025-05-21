<template>
    <Header search />
    <v-container style="padding: 0 20px">
        <UiSwitch v-model="searchPageSwitchState" :items="[`${$t('search.proj')} `, `${$t('search.human')} `]" />
        <UiInput @keyup.enter="" v-model="searchQuery" :placeholder="$t('search.search')"
            append-inner-icon="mdi-magnify" />
        <div :class="detailsValue === true ? 'details--opened' : 'details'" class="card">
            <div @click="detailsValue = !detailsValue" class="details__head">
                <p class="txt-body1">{{ $t('search.searchDetail') }}</p>
                <img v-show="detailsValue === false" src="@/assets/icons/settings-black.svg" />
                <img v-show="detailsValue === true" src="@/assets/icons/close-black.svg" />
            </div>

            <div v-if="searchPageSwitchState === 0" class="details__body mt-4" v-show="detailsValue === true">
                <v-select clearable :label="$t('tags')" v-model="projectTags" :items="tagList" item-title="name" item-value="id"
                    variant="outlined" class="blue-select" multiple color="active" item-color="active"
                    chips />
                    <v-select clearable color="active" item-color="active" variant="outlined" class="my-[8px]" :label="$t('screening.country')" v-model="selectedCountry"
                    :items="countries" item-title="name" item-value="id" hide-details />
                <div class="details__body__switchs">
                    <div class="details__body__switchs__item">
                        <p class="txt-body1">{{ $t('search.vacancee') }}</p>
                        <p class="txt-body1 color-blue">{{ $t('search.NoNeed') }}</p>
                    </div>

                    <div class="details__body__switchs__item">
                        <p class="txt-body1">{{ $t('search.Insearch') }}</p>
                        <p class="txt-body1 color-blue">{{ $t('search.Yes') }}</p>
                    </div>
                </div>
            </div>
            <div v-if="searchPageSwitchState === 1" class="details__body" v-show="detailsValue === true">
                <div class="details__body__inputs">
                    <!-- v-select для userTags (теги для пользователей) -->
                    <v-select clearable color="active" item-color="active"  :label="$t('tags')" v-model="userTags" :items="userTagList" item-title="name"
                        item-value="id" variant="outlined" multiple chips />
                    <!-- страна только для пользователей -->
                    <v-select clearable color="active" item-color="active" variant="outlined" class="mt-[8px]" :label="$t('screening.country')" v-model="selectedCountry"
                        :items="countries" item-title="name" item-value="id" hide-details />
                    <!-- <UiInput class="mt-[28px]" :label="$t('screening.city2')" />)" /> -->
                </div>

                <div class="details__body__switchs">
                    <div class="details__body__switchs__item">
                        <p class="txt-body1">{{ $t('search.opened') }}</p>
                        <p class="txt-body1 color-blue">{{ $t('search.open') }}</p>
                    </div>
                </div>

            </div>
        </div>

        <!-- Карточки проектов -->
        <div v-if="searchPageSwitchState === 0">
            <div v-for="project in filteredProjects" :key="project.id">
                <SearchProjectCard :projectInfoSet="project" />
            </div>
        </div>

        <!-- Карточки пользователей -->
        <div class="mt-2" v-if="searchPageSwitchState === 1">
            <div v-for="user in filteredUsers" :key="user.id">
                <SearchUserCard :user-info-set="user" />
            </div>
        </div>
    </v-container>

    <Footer />
</template>

<script setup lang="ts">

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import UiSwitch from '~/components/ui-kit/UiSwitch.vue'
import UiInput from '~/components/ui-kit/UiInput.vue'
import SearchUserCard from '~/components/search/SearchUserCard.vue'
import SearchProjectCard from '~/components/search/SearchProjectCard.vue'
import { ref, computed, onMounted, watch } from 'vue';
import { getAllProjects } from '~/API/ways/project'
import { getUserSearch } from '~/API/ways/user'
import { useRoute } from 'vue-router';
import { addComment } from '~/API/ways/post'
import ava from '../assets/Coop.svg'
import { getCountryList, getInterestListGrouped } from '~/API/ways/dictionary';
import debounce from 'lodash/debounce';
import { searcgProjects } from '~/API/ways/project';
const route = useRoute();
import projectSkill from '~/helpers/projectSkill';

const tagList = Object.entries(projectSkill.manageSkills ?? projectSkill).map(([key, value]: any) => ({
    id: key,
    name: value.value || value.name || value
}));

// Для пользователей: список интересов
const userTagList = ref<{ id: number, name: string }[]>([]);

const fetchUserTags = async () => {
    try {
        const response = await getInterestListGrouped();
        // Преобразуем в плоский массив для v-select
        userTagList.value = response.data.object
            .flatMap((cat: any) => cat.interests.map((interest: any) => ({
                id: interest.id,
                name: interest.name
            })));
    } catch (e) {
        console.error('Error fetching user tags:', e);
        userTagList.value = [];
    }
};

const savedSwitchState = localStorage.getItem('searchPageSwitchState');
const searchPageSwitchState = ref(savedSwitchState !== null ? Number(savedSwitchState) : 0);

watch(searchPageSwitchState, (newVal) => {
    localStorage.setItem('searchPageSwitchState', String(newVal));
});

const detailsValue = ref(false)
onMounted(() => {
    searchQuery.value = route.query.skill as string || '';
});

interface User {
    id: number;
    roles: Array<any>;
    login: string;
    confirmed: boolean;
    errorConfirm: boolean;
}
interface Project {
    id: number;
    name: string;
    descriptionHeader: string;
    avatarUrl: string;
    slogan: string;
}
const users = ref<User[]>([]);
const projects = ref<Project[]>([]);
const searchQuery = ref('');
const countries = ref([]);
// projectTags и userTags теперь массив id
const projectTags = ref<number[]>([]);
const userTags = ref<number[]>([]);
const selectedCountry = ref(null);
const filteredUsers = computed(() => {
    if (!Array.isArray(users.value)) {
        console.error('Users is not an array:', users.value);
        return [];
    }
    return users.value.filter(user => {
        const searchLower = searchQuery.value.toLowerCase();
        return Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchLower)
        );
    });
});
const filteredProjects = computed(() => {
    if (!Array.isArray(projects.value)) {
        console.error('Projects is not an array:', projects.value);
        return [];
    }
    return projects.value.filter(project => {
        const searchLower = searchQuery.value.toLowerCase();
        return Object.values(project).some(value =>
            String(value).toLowerCase().includes(searchLower)
        );
    });
});
const openforProp = ref()
const fetchUsers = async () => {
    try {
        const params: any = {};
        if (selectedCountry.value) {
            params.countryId = selectedCountry.value.id;
        }
        if (searchQuery.value) {
            params.searchString = searchQuery.value;
        }
        if (userTags.value && userTags.value.length) {
            // Для передачи нескольких tags в URLSearchParams используем массив
            userTags.value.forEach((id: number) => {
                if (!params.tags) params.tags = [];
                params.tags.push(id);
            });
        }
        const queryParams = new URLSearchParams();
        if (params.countryId) queryParams.append('countryId', params.countryId);
        if (params.searchString) queryParams.append('searchString', params.searchString);
        if (params.tags) params.tags.forEach((id: number) => queryParams.append('tags', id));
        // ...добавьте другие параметры если нужно...

        const response = await getUserSearch(queryParams);
        if (response.data && Array.isArray(response.data.object)) {
            users.value = response.data.object;
        } else {
            console.error('Fetched data is not in expected format:', response.data);
            users.value = [];
        }
        console.log('Fetched users:', users.value);
    } catch (error) {
        console.error('Error fetching users:', error);
        users.value = [];
    }
};

const debouncedFetchUsers = debounce(fetchUsers, 400);

const fetchProjects = async () => {
    try {
        const params: any = {};
        if (searchQuery.value) {
            params.searchString = searchQuery.value;
        }
        if (projectTags.value && projectTags.value.length) {
            params.tagIds = projectTags.value;
        }
        const response = await searcgProjects(params);
        if (response.data && response.data.object && Array.isArray(response.data.object.content)) {
            projects.value = response.data.object.content;
        } else {
            console.error('Fetched data is not in expected format:', response.data);
            projects.value = [];
        }
        console.log('Fetched projects:', projects.value);
    } catch (error) {
        console.error('Error fetching projects:', error);
        projects.value = [];
    }
};

const debouncedFetchProjects = debounce(fetchProjects, 400);

const fetchCountries = async () => {
    try {
        const response = await getCountryList();
        countries.value = response.data.object;
    } catch (e) {
        console.error('Error fetching countries:', e);
        countries.value = [];
    }
};

watch([searchQuery, selectedCountry, projectTags], () => {
    if (searchPageSwitchState.value === 0) {
        debouncedFetchProjects();
    }
});
watch([searchQuery, selectedCountry, userTags], () => {
    if (searchPageSwitchState.value === 1) {
        debouncedFetchUsers();
    }
});
watch(searchPageSwitchState, (val) => {
    if (val === 0) {
        fetchProjects();
    } else {
        fetchUsers();
    }
    localStorage.setItem('searchPageSwitchState', String(val));
});

onMounted(fetchProjects);
onMounted(fetchUsers);
onMounted(fetchCountries);
onMounted(fetchUserTags); // загружаем теги пользователей
</script>

<style lang="scss" scoped>
::v-deep .v-stepper-item__avatar.v-avatar {
    background: white !important;
    color: black !important;
}

/* или для Vue 3 */
:deep(.v-stepper-item__avatar.v-avatar) {
    background: white !important;
    color: black !important;
}

.details {
    margin-top: 8px;
    margin-bottom: 24px;
    padding: 11px 13px;

    &--opened {
        padding: 12px 13px 18px 13px;
    }

    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
    }

    &__body {
        &__inputs {
            margin: 28px 0;
        }

        &__switchs {
            display: flex;
            flex-direction: column;
            gap: 20px;

            &__item {
                display: flex;
                gap: 15px;
                padding-left: 14px;
                align-items: center;
            }
        }
    }
}

:deep(.v-select .v-chip) {
    background: #e1f5fe;
    color: #1976d2;
    border-radius: 12px;
    font-size: 1rem;
}

.blue-select>>>.v-input--selection-controls__input .mdi-checkbox-marked {
    color: blue !important;
}

.blue-select>>>.v-input--selection-controls__input .mdi-checkbox-blank-outline {
    color: blue !important;
}

.blue-select>>>.v-simple-checkbox {
    color: blue !important;
}

.blue-select>>>.v-select__selections {
    border-color: blue !important;
}

.blue-select>>>.v-input__slot {
    border-color: blue !important;
}

.blue-select>>>.v-input__slot:hover {
    border-color: blue !important;
}

.blue-select>>>.v-input--is-focused .v-input__slot {
    border-color: blue !important;
    box-shadow: 0 0 0 1px blue !important;
}

.blue-select>>>.v-input--is-focused .v-label {
    color: blue !important;
}

/* Для элементов списка при наведении */
.blue-select>>>.v-list-item--link:hover {
    background-color: rgba(0, 0, 255, 0.1) !important;
}

/* Для чекбоксов в выпадающем списке */
.blue-select>>>.v-list-item__action .v-input--selection-controls__input .v-icon {
    color: blue !important;
}
</style>