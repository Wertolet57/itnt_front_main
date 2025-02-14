<script lang="ts">
export default {
    name: 'Footer',
}
</script>

<template>
    <div class="small__screen">
        <v-bottom-navigation :elevation="10" grow>
            <v-footer>
                <div class="footer__row">
                    <div class="footer__item" v-for="(route, id) in routes" :key="id" @click="$router.push(route?.name)"
                        :class="route.name === $route.path && 'footer__item--active'">
                        <img width="22" height="22" :src="route?.icon" :alt="route.icon" />
                    </div>
                </div>
            </v-footer>
        </v-bottom-navigation>
    </div>
    <div class="big__screen">
        <div class="footer__column">
            <div class="footer__item2" v-for="(route, id) in routes" :key="id" @click="$router.push(route?.name)"
                :class="route.name === $route.path && 'footer__item2--active'">
                <img width="24" height="24" :src="route?.icon" :alt="route.icon" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import profile from "~/assets/icons/footer/account.svg"
import lupa from "~/assets/icons/footer/lupa.svg"
import home from "~/assets/icons/footer/home.svg"
import rate from "~/assets/icons/footer/rate.svg"
import message from "~/assets/icons/footer/message.svg"
import { modalActionsList } from '~/helpers/types'

const routes: modalActionsList[] = [
    {
        name: '/feed',
        icon: home,
    },
    {
        name: '/projects',
        icon: rate,
    },
    {
        name: '/messenger',
        icon: message,
    },
    {
        name: '/search',
        icon: lupa,
    },
    {
        name: '/me',
        icon: profile,
    },
]
</script>

<style lang="scss" scoped>
.small__screen {
    display: block;

    @media (min-width: 1200px) {
        display: none;
    }
}

.big__screen {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 80px;
    background-color: #ffffff;
    display: none;
    // box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 900;

    @media (min-width: 1200px) {
        display: block;
        // box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }
}

.footer {
    background: #ffffff;
    padding: 18px 27px;
    width: 100%;

    &__column {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        width: 100%;
    }

    &__row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }
    &__item2 {
        display: flex;
        align-items: center;
        padding: 28px 18px;
        
        &--active {
            padding: 28px 18px;
            background: #e1f5fe;
            border-radius: 8px;
        }
    }
    &__item {
        display: flex;
        align-items: center;
        padding: 4px 18px;

        &--active {
            padding: 4px 18px;
            background: #e1f5fe;
            border-radius: 8px;
        }
    }
}
</style>
