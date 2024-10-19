<template>
    <swiper v-if="filteredProjectFiles && filteredProjectFiles.length > 0" :pagination="{ dynamicBullets: true, }" :modules="modules" class="mySwiper">
        <swiper-slide class="rounded-[16px]"  v-for="(file, index) in filteredProjectFiles" :key="file.id">
            <img class="rounded-[16px]" :src="getFileUrl(file.pictureUrl)" alt="Project Image" />
        </swiper-slide>
    </swiper>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useRoute } from 'vue-router';
import { getProjectByID } from '../../API/ways/project';

const props = defineProps({
    id: {
        type: Number
    }
})
const route = useRoute();
const modules = ref([Pagination]);
const baseURL ='https://itnt.store/files/';
const data = ref([]);

// Function to check if URL is external
const isExternalUrl = (url: string | null) => {
    return url?.startsWith('http') || url?.startsWith(',');
};

// Function to format the file URL
const getFileUrl = (url: string) => {
    return `${baseURL}${url}`;
};

// Fetch project files on component mount
onMounted(async () => {
    try {
        const response = await getProjectByID(props.id);
        data.value = response.data.object.projectFiles;
    } catch (error) {
        console.error('Error fetching project files:', error);
    }
});

// Filter project files that have a valid picture URL and are not external
const filteredProjectFiles = computed(() =>
    data.value.filter((file) => file.pictureUrl && !isExternalUrl(file.pictureUrl))
);
</script>
<style lang="scss" scoped>
.swiper {
    width: 100%;
    height: 400px;
    // border-radius: 16px;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    padding-left: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
}

.swiper-slide img {
    display: flex;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    @media (min-width: 768px) {
        object-fit: cover;
        border-radius: 16px;
        max-width: 500px;
        max-height: 100%;
    }
}
</style>
