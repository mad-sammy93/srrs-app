<template>
  <div>
    <div class="overflow-x-auto min-w-[1440px] min-h-[350px]">
      <div class="flex justify-between items-center mb-4">
        <h3
          v-if="title"
          class="text-2xl font-semibold mb-4 dark:text-white"
        >
          {{ title }}
        </h3>
        <div class="flex justify-between gap-2">
          <div class="filter">
            <input
              type="text"
              :value="filter.searchTerm"
              @input="updateFilter($event, 'searchTerm')"
              placeholder="Search by Meeting agenda or Room Name"
              class="p-2 border border-gray-300 rounded-md"
            />
            <button
            class="p-2 ml-2 bg-blue-500 text-white rounded-md"
            @click.prevent="applyFilters"
          >
            Search
          </button>
          </div>
          <!-- Filter Button + Accordion -->
          <div class="relative">
            <button
              @click.prevent="showFilter = !showFilter"
              class="px-4 py-2 border rounded-md bg-white dark:bg-slate-900 dark:text-white"
            >
              Filter
            </button>

            <div
              v-if="showFilter"
              class="absolute z-10 right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4"
            >
              <!-- Accordion Group -->
              <div>
                <!-- Room Name -->
                <div class="mb-2">
                  <button
                    @click.prevent="toggleAccordion('roomFilter')"
                    class="w-full flex justify-between items-center font-semibold"
                  >
                    Room Name
                    <span>{{ openAccordion.roomFilter ? "−" : "+" }}</span>
                  </button>
                  <div
                    v-show="openAccordion.roomFilter"
                    class="mt-2 pl-2"
                  >
                    <select
                      v-model="filters.roomId"
                      class="border rounded w-full p-1"
                    >
                      <option value="">All Rooms</option>
                      <option
                        v-for="room in uniqueRooms"
                        :key="room.roomId"
                        :value="room.roomId"
                      >
                        {{ room.roomName }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="mb-2">
                  <button
                    @click.prevent="toggleAccordion('date')"
                    class="w-full flex justify-between items-center font-semibold"
                  >
                    Date
                    <span>{{ openAccordion.date ? "−" : "+" }}</span>
                  </button>
                  <div
                    v-show="openAccordion.date"
                    class="mt-2 pl-2"
                  >
                    <label>From date
                      <input
                        type="date"
                        v-model="filters.fromDate"
                        class="border rounded p-1 w-full"
                      />
                      </label
                    >
                    <label>To date
                      <input
                        type="date"
                        v-model="filters.toDate"
                        class="border rounded p-1 w-full"
                      /></label
                    >
                  </div>
                </div>
                <!-- Status -->
                <div class="mb-2">
                  <button
                    @click.prevent="toggleAccordion('status')"
                    class="w-full flex justify-between items-center font-semibold"
                  >
                    Status
                    <span>{{ openAccordion.status ? "−" : "+" }}</span>
                  </button>
                  <div
                    v-show="openAccordion.status"
                    class="mt-2 pl-2"
                  >
                    <select
                      v-model="filters.status"
                      class="border rounded w-full p-1"
                    >
                      <option value="">All Statuses</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <!-- Filter Buttons -->
                <div class="flex justify-between mt-4">
                  <button
                    @click.prevent="clearFilters"
                    class="px-3 py-1 text-gray-600 rounded-md border"
                  >
                    Clear
                  </button>
                  <button
                    @click.prevent="applyFilters"
                    class="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <table
        class="min-w-full bg-white border dark:bg-slate-800 dark:text-white border-gray-300 text-gray-500"
        v-if="!loading"
      >
        <thead
          class="bg-white font-extrabold text-gray-700 dark:bg-slate-900 dark:text-white"
        >
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
            <td class="p-3 border text-center">
              {{ meeting.startDateTime.slice(0, 10) }}
            </td>
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
              <span
                class="flex justify-center items-center border-solid border-2 rounded-lg space-x-0"
                :class="{
                  'border-green-600': meetingStatus[index].value === 'UPCOMING',
                  'border-blue-600':
                    meetingStatus[index].value === 'IN_PROGRESS',
                  'border-gray-600': meetingStatus[index].value === 'COMPLETED',
                }"
              >
                <span
                  class="flex w-2 h-2 mr-4 rounded-full"
                  :class="{
                    'bg-green-600': meetingStatus[index].value === 'UPCOMING',
                    'bg-blue-600': meetingStatus[index].value === 'IN_PROGRESS',
                    'bg-gray-600': meetingStatus[index].value === 'COMPLETED',
                  }"
                  aria-hidden="true"
                  tooltip="Online"
                ></span>
                {{ meetingStatus[index].label }}
              </span>
            </td>
            <td class="p-3 border flex justify-around text-center">
              <button
                class="text-blue-600 hover:underline mr-2"
                @click.prevent="$emit('edit', meeting)"
                :disabled="meetingStatus[index].value !== 'UPCOMING'"
              >
                <UIAtomsIconsEditBooking
                  :color="
                    meetingStatus[index].value !== 'UPCOMING'
                      ? 'gray'
                      : '#60a5fa'
                  "
                />
              </button>
              <button
                class="text-red-600 hover:underline"
                @click.prevent="confirmDelete(meeting)"
                :disabled="meetingStatus[index].value !== 'UPCOMING'"
              >
                <UIAtomsIconsDeleteBooking
                  :color="
                    meetingStatus[index].value !== 'UPCOMING' ? 'gray' : 'red'
                  "
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        class="min-w-full bg-white border border-gray-300 text-gray-500 dark:bg-slate-800 dark:text-white"
        v-else
      >
        <thead
          class="bg-white font-extrabold text-gray-700 dark:bg-slate-900 dark:text-white"
        >
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
          <label
            class="flex items-center mb-2"
            v-show="selectedMeeting?.isRecurring"
          >
            <input
              type="radio"
              v-model="deleteOption"
              value="SELECTED"
              class="mr-2"
              checked
            />
            Delete only this event
          </label>

          <!-- Show this option only if the meeting is recurring -->
          <label
            v-if="selectedMeeting?.isRecurring"
            class="flex items-center"
          >
            <input
              type="radio"
              v-model="deleteOption"
              value="SELECTED_AND_UPCOMING"
              class="mr-2"
            />
            Delete this and all upcoming events
          </label>
        </div>

        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 mr-2 bg-gray-300 rounded-md"
            .prevent="showDeleteModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-md"
            @click.prevent="deleteMeeting"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4 dark:text-white">
      <button
        @click.prevent="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 dark:bg-blue-500"
      >
        Previous
      </button>

      <span> Page {{ currentPage }} of {{ totalPages }} </span>

      <button
        @click.prevent="nextPage"
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
import rooms from "~/server/api/Authenticated/rooms";

