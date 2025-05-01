<template>
    <Header :messenger="true" showID :showUserMinify="true" />
    <h3 class="title font-medium m-4">{{ $t('language.interface') }}</h3>
    <div class="language-selector">
        <ul class="language-list">
            <li v-for="(language, index) in languages" :key="index" @click="selectLanguage(language)"
                :class="{ 'selected': selectedLanguage === language.locale }">
                <div class="language-info">
                    <span class="language-name font-medium">{{ language.displayName }}</span>
                    <span class="language-native">{{ language.nativeName }}</span>
                </div>
                <v-icon class="mt-2" v-if="selectedLanguage === language.locale" icon="mdi-check" color="blue"></v-icon>
            </li>
        </ul>
    </div>
</template>


<script setup lang="ts">
import Header from '../../components/Header.vue';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const languages = ref([
    { locale: 'ru', displayName: 'Russian', nativeName: 'Русский' },
    { locale: 'en', displayName: 'English', nativeName: 'English' },
    { locale: 'ar', displayName: 'Arabic', nativeName: 'العربية' },
    { locale: 'ch', displayName: 'Chinese', nativeName: '中文' },
]);

// Получаем текущий выбранный язык из localStorage или используем значение по умолчанию
const selectedLanguage = ref(localStorage.getItem('selectedLanguage') || locale.value);

// Функция для изменения языка
const selectLanguage = (language: any) => {
    locale.value = language.locale;
    selectedLanguage.value = language.locale;

    // Сохраняем выбранный язык в localStorage
    localStorage.setItem('selectedLanguage', language.locale);
};

// Проверяем localStorage при загрузке компонента и устанавливаем язык
onMounted(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
        locale.value = storedLanguage;
        selectedLanguage.value = storedLanguage;
    }
});

</script>

<style scoped lang="scss">
.language-selector {
    margin: 0 12px;
    padding: 10px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 1.1rem;
    margin-bottom: 10px;
}

.language-list {
    list-style: none;
    padding: 0;
}

.language-list li {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    margin-bottom: 5px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s ease-in-out;
}

.language-list li:hover {
    background-color: #f0f0f0;
}

.language-list li.selected {
    background-color: rgba(0, 0, 255, 0.1);
}

.language-info {
    display: flex;
    flex-direction: column;
}

.language-name {
    font-size: 1rem;
    // font-weight: bold;
}

.language-native {
    font-size: 0.9rem;
    color: #666;
}

.checkmark {
    color: blue;
    font-size: 1.2rem;
}
</style>