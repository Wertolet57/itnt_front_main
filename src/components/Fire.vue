<script lang="ts">
export default {
    name: 'Fire',
}
</script>

<template>
     <button v-if="props.prjType" @click="handleLike" class="fire">
        <transition name="fade">
            <img v-if="status === 'default'" :src="flame" alt="Default" />
        </transition>
        <transition name="fade">
            <v-progress-circular v-if="status === 'loading'" width="2" class="loading m-0 p-0 text-center" color="white"
                indeterminate></v-progress-circular>
        </transition>
        <transition class="m-0 p-0" name="fade">
            <img width="28" v-if="status === 'success'" :src="sucess" alt="Success" />
        </transition>
    </button>
    <button v-else @click="handleLikePost" class="fire">
        <transition name="fade">
            <img v-if="status === 'default'" :src="flame" alt="Default" />
        </transition>
        <transition name="fade">
            <v-progress-circular v-if="status === 'loading'" width="2" class="loading m-0 p-0 text-center" color="white"
                indeterminate></v-progress-circular>
        </transition>
        <transition class="m-0 p-0" name="fade">
            <img width="28" v-if="status === 'success'" :src="sucess" alt="Success" />
        </transition>
    </button>
</template>

<script setup lang="ts">
import sucess from '~/assets/LoadingIcon.svg'
import flame from '~/assets/icons/fire/flame.svg'
import { nextTick, ref, watch } from 'vue'
import { addLike, delLike } from '~/API/ways/project'
import { addLikes, delLikes } from '~/API/ways/post'
const props = defineProps({
    id: {
        type: Number,
    },
    prjType:{
        type:Boolean,
        default:true
    },
    likedByMe: { // New prop to handle initial liked state
        type: Boolean,
        default: false,
    },
})

const status = ref(props.likedByMe ? "success" : "default");
const isLiked = ref(props.likedByMe);

watch(() => props.likedByMe, (newValue) => {
    status.value = newValue ? "success" : "default";
    isLiked.value = newValue;
});

async function handleLike() {
    console.log('clicked')
    status.value = 'loading'

    try {
        let response
        if (isLiked.value) {
            response = await delLike(props.id)
        } else {
            response = await addLike(props.id)
        }
        console.log(response)
        setTimeout(() => {
            status.value = isLiked.value ? 'default' : 'success';
            isLiked.value = !isLiked.value 
        }, 500);
    } catch (error) {
        console.error(error)
        status.value = 'error'
    }

    await nextTick()
}
async function handleLikePost() {
    console.log('clicked')
    status.value = 'loading'

    try {
        let response
        if (isLiked.value) {
            response = await delLikes(props.id)
        } else {
            response = await addLikes(props.id)
        }
        console.log(response)
        setTimeout(() => {
            status.value = isLiked.value ? 'default' : 'success';
            isLiked.value = !isLiked.value 
        }, 500);
    } catch (error) {
        console.error(error)
        status.value = 'error'
    }

    await nextTick()
}
</script>

<style lang="scss" scoped>
.fire {
    border-radius: 2px 12px 12px 12px;
    display: flex;
    justify-content: center;
    padding: 9px 0;
    // height: 52px;
    // width: 62px;
    width: 51px;

    align-items: center;
    background: linear-gradient(173deg, #ffaf13 0%, #ff7313 100%);
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.2) inset, 0px 9px 9px -9px #ff7c13;
}
</style>
