<template>
    <div v-if="props.zoom" class="zoom-mode">
        <swiper :breakpoints="swiperBreakpoints" :spaceBetween="10" :modules="modules" class="">
            <swiper-slide v-for="file in data" :key="file.id">
                <img :src="`${baseURL}/${file.pictureUrl}`" :alt="baseURL" />
            </swiper-slide>
        </swiper>
    </div>
    <div v-else class="default-mode">
        <swiper :breakpoints="defaultSwiperBreakpoints" :spaceBetween="1" :modules="modules" class="">
            <swiper-slide v-for="file in data" :key="file.id">
                <img :src="`${baseURL}/${file.pictureUrl}`" :alt="baseURL" />
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { getPostById } from '../API/ways/post';

const props = defineProps({
    id: {
        type: Number
    },
    zoom: {
        type: Boolean,
        default: false
    }
});
const modules = ref([Pagination]);
const baseURL = 'https://itnt.store/files';

const data = ref([]);
onMounted(async () => {
    try {
        const response = await getPostById(props.id);
        data.value = response.data.object.pictureUrls;
    } catch (error) {
        console.error('Error fetching project files:', error);
    }
});
const swiperBreakpoints = {
    0: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 1
    },
    1024: {
        slidesPerView: 1
    }
};
const defaultSwiperBreakpoints = {
    0: {
        slidesPerView: 1
    },
    600: {
        slidesPerView: 2
    },
    1024: {
        slidesPerView: 4
    }
};
</script>

<style lang="scss" scoped>
.zoom-mode {
    display: flex;
    height: 100vh;
    max-width: 100vw;
    justify-content: center;
    align-items: center;
}

.zoom-mode .swiper-slide img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 12px;
}

.default-mode {
    display: flex;
    justify-content: start;
    height: 160px;
    width: 97%;
    margin: 0 10px;
    .swiper{
    overflow:visible !important;
    margin:0 !important;
    position:relative;
}
}

.default-mode .swiper-slide img {
    min-width: 160px;
    min-height: 100%;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.05);
}
</style>
