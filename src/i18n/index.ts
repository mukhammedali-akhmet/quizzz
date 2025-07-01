import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                sidebar: {
                    create: "Create",
                    home: "Home",
                    library: "Library"
                },
                header: {
                    search: "Search for quizzes...",
                    signIn: "Sign In",
                    signOut: "Sign Out"
                }
            }
        },
        ru: {
            translation: {
                sidebar: {
                    create: "Создать",
                    home: "Главная",
                    library: "Коллекции"
                },
                header: {
                    search: "Искать викторины...",
                    signIn: "Войти",
                    signOut: "Выйти"
                }
            }
        }
    },
    lng: "en", // язык по умолчанию
    fallbackLng: "en",

    interpolation: {
        escapeValue: false // React уже экранирует
    }
});

export default i18n;
