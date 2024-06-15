<script setup>
import { ref, onBeforeMount, onMounted, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { CustomerService } from '@/service/CustomerService';
import { ProductService } from '@/service/ProductService';
import MessageService from '../../service/MessageService';
import { repository } from '../../service/Repository';
import { useRouter } from 'vue-router'

const router = useRouter();

const messageService = new MessageService();
const { getOrganisations, createOrganization } = repository();

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);


const logo = ref(null);
const orgImage = ref(null);

const customBase64UploaderOrganisation = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob());

    reader.readAsDataURL(blob);

    logo.value = {
        name: file.name,
        base64: "",
        contentType: file.type,
        expression: file.name.split('.').pop()
    } 

    reader.onloadend = function () {
        let base64Full = reader.result;
        logo.value.base64 = base64Full.split(',')[1];
        orgImage.value = base64Full;
    };
};

const customerService = new CustomerService();
const productService = new ProductService();

const getSeverity = (id) => {
    switch (id) {
        case 0:
            return 'success';
        case 1:
            return 'info';
        default:
            return null;
    }
};

const linkOrganisation = (event) => {
    router.push(`/organisation-view/${event.data.id}`);
};

const openAddOrganisationDialog = ref(false);

const organisations = ref(null);

onMounted(async () => {
    let res = await getOrganisations();

    organisations.value = res.data;
})

onBeforeMount(() => {
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    loading2.value = false;
});

const addOrganisation = () => {
    openAddOrganisationDialog.value = true;
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const name = ref(null);
const email = ref(null);
const phone = ref(null);
const adress = ref(null);
const description = ref(null);
const webSite = ref(null);
const organisationType = ref({
    id: 1,
    Type: "Неофіційна"
});
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


const saveOrganisation = async () => {
    const organisationRequest = {
        organisationName: name.value,
        organisationType: organisationType.value.id,
        goal: goal.value,
        description: description.value,
        email: email.value,
        phone: phone.value,
        address: adress.value,
        webSite: webSite.value,
        logo: orgImage.value
    };

    organisations.value.push(organisationRequest);

    let res = await createOrganization(organisationRequest);

    if(res){
        messageService.showSuccess('Ви успішно створили організацію!');
        setTimeout(() => {openAddOrganisationDialog.value = false;}, 500)
    } else {
        messageService.showError('Щось пішло не так, організація не створена!'); 
    }
};

</script>

<template>
    <div class="grid">
        <Dialog header="Реєстрація організації" v-model:visible="openAddOrganisationDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
            <div class="card p-fluid">
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="name">Назва Організації</label>
                        <InputText id="name" v-model="name" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col-12 md:col-4">
                            <Avatar :image="orgImage" style="width: 8rem; height: 8rem;" shape="circle"></Avatar>
                            <FileUpload
                                class="mt-1"
                                mode="basic"
                                name="demo[]"
                                url="/api/upload"
                                accept="image/*"
                                customUpload
                                :auto="true"
                                @uploader="customBase64UploaderOrganisation"
                                />
                    </div>
                    <div class="field col">
                        <label for="descr">Опис</label>
                        <Textarea id="descr" rows="5" v-model="description" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="phone">Телефон</label>
                        <InputText id="phone" v-model="phone" type="text" />
                    </div>
                    <div class="field col">
                        <label for="email">Електронна пошта</label>
                        <InputText id="email" v-model="email" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="goal">Ціль</label>
                        <InputText id="goal" v-model="goal" type="text" />
                    </div>
                    <div class="field col">
                        <label for="name2">Тип організації</label>
                        <Dropdown v-model="organisationType" :options="organisationTypes" optionLabel="Type" placeholder="Обрати"/>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="web">Вебсайт</label>
                        <InputText id="web" v-model="webSite" type="text" />
                    </div>
                    <div class="field col">
                        <label for="adress">Адреса</label>
                        <InputText id="adress" v-model="adress" type="text" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col-12 md:col-12">
                        <div class="formgrid grid">
                            <div class="field col">
                                <Button label="Створити організацію" @click="saveOrganisation()" class="mt-2 mr-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
        <div class="col-12">
            <div class="card">
                <h5>Усі організації</h5>
                <DataTable
                    :value="organisations"
                    :paginator="true"
                    :rows="10"
                    dataKey="id"
                    :rowHover="true"
                    showGridlines
                    @row-click="linkOrganisation"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" label="Додати організацію" @click="addOrganisation()" />
                        </div>
                    </template>
                    <Column field="organisationName" header="Назва" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.organisationName }}
                        </template>
                    </Column>
                    <Column header="Ціль" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <span>{{ data.goal }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column header="Опис" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <span>{{ data.description }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="status" header="Тип організації" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <Tag :severity="getSeverity(data.organisationType)">{{organisationTypes.filter(x => x.id == data.organisationType)[0].Type}}</Tag>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
