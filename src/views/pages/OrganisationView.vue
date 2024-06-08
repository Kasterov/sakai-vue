<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { repository } from '../../service/Repository';

const router = useRouter();
const { getOrganisationById } = repository();
const route = useRoute();

const name = ref(null);
const email = ref(null);
const phone = ref(null);
const address = ref(null);
const description = ref(null);
const web = ref(null);
const organisationType = ref(null);
const goal = ref(null);

const organisationTypes = ref([
{
    id: 0,
    Type: "Офіційна"
},
{
    id: 1,
    Type: "Неофіційна"
}]);

onMounted(async () => {
    let res = await getOrganisationById(route.params.id);

    name.value = res.data.organisationName;
    email.value = res.data.email;
    phone.value = res.data.phone;
    address.value = res.data.address;
    description.value = res.data.description;
    web.value = res.data.webSite;
    organisationType.value = organisationTypes.value.filter(x => x.id == res.data.organisationType)[0];
    goal.value = res.data.goal;
})

const linkToEditOrganisation = (event) => {
    router.push(`/organisation/${route.params.id}`);
};

</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <div class="card p-fluid">
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="name">Назва Організації</label>
                        <InputText id="name" :readonly="true" v-model="name" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="descr">Опис</label>
                        <Textarea id="descr" :readonly="true" rows="5" v-model="description" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="phone">Телефон</label>
                        <InputText id="phone" :readonly="true" v-model="phone" type="text" />
                    </div>
                    <div class="field col">
                        <label for="email">Електронна пошта</label>
                        <InputText id="email" :readonly="true" v-model="email" type="text" />
                    </div>
                    <div class="field col">
                        <label for="address">Адреса</label>
                        <InputText id="address" :readonly="true" v-model="address" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="web">Вебсайт</label>
                        <InputText id="web" :readonly="true" v-model="web" type="text" />
                    </div>
                    <div class="field col">
                        <label for="goal">Ціль</label>
                        <InputText id="goal" :readonly="true" v-model="goal" type="text" />
                    </div>
                    <div class="field col">
                        <label for="name2">Тип організації</label>
                        <Dropdown :readonly="true" v-model="organisationType" :options="organisationTypes" optionLabel="Type" placeholder="Обрати"/>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col-12 md:col-12">
                        <div class="formgrid grid">
                            <div class="field col">
                                <Button label="Перейти на сторінку зміни організації" @click="linkToEditOrganisation()" class="mt-2 mr-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
