<template>
    <Header showUserMinify :routeName="$t('page.top')" />
    <v-container grid-list-xs>
        <UiPrompt v-show="projectsType === 0">{{ $t('prompts.topProjects.fresh') }} </UiPrompt>
        <UiPrompt v-show="projectsType === 1">
            {{ $t('prompts.topProjects.top') }}
        </UiPrompt>
        <UiSwitch @change-value="projectsType = $event"
            :items="[`${$t('prompts.topProjects.freshSwitch')} `, `${$t('prompts.topProjects.topSwitch')}`]" />

        <UiSwitch v-if="projectsType === 1" @change-value="topProjectsData = $event"
            :items="[`${$t('prompts.topProjects.week')} `, `${$t('prompts.topProjects.month')} `, `${$t('prompts.topProjects.year')} `]" />
        <div v-if="projectsType === 1" class="">
            <div v-if="topProjectsData === 0" class="">
                <div v-for="(project, id) in projectByWeek" :key="id" class="mt-6">
                    <RatingProjectCard :status="'down'" :projectInfoSet="project" />
                </div>
            </div>
            <div v-if="topProjectsData === 1" class="">
                <div v-for="(project, id) in projectByMonth" :key="id" class="mt-6">
                    <RatingProjectCard :status="'up'" :projectInfoSet="project" />
                </div>
            </div>
            <div v-if="topProjectsData === 2" class="">
                <div v-for="(project, id) in projectByYear" :key="id" class="mt-6">
                    <RatingProjectCard  :projectInfoSet="project" />
                </div>
            </div>
        </div>
        <div v-if="projectsType === 0" v-for="(project, id) in projectByFresh" :key="id" class="mt-6">
            <RatingProjectCard :fresh="true" :listID="++id" :projectInfoSet="project" />
        </div>
         <!-- <div v-for="(project, id) in projectsInfo" :key="id" class="mt-6">
            <RatingProjectCard :listID="++id" :projectInfoSet="project" />
        </div> -->

    </v-container>
    <Footer />
</template>

<script setup lang="ts">

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import UiPrompt from '~/components/ui-kit/UiPrompt.vue'
import UiSwitch from '~/components/ui-kit/UiSwitch.vue'
import RatingProjectCard from '~/components/projects/RatingProjectCard.vue'

import { ref, onMounted } from 'vue'
import { getAllProjects } from '~/API/ways/project'
import { getProjectWeek, getProjectMonth, getProjectYear, getProjectFresh } from '~/API/ways/post'
let projectsInfo = ref({})

onMounted(async () => {
    await getAllProjects().then((response) => {
        try {
            projectsInfo.value = response.data.object.content
        } catch (e) {
            console.error('text error:', e)
        }
    })
})

let projectByWeek = ref({})

onMounted(async () => {
    await getProjectWeek().then((response) => {
        try {
            projectByWeek.value = response.data.object
        } catch (e) {
            console.error('text error:', e)
        }
    })
})
let projectByMonth = ref({})

onMounted(async () => {
    await getProjectMonth().then((response) => {
        try {
            projectByMonth.value = response.data.object
        } catch (e) {
            console.error('text error:', e)
        }
    })
})
let projectByYear = ref({})

onMounted(async () => {
    await getProjectYear().then((response) => {
        try {
            projectByYear.value = response.data.object
        } catch (e) {
            console.error('text error:', e)
        }
    })
})
let projectByFresh = ref()

onMounted(async () => {
    await getProjectFresh().then((response) => {
        try {
            projectByFresh.value = response.data.object

            console.log(response)
        } catch (e) {
            console.error('text error:', e)
        }
    })
})
const projectsType = ref(0)
const topProjectsData = ref(0)
</script>
