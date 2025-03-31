<template>
  <div class="py-[25px] mx-auto max-w-[1440px]">
    <!-- <pre>{{ userData }}</pre> -->
    <!-- <pre>{{ eventSettings.dataSource }}</pre> -->
    <ejs-schedule
      height="550px"
      width="100%"
      :currentDate="currentDate"
      :views="viewModes"
      :showTimeIndicator="true"
      :selectedDate="selectedDate"
      :renderCell="onRenderCell"
      :eventSettings="eventSettings"
      :eventRendered="eventRendered"
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
          :field="resources.OwnerId"
          :title="Owner"
          :name="Owners"
          :dataSource="ownerDataSource"
          :textField="OwnerText"
          :idField="id"
          :colorField="OwnerColor"
        >
        </e-resource>
      </e-resources> -->
      
    </ejs-schedule>
  </div>
</template>
<script setup lang="ts">
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
import type {EventRenderedArgs} from '@syncfusion/ej2-schedule';
import type { Meeting } from "@/types";
import { ref, watch, provide, toRaw } from "vue";
import { createElement } from '@syncfusion/ej2-base';

import type{ RenderCellEventArgs } from '@syncfusion/ej2-schedule';
// ✅ Define Props
const meetingProps = defineProps({
  meetings: Array,
  userData: Object,

});

const onRenderCell = (args: RenderCellEventArgs) => {
  if (args.elementType == "currentDay") {
    let ele: any = createElement("div", {
      className: "e-current-day",
    //   styles: "border: 1px solid red;background: red; height  : 100%;",
    //   className: "templatewrap",
    });
    args.element.appendChild(ele);
  }
  if (args.elementType == "workCells" || args.elementType == "monthCells") {
    let weekEnds: number[] = [0, 6];
    if (args.date && weekEnds.indexOf(args.date.getDay()) >= 0) {
      let ele: any = createElement("div", {
        styles: "background: #2196f3",//blue
        className: "templatewrap",
      });
      args.element.appendChild(ele);
    }
  }
  if (args.elementType == "workCells" || args.elementType == "monthCells") {
        // To change the color of weekend columns in week view
        if (args.date) {
            if (args.date.getDay() === 6) {
              (args.element as HTMLElement).style.background = '#FFE7E7';
            }
            if (args.date.getDay() === 0) {
              (args.element as HTMLElement).style.background = '#FFE7E7';
            }
        }
        
    }
};

// ✅ Reactive Data for Meetings (initialized to avoid early access)
const meetingData = ref(
  Array.isArray(meetingProps.meetings) ? meetingProps.meetings.map(toRaw) : []
);
let toolTipTemplate: string = '<div class="tooltip-wrap">' +
    '<div class="content-area">${subject}' +
    '${if(City !== null && City !== undefined)}<div class="city">${City}</div>${/if}' +
    '<div class="time">From : ${startTime.toLocaleString()} </div>' +
    '<div class="time">To   : ${endTime.toLocaleString()} </div></div></div>';
    

// ✅ Initialize Event Settings Before Using It
const eventSettings = ref({
  dataSource: meetingData.value, // This will be updated in the watch function
  // enableTooltip: true,
  tooltipTemplate: toolTipTemplate,
  allowEditing: false,
  allowadding: false,
  allowDeleting: false,
  allowDragAndDrop: false,
  allowResizing: false,
  currentView: "Week",
  readonly: true,
  fields: {
    id: "id",
    subject: { name: "agenda" },
    startTime: { name: "startTime" },
    endTime: { name: "endTime" },
    location: { name: "location" },
    color: { name: "color" }, // Ensure color is mapped
  },
});
const eventRendered = (args: EventRenderedArgs) => applyCategoryColor(args);

function applyCategoryColor(args: EventRenderedArgs): void {
  const eventColor = args.data.color; // Get color from event data

  if (args.element && eventColor) {
    args.element.style.color = `#fff`;
    args.element.style.backgroundColor = `#${eventColor}90`; // Apply background color
    args.element.style.borderLeft = `4px solid #${eventColor}`; // Add a left border for better visibility
    args.element.style.borderRadius = `7px`;
  }
}

// ✅ Watch for Changes in Meetings and Update Scheduler Data
watch(
  () => meetingProps.meetings,
  (newMeetings) => {
    if (Array.isArray(newMeetings)) {
      meetingData.value = newMeetings.map((meeting: any) => ({
        ...toRaw(meeting),
        id: meeting.id,
        startTime: new Date(meeting.startDateTime),
        endTime: new Date(meeting.endDateTime),
        location: meeting.room?.roomName || "No Room",
        color: meeting.room?.hexColor || "#cccccc", // Ensure a valid color
      }));
    }
    eventSettings.value = { ...eventSettings.value, dataSource: [...meetingData.value] };
  },
  { deep: true, immediate: true }
);

interface Owner {
  Id: number;
  OwnerText: string;
  OwnerColor: string;
}
// ✅ Ensure updates on user data changes (owners/rooms)
// const ownerDataSource = ref<Owner[]>([]);

// watch(
//   () => meetingProps.userData,
//   (newUserData) => {
//     if (newUserData && Array.isArray(newUserData.usersList)) {
//       ownerDataSource.value = newUserData.usersList.map(toRaw);
//     } else {
//       ownerDataSource.value = []; // Reset if invalid
//     }
//   },
//   { deep: true, immediate: true }
// );

// ✅ Provide Syncfusion Modules
provide("schedule", [Day, Week, WorkWeek, Month, Agenda]);

// ✅ Selected Date for Scheduler
const selectedDate = ref(new Date());
const currentDate = ref(new Date());

// currentDate: new Date(2025, 1, 15),

const viewModes = ref(["Day", "Week", "Month"]);
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
/* Header */
/* .e-schedule .e-toolbar {
    background-color: white;
    border-bottom: 2px solid #dfe3e8;
}

.e-schedule .e-toolbar .e-tbar-btn {
    background-color: white;
    color: black;
    font-weight: bold;
}

.e-schedule .e-toolbar .e-active {
    background-color: #007bff !important;
    color: white !important;
} */

/* Sidebar */
/* .e-schedule .e-sidebar {
    background-color: #2d7ebf;
    color: white;
} */

/* Weekend Highlight */
/* .e-work-cells.e-weekend {

    background-color: #f8e7e7 !important;
} */

/* Selected Day Border */
.e-current-day {
  /* border: 2px solid #007bff !important; */
  color: #437DD6 !important;
}
/* .schedule-cell-customization.e-schedule .e-month-view .e-work-cells:not(.e-work-days) {
    background-color: #f08080;
} */
/* Event Colors */
.e-appointment[room="A"] {
    background-color: #cce5ff;
    color: #004085;
}

/* .e-appointment[room="B"] {
    background-color: #d4edda;
    color: #155724;
} */

/* .e-appointment[room="C"] {
    background-color: #f8d7da;
    color: #721c24;
}

.e-appointment[room="D"] {
    background-color: #e2d5f5;
    color: #4b0082;
}

.e-appointment[room="E"] {
    background-color: #d1ecf1;
    color: #0c5460;
} */

/* Book Room Button */
/* .book-room-btn {
    background-color: black;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
} */
.router-link-exact-active {
  background-color: #007bff !important;
}
</style>
