<template>
  <div class="py-[25px] mx-auto max-w-[1440px]">
    <!-- <pre>{{ meetingProps.userData }}</pre> -->
    <ejs-schedule
      height="550px"
      width="100%"
      :currentDate="currentDate"
      :views="views"
      :resources="resources"
      
      :showTimeIndicator="true"
      :selectedDate="selectedDate"
      :eventSettings="eventSettings"
    >
      <!-- <e-views>
        <e-view option="Day"></e-view>
        <e-view option="Week"></e-view>
        <e-view option="WorkWeek"></e-view>
        <e-view option="Month"></e-view>
        <e-view option="Agenda"></e-view>
      </e-views> -->
      <!-- <e-resources>
        <e-resource
          field="OwnerId"
          title="Owner"
          name="Owners"
          :dataSource="ownerDataSource"
          textField="OwnerText"
          idField="Id"
          colorField="OwnerColor"
        >
        </e-resource>
      </e-resources> -->
    </ejs-schedule>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import {
  ScheduleComponent as EjsSchedule,
  ViewsDirective as EViews,
  ViewDirective as EView,
  ResourcesDirective as EResources,
  ResourceDirective as EResource,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
} from "@syncfusion/ej2-vue-schedule";
import { props } from "@syncfusion/ej2-vue-schedule/src/schedule/schedule.component";

const meetingProps = defineProps({
  meetings: Object,
  userData: Object
});

// Provide Syncfusion modules
provide("schedule", [Day, Week, WorkWeek, Month, Agenda]);

// Selected date for the scheduler
const selectedDate = ref(new Date());


const meetingData = ref([]); // Initialize meetingData as an empty array
meetingData.value = meetingProps.meetings

// Reactive data for event settings
const eventSettings = ref({
  dataSource: meetingData.value,
  fields: {
    id: "id",
    subject: { name: "agenda" }, 
    startTime: { name: "startDateTime" },
    endTime: { name: "endDateTime" },
    isAllDay: { name: "isAllDay", defaultValue: false },
    location: { name: "room.roomName" },
    color: { name: "room.hexColor" }, // Use room color
  }
});

const resources = ref([
  {
    field: "OwnerId",
    title: "Owner",
    name: "Owners",
    dataSource: meetingProps.userData,
    textField: "OwnerText",
    idField: "Id",
    colorField: "OwnerColor",
  },
]);

// views: ['Week', 'TimelineWeek', 'Month', 'TimelineMonth'],
const views = ref(["Month", "Agenda"]);
// Owner data source (rooms mapped to owners)
const ownerDataSource = ref([]); //userData
ownerDataSource.value = meetingProps.userData
</script>

<style>
@import "@syncfusion/ej2-base/styles/material.css";
@import "@syncfusion/ej2-buttons/styles/material.css";
@import "@syncfusion/ej2-calendars/styles/material.css";
@import "@syncfusion/ej2-dropdowns/styles/material.css";
@import "@syncfusion/ej2-inputs/styles/material.css";
@import "@syncfusion/ej2-navigations/styles/material.css";
@import "@syncfusion/ej2-popups/styles/material.css";
@import "@syncfusion/ej2-vue-schedule/styles/material.css";
</style>
