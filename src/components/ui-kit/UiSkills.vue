<script lang="ts">
export default {
    name: 'UiSkills',
}
</script>
<template>
    <v-card class="ui-skills shadow-sm p-4">
        <div class="">
            <div class="ui-skills__head" v-if="!props.readOnly">
                <p class="txt-cap2">{{ $t('me.skills') }}</p>
                <div v-if="deleteMode === false" @click="openSheet" class="ui-skills__btn cursor-pointer">
                    <p class="txt-body1">{{ $t('me.add') }}</p>
                    <v-icon icon="mdi-plus" size="x-small" />
                </div>
                <div v-if="deleteMode === true" @click="cancelDelete" class="ui-skills__btn cursor-pointer">
                    <p class="txt-body1">{{ $t('me.cancel') }}</p>
                </div>
                <div v-if="props.skillList.length > 0 && deleteMode === false" @click="toggleDeleteTrue"
                    class="ui-skills__trash cursor-pointer">
                    <img src="../../assets/icons/trash.svg" alt="trash icon" />
                </div>
                <div v-if="props.skillList.length > 0 && deleteMode === true" @click="deleteSkills"
                    class="ui-skills__trash cursor-pointer">
                    <img src="../../assets/icons/trash.svg" alt="trash icon" />
                </div>
            </div>
            <div class="" v-else></div>
        </div>
        <div class="ui-skills__list">
            <div v-for="skill in props.skillList" :key="skill.id" class="ui-skills__skill"
                :class="{ 'ui-skills__skill--delete': deleteMode && selectedSkills.includes(skill.id) }"
                @click="deleteMode ? toggleSkillSelection(skill.id) : null">
                {{ skill.name }}
            </div>
        </div>
    </v-card>

    <transition name="bottom-sheet">
        <div v-if="showSheet" class="bottom-sheet min-h-[400px] bg-white text-left">
            <UiInput v-model="searchTerm" class="mx-4" label="Введите навык для поиска" />
            <div class="ui-skills__choser mt-2" v-for="(category, id) in filteredCategories" :key="id">
                <p class="text-[#29b6f6] text-lg mx-5 ml-[3%] ui-skills__choser__title">{{ category.name }}</p>
                <div v-for="(interest, id) in category.interests" :key="id" class="m-0 cursor-pointer">
                    <p @click="toggleSkill(interest.id, interest.name)" class="txt-body1 ui-skills__choser__skill"
                        :class="{ 'skill-chosen': isSkillSelected(interest.name) }">
                        {{ interest.name }}
                    </p>
                </div>
            </div>
            <v-btn @click="saveSelectedSkills" class="close-btn mr-2 text-white" icon="mdi-check" color="#00e676" />
        </div>
    </transition>
</template>

<script lang="ts" setup>

import { ref, onMounted, computed } from 'vue'
import UiInput from './UiInput.vue'
import { patchUser, deleteInterest } from '../../API/ways/user'
import { getInterestListGrouped } from '../../API/ways/dictionary'
const props = defineProps({
    readOnly: { type: Boolean, default: false },
    skillList: { type: Array, default: () => [] }
});

const emit = defineEmits(['update-skills']);
const showSheet = ref(false);
const categories = ref([]);
const searchTerm = ref('');
const selectedSkills = ref([]);
const deleteMode = ref(false)
const cancelDelete = () => {
    deleteMode.value = false
    selectedSkills.value = [];
}
const toggleDeleteTrue = () => {
    deleteMode.value = true
}
onMounted(async () => {
    try {
        const response = await getInterestListGrouped();
        categories.value = response.data.object;
    } catch (error) {
        console.error("Error fetching interests:", error);
    }
});

const openSheet = () => {
    selectedSkills.value = [...props.skillList]; 
    showSheet.value = true;
};

