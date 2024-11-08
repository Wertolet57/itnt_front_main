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
        <v-card class="ui-skills shadow-sm p-4">
            <div class="ui-skills__head">
                <p class="txt-cap2">{{ $t('me.skills') }}</p>
                <div @click="openBottomSheet" class="ui-skills__btn cursor-pointer">
                    <p class="txt-body1">{{ $t('me.add') }}</p>
                    <v-icon icon="mdi-plus" size="x-small" />
                </div>
                <!-- <div v-if="deleteMode === true" @click="cancelDelete" class="ui-skills__btn cursor-pointer">
                    <p class="txt-body1">{{ $t('me.cancel') }}</p>
                </div>
                <div v-if="props.skillList.length > 0 && deleteMode === false" @click="toggleDeleteTrue"
                    class="ui-skills__trash cursor-pointer">
                    <img src="../../assets/icons/trash.svg" alt="trash icon" />
                </div>
                <div v-if="props.skillList.length > 0 && deleteMode === true" @click="deleteSkills"
                    class="ui-skills__trash cursor-pointer">
                    <img src="../../assets/icons/trash.svg" alt="trash icon" />
                </div> -->
            </div>
            <div class="ui-skills__list justify-between">
                <div v-for="skill in props.tags"  class="ui-skills__skill">
                    {{ skill }}
                </div>
            </div>
        </v-card>
    </div>
    <transition name="bottom-sheet">
        <div v-if="isBottomSheetOpen == true" class="bottom-sheet min-h-[400px] bg-white text-left">
            <div class="txt-body1 mb-2 mx-4">Выбрано : {{ selectedSkills.length }} </div>
            <UiInput class="mx-4 mb-2" label="Введите навык для поиска" />
            <div class="skill-category" v-for="(skillCategory, index) in projectSkill" :key="index">
                <div class="skill-item px-4" v-for="skill in skillCategory" :key="skill.key" :class="{
        'selected': selectedSkills.includes(skill.key),
        'disabled': selectedSkills.length >= 3 && !selectedSkills.includes(skill.key)
    }" @click="toggleSkill(skill.key)">
                    {{ skill.value }}
                </div>
            </div>
            <v-btn v-if="props.isNewProject" @click="emitAddSkills" class="close-btn mr-2 text-white" icon="mdi-check"
                color="#00e676" />
            <v-btn v-else @click="addSkills" class="close-btn mr-2 text-white" icon="mdi-check" color="#00e676" />
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import UiInput from '../ui-kit/UiInput.vue';
import projectSkill from '../../helpers/projectSkill';
import { patchProject, getProjectByID } from '~/API/ways/project';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const isBottomSheetOpen = ref(false);
const selectedSkills = ref<string[]>([]);
const props = defineProps({
    readOnly: {
        type: Boolean,
        default: true
    },
    new: {
        type: Boolean,
        default: true
    },
    tags: {
        type: String,
    },
    isNewProject: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['add-skills']);

const emitAddSkills = () => {
    emit('add-skills', selectedSkills.value);
    isBottomSheetOpen.value = false;
};

const openBottomSheet = () => {
    isBottomSheetOpen.value = true;
};

const closeBottomSheet = () => {
    isBottomSheetOpen.value = false;
};

const reverseSkillsMap = Object.fromEntries(
    Object.entries(projectSkill).map(([key, value]) => [value, key])
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
        await getProjectByID(route.params.ID);
    } catch (error) {
        console.error(error);
    }
};

const addSkills = async () => {
    const selectedSkillKeys = selectedSkills.value.map(skill => reverseSkillsMap[skill]);
    const data = {
        id: route.params.ID,
        activityFields: selectedSkillKeys,
    };
    try {
        isBottomSheetOpen.value = false;
        await patchProject(data);
        await getProject();
    } catch (error) {
        console.error(error);
    }
};

onMounted(getProject);
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