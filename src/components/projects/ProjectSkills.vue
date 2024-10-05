<template>
    <div class="" v-if="props.readOnly === true">
        <div v-if="props.tags && props.tags.length > 0" class="projectCard__tags" :class="{
        'justify-center': props.tags.length === 1,
        'justify-between mx-[8%] gap-2': props.tags.length === 2,
        'justify-between': props.tags.length === 3
    }">
            <div v-for="(tag, index) in props.tags.slice(0, 3)" :key="index" class="projectCard__tags--tag txt-body2">
                {{ tag }}
            </div>
        </div>
    </div>
    <div class="" v-else>
        <div v-if="props.tags !== null" class="">
            <div @click="openBottomSheet" class="selected-skills" :class="`skills-${$props.tags?.length}`">
                <div class="skill-pill" v-for="tag in props.tags">
                    {{ tag }}
                </div>
                <div v-if="selectedSkills.length < 3" @click="openBottomSheet" class="select-skill-btn">
                    <v-icon :size="20" icon="mdi-plus"></v-icon>
                </div>
            </div>
        </div>
        <!-- <div v-if="selectedSkills.length">
            <div @click="openBottomSheet" class="selected-skills" :class="`skills-${selectedSkills.length}`">
                <div v-for="skill in selectedSkills" :key="skill" class="skill-pill">
                    {{ skill }} {{ props.tags }}

                </div>
                <div v-if="selectedSkills.length < 3" @click="openBottomSheet" class="select-skill-btn">
                    <v-icon :size="20" icon="mdi-plus"></v-icon>
                </div>
            </div>
        </div> -->
        <div v-else @click="openBottomSheet" class="empty">
            <v-icon :size="20" icon="mdi-plus"></v-icon>
        </div>
        <transition name="bottom-sheet">
            <div v-if="isBottomSheetOpen == true" class="bottom-sheet min-h-[400px] bg-white text-left">
                <div class="txt-body1 mb-2 mx-4">Выбрано : {{ selectedSkills.length }} </div>
                <UiInput class="mx-4 mb-2" label="Введите навык для поиска" />
                <div class="px-4  skill-item" v-for="skill in projectSkills" :key="skill"
                    :class="{ 'selected': selectedSkills.includes(skill), 'disabled': selectedSkills.length >= 3 && !selectedSkills.includes(skill) }"
                    @click="toggleSkill(skill)">
                    {{ skill }}
                </div>
                <v-btn @click="addSkills" class="close-btn mr-2 text-white" icon="mdi-check" color="#00e676" />

            </div>

        </transition>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import UiAgree from '../ui-kit/UiAgree.vue'
import UiInput from '../ui-kit/UiInput.vue'

import projectSkills from "../../helpers/skills.json";
import { patchProject, getProjectByID } from '~/API/ways/project';
import { useRoute } from 'vue-router'
import { onMounted } from 'vue';
const route = useRoute()
const isBottomSheetOpen = ref(false);
const selectedSkills = ref<string[]>([]);
const props = defineProps({
    readOnly: {
        type: Boolean,
        default: true
    },
    tags: {
        type: String,
    }
})
const openBottomSheet = () => {
    isBottomSheetOpen.value = true;
};
const closeBottomSheet = () => {
    isBottomSheetOpen.value = false;
};
const reverseSkillsMap = Object.fromEntries(
    Object.entries(projectSkills).map(([key, value]) => [value, key])
);
const toggleSkill = (skill: string) => {
    if (selectedSkills.value.includes(skill)) {
        selectedSkills.value = selectedSkills.value.filter(s => s !== skill);
    } else if (selectedSkills.value.length < 3) {
        selectedSkills.value.push(skill);
    }
};
const getProject = async () => {
    try {
        await getProjectByID(route.params.ID)
    } catch (error) {

    }
}
const addSkills = async () => {
    const selectedSkillKeys = selectedSkills.value.map(skill => reverseSkillsMap[skill]);

    //Как строка
    // const activityFields = selectedSkillKeys.join(',');
    // const data = {
    //     id: route.params.ID,
    //     activityFields: activityFields,
    // }

    //Как массив
    const data = {
        id: route.params.ID,
        activityFields: selectedSkillKeys,
    }
    try {
        isBottomSheetOpen.value = false
        await patchProject(data)
        await getProject()
    } catch (error) {

    }
}
onMounted(getProject)
</script>

<style lang="scss">
.bottom-sheet {
    position: relative;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    padding: 16px 0;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
}

.skill-item {
    cursor: pointer;
    padding: 6px;
    transition: background-color 0.2s;
}

.skill-item.selected {
    background-color: #E1F5FE;
    color: black;
    border: none;

}

.skill-item.disabled {
    pointer-events: none;
    opacity: 0.5;
}

.selected-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.selected-skills .skill-pill {
    background-color: white;
    color: black;
    border: 1px solid #E0E0E0;
    padding: 6px 6px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.skills-1 .skill-pill {
    flex: 1 0 48%;
}

.skills-1 .select-skill-btn {
    flex: 1 0 48%;
}

.skills-2 .skill-pill {
    flex: 1 0 30%;
}

.skills-2 .select-skill-btn {
    flex: 1 0 30%;
}

.skills-3 .skill-pill {
    flex: 1 0 40%;
}

.skills-3 .select-skill-btn {
    display: none;
}

.select-skill-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 6px 0;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
}

.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 0;
    background-color: #ffffff;
    border-radius: 16px;
    border: 1px solid #E0E0E0;

}

.projectCard {
    &__tags {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        margin-bottom: 48px;

        &--tag {
            border-radius: 8px;
            background: $prim-var2;
            padding: 6px 18px;
            color: #1769aa;
        }
    }

}
</style>