const showDeleteModal = ref(false);
const selectedMeeting = ref<Meeting | null>(null);
const deleteOption = ref<"SELECTED" | "SELECTED_AND_UPCOMING">("SELECTED");
const disabledDelete = ref(false);

const confirmDelete = (meeting: Meeting) => {
  if (!meetingStatus) return noDeleteMeeting();

  selectedMeeting.value = meeting;
  showDeleteModal.value = true;

  // Show "Delete this and all upcoming meetings" only if the meeting is recurring
  if (meeting.isRecurring) {
    deleteOption.value = "SELECTED_AND_UPCOMING";
  } else {
    deleteOption.value = "SELECTED";
  }
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
  logMessage("Cannot delete meeting", "warning");
  setTimeout(() => {
    disabledDelete.value = false;
  }, 2000);
};
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
    type: Object as () => {
      searchTerm: string;
      roomId: number;
      status: string;
      fromDate: string;
      toDate: string;
    },
    required: true,
  },
  rooms: {
    type: Object as () => { id: number; roomName: string , pax: number, hexColor: string}[],
    required: true,
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
  "filterMeetings",
  "update:filter",
  "fetchPageData",
]);

// Pagination settings
const currentPage = computed(() => props.currentPage);
const totalPages = computed(() => props.totalPages);

// Computed: Meetings for the current page
const paginatedMeetings = computed(() => props.meetings);
interface Filters {
  [key: string]: string | number;
}
const updateFilter = (event: Event, filterKey: keyof typeof filters.value) => {

  // console.log("Search term:", filters.value);
  const target = event.target as HTMLInputElement | null;
  if (target) {
    filters.value[filterKey] = target.value; // Safely update the filter value
  }
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

    if (now < startDate) return { label: "Upcoming", value: "UPCOMING" };
    if (now >= startDate && now < endDate)
      return { label: "In Progress", value: "IN_PROGRESS" };
    return { label: "Completed", value: "COMPLETED" };
  });
});

const showFilter = ref(false);
const openAccordion = ref({
  roomFilter: true,
  date: false,
  status: false,
});

// Define filters type to allow dynamic keys with string values
const filters = ref<Filters>({
  searchTerm: "",
  roomId: 0,
  status: "",
  fromDate: "",
  toDate: "",
});

const toggleAccordion = (section: keyof typeof openAccordion.value) => {
  openAccordion.value[section] = !openAccordion.value[section];
};

const clearFilters = () => {
  filters.value = {
    roomId: 0,
    status: "",
    fromDate: "",
    toDate: "",
  };
  applyFilters();
};

const applyFilters = () => {
  const activeFilters = {
    searchTerm: filters.value.searchTerm,
    roomId: filters.value.roomId,
    status: filters.value.status,
    fromDate: filters.value.fromDate,
    toDate: filters.value.toDate,
  };

  emit("filterMeetings", activeFilters); // Emit the filter values to parent
};

const uniqueRooms = computed(() => {
  return Array.from(
    new Set(props.rooms.map((m) => m.id)) // Ensure no duplicate room IDs
  ).map((roomId) => {
    return {
      roomId,
      roomName: props.rooms.find((m) => m.id === roomId)?.roomName,
    };
  });
});
</script>
