<script setup>
import { ref } from 'vue';
import { repository } from '../../service/Repository';

const { createVolunteer } = repository();
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
    <div class="grid">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
