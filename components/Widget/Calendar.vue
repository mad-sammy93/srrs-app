<template>
  <ejs-schedule height="550px" width="100%" :selectedDate="selectedDate" :eventSettings="eventSettings">
    <e-views>
      <e-view option="Day"></e-view>
      <e-view option="Week"></e-view>
      <e-view option="WorkWeek"></e-view>
      <e-view option="Month"></e-view>
      <!-- <e-view option="Agenda"></e-view> -->
    </e-views>
    <e-resources>
      <e-resource field="OwnerId" title="Owner" name="Owners" :dataSource="ownerDataSource" textField="OwnerText"
        idField="Id" colorField="OwnerColor">
      </e-resource>
    </e-resources>
  </ejs-schedule>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import {
  ScheduleComponent as EjsSchedule, ViewsDirective as EViews, ViewDirective as EView,
  ResourcesDirective as EResources, ResourceDirective as EResource,
  Day, Week, WorkWeek, Month, Agenda
} from "@syncfusion/ej2-vue-schedule";
import { props } from "@syncfusion/ej2-vue-schedule/src/schedule/schedule.component";

// Provide Syncfusion modules
provide('schedule', [Day, Week, WorkWeek, Month, Agenda]);

// Selected date for the scheduler
const selectedDate = ref(new Date());

// Reactive data for event settings
const eventSettings = ref({
  dataSource: []
});

// Owner data source (rooms mapped to owners)
const ownerDataSource = ref([]);

// Fetch and transform API data
// const props = defineProps({
//   rooms: {
//     type: Array,
//     required: true
//   },
//   meetings: {
//     type: Array,
//     required: true
//   },
// });

// const fetchMeetingData = async () => {
//   try {
//     const response = await fetch("/api/meeting-rooms"); // Adjust API endpoint if needed
//     const apiData = await response.json();

//     // Transform API response into Syncfusion Scheduler format
//     eventSettings.value.dataSource = apiData.data.list.map((meeting) => ({
//       Id: meeting.id,
//       Subject: meeting.agenda,
//       EventType: meeting.isRecurring ? "Recurring" : "Confirmed",
//       StartTime: new Date(meeting.startDateTime),
//       EndTime: new Date(meeting.endDateTime),
//       OwnerId: meeting.room.id, // Map to room ID
//     }));

//     // Populate the owner (rooms) list dynamically
//     ownerDataSource.value = apiData.data.list.reduce((acc, meeting) => {
//       if (!acc.some((owner) => owner.Id === meeting.room.id)) {
//         acc.push({
//           OwnerText: meeting.room.roomName,
//           Id: meeting.room.id,
//           OwnerColor: `#${meeting.room.hexColor}`,
//         });
//       }
//       return acc;
//     }, []);

//   } catch (error) {
//     console.error("Error fetching meetings:", error);
//   }
// };
// Fetch data on mount
// onMounted(fetchMeetingData);


</script>

<style>
@import '@syncfusion/ej2-base/styles/material.css';
@import '@syncfusion/ej2-buttons/styles/material.css';
@import '@syncfusion/ej2-calendars/styles/material.css';
@import '@syncfusion/ej2-dropdowns/styles/material.css';
@import '@syncfusion/ej2-inputs/styles/material.css';
@import '@syncfusion/ej2-navigations/styles/material.css';
@import '@syncfusion/ej2-popups/styles/material.css';
@import '@syncfusion/ej2-vue-schedule/styles/material.css';
</style>
