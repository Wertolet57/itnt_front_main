<template>
    <div class="card" style="padding: 15px; padding-bottom: 20px">
        <div class="d-flex mb-2">
            <p>{{ $t("Post.publish") }}</p>
        </div>
        <div class="ui-vacancyPanel__inputs">
            <UiInput :label="$t('Post.title')" v-model="localDescriptionHeader" />
            <UiInput :label="$t('Post.offer')" v-model="localDescription" class="mt-[48px]" />

            <UiButton v-if="!imagePreview" bg-color="def">
                <label for="fileInput" style="cursor: pointer;">{{ $t("Post.magazine") }}</label>
            </UiButton>
            <input @change="handleFileChange" type="file" id="fileInput" style="display: none;" ref="fileInput"
                accept="image/*">

            <div v-if="imagePreview" class="mt-4">
                <img class="rounded-t-[12px]" :src="imagePreview" alt="Image preview"
                    style="max-width: 100%; height: auto;" />
            </div>

            <UiButton v-if="imagePreview" @click="removeImage" bg-color="def" class="mt-2">
                {{ $t('remove') }}
            </UiButton>

            <UiButton @click="handlePostBlog" bg-color="smBlue" class="mt-[48px]">
                {{ $t("Post.post") }}
            </UiButton>
        </div>
    </div>

    <v-snackbar v-model="snackbarVisible" min-width="270px" max-height="46px" :timeout="3000" color="white"
        rounded="lg">
        <div class="flex flex-row justify-between items-center">
            {{ $t("Post.published") }}
        </div>
    </v-snackbar>
</template>

<script lang="ts" setup>
import UiButton from './UiButton.vue';
import UiInput from './UiInput.vue';
import { ref, computed } from 'vue';
import { postProject } from "~/API/ways/post";

interface Data {
    description: string;
    descriptionHeader: string;
    authorProject: { id: number };
    authorUser: { id: number };
}

const snackbarVisible = ref(false);
const backgroundFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const props = defineProps({
    descriptionHeader: String,
    description: String,
    authorUser: String,
    authorProject: String,
    prjAuth: {
        type: Boolean,
        default: false
    },
    edit: {
        type: Boolean,
        default: false
    },
    userAuth: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:descriptionHeader', 'update:description', 'postSuccess']);

const localDescriptionHeader = computed({
    get: () => props.descriptionHeader,
    set: (value) => emit('update:descriptionHeader', value)
});

const localDescription = computed({
    get: () => props.description,
    set: (value) => emit('update:description', value)
});

const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        backgroundFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};
const handlePostBlog = async () => {
    try {
        const background = backgroundFile.value || new File(['content'], 'background.jpg', { type: 'image/jpeg' });
        const files: File[] = backgroundFile.value
            ? [background, background]
            : [
                new File(['file1'], 'file1.jpg', { type: 'image/jpeg' }),
                new File(['file2'], 'file2.jpg', { type: 'image/jpeg' })
            ];

        const postData: Data = {
            description: localDescription.value || 'My Project Description',
            descriptionHeader: localDescriptionHeader.value || 'My Project Header',
            authorProject: { id: 0 },
            authorUser: { id: 91 },
        };

        await postProject(background, files, postData);

        emit('postSuccess');
        snackbarVisible.value = true;
        console.log('Post added successfully');
    } catch (error) {
        console.error('Error adding post:', error);
    }
};

const removeImage = () => {
    imagePreview.value = null;
    backgroundFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};
</script>

<style lang="scss" scoped>
.ui-vacancyPanel {
    &__head {
        padding: 10px 20px;
        display: flex;
        gap: 10px;
        align-items: center;
        max-width: fit-content;
        border-radius: 8px;
        background: #e1f5fe;
    }

    &__inputs {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &--card {
        border-radius: 12px;
        background: $def-white;
        padding: 23px 20px !important;
    }
}

.photo-upload {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
}

.upload-wrapper {
    flex-basis: calc(20% - 12px);
}

.file-upload-label {
    display: flex;
    min-width: 100%;
    min-height: 120px;
    background-color: white;
    cursor: pointer;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #E0E0E0;
    border-radius: 12px;
    margin-bottom: 10px;
    background-size: cover;
    cursor: default;
    background-position: center;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    position: relative;

    .delete {
        position: absolute;
        right: -8px;
        bottom: -8px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

    }
}

@media (max-width: 576px) {
    .file-upload-label {
        min-height: 110px;
    }
}

@media (max-width: 440px) {
    .file-upload-label {
        min-height: 110px;
    }
}

@media (max-width: 380px) {
    .file-upload-label {
        min-height: 100px;
    }
}


.file-upload-label.with-image {
    min-height: 120px;
    min-width: 100%;
}

@media (max-width: 576px) {
    .file-upload-label.with-image {
        min-height: 110px;
    }
}

@media (max-width: 440px) {
    .file-upload-label.with-image {
        min-height: 110px;
    }
}

@media (max-width: 380px) {
    .file-upload-label.with-image {
        min-height: 100px;
    }
}

.file-upload-label.active {
    cursor: pointer;
}

input[type="file"] {
    display: none;
}

.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}
</style>
