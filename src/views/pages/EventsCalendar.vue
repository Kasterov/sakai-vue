<script setup>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { repository } from '../../service/Repository';
import MessageService from '../../service/MessageService';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';

const messageService = new MessageService();
const { getOrganisations,
    getTags,
    createEvent,
    getOrganisationsByCreatorId,
    getAllEvents,
    getEventById,
    createTag,
    getCommentsOfEventById,
    deleteComment,
    createComment } = repository();

const organisationsFilter = ref([]);
const possibleOrganisationForCreateNewEvent = ref([]);
const possibleTags = ref([]);
const selectedTags = ref(null);

const isDialogAddTagOpen = ref(false);
const newTagName = ref(null);

const openDialogAddTag = () => {
    isDialogAddTagOpen.value = true;
};

const addNewTag = async () => {
    let res = await createTag({name: newTagName.value});

    if(res) {
        possibleTags.value.push({id: res, name: newTagName.value})
        messageService.showSuccess("Тег створено!");
        isDialogAddTagOpen.value = false;
    } else {
        messageService.showError("Тег не створено!", "виникла непердбачувана помилка!");
    }
};

const openDiaogNewEvent = ref(false);

onMounted(async () => {
    let organisationsToSelect = await getOrganisationsByCreatorId();
    let organisationsForFilter = await getOrganisations();
    let tags = await getTags();

    possibleTags.value = tags?.data;
    organisationsFilter.value = organisationsForFilter?.data;
    possibleOrganisationForCreateNewEvent.value = organisationsToSelect?.data;
    await getFilteredEvents();
})

const getFilteredEvents = async () => {
    const searchRequest = {
        organisationIds: organisationFilter.value?.map(x => x.id),
        tagIds: tagsFilter.value?.map(x => x.id),
        city: cityFilter.value,
        startDate: startDateFilter.value,
        endDate: endDateFilter.value
    }

    const events = await getAllEvents(searchRequest);

    calendarOptions.value.events = events.map(e => ({
        id: e.id, title: e.title, start: e.startDate, end: e.endDate, color: e.color ? `#${e.color}` : '#3d5ddb' }
    ));
};

const uploadedImage = ref(null);
const avatar = ref(null);

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

const openDialogNewEvent = () => {
    openDiaogNewEvent.value = true;
};

const eventName = ref(null);
const description = ref(null);
const location = ref(null);
const city = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const eventOrganisation = ref(null);
const colorOfEvent = ref(null);

const eventDetails = ref(null);
const openDialogEventdetails = ref(false);

const openEventDetails = async (eventId) => {
    const res = await getEventById(eventId);

    await getCommentsOfEvent(eventId);

    openDialogEventdetails.value = true;
    eventDetails.value = res;
};

const eventComments = ref([]);

const getCommentsOfEvent = async (eventId) => {
    let res = await getCommentsOfEventById(eventId);

    eventComments.value = res;
}

const deleteCommentById = async (id) => {
    let res = await deleteComment(id);

    if(res) {
        eventComments.value = eventComments.value.filter(x => x.id != id)
        messageService.showSuccess("Коментар видалнео!");
    } else {
        messageService.showError("Коментар не видалено!", "виникла непердбачувана помилка!");
    }
};

const saveNewEvent = async () => {
    const eventRequest = {
        title: eventName.value,
        description: description.value,
        location: location.value,
        startDate: startDate.value,
        endDate: endDate.value,
        city: city.value,
        photo: uploadedImage.value,
        tagIds: selectedTags.value?.map(x => x.id),
        organisationId: eventOrganisation.value?.id,
        color: colorOfEvent.value
    };


    let res = await createEvent(eventRequest);

    if(res) {
        await getFilteredEvents();
        messageService.showSuccess("Подію створено!");
        openDiaogNewEvent.value = false;
    } else {
        messageService.showError("Подію не створено!", "виникла непердбачувана помилка!");
    }
};

const organisationFilter = ref([]);
const tagsFilter = ref([]);
const startDateFilter = ref(null);
const endDateFilter = ref(null);
const cityFilter = ref(null);

const addDialogShow = ref(false);
const comment = ref(null);

