<template>
    <div v-if="isZoomed" class="zoom-mode" @click="toggleZoom">
        <swiper :breakpoints="swiperBreakpoints" :spaceBetween="10" :modules="modules">
            <swiper-slide v-for="file in data" :key="file.id">
                <img :src="`${baseURL}/${file.pictureUrl}`" :alt="baseURL" />
            </swiper-slide>
        </swiper>
    </div>
    <div v-else class="custom-swiper">
        <swiper :breakpoints="defaultSwiperBreakpoints" :space-between="20" :modules="modules" class="mySwiper">
            <swiper-slide v-for="file in data" :key="file.id" class="my-slide" @click="toggleZoom">
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
});
const isZoomed = ref(false);
const toggleZoom = () => {
    isZoomed.value = !isZoomed.value;
};
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
    320: {
        slidesPerView: 5,
        spaceBetween: 10
    },
    768: {
        slidesPerView: 5,
        spaceBetween: 10
    },
    1024: {
        slidesPerView: 5,
        spaceBetween: 10
    }
};
</script>

<style lang="scss" scoped>
.zoom-mode {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
        margin: auto;
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 16px;
    }
}

.custom-swiper {
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: row;

    .mySwiper {
        width: 100%;
        height: 100%;
    }

    .my-slide {
        aspect-ratio: 1;
        max-width: 160px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        // &:hover {
        //     transform: translateY(-5px);
        //     box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
        // }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
        }
    }
}
</style>
