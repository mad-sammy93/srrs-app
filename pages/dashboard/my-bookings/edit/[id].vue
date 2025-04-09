<template>
  <div class="p-8">
    <div class="mb-4 text-gray-500">
      <a
        href="#"
        class="text-blue-500"
        >Dashboard</a
      >
      / <span>Edit Booking</span>
    </div>
    <div class="p-4 mb-4">
      <h1 class="text-4xl font-light mb-4 dark:text-white">Edit Booking</h1>
    </div>
    <div
      class="min-w-[1440px] mx-auto px-[100px] py-[50px] mt-[50px] bg-white dark:bg-slate-800 shadow-md rounded-lg"
    >
      <form @submit.prevent="submitEdit">
        <!-- Agenda -->
        <div class="mb-4">
          <label class="block font-normal text-gray-500 dark:text-white"
            >Agenda</label
          >
          <input
            v-model="form.agenda"
            type="text"
            class="input-field dark:bg-slate-600 dark:text-white"
            v-show="!loading"
            required
          />
          <div
            role="status"
            class="space-y-2.5 animate-pulse w-full"
            v-show="loading"
          >
            <div
              class="flex items-center w-full border rounded border-gray-600 p-3"
            >
              <div
                class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"
              ></div>
              <div
                class="h-4 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
              ></div>
              <div
                class="h-4 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
              ></div>
            </div>
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <!-- Select Room -->
        <div class="mb-4">
          <label class="block mb-2 text-gray-500 dark:text-white"
            >Select Room</label
          >
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="room in rooms"
              :key="room.id"
              :class="[
                'room-btn',
                form.roomId === room.id ? 'selected-room' : '',
                getRoomClass(room),
              ]"
              v-show="!loading"
              class="room-btn text-white text-shadow-sm"
              :style="`background: #${room.hexColor}95;border-left: 6px solid #${room.hexColor};border:2px solid #${room.hexColor};`"
              @click.prevent="form.roomId = room.id"
            >
              {{ room.roomName }} | Pax. {{ room.pax }}
            </button>

            <div
              role="status"
              class="space-y-2.5 animate-pulse max-w-lg"
              v-show="loading"
            >
              <div
                class="flex items-center w-full border rounded border-gray-600 p-3"
              >
                <div
                  class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
                ></div>
              </div>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>

        <!-- Recurring Meeting Toggle -->
        <div class="mb-4 flex items-center">
          <button
            v-if="!form.isRecurring"
            @click.prevent="
              showRecurrenceModal = true;
              form.isRecurring = true;
            "
            class="btn-primary border-2 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white px-4 py-2 rounded-md"
          >
            Add meetin recurrence
          </button>
          <button
            v-if="form.isRecurring"
            @click.prevent="
              showRecurrenceModal = true;
              form.isRecurring = true;
            "
            class="btn-secondary border-2 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white px-4 py-2 rounded-md"
          >
            Edit recurrence
          </button>
        </div>
        <UIModalRecurrence
          v-if="form.isRecurring"
          :show="showRecurrenceModal"
          @close="
            showRecurrenceModal = false;
            form.recurrencePatternId = 0;
            form.frequency = 0;
            form.weekdayId = 0;
            form.isRecurring = false;
          "
          @save="handleRecurrence"
        />
        <div
          v-if="form.isRecurring"
          class="text-gray-500 dark:text-white hidden"
        >
          Meeting will repeat every {{ form.frequency }} times
          {{ checkRecPattern(form.recurrencePatternId) }}
          {{ form.weekdayId ? `on ` + checkweekday(form.weekdayId) : "" }}
        </div>
        <!-- Meeting Date, Time and Members -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block font-normal text-gray-500 dark:text-white"
              >Meeting Date</label
            >
            <input
              v-model="form.meetingDate"
              type="date"
              class="input-field dark:bg-slate-600 dark:text-white"
              required
              v-show="!loading"
            />

            <div
              role="status"
              class="space-y-2.5 animate-pulse max-w-lg"
              v-show="loading"
            >
              <div
                class="flex items-center w-full border rounded border-gray-600 p-3"
              >
                <div
                  class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
                ></div>
              </div>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <div>
            <label class="block font-normal text-gray-500 dark:text-white"
              >Start Time</label
            >
            <input
              v-model="form.startTime"
              type="time"
              class="input-field dark:bg-slate-600 dark:text-white"
              required
              v-show="!loading"
            />

            <div
              role="status"
              class="space-y-2.5 animate-pulse max-w-lg"
              v-show="loading"
            >
              <div
                class="flex items-center w-full border rounded border-gray-600 p-3"
              >
                <div
                  class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
                ></div>
              </div>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <div>
            <label class="block font-normal text-gray-500 dark:text-white"
              >End Time</label
            >
            <input
              v-model="form.endTime"
              type="time"
              class="input-field dark:bg-slate-600 dark:text-white ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              required
              v-show="!loading"
            />

            <div
              role="status"
              class="space-y-2.5 animate-pulse max-w-lg"
              v-show="loading"
            >
              <div
                class="flex items-center w-full border rounded border-gray-600 p-3"
              >
                <div
                  class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"
                ></div>
                <div
                  class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
                ></div>
              </div>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
        <div class="my-4 max-w-[1240px]">
          <UIMoleculesMultiSelect
            :options="formattedOptions"
            @update:selected="handleSelected"
            v-show="!loading"
          />

          <div
            role="status"
            class="space-y-2.5 animate-pulse max-w-full"
            v-show="loading"
          >
            <div
              class="flex items-center w-full border rounded border-gray-600 p-3 flex-wrap"
            >
              <div class="flex items-center w-full max-w-[400px]">
                <div
                  class="h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
                ></div>
                <div
                  class="h-5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"
                ></div>
                <div
                  class="h-5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"
                ></div>
              </div>
            </div>

            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex flex-wrap justify-end">
          <button
            type="button"
            class="mr-4 border border-1 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white px-4 py-2 rounded-md"
            @click.prevent="cancelEdit"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="loading"
          >
            {{ loading ? "Updating..." : "Update Booking" }}
          </button>
        </div>
      </form>
      <div class="py-4 mb-5">
        <div class="flex items-center mt-4 space-x-4">
          <div
            role="status"
            class="space-y-2.5 animate-pulse max-w-lg"
            v-show="loading"
          >
            <div
              class="flex items-center w-full border rounded border-gray-600 p-3"
            >
              <span
                class="w-6 h-6 mr-2 bg-purple-200 rounded inline-block"
              ></span>
              <div
                class="h-2.5 ms-2 bg-green-300 rounded-full dark:bg-gray-600 w-24"
              ></div>
              <div
                class="h-2.5 ms-2 bg-yellow-300 rounded-full dark:bg-gray-600 w-full"
              ></div>
            </div>
            <span class="sr-only">Loading...</span>
          </div>
          <div
            v-for="room in rooms"
            :key="room.id"
            class="flex flex-wrap items-center dark:text-white"
          >
            <span
              class="w-6 h-6 bg-green-200 mr-2 rounded inline-block"
              :style="`background-color: #${room.hexColor}`"
            ></span
            >{{ room.roomName }} Room
          </div>
          <div class="flex flex-wrap items-center dark:text-white">
            <span class="w-6 h-6 mr-2 bg-gray-400 rounded inline-block"></span
            >Not Available
          </div>
          <div class="flex flex-wrap items-center dark:text-white">
            <span class="w-6 h-6 mr-2 bg-purple-200 rounded inline-block"></span
            >Selected Room
          </div>
        </div>
      </div>
      <!-- Confirmation Modal -->
      <div
        v-if="confirmModalVisible"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold mb-4 dark:text-white">
            Apply Changes
          </h3>
          <p class="text-gray-600 mb-4 dark:text-gray-300">
            Do you want to apply the changes to:
          </p>

          <div
            class="flex flex-col gap-3"
            v-if="form.isRecurring"
          >
            <button
              @click.prevent="confirmEdit('SELECTED')"
              class="btn-secondary dark:text-white"
            >
              Only this meeting
            </button>

            <button
              @click.prevent="confirmEdit('SELECTED_AND_UPCOMING')"
              class="btn-primary dark:text-white"
            >
              This and upcoming meetings
            </button>
          </div>

          <button
            v-if="!form.isRecurring"
            @click.prevent="confirmEdit('SELECTED')"
            class="mt-4 btn-primary"
          >
            Confirm
          </button>
          <button
            @click.prevent="confirmModalVisible = false"
            class="btn-secondary mt-4 text-gray-500 dark:text-white hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoomStore } from "@/stores/roomStore";
