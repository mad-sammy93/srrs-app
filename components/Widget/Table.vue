<template>
  <div>
    <UIModalLogger :message="logger.message" :type="logger.type"/>
    <div class="overflow-x-auto min-w-[1440px]">
      <div class="flex justify-between items-center mb-4">
        <!-- paginatedMeetings: {{ paginatedMeetings }} -->
        <h3
          v-if="title"
          class="text-2xl font-semibold mb-4 dark:text-white"
        >
          {{ title }}
        </h3>
        <div class="filter">
          <input
            type="text"
            :value="filter"
            @input="updateFilter($event)"
            placeholder="Search..."
            class="p-2 border border-gray-300 rounded-md"
          />
          <button
            class="p-2 ml-2 bg-blue-500 text-white rounded-md"
            @click="searchMeetings(filter)"
          >
            Search
          </button>
        </div>
      </div>

      <table
        class="min-w-full bg-white border dark:bg-slate-800 dark:text-white border-gray-300 text-gray-500"
        v-if="!loading"
      >
        <thead class="bg-white font-extrabold text-gray-700 dark:bg-slate-900 dark:text-white">
          <tr>
            <!-- <th class="p-3 border">ID</th> -->
            <th class="p-3 border">Room Name</th>
            <th class="p-3 border">Date</th>
            <th class="p-3 border">Start Time</th>
            <th class="p-3 border">End Time</th>
            <th class="p-3 border">Booked Date & Time</th>
            <th class="p-3 border">Pax</th>
            <th class="p-3 border">Meeting Agenda</th>
            <th class="p-3 border">Status</th>
            <th class="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(meeting, index) in paginatedMeetings"
            :key="index"
            class="hover:bg-gray-100 font-normal dark:hover:text-black"
          >
            <td class="p-3 border text-center">{{ meeting.room.roomName }}</td>
            <td class="p-3 border text-center">{{ meeting.startDateTime.slice(0, 10) }}</td>
            <td class="p-3 border text-center">
              {{
                new Date(meeting.startDateTime).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </td>
            <td class="p-3 border text-center">
              {{
                new Date(meeting.endDateTime).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </td>
            <td class="p-3 border text-center">
              {{ meeting.createdAt.slice(0, 10) }} ,
              {{ meeting.createdAt.slice(11, 16) }}
            </td>
            <td class="p-3 border text-center">{{ meeting.paxCount }}</td>
            <td class="p-3 border text-center">{{ meeting.agenda }}</td>
            <td class="p-3 border text-center">
              <span class="flex justify-center items-center">
                <span
                  class="flex w-2 h-2 mr-4 rounded-full"
                  :class="{
                    'bg-green-600': meetingStatus[index] === 'Upcoming',
                    'bg-blue-600': meetingStatus[index] === 'In Progress',
                    'bg-gray-600': meetingStatus[index] === 'Completed',
                  }"
                  aria-hidden="true"
                  tooltip="Online"
                ></span>
                {{ meetingStatus[index] }}
              </span>
            </td>
            <td class="p-3 border flex justify-around text-center">
              <button
                class="text-blue-600 hover:underline mr-2"
                @click="$emit('edit', meeting)"
              >
                <UIAtomsIconsEditBooking :color="`#60a5fa`"/>
              </button>
              <button
                class="text-red-600 hover:underline"
                @click="confirmDelete(meeting)"
                :disabled="meetingStatus[index] !== 'Upcoming'"
              >
                <UIAtomsIconsDeleteBooking :color="meetingStatus[index] !== 'Upcoming' ? 'gray' : 'red'"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="min-w-full bg-white border border-gray-300 text-gray-500 dark:bg-slate-800 dark:text-white" v-else>
        <thead class="bg-white font-extrabold text-gray-700  dark:bg-slate-900 dark:text-white">
          <tr>
            <!-- <th class="p-3 border">ID</th> -->
            <th class="p-3 border">Room Name</th>
            <th class="p-3 border">Date</th>
            <th class="p-3 border">Start Time</th>
            <th class="p-3 border">End Time</th>
            <th class="p-3 border">Booked Date & Time</th>
            <th class="p-3 border">Pax</th>
            <th class="p-3 border">Meeting Agenda</th>
            <th class="p-3 border">Status</th>
            <th class="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="n in 5"
            :key="n"
            class="animate-pulse"
          >
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-10"></div>
            </td>
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </td>
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-20"></div>
            </td>
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-16"></div>
            </td>
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-16"></div>
            </td>
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </td>
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-10"></div>
            </td>
            <td class="p-3 border">
              <div class="h-4 bg-gray-300 rounded w-32"></div>
            </td>
            <td class="p-3 border flex justify-center space-x-2">
              <div class="h-4 bg-gray-300 rounded w-8"></div>
              <div class="h-4 bg-gray-300 rounded w-8"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
    >
      <div class="fixed w-full h-full blur-md"></div>
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm z-0">
        <h2 class="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p class="mb-4">Are you sure you want to delete this meeting?</p>

        <!-- Delete Options -->
        <div class="mb-4">
          <label class="flex items-center mb-2">
            <input
              type="radio"
              v-model="deleteOption"
              value="SELECTED"
              class="mr-2"
              checked
            />
            Delete only this meeting
          </label>
          <label class="flex items-center">
            <input
              type="radio"
              v-model="deleteOption"
              value="SELECTED_AND_UPCOMING"
              class="mr-2"
            />
            Delete this and all upcoming meetings
          </label>
        </div>

        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 mr-2 bg-gray-300 rounded-md"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-md"
            @click="deleteMeeting"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4 dark:text-white">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 dark:bg-blue-500"
      >
        Previous
      </button>

      <span> Page {{ currentPage }} of {{ totalPages }} </span>

      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 dark:bg-blue-500"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Meeting } from "@/types";

const showDeleteModal = ref(false);
const selectedMeeting = ref<Meeting | null>(null);
const deleteOption = ref<"SELECTED" | "SELECTED_AND_UPCOMING">("SELECTED");
const disabledDelete = ref(false);
const logger = ref({
  message: "" as string | undefined,
  type: "error",
  duration: 3000,
})

const confirmDelete = (meeting: Meeting) => {
  if(!meetingStatus.value.includes('Upcoming')) return noDeleteMeeting();
  selectedMeeting.value = meeting;
  showDeleteModal.value = true;
  deleteOption.value = "SELECTED";
};
const deleteMeeting = () => {
  if (!selectedMeeting.value) return;

  if (deleteOption.value === "SELECTED") {
    // add option in selected meeting object
    emit("cancel", selectedMeeting.value, deleteOption.value);
  } else if (deleteOption.value === "SELECTED_AND_UPCOMING") {
    emit("cancel", selectedMeeting.value, deleteOption.value);
  }
  showDeleteModal.value = false;
  selectedMeeting.value = null;
};
const noDeleteMeeting = () => {
  disabledDelete.value = true;
  logger.value.message = 'Cannot delete meeting';
  logger.value.type = 'warning';
  setTimeout(() => {
    disabledDelete.value = false;
  }, 2000);

}
const props = defineProps({
  meetings: {
    type: Array as () => Meeting[],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  filter: {
    type: String,
    default: "",
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "fetchPageData",
  "edit",
  "cancel",
  "searchMeetings",
  "update:filter",
  "fetchPageData",
]);

// Pagination settings
// const itemsPerPage = computed(() => props.itemsPerPage);
const currentPage = computed(() => props.currentPage);
const totalPages = computed(() => props.totalPages);

watch(
  () => props.totalPages,
  (newTotalPages, oldTotalPages) => {
  //   logMessage(
  //     `Total pages changed from ${oldTotalPages} to ${newTotalPages}`
  //   ,'info');
  }
);

watch(
  () => props.currentPage,
  (newCurrentPage, oldCurrentPage) => {
    // logMessage(
    //   `Current page changed from ${oldCurrentPage} to ${newCurrentPage}`
    //   ,'info');
  }
);

// Computed: Meetings for the current page
const paginatedMeetings = computed(() => props.meetings);

const updateFilter = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    emit("update:filter", target.value);
  }
};

const searchMeetings = (searchTerm: string) => {
  emit("searchMeetings", searchTerm);
};

// Pagination controls
const prevPage = () => {
  if (props.currentPage > 1) {
    emit("fetchPageData", props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit("fetchPageData", props.currentPage + 1);
  }
};

// Compute Meeting Status
const meetingStatus = computed(() => {
  return props.meetings.map((meeting: Meeting) => {
    const startDate = new Date(meeting.startDateTime);
    const endDate = new Date(meeting.endDateTime);
    const now = new Date();

    if (now < startDate) return "Upcoming";
    if (now >= startDate && now < endDate) return "In Progress";
    return "Completed";
  });
});
</script>
