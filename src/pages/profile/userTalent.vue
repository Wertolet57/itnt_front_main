<template>
    <Header showUserMinify />
    <v-container>
        <v-row class="grid grid-cols-2 gap-[0.4vw] my-[1vw]">
            <div class="col-span-1">
                <UiInput v-model="talentForm.minContribution" placeholder="Минимальный взнос" label="Минимальный взнос" type="number"/>
            </div>
            <div class="col-span-1">
                <UiInput v-model="talentForm.shareForSale" placeholder="Доля на продажу (%)" label="Доля на продажу (%)" type="number"/>
            </div>
            <div class="col-span-1">
                <UiInput v-model="talentForm.amountAttracted" placeholder="Привлеченная сумма" label="Привлеченная сумма" type="number"/>
            </div>
            <div class="col-span-1">
                <UiInput v-model="talentForm.alreadyPurchased" placeholder="Уже куплено" label="Уже куплено" type="number"/>
            </div>
        </v-row>
        <div class="flex w-full justify-end">

            <UiButton @click="openSearchTeammateModal" fit
            style="height: 36px; padding: 16px 16px" bgColor="smBlue" isSmall :plus="true"></UiButton>
        </div>    
        <div class="projectCard__editable__info">
            <p>Описание таланта</p>

            <UiInput v-model="talentForm.monetizationInfo" placeholder="Заголовок таланта" label="Заголовок таланта" />
            <div>
                <UiTextArea v-model="talentForm.description" label="Описание таланта"
                    :rules="[(v) => v.length <= 900 || 'Max 1024 characters']" counter ref="projectDescriptionRef" />
            </div>
        </div>
        <div class="projectCard__editable__info">
            <p>Информация о развитии таланта</p>
            <UiTextArea v-model="talentForm.talantDevelopmentInfo" label="Информация о развитии таланта"
                :rules="[(v) => v.length <= 900 || 'Max 900 characters']" counter />
        </div>
        <div class="">
            <UiButton @click="createTalent" class="mt-12" bgColor="blue">Create Talent</UiButton>
        </div>
    </v-container>
    <Footer />

    <v-bottom-sheet v-model="isBottomSheetOpen">
        <v-card min-height="500" class="bottom-sheet-card">
            <div class="pa-4">
                <p class="tex mb-2">Поиск человека для добавления в блок инвестиций</p>
                <UiInput prepend-icon="magnify" label="Введите данные для поиска" v-model="searchQuery" />
                <div class="mt-4">
                    <div v-for="user in users" :key="user?.id" 
                         class="d-flex align-center py-2 user-item"
                         @click="openAddDialog(user)">
                        <img class="mr-3 w-[37px] h-[37px] rounded-circle" 
                             width="37" height="37" 
                             :src="user?.pictureUrl ? `${baseAvaURL}/files/${user.pictureUrl}` : ava" />
                        <div>
                            <div class="d-flex align-center">
                                <p class="text-subtitle-1">{{ user?.firstName || `#${user?.id}` }}</p>
                            </div>
                            <p class="text-caption text-grey">{{ user?.login }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </v-bottom-sheet>

    <v-dialog v-model="showAddDialog" width="auto">
        <v-card class="ui-skills__search min-w-[300px] p-6 text-left">
            <p class="text mb-4">Добавить {{ selectedUser?.firstName || '#' + selectedUser?.id }} в Talent?</p>
            <div class="d-flex gap-2">
                <UiButton @click="confirmAddUser" bgColor="blue__no__shadow " isSmall>Добавить</UiButton>
                <UiButton @click="showAddDialog = false" bgColor="def" isSmall>Отмена</UiButton>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import UiTextArea from '~/components/ui-kit/UiTextArea.vue'
import UiButton from '~/components/ui-kit/UiButton.vue'
import { ref, onMounted , watch} from 'vue'
import debounce from 'lodash/debounce';
import { getUserSearch } from '~/API/ways/user.ts';
import { postTalent, getTalentByID, addUser, deleteUser, getTalentSearch } from '../../API/ways/talent'
import UiInput from "../../components/ui-kit/UiInput.vue";
import ava from '../../assets/demo/ava-small-header.svg'
import { AnyKindOfDictionary } from 'lodash'

const baseAvaURL = 'https://itnt.store/';
const talentID = ref<number>(4) // Example talent ID, replace with actual ID
const projectFiles = ref([])

const talentForm = ref({
    description: '',
    talantDevelopmentInfo: '',
    alreadyPurchased: 0,
    amountAttracted: 0,
    minContribution: 0,
    shareForSale: 0
})

const talent = ref()
const getTalent = async () => {
    try {
        const response = await getTalentByID(talentID.value)
        talent.value = response.data?.object
        projectFiles.value = response.data?.object?.projectFiles || []
        console.log('Talent:', response)
    } catch (error) {
        console.error('Error getting talent:', error)
    }
}
const getTalentSearchApi = async () => {
    try {
        const response = await getTalentSearch()
        console.log('Talent:', response)
    } catch (error) {
        console.error('Error getting talent:', error)
    }
}
const createTalent = async () => {
    if (!talentForm.value.description || !talentForm.value.talantDevelopmentInfo) {
        console.error('Description and Talent Development Info are required.');
        return;
    }
    try {
        const response = await postTalent(talentForm.value);
        console.log('Talent created successfully:', response);
    } catch (error) {
        console.error('Error creating talent:', error);
    }
}


const isBottomSheetOpen = ref(false)

const openSearchTeammateModal = () => {
    isBottomSheetOpen.value = true
}

const searchQuery = ref('');
const users = ref([]);

const searchUsers = debounce(async (query: string) => {
    if (!query.trim()) {
        users.value = [];
        return;
    }

    try {
        const response = await getUserSearch({
            searchString: query
        });
        users.value = response.data.object;
    } catch (error) {
        console.error('Error searching users:', error);
        users.value = [];
    }
}, 300);

const showAddDialog = ref(false)
const selectedUser = ref(null)

const openAddDialog = (user:AnyKindOfDictionary) => {
    selectedUser.value = user
    showAddDialog.value = true
}

const confirmAddUser = async () => {
    if (selectedUser.value?.id) {
        try {
            await addUser(talentID.value, selectedUser.value.id)
            showAddDialog.value = false
            isBottomSheetOpen.value = false
            await getTalent()
        } catch (error) {
            console.error('Error adding user:', error)
        }
    }
}

onMounted(() => {
    getTalent()
    getTalentSearchApi()
})
watch(searchQuery, (newQuery) => {
    searchUsers(newQuery);
});
</script>

<style scoped lang="scss">

.avatar-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.avatar-circle {
    width: 15vw;
    height: 15vh;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.2s ease;
}

.avatar-circle:hover {
    border-color: #aaa;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-circle span {
    font-size: 2rem;
    color: #aaa;
}

.hidden-input {
    display: none;
}
.projectCard {
    &__editable {
        &__pics {
            p {
                margin-bottom: 18px;
            }

            &__grid {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }

            &__adder {
                height: 106px;
                width: 73px;
                background: $def-white;
                border-radius: 12px;
                align-items: center;
                justify-content: center;
                display: flex;
            }
        }

        &__tags {
            margin-top: 43px;
            margin-bottom: 48px;

            p {
                margin-bottom: 16px;
            }
        }

        &__info {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }
}

.user-item {
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
}

.bottom-sheet-card {
    min-height: 500px !important;
    border-radius: 12px 12px 0 0;
}

.file-upload-container {
    display: flex;
    flex-direction: column;
    padding: 16px;
}

.file-upload-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
}

.file-upload-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: flex-start; // Ensure items align to the left
}

.file-item {
    position: relative;
    width: 250px;
    height: 150px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
}

.file-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    margin-bottom: 8px;
}

.uploaded-image,
.file-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.file-details {
    text-align: center;
}

.file-action {
    color: #00aaff;
    font-size: 14px;
    margin-bottom: 4px;
    cursor: pointer;
}

.file-link {
    color: #666;
    font-size: 12px;
    word-break: break-word;
}

.remove-file-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: red;
    font-size: 16px;
    cursor: pointer;
}

.file-adder {
    margin-left: 0; // Align the "+" block to the left
    width: 250px;
    height: 150px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.file-adder span {
    font-size: 32px;
    color: #aaa;
}
</style>