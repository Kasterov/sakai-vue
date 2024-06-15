<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { repository } from '../../service/Repository';
import MessageService from '../../service/MessageService';

const messageService = new MessageService();

const { getAllDonates, donate, getOrganisationsByCreatorId, createDonate } = repository();

const allDonates = ref([]);
const openDialogCreateDonate = ref(false);
const donateId = ref(0);
const moneyAmount = ref(null);

const donateToOrg = (donId) => {
    openDialogCreateDonate.value = true;
    donateId.value = donId;
};

const isCreateDonateOpened = ref(false);

const openCreateDonate = () => {
    isCreateDonateOpened.value = true;
}


const title = ref(null);
const description = ref(null);
const amount = ref(null);
const amountLeft = ref(null);
const jarLink = ref(null);
const selectedOrganisation = ref(null);
const possibleOrganisationForCreateNewEvent = ref(null);

const createDonateFunc = async () => {
    let donate = {
        title: title.value,
        description: description.value,
        amount: amount.value,
        amountLeft: amountLeft.value,
        jarLink: jarLink.value,
        organisationId: selectedOrganisation.value.id
    }

    let res = await createDonate(donate);

    if(res){
        messageService.showSuccess('Ви успішно створили донат!');
        setTimeout(() => {openDialogCreateDonate.value = false;}, 500)
    } else {
        messageService.showError('Щось пішло не так, донат не створено!'); 
    }
};

const search = ref(null);

const searchFunc = async () => {
    allDonates.value = (await getAllDonates()).filter(x => x.title.includes(search.value) || x.organisation.organisationName.includes(search.value))
}

const donateFinal = async () => {
    let res = await donate(donateId.value, parseInt(moneyAmount.value));

    if(res){
        allDonates.value = await getAllDonates();
        window.open(allDonates.value.filter(x => x.id == donateId.value)[0].jarLink,"_blank"); 
        openDialogCreateDonate.value = false;
    }
};

onMounted(async () => {
    let organisationsToSelect = await getOrganisationsByCreatorId();
    possibleOrganisationForCreateNewEvent.value = organisationsToSelect?.data;
    allDonates.value = await getAllDonates();
})

</script>

<template>
    <div class="card p-fluid">
        <Dialog header="Створення донату" v-model:visible="isCreateDonateOpened" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
            <div class="card p-fluid">
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="phone">Назва</label>
                        <InputText id="phone" v-model="title" type="text" />
                    </div>
                    <div class="field col">
                        <label for="email">Призначення</label>
                        <InputText id="email" v-model="description" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="goal">Цільова сума збору</label>
                        <InputText id="goal" v-model="amount" type="number" />
                    </div>
                    <div class="field col">
                        <label for="name2">Залишилось зібрати</label>
                        <InputText id="goal" v-model="amountLeft" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="web">Посилання на монобанку</label>
                        <InputText id="web" v-model="jarLink" type="text" />
                    </div>
                    <div class="field col">
                        <label for="adress">Організація</label>
                        <Dropdown v-model="selectedOrganisation" :options="possibleOrganisationForCreateNewEvent" optionLabel="organisationName" placeholder="оберіть організацію" />
                    </div>
                </div>
                <Button label="Створити донат" @click="createDonateFunc()" class="w-full p-3 text-s"></Button>
            </div>
        </Dialog>
        <Dialog header="Задонатити" v-model:visible="openDialogCreateDonate" :breakpoints="{ '960px': '75vw' }" :style="{ width: '20vw' }" :modal="true">
            <div class="card p-fluid">
                <div class="field col">
                    <label for="name">Сума донату?</label>
                    <InputText id="name" v-model="moneyAmount" type="text" />
                </div>
                <Button label="Задонатити суму" @click="donateFinal()" class="w-full p-3 text-s"></Button>
            </div>
        </Dialog>
        <div class="field grid">
            <div class="col-12">
                <div class="card">
                    <h5>Донати</h5>
                    <Toolbar>
                        <template v-slot:start>
                            <Button @click="openCreateDonate()" label="Створити донат" icon="pi pi-plus" class="mr-2" />
                            <InputGroup>
                                <Button label="Пошук" @click="searchFunc()" />
                                <InputText v-model="search" placeholder="назва донату" />
                            </InputGroup>
                        </template>
                    </Toolbar>
                </div>
            </div>
            <div class="col-12 md:col-6 mt-4" v-for="donate in allDonates" :key="index">
                <div class="card p-fluid">
                    <h4>{{ donate.title }}</h4>
                    <div class="field">
                        <h5>Організація: {{ donate.organisation.organisationName }}</h5>
                        {{ donate.description }}
                    </div>
                    <div class="field">
                        <Button label="Задонатити" @click="donateToOrg(donate.id)"></Button>
                    </div>
                    <div class="field">
                        <ProgressBar :value="donate.amountPercent"></ProgressBar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
