<template>
    <div class="card" style="padding: 15px; padding-bottom: 20px;overflow-y: auto;">
        <div class="d-flex mb-2">
            <p>{{ $t("Post.publish") }}</p>
        </div>
        <div class="ui-vacancyPanel__inputs">
            <UiInput :label="$t('Post.title')" v-model="localDescriptionHeader" />

            <div class="">
                <div v-if="background" class="background">
                    <img :src="backgroundPreview" alt="Background image" />
                     <UiButton @click="removeBackground" bg-color="def" class="mt-[5px]">
                        {{ $t('remove') }}
                    </UiButton>
                </div>
                <div v-else>
                    <UiButton @click="handleAddBackground" bg-color="def" class="mt-[0]">
                        {{ $t('Add Background') }}
                    </UiButton>
                    
                </div>
            </div>
            <UiInput :label="$t('Post.offer')" v-model="localDescription" class="mt-[0]" />
            <div class="item">
                <div v-for="(image, index) in previewImages" :key="index" class="image-item">
                    <img :src="image" alt="Uploaded image" />
                    <button class="delete-btn" @click="removeImage(index)">×</button>
                </div>
                
                <div v-if="previewImages.length < maxImages" class="add-item" @click="handleAddImage">
                    <v-icon icon="mdi-plus" />
                </div>
            </div>

            <UiButton @click="submitImages" bg-color="smBlue" class="mt-[48px]">
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

const snackbarVisible = ref(false);
const props = defineProps({
    descriptionHeader: String,
    description: String,
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


const maxImages = 6;
const files = ref([]);
const background = ref<File | null>(null); 
const previewImages = ref([]);
const backgroundPreview = ref(null);

const handleAddBackground = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      background.value = file; 
      const reader = new FileReader();
      reader.onload = (e) => {
        backgroundPreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

const removeBackground = () => {
  background.value = null; 
  previewImages.value.shift(); 
};
const handleAddImage = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file && files.value.length < maxImages) {
      files.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => previewImages.value.push(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

const removeImage = (index:any) => {
  previewImages.value.splice(index, 1);
  files.value.splice(index, 1);
};

const submitImages = async () => {
  try {
    const otherFiles = files.value.slice(0);
    const postData = {
        description: localDescription.value || '',
        descriptionHeader: localDescriptionHeader.value || '',
      authorProject: { id: props.authorProject || 0 },
      authorUser: { id: 2 },
    };
    console.log(postData);
    const response = await postProject(background.value as File, otherFiles, postData);
    snackbarVisible.value = true
    emit('postSuccess')
    console.log('Успешно отправлено:', response);
  } catch (error) {
    console.error('Ошибка при отправке:', error);
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

    &__card {
        border-radius: 12px;
        background: $def-white;
        padding: 23px 20px !important;
    }
}
.background{
    img{
        width: 100%;
        max-height: 240px;
        object-fit: cover;
        border-radius: 12px;
    }
}
.item{
    display:flex;
    width:100%;
    gap:8px;
    .image-item {
        position:relative;
        display:flex;
        border-radius:12px;
        align-items:center;
        justify-content:center;
        border:1px solid #e5e5e5;
        width:calc(20% - 10px);
        min-height:80px;
        transition: transform 0.2s;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            .delete-btn {
                position: absolute;
                bottom: -5px;
                right: -5px;
                background: rgba(0, 0, 0, 0.6);
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                font-size: 16px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background 0.3s;
            }
            .delete-btn:hover {
                background: rgba(255, 0, 0, 0.8);
            }
        }
    .image-item:hover {
        transform: scale(1.05);
    }

    .image-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
    }
    .add-item{
        transition: background 0.3s, color 0.3s;
        display:flex;
        cursor: pointer;
        border-radius:12px;
        align-items:center;
        justify-content:center;
        border:1px solid rgb(180, 178, 178);
        width:calc(20% - 10px);
        transition: transform 0.2s;
        min-height:80px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
}
</style>
