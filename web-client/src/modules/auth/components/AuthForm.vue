<template>
    <div class="rvt-tabs tlt-tabs centered" data-rvt-tabs="tabset-1">
        <div class="rvt-tabs__tablist lockup-tabs" aria-label="Rivet tabs" data-rvt-tablist>
            <button type="button" class="rvt-tabs__tab tlt-tabs__tab rvt-bg-white" data-rvt-tab
                :class="{ 'tlt-tabs__tab--active': panel === 'login' }" @click="changeTab">Login</button>
            <button type="button" class="rvt-tabs__tab tlt-tabs__tab rvt-bg-white" data-rvt-tab
                :class="{ 'tlt-tabs__tab--active': panel === 'createAccount' }" @click="changeTab">Create an
                account</button>
        </div>
        <div class="rvt-tabs__panel rvt-p-all-lg rvt-p-bottom-xl rvt-p-all-xl-sm-up rvt-p-top-lg-sm-up rvt-shadow-heavy rvt-bg-white"
            data-rvt-tab-panel v-if="panel === 'login'">
            <form @submit.prevent="store.login(loginForm)">
                <fieldset class="rvt-fieldset">
                    <legend class="rvt-sr-only">Login</legend>
                    <div>
                        <base-input type="text" id="email" label="Email address" :required="true"
                            v-model="loginForm.email"></base-input>
                    </div>
                    <div class="rvt-m-top-md password">
                        <base-input type="password" id="password" label="Password" :required="true"
                            v-model="loginForm.password"></base-input>
                    </div>
                </fieldset>
                <button class="rvt-button tlt-button rvt-m-top-xl" type="submit" @click="login">Log in</button>
            </form>
            <div class="rvt-m-top-xl rvt-text-center tlt-help">
                <a href="https://one.iu.edu/launch-task/iu/reset-my-passphrase" target="_blank"
                    rel="noopener noreferrer">
                    <svg data-name="Sync icon" xmlns="http://www.w3.org/2000/svg" class="icon1" viewBox="0 0 16 16"
                        aria-hidden="true" focusable="false">
                        <title>Reset passphrase icon</title>
                        <path fill="currentColor"
                            d="M13.93,1a1,1,0,0,0-1,1V3A7,7,0,0,0,1.41,5.67,1,1,0,0,0,2,6.94a1,1,0,0,0,1.28-.61A5,5,0,0,1,12,5H10a1,1,0,0,0,0,2h3.52a1,1,0,0,0,.17,0l.15,0h.13a1,1,0,0,0,1-1V2A1,1,0,0,0,13.93,1Z">
                        </path>
                        <path fill="currentColor"
                            d="M14,9.06a1,1,0,0,0-1.28.61A5,5,0,0,1,4,11H6.14a1,1,0,0,0,0-2H2.51a.88.88,0,0,0-.28,0H2.17a.7.7,0,0,0-.14,0H2a1,1,0,0,0-.84,1v4a1,1,0,0,0,2,0v-.92a7,7,0,0,0,11.42-2.73A1,1,0,0,0,14,9.06Z">
                        </path>
                    </svg>
                    <span class="rvt-m-left-xxs">Reset passphrase</span>
                </a>
            </div>
            <div class="rvt-inline-alert rvt-inline-alert--standalone rvt-inline-alert--danger rvt-m-top-md"
                v-if="store.errorMessage">
                <span class="rvt-inline-alert__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path d="m8 6.586-2-2L4.586 6l2 2-2 2L6 11.414l2-2 2 2L11.414 10l-2-2 2-2L10 4.586l-2 2Z" />
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z" />
                    </svg>
                </span>
                <span class="rvt-inline-alert__message" id="example-message-4">{{ store.errorMessage }}</span>
            </div>
            <div class="rvt-inline-alert rvt-inline-alert--standalone rvt-inline-alert--success rvt-m-top-md"
                v-if="store.successMessage">
                <span class="rvt-inline-alert__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path d="M7 11.414 11.914 6.5 10.5 5.086 7 8.586l-1.5-1.5L4.086 8.5 7 11.414Z" />
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z" />
                    </svg>
                </span>
                <span class="rvt-inline-alert__message" id="example-message-2">{{ store.successMessage }}</span>
            </div>
        </div>
        <div class="rvt-tabs__panel rvt-p-all-lg rvt-p-bottom-xl rvt-p-all-xl-sm-up rvt-p-top-lg-sm-up rvt-shadow-heavy rvt-bg-white"
            data-rvt-tab-panel v-if="panel === 'createAccount'">
            <form @submit.prevent="store.register(registrationForm)">
                <fieldset class="rvt-fieldset">
                    <legend class="rvt-sr-only">Create an account</legend>
                    <div>
                        <base-input type="text" id="newEmail" label="New email address" :required="true"
                            v-model="registrationForm.newEmail"></base-input>
                    </div>
                    <div class="rvt-m-top-md password">
                        <base-input type="password" id="newPassword" label="New Password" :required="true"
                            v-model="registrationForm.newPassword"></base-input>
                    </div>
                </fieldset>
                <button class="rvt-button tlt-button rvt-m-top-xl" type="submit">Create
                    account</button>
            </form>
            <div class="rvt-inline-alert rvt-inline-alert--standalone rvt-inline-alert--danger rvt-m-top-md"
                v-if="store.errorMessage">
                <span class="rvt-inline-alert__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path d="m8 6.586-2-2L4.586 6l2 2-2 2L6 11.414l2-2 2 2L11.414 10l-2-2 2-2L10 4.586l-2 2Z" />
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z" />
                    </svg>
                </span>
                <span class="rvt-inline-alert__message" id="example-message-4">{{ store.errorMessage }}</span>
            </div>
            <div class="rvt-inline-alert rvt-inline-alert--standalone rvt-inline-alert--success rvt-m-top-md"
                v-if="store.successMessage">
                <span class="rvt-inline-alert__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path d="M7 11.414 11.914 6.5 10.5 5.086 7 8.586l-1.5-1.5L4.086 8.5 7 11.414Z" />
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z" />
                    </svg>
                </span>
                <span class="rvt-inline-alert__message" id="example-message-2">{{ store.successMessage }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useFirebaseStore } from '../store/authStore.js';
import { reactive, ref } from 'vue';
import BaseInput from '@/core/components/BaseInput.vue';

const store = useFirebaseStore();

const panel = ref('login');

const registrationForm = reactive({
    newEmail: '',
    newPassword: ''
})

const loginForm = reactive({
    email: '',
    password: ''
})

const newPassword = defineModel('newPassword');


const changeTab = () => {
    panel.value === 'login' ? panel.value = 'createAccount' : panel.value = 'login';
}
</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/buttons/base';

.tlt-tabs {
    background-color: transparent;

    &__tab {
        border-top: 0.25rem solid transparent;
        flex-grow: 0;

        &--active {
            border-top: 0.25rem solid #006298;
        }

        &:hover {
            border-top: 0.25rem solid #006298;

            &::after {
                content: none;
            }
        }
    }
}

.tlt-button {
    justify-content: center;
    width: 100%;
}

.tlt-help {
    a {
        font-size: 0.875rem;
        text-decoration: none;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        line-height: 0.875rem;
        padding: 0 0.875rem;
    }

    svg {
        height: 1rem;
        width: 1rem;
    }
}

.lockup-tabs {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
}

/* Small view ports and up */
@media screen and (min-width: 30em) {
    .centered {
        margin: auto;
        max-width: 440px;
        width: 100%;
        position: inherit;
    }

    .centered {
        max-width: 27.5rem;
        margin: 1rem auto;
    }
}
</style>