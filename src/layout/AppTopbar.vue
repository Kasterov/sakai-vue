<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { repository } from '../service/Repository';
import { useToast } from 'primevue/usetoast';
import store from '@/store';
import MessageService from '../service/MessageService';

const messageService = new MessageService();

const { login, createVolunteer } = repository();
const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const loginModalOpen = ref(false);
const registerModalOpen = ref(false);

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const menu = ref(null);
const passwordLogin = ref(null);
const emailLogin = ref(null);

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const overlayMenuItems = computed(() => {
    const token = store.getters.getToken;

    if(token){
        return [{
            label: 'Профіль',
            icon: 'pi pi-id-card'
        },
        {
            label: 'Вийти з акаунту',
            icon: 'pi pi-sign-out',
            command: (event) => {store.dispatch('clearToken');}
        }];
    }
    else {
        return [{
            label: 'Увійти',
            icon: 'pi pi-sign-in',
            command: (event) => {loginModalOpen.value = true;}
            },
        {
            label: 'Реєстрація',
            icon: 'pi pi-user',
            command: (event) => {registerModalOpen.value = true; toggleMenu(event)}
        }]
    }
})

const loginVolunteer = async () => {

    let loginRequest = {
        email: emailLogin.value,
        password: passwordLogin.value
    };

    let res = await login(loginRequest);

    if(res){
        messageService.showSuccess('Ви успішно увійшли!');
        setTimeout(() => {loginModalOpen.value = false;}, 500)
    } else {
        messageService.showError('Не вірна пошта або пароль!'); 
    }
};

const toggleMenu = (event) => {
    menu.value.toggle(event);
};


const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const saveVolunteer = () => {
    
    let volunteer = {
        firstName: firstName.value,
        lastName: lastName.value,
        gender: gender.value.id,
        dateOfBirth: birthDate.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        confirmPassword: password.value,
        photo: uploadedImage.value
    };

    let res = createVolunteer(volunteer);


    if(res) {
        messageService.showSuccess("Користувача створено!");
    } else {
        messageService.showError("Користувача не створено!", "виникла непердбачувана помилка!");
    }

    registerModalOpen.value = false;
};  

const birthDate = ref(null);
const password = ref(null);
const gender = ref({ name: 'Не вказано', id: 0 });
const avatar = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const email = ref(null);
const phone = ref(null);

const genders = ref([
    { name: 'Не вказано', id: 0 },
    { name: 'Чоловік', id: 1 },
    { name: 'Жінка', id: 2 },
    { name: 'Небінарна особистість', id: 3 }
]);

const uploadedImage = ref(null);

const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob());

    reader.readAsDataURL(blob);

    avatar.value = {
        name: file.name,
        base64: "",
        contentType: file.type,
        expression: file.name.split('.').pop()
    } 

    reader.onloadend = function () {
        let base64Full = reader.result;
        avatar.value.base64 = base64Full.split(',')[1];
        uploadedImage.value = base64Full;
    };
};

</script>

<template>
    <Dialog header="Реєстрація" v-model:visible="registerModalOpen" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }" :modal="true">
        <div class="card p-fluid">
                <div class="field col-12 md:col-4">
                            <Avatar :image="uploadedImage" style="width: 8rem; height: 8rem;" shape="circle"></Avatar>
                            <FileUpload
                                class="mt-1"
                                mode="basic"
                                name="demo[]"
                                url="/api/upload"
                                accept="image/*"
                                customUpload
                                :auto="true"
                                @uploader="customBase64Uploader"
                                />
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="name2">Ім'я</label>
                        <InputText id="name2" v-model="firstName" type="text" />
                    </div>
                    <div class="field col">
                        <label for="email2">Прізвище</label>
                        <InputText id="email2"v-model="lastName" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="name2">Пароль</label>
                        <Password id="password" v-model="password" placeholder="" :toggleMask="true" class="w-full mb-3" inputClass="w-full"></Password>
                    </div>
                    <div class="field col">
                        <label for="email2">Дата народження</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="birthDate"></Calendar>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="name2">Електронна пошта</label>
                        <InputText id="name2" v-model="email" type="text" />
                    </div>
                    <div class="field col">
                        <label for="email2">Телефон</label>
                        <InputText id="email2" v-model="phone" type="text" />
                    </div>
                    <div class="field col">
                        <label for="name2">Гендер</label>
                        <Dropdown v-model="gender" :options="genders" optionLabel="name" placeholder="Обрати"/>
                    </div>
                </div>
            </div>
        <Button label="Створити користувача" @click="saveVolunteer()" class="w-full p-3 text-xl"></Button>
    </Dialog>
    <Dialog header="Вхід" v-model:visible="loginModalOpen" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
        <InputText id="email1" type="text" placeholder="" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="emailLogin" />

        <label for="password1" class="block text-900 font-medium text-xl mb-2">Пароль</label>
        <InputText id="password1" v-model="passwordLogin" placeholder="Password" class="w-full md:w-30rem mb-5" inputClass="w-full" style="padding: 1rem"></InputText>

        <!-- <div class="flex align-items-center justify-content-between mb-5 gap-5">
        <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
        </div> -->
        <Button label="Увійти" @click="loginVolunteer()" class="w-full p-3 text-xl"></Button>
    </Dialog>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <span>VolunteerLink</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button @click="onTopBarMenuButton()" v-on:click="toggleMenu" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