import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { useRoute } from "vue-router";
import type {
  FormData,
  UserDetail
} from "@/types";

const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

const confirmModalVisible = ref(false);
const selectedOption = ref("");

const rooms = storeToRefs(roomStore).roomList;
const users = storeToRefs(userStore).usersList;
const loading = ref(false);
const weekdays = [
  {
    id: 1,
    name: "Sunday",
  },
  {
    id: 2,
    name: "Monday",
  },
  {
    id: 3,
    name: "Tuesday",
  },
  {
    id: 4,
    name: "Wednesday",
  },
  {
    id: 5,
    name: "Thursday",
  },
  {
    id: 6,
    name: "Friday",
  },
  {
    id: 7,
    name: "Saturday",
  },
];
const route = useRoute();
const meetingId = Number(route.params.id);
const form = ref<FormData>({
  id: 0,
  agenda: "",
  meetingDate: "",
  meetingEndDate: "",
  startTime: "",
  endTime: "",
  roomId: 0,
  userId: 0,
  memberIds: [],
  isRecurring: false,
  option: "SELECTED",
  recurrencePatternId: undefined,
  frequency: undefined,
  weekdayId: undefined,
});

onMounted(async () => {
  loading.value = true;
  let params = {
    pageNo: 1,
    limit: 200,
  };
  await roomStore.fetchRoomsData();
  await userStore.fetchUsers(params);

  try {
    loading.value = true;
    const meeting = await meetingStore.fetchBookedMeetingWithId(meetingId);
    if (!meeting) {
      logMessage("Booking not found.", "error");
      setTimeout(() => {
        logMessage("Redirecting to dashboard", "info");
        navigateTo("/dashboard/my-bookings");
      }, 2000);
    }
    if (meeting) {
      // console.log('Fetching meeting:', meeting.data);
      form.value = {
        id: meetingId,
        agenda: meeting.data.agenda,
        meetingDate: meeting.data.meetingDate,
        meetingEndDate: meeting.data.meetingEndDate,
        startTime: convertTo24HourFormat(meeting.data.startDateTime),
        endTime: convertTo24HourFormat(meeting.data.endDateTime),
        roomId: meeting.data.room.id,
        userId: meeting.data.user?.id, // Add null check and default value
        memberIds: meeting.data.members.map((member: any) => member.id),
        isRecurring: meeting.data.isRecurring,
        option: form.value.isRecurring ? "SELECTED" : "SELECTED_AND_UPCOMING",
        recurrencePatternId: meeting.data.recurrencePattern?.id, // Add null check and default value
        frequency: meeting.data.frequency, // Add null check and default value
        weekdayId: meeting.data.weekday?.id, // Add null check and default value
      };

      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
    logMessage("Error fetching rooms", "error");
  }
});

const showRecurrenceModal = ref(false);
// Handle recurrence data
const handleRecurrence = (options: any) => {
  form.value.recurrencePatternId = options.frequency;
  form.value.frequency = options.until;
  form.value.weekdayId = options.weekdayId;
  showRecurrenceModal.value = false;
};

const checkRecPattern = (id: number | undefined) => {
  if (id === 1) {
    return "weekly";
  }
  if (id === 0) {
    return "daily";
  }
  if (id === 2) {
    return "monthly";
  }
  return "";
};
const handleSelected = (newSelected: UserDetail[]) => {
  // Ensure only IDs are stored in form.memberIds
  form.value.memberIds = newSelected.map((member: any) => member.id);
  console.log("Selected member IDs:", form.value.memberIds);
};
const formattedOptions = users.value?.map((user: any) => ({
  label: `${user.fullName} (${user.email})`,
  id: user.id,
  value: user.email,
}));

const checkweekday = (id: number | undefined) => {
  const day = weekdays.find((day) => day.id === id);
  return day?.name;
};
const validateForm = () => {
  form.value.recurrencePatternId = form.value.recurrencePatternId
    ? Number(form.value.recurrencePatternId)
    : undefined;

  if (!form.value.agenda || form.value.agenda.length > 40) {
    logMessage("Agenda must be between 1 to 40 characters.", "error");
    return false;
  }
  if (
    !form.value.meetingDate ||
    !/^\d{4}-\d{2}-\d{2}$/.test(form.value.meetingDate)
  ) {
    logMessage("Meeting Date must be in YYYY-MM-DD format.", "error");
    return false;
  }
  if (!form.value.startTime || !/^\d{2}:\d{2}$/.test(form.value.startTime)) {
    logMessage("Start Time must be in HH:MM (24-hour) format.", "error");
    return false;
  }
  if (!form.value.endTime || !/^\d{2}:\d{2}$/.test(form.value.endTime)) {
    logMessage("End Time must be in HH:MM (24-hour) format.", "error");
    return false;
  }
  if (!form.value.roomId || isNaN(Number(form.value.roomId))) {
    logMessage("Please select a valid room.", "error");
    return false;
  }

  // Recurrence validation
  if (form.value.isRecurring) {
    if (!form.value.recurrencePatternId) {
      logMessage("Please select a recurrence pattern.", "error");
      return false;
    }
    if (form.value.recurrencePatternId === 2 && !form.value.weekdayId) {
      logMessage("Please select a weekday for weekly recurrence.", "error");
      return false;
    }
    if (!form.value.meetingEndDate) {
      logMessage("Please select a meeting end date for recurrence.", "error");
      return false;
    }
    if (form.value.meetingEndDate <= form.value.meetingDate) {
      logMessage("Meeting end date must be after the start date.", "error");
      return false;
    }
  }

  return true;
};

const cancelEdit = () => {
  navigateTo("/dashboard/my-bookings");
};
const recurrencePatterns = ref([
  {
    id: 1,
    name: "Daily",
    patternId: 1,
  },
  {
    id: 2,
    name: "Weekly",
    patternId: 2,
  },
  {
    id: 3,
    name: "Monthly",
    patternId: 3,
  },
]);

const convertTo24HourFormat = (time: string) => {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const submitEdit = () => {
  confirmModalVisible.value = true;
};

const confirmEdit = async (option: string) => {
  if (!validateForm()) return;
  selectedOption.value = option;
  confirmModalVisible.value = false;
  loading.value = true;

  const { data: response, error } = await meetingStore.editBookedMeetingRoom(
    meetingId,
    {
      ...form.value,
      option: selectedOption.value, // Send selected option to API
      meetingEndDate: form.value.isRecurring
        ? form.value.meetingEndDate
        : form.value.meetingDate,
    }
  );

  if (response) {
    loading.value = false;
    logMessage(response, "success"); // 🔥 Use the logger utility
  } else if (error) {
    logMessage(error, "error"); // 🔥 Use the logger utility
    loading.value = false;
  }
};

const getRoomClass = (roomName: any) => {
  // if (room.isAvailable === false) return "room-unavailable";
  const colors = [
    {
      id: 1,
      roomName: "Diversity",
      className: "diversity",
    },
    {
      id: 2,
      roomName: "Excellence",
      className: "excellence",
    },
    {
      id: 3,
      roomName: "Positive_Attitude",
      className: "positive-attitude",
    },
  ];
  return colors.find((color) => color.roomName === roomName)?.className; //match name with roomName and return class name
};

useHead({ title: "Edit Booking" });
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
}
.btn-primary {
  background-color: #35464d;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #007bff;
}
.room-btn {
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}
.room-unavailable {
  background-color: #dc3545;
  color: white;
}
.selected-room {
  border-left-width: 10px !important;
  color: white;
  text-shadow: rgba(0, 0, 0, 0.601) 2px 2px 10px;
}
</style>
