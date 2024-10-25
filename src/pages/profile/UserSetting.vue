<template>
    <Header showID :showUserMinify="true" />
    <v-container style="padding: 0 20px; margin-bottom: 48px">
        <div class="card">
            <div class="card__title">
                {{ t("setting.setting") }}
            </div>
            <div class="card__item" v-if="edit === true">
                <div class="w-full mb-[8px]" v-for="(item, index) in cardItems" :key="index">
                    <UiInput :label="item.title" :placeholder="item.title" v-model="item.text" />
                </div>
                <button @click="updateUser">ок</button>
            </div>

            <div class="card__item" v-else @click="editable">
                <div v-for="(item, index) in cardItems" :key="index">
                    <div class="card__subTitle">
                        {{ item.title }}
                    </div>
                    <div class="card__text">
                        {{ item.text }}
                    </div>
                </div>
            </div>

        </div>
        <div class="list">
            <router-link class="list__item" :class='item.addClass' v-for="(item, index) in items" :key="index"
                :to="item.route">
                <div class="item__icon">
                    <img :src="item.src" alt=" " />
                </div>
                <div class="item__title">
                    {{ item.title }}
                </div>
            </router-link>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import globe from '../../assets/setting/globe.svg'
import confident from '../../assets/setting/confident.svg'
import eye from '../../assets/setting/eye.svg'
import face from '../../assets/setting/face-id.svg'
import lock from '../../assets/setting/lock.svg'
import mail from '../../assets/setting/mail-opened.svg'
import notification from '../../assets/setting/notification.svg'
import support from '../../assets/setting/support.svg'
import vallet from '../../assets/setting/vallet.svg'

import UiInput from '../../components/ui-kit/UiInput.vue'
import Header from '../../components/Header.vue'
import { getUserByID, patchUser } from '../../API/ways/user'
import { onMounted, ref, } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

let edit = ref(false)
const editable = () => {
    edit.value = !edit.value
}
const cardItems = ref([]);
let data = ref()
onMounted(async () => {
    await getUserByID(Number(localStorage.getItem("userId"))).then((response) => {
        try {
            data.value = response.data.object
            cardItems.value = [
                { title:`${t("setting.tel")}`, text: data.value?.login },
                { title: 'E-mail', text: '' },
                { title: `${t("setting.id")}`, text: '@' + data.value?.id },
            ];
        } catch (e) {
            console.error('text error:', e)
        }
    })
})
const updateUser = async () => {
    const data = {
        id: localStorage.getItem("userId"),
        login: cardItems.value[0].text,
    };

    await patchUser(data).then((response) => {
        console.log('response:', response)
        edit.value = !edit.value
    })
}
const items = [
    { src: vallet, title: `${t("setting.wallet")}`, route: '/me/vallet', addClass: 'list__class' },
    { src: mail, title: `${t("setting.invite")}`, route: '/me/invite' },
    { src: globe, title: `${t("setting.language")}`, route: '/me/language' },
    { src: lock, title: `${t("setting.safety")}`, route: '/me/safety' },
    { src: face, title: `${t("setting.privacy")}`, route: '/me/privacy' },
    { src: eye, title: `${t("setting.looking")}`, route: '/me/looking' },
    { src: support, title: `${t("setting.support")}`, route: '/me/support' },
    { src: confident, title: `${t("setting.policy")}`, route: '/me/privacy-policy' },
]

</script>

<style scoped lang="scss">
.card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 20px;

    &__item {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__text {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1%;
        text-align: left;
    }

    &__title {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 1%;
        text-align: left;
    }

    &__subTitle {
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 1%;
        text-align: left;
        color: #9e9e9e;
    }

}

.list {
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    width: 100%;
    height: 100%;

    &__class {
        border-top: rgba(158, 158, 158, 0.1) 0.1px solid;
    }

    &__item {
        padding: 14px 14px 14px 0;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 12px;
        // border-top: rgba(158, 158, 158, 0.1) 0.1px solid;
        border-bottom: rgba(158, 158, 158, 0.1) 0.1px solid;
    }
}
</style>