const filteredCategories = computed(() => {
    if (!searchTerm.value) return categories.value;
    return categories.value.map(category => ({
        ...category,
        interests: category.interests.filter(interest =>
            interest.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
    })).filter(category => category.interests.length > 0);
});

const isSkillSelected = (skillName: string) => {
    return selectedSkills.value.some(skill => skill.name === skillName);
};
const toggleSkillSelection = (id) => {
    const index = selectedSkills.value.indexOf(id);
    if (index === -1) {
        selectedSkills.value.push(id);
    } else {
        selectedSkills.value.splice(index, 1);
    }
};

const toggleSkill = (skillId: number, skillName: string) => {
    const index = selectedSkills.value.findIndex(skill => skill.name === skillName);
    if (index !== -1) {
        selectedSkills.value.splice(index, 1);
    } else {
        selectedSkills.value.push({ id: skillId, name: skillName });
    }
};
const deleteInt = async (skillIds: number[]) => {
    try {
        for (const skillId of skillIds) {
            await deleteInterest(skillId);
        }
    } catch (error) {
        console.log('Ошибка при удалении навыков:', error);
    }
};

const deleteSkills = async () => {
    const userId = localStorage.getItem("userId");
        const skillsToDelete = props.skillList.filter(skill => selectedSkills.value.includes(skill.id));
    const data = {
        id: userId,
        interests: props.skillList.filter(skill => !selectedSkills.value.includes(skill.id)), // Убираем выбранные
    };
    try {
        await deleteInt(skillsToDelete.map(skill => skill.id)); // Удаляем выбранные навыки
        await patchUser(data);
        emit('update-skills', data.interests); // Обновляем локальный список навыков
        cancelDelete();
    } catch (error) {
        console.error('Ошибка при удалении навыков:', error);
    }
};

const saveSelectedSkills = async () => {
    const data = {
        id: localStorage.getItem("userId"),
        interests: selectedSkills.value
    };

    try {
        await patchUser(data);
        emit('update-skills', selectedSkills.value);
        showSheet.value = false;
    } catch (error) {
        console.error('Ошибка при обновлении навыков:', error);
    }
};
</script>

<style lang="scss">
.ui-skills__skill--delete {
    background-color: #ff3d00;
    border: 2px solid #ff3d00;
}

.bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    padding: 16px 0;
    max-height: 80vh;
    /* Example: Limit height to 80% of viewport height */
    overflow-y: auto;
}


.bottom-sheet-content {
    padding: 16px;
    position: relative;
}

.close-btn {
    position: fixed;
    bottom: 16px;
    right: 16px;
    border-radius: 12px;
    color: white;
    box-shadow: 0px 9px 9px -9px #00b65d;
    padding: 10px;
}

.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
    transition: transform 0.3s ease-in-out;
}

.bottom-sheet-enter,
.bottom-sheet-leave-to {
    transform: translateY(100%);
}

.action-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
}

.snacbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 19px;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: -100%;
    height: 112%;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.popup {
    padding-top: 20px;
    padding-bottom: 32px;
    background: white;
    border-radius: 24px;
    max-height: 80%;
    min-height: 40%;
    width: 100%;
    max-width: 768px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
}


.selected {
    background-color: #FFEBEE;
    border: 1px solid red;
    color: white;
}

.skill-chosen {
    background-color: #E1F5FE;
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

    &__trash {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        width: 31px;
        height: 31px;
        background: #ff3d00;
        box-shadow: 0px 3px 6px -3px #ff3d00;
    }

    &__list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    &__search {
        padding: 40px 30px 30px 30px;
        border-radius: 20px !important;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05) !important;

        p {
            margin-bottom: 24px;
            text-align: center;
        }

        &__actions {
            display: flex;
            justify-content: space-between;
        }
    }

    &__skill {
        padding: 6px 16px;
        color: $def-black;
        max-width: fit-content;
        border: 1.5px solid $primary;
        border-radius: 8px;

        &--delete {
            background-color: #FFEBEE;
            border: 1px solid red;
            color: black;
        }
    }

    &__choser {
        display: flex;
        flex-direction: column;
        margin-bottom: 0px;
        position: relative;

        &__close {
            position: absolute;
            bottom: 0;
            right: 10%;
            width: 40px;
            height: 40px;
            // padding: 10px;
            cursor: pointer;

            @media (max-width: 768px) {
                right: 40px;
                width: auto;
                height: auto;
            }
        }

        &__skill {
            padding: 9px 0px 9px 47px;
            color: $def-black;
        }
    }

    &__projects {
        display: flex;
        gap: 8px;

        &__tag {
            padding-top: 6px;
            width: 100%;
            border: 1px solid #e0e0e0;

            border-radius: 8px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 7px;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
        }
    }


}
</style>