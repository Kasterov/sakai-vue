<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { repository } from '../../service/Repository';
import MessageService from '../../service/MessageService';

const messageService = new MessageService();
const route = useRoute();
const volunteerId = ref(null);

const openChangePassDialog = ref(false);
const { createVolunteer, getVolunteerById, updateVolunteer, generateCode, changePassword, checkCode  } = repository();
const saveVolunteer = async () => {
    
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

    let res = await updateVolunteer(volunteerId.value, volunteer);

    if(res) {
        messageService.showSuccess("Волонтера оновлено!");
    } else {
        messageService.showError("Волонтера не оновлено!", "виникла непердбачувана помилка!");
    }
};  

const openChangePassFinalDialog = ref(false);

const passwordChange = ref(null);
const confirmPasswordChange = ref(null);

const requestToFinalPasswordChange = async () => {
    let res = await changePassword(passwordChange.value, confirmPasswordChange.value);

    if(res) {
        messageService.showSuccess("Ваш пароль змінено!");
        openChangePassFinalDialog.value = false;
        openChangePassDialog.value = false;
    } else {
        messageService.showError("Щось пішло не так!");
    }
}

const code = ref(null);

const requestToChangePassword = async () => {
    let res = await checkCode(code.value);

    if(res) {
        messageService.showSuccess("Змініть ваш пароль!");
        openChangePassFinalDialog.value = true;
    } else {
        messageService.showError("Код не підходить!");
    }
}

const gerateChangePswedCode = async () => {
    let res = await generateCode();

    if(res) {
        messageService.showSuccess("Зміна паролю!", "Код для зміни відправлено на ваш номер телефону!");
        openChangePassDialog.value = true;
    } else {
        messageService.showError("Зміна паролю!", "Щось пішло не так!");
    }
}

onMounted(async () => {

    let res = await getVolunteerById(route.params.id);

    volunteerId.value = res.id;
    lastName.value = res.lastName;
    firstName.value = res.firstName;
    phone.value = res.phone;
    email.value = res.email;
    gender.value = genders.value.filter(x => x.id == res.gender)[0];
    birthDate.value = res.dateOfBirth;
    uploadedImage.value = res.photo;
})

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
    <div class="grid">
        <Dialog header="Зміна паролю" v-model:visible="openChangePassDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '20vw' }" :modal="true">
            <div class="card p-fluid" v-if="!openChangePassFinalDialog">
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="name">Код з СМС</label>
                        <InputText id="name" v-model="code" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <Button label="Підтвердити" @click="requestToChangePassword()" class="mt-2 mr-2" />
                    </div>
                </div>
            </div>
            <div class="card p-fluid" v-if="openChangePassFinalDialog">
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="name">Новий пароль</label>
                        <InputText id="psw" v-model="passwordChange" type="text" />
                    </div>
                    <div class="field col">
                        <label for="name">Підтвердити пароль</label>
                        <InputText id="psw2" v-model="confirmPasswordChange" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <Button label="Підтвердити зміну пароля" @click="requestToFinalPasswordChange()" class="mt-2 mr-2" />
                    </div>
                </div>
            </div>
        </Dialog>
        <div class="col-12 md:col-12">
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
                        <label for="email2">Дата народження</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="birthDate"></Calendar>
                    </div>
                    <div class="field col">
                        <label for="name2">Електронна пошта</label>
                        <InputText id="name2" v-model="email" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="email2">Телефон</label>
                        <InputText id="email2" v-model="phone" type="text" />
                    </div>
                    <div class="field col">
                        <label for="name2">Гендер</label>
                        <Dropdown v-model="gender" :options="genders" optionLabel="name" placeholder="Обрати"/>
                    </div>
                    <div class="field col-12 md:col-12">
                        <div class="formgrid grid">
                            <div class="field col">
                                <Button label="Оновити користувача" @click="saveVolunteer()" class="mt-2 mr-2" />
                            </div>
                        </div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <Button label="Змінити пароль" @click="gerateChangePswedCode()" class="mt-2 mr-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
