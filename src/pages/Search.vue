<template>
    <Header search />

    <v-container style="padding: 0 20px">
        <!-- {{ ProjectSearch() }} -->
        <v-stepper non-linear>
            <v-stepper-header>
                <v-stepper-item :items="items" v-for="(item, index) in items" :key="index" :value="index + 1"
                    class="white-background" :class="{ 'white--text': true }" editable>
                    <template v-slot:icon>
                        <img :src="item.iconSrc" :alt="item.alt">
                    </template>
                    <template v-slot:item.1>
                        <img :src="item.iconSrc" :alt="item.alt">
                    </template>
                </v-stepper-item>
            </v-stepper-header>
            <v-stepper-items>
      <v-stepper-content step="2">
        <h3 class="text-h6">Shipping</h3>
        <br>
        <v-radio-group v-model="shipping" label="Delivery Method">
          <v-radio label="Standard Shipping" value="5"></v-radio>
          <v-radio label="Priority Shipping" value="10"></v-radio>
          <v-radio label="Express Shipping" value="15"></v-radio>
        </v-radio-group>
      </v-stepper-content>

      <v-stepper-content step="3">
        <h3 class="text-h6">Confirm</h3>
        <!-- Добавьте здесь контент для подтверждения -->
      </v-stepper-content>

      <!-- Добавьте дополнительные v-stepper-content для остальных шагов -->
    </v-stepper-items>
        </v-stepper>
        <UiSwitch @changeValue="searchPageSwitchState = $event" :items="['Проекты', 'Люди']" />
        <UiInput v-model="searchQuery" placeholder="Поиск..." />
        <!-- Детальный поиск -->
        <div :class="detailsValue === true ? 'details--opened' : 'details'" class="card">
            <div @click="detailsValue = !detailsValue" class="details__head">
                <p class="txt-body1">{{ $t('search.searchDetail') }}</p>
                <img v-show="detailsValue === false" src="@/assets/icons/settings-black.svg" />
                <img v-show="detailsValue === true" src="@/assets/icons/close-black.svg" />
            </div>

            <div class="details__body" v-show="detailsValue === true">
                <div class="details__body__inputs">
                    <UiInput label="Теги" />
                </div>

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
        </div>

        <!-- Карточки проектов -->
        <div v-if="searchPageSwitchState === 0">
            <div v-for="project in filteredProjects" :key="project.id">
                <SearchProjectCard :projectInfoSet="project" />
            </div>
        </div>

        <!-- Карточки пользователей -->
        <div v-if="searchPageSwitchState === 1">
            <div v-for="user in filteredUsers" :key="user.id">
                <SearchUserCard :user-info-set="user" />
            </div>
        </div>
    </v-container>

    <Footer />
</template>

<script setup lang="ts">
import a from '../assets/icons/projectStages/A.svg'
import b from '../assets/icons/projectStages/B.svg'
import c from '../assets/icons/projectStages/C.svg'
import d from '../assets/icons/projectStages/D.svg'

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import UiSwitch from '~/components/ui-kit/UiSwitch.vue'
import UiInput from '~/components/ui-kit/UiInput.vue'
import SearchUserCard from '~/components/search/SearchUserCard.vue'
import SearchProjectCard from '~/components/search/SearchProjectCard.vue'
import { ref, computed, onMounted } from 'vue';
import { getAllProjects } from '~/API/ways/project'
import { getUserSearch } from '~/API/ways/user'
import { useRoute } from 'vue-router';
import ava from '../assets/Coop.svg'
const route = useRoute();
onMounted(() => {
    searchQuery.value = route.query.skill as string || '';
});
const items = ref([
    { iconSrc: a, alt: 'Stage A' },
    { iconSrc: a, alt: 'Stage A' },
    { iconSrc: b, alt: 'Stage B' },
    { iconSrc: b, alt: 'Stage B' },
    { iconSrc: d, alt: 'Stage D' },
    { iconSrc: d, alt: 'Stage D' },
    { iconSrc: c, alt: 'Stage C' },
]);
const searchPageSwitchState = ref(0)
const detailsValue = ref(false)
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
const fetchUsers = async () => {
    try {
        const response = await getUserSearch();
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

const fetchProjects = async () => {
    try {
        const response = await getAllProjects();
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

onMounted(fetchProjects);
onMounted(fetchUsers);
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
</style>