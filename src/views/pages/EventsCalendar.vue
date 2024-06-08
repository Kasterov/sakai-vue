<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    FullCalendar
  },
  data: function() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridWeek,dayGridDay,dayGridMonth' // user can switch between the two
        },
        events: [
          { title: 'Meeting', start: new Date() },
          { title: 'Meeting', start: new Date('2024.04.28 15:00'), end: new Date('2024.04.28 18:00') },
          { title: 'Meeting', start: new Date('2024.04.28 19:00') },
          { title: 'Meeting', start: new Date() }
        ]
      }
    }
  }
}
</script>

<template>
    <FullCalendar :options='calendarOptions'/>   
</template>