const addComment = () => {
    addDialogShow.value = true;
}

const saveComment = async () => {
    let res = await createComment(eventDetails.value.id, comment.value);

    if(res) {
        messageService.showSuccess("Коментарій створено!");
        addDialogShow.value = false;
        await getCommentsOfEvent(eventDetails.value.id);
    } else {
        messageService.showError("Коментарій не створено!", "виникла непердбачувана помилка!");
    }
}

const calendarOptions = ref ({
        plugins: [dayGridPlugin, interactionPlugin, bootstrapPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        displayEventTime: false,
        themeSystem: 'bootstrap5',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridWeek,dayGridDay,dayGridMonth'
        },
        eventDisplay: 'block',
        events: [],
        eventClick: function (info) {
            openEventDetails(info.event.id);
        }
      })

</script>

<template>
  <div class="grid p-fluid">
    <Dialog header="Додати тег" v-model:visible="isDialogAddTagOpen" :breakpoints="{ '960px': '75vw' }" :style="{ width: '20vw' }" :modal="true">
        <div class="card p-fluid">
            <div class="field col">
                <label for="name">Назва тега</label>
                <InputText id="name" v-model="newTagName" type="text" />
            </div>
            <Button label="Додати тег" @click="addNewTag()" class="w-full p-3 text-s"></Button>
        </div>
    </Dialog>
    <Dialog header="Додати коментар" v-model:visible="addDialogShow" :breakpoints="{ '960px': '75vw' }" :style="{ width: '20vw' }" :modal="true">
        <div class="card p-fluid">
            <div class="field col">
                <label for="name">Ваш кометнар</label>
                <InputText id="name" v-model="comment" type="text" />
            </div>
            <Button label="Додати коментар" @click="saveComment()" class="w-full p-3 text-s"></Button>
        </div>
    </Dialog>

    <Dialog :header="eventDetails?.title" v-model:visible="openDialogEventdetails" :breakpoints="{ '960px': '75vw' }" :style="{ width: '45vw' }" :modal="true">
        <div class="grid">
            <div class="field col-12 md:col-3">
                <Avatar :image="eventDetails.photo" style="width: 8rem; height: 8rem;" shape="circle"></Avatar>
            </div>
            <div class="field col-12 md:col-8">
                <h5>{{ new Date(eventDetails.startDate).toLocaleString() }} - {{ new Date(eventDetails.endDate).toLocaleString() }}</h5>
                <span v-for="(tag, index) in eventDetails.tags" :key="index">
                    <Chip label="Action" class="mr-2 mb-2">{{ tag }}</Chip>
                </span>
            </div>
            <div class="field col-12 md:col-12">
                <h5>{{ eventDetails.description }}</h5>
            </div>
            <div class="field col-12 md:col-12">
                <Button label="Додати коментар" @click="addComment()"></Button>
            </div>
        </div>
        <div class="card p-fluid">
                <Accordion :activeIndex="1">
                    <AccordionTab header="Коментарі">
                        <div class="field col-12 md:col-12" v-for="(comment, index) in eventComments" :key="index">
                            <Card>
                            <template v-slot:title>
                                <div class="flex align-items-center justify-content-between mb-0">
                                    <h5>{{ comment.author.firstName }}</h5>
                                    <Button icon="pi pi-trash" class="p-button-text" @click="deleteCommentById(comment.id)" />
                                </div>
                                <Menu id="config_menu" ref="menuRef" :model="cardMenu" :popup="true" />
                            </template>

                            <template v-slot:content>
                                <p class="line-height-3 m-0">
                                    {{ comment.commnet }}
                                </p>
                            </template>
                            </Card>
                        </div>
                    </AccordionTab>
                </Accordion>
        </div>
    </Dialog>

    <Dialog header="Створення нової події" v-model:visible="openDiaogNewEvent" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }" :modal="true">
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
                        <label for="name">Назва події</label>
                        <InputText id="name" v-model="eventName" type="text" />
                    </div>
                    <div class="field col">
                        <label for="description">Опис</label>
                        <InputText id="description"v-model="description" type="text" />
                    </div>
                    <div class="field col">
                        <h6>Колір події</h6>
                        <ColorPicker style="width: 2rem" v-model="colorOfEvent" />
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="location">Локація</label>
                        <InputText id="location" v-model="location" placeholder="" :toggleMask="true" class="w-full mb-3" inputClass="w-full"></InputText>
                    </div>
                    <div class="field col">
                        <label for="town">Місто</label>
                        <InputText id="town" v-model="city" placeholder="" :toggleMask="true" class="w-full mb-3" inputClass="w-full"></InputText>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label for="startDate">Дата початку події</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="startDate" showTime hourFormat="24"></Calendar>
                    </div>
                    <div class="field col">
                        <label for="endDate">Дата кінця події</label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="endDate" showTime hourFormat="24"></Calendar>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col">
                        <label>Організація, яка проводить подію</label>
                        <Dropdown v-model="eventOrganisation" :options="possibleOrganisationForCreateNewEvent" optionLabel="organisationName" placeholder="оберіть організацію" />
                    </div>
                    <div class="field col">
                        <label>Теги події</label>
                        <InputGroup>
                            <InputGroupAddon @click="openDialogAddTag">
                                <i class="pi pi-plus"></i>
                            </InputGroupAddon>
                            <MultiSelect v-model="selectedTags" :options="possibleTags" optionLabel="name" :filter="true" placeholder="оберіть теги">
                            <template #value="slotProps">
                                <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.id">
                                    <div>{{ option.name }}</div>
                                </div>
                                <template v-if="!slotProps.value || slotProps.value.length === 0">
                                    <div class="p-1">оберіть теги</div>
                                </template>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                            </MultiSelect>
                        </InputGroup>
                    </div>
                </div>
            </div>
        <Button label="Створити подію" @click="saveNewEvent()" class="w-full p-3 text-xl"></Button>
    </Dialog>

    <div class="col-12">
          <div class="card">
                <div class="grid p-fluid">
                    <div class="col-12 md:col-2">
                        <div class="field-radiobutton mb-0">
                            <Button label="Нова подія" @click="openDialogNewEvent()"></Button>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <MultiSelect v-model="organisationFilter" :options="organisationsFilter" optionLabel="name" placeholder="оберіть організацію" :filter="true">
                            <template #value="slotProps">
                                <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.id">
                                    <div>{{ option.organisationName }}</div>
                                </div>
                                <template v-if="!slotProps.value || slotProps.value.length === 0">
                                    <div class="p-1">Організації</div>
                                </template>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.organisationName }}</div>
                                </div>
                            </template>
                          </MultiSelect>
                    </div>

                    <div class="col-12 md:col-4">
                        <MultiSelect v-model="tagsFilter" :options="possibleTags" optionLabel="name" placeholder="оберіть організацію" :filter="true">
                            <template #value="slotProps">
                                <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.id">
                                    <div>{{ option.name }}</div>
                                </div>
                                <template v-if="!slotProps.value || slotProps.value.length === 0">
                                    <div class="p-1">Теги</div>
                                </template>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                          </MultiSelect>
                    </div>
                    <div class="col-12 md:col-2">
                        <div class="field-radiobutton mb-0">
                          <Button type="button" class="mr-2 mb-2" label="Пошук" icon="pi pi-search" @click="getFilteredEvents" />
                        </div>
                    </div>
                </div>
                <div class="grid p-fluid">
                    <div class="col-12 md:col-4">
                        <Calendar placeholder="Початкова дата" :showIcon="true" :showButtonBar="true" v-model="startDateFilter"></Calendar>
                    </div>
                    <div class="col-12 md:col-4">
                        <Calendar placeholder="Кінцева дата" :showIcon="true" :showButtonBar="true" v-model="endDateFilter"></Calendar>
                    </div>
                    <div class="col-12 md:col-4">
                        <InputText placeholder="Місто" id="city" v-model="cityFilter" type="text" />
                    </div>
                </div>
            </div>
    </div>

    <div class="col-12 md:col-12">
        <div class="card">
            <FullCalendar :options='calendarOptions'/>
        </div>
    </div>
  </div>
</template>