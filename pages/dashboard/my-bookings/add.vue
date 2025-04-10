<template>
  <div class="p-8">
    <div class="mb-4 text-gray-500">
      <NuxtLink
        to="/dashboard"
        class="text-blue-500"
        >Dashboard</NuxtLink
      >
      / <span>Book Room</span>
    </div>
    <div class="p-4 mb-4">
      <h1 class="text-4xl font-light mb-4 dark:text-white">Book Room</h1>
    </div>
    <div
      class="min-w-[1440px] mx-auto px-[100px] py-[50px] mt-[50px] bg-white dark:bg-slate-800 shadow-md rounded-lg"
    >
      <form @submit.prevent="submitBooking">
        <!-- Agenda -->
        <div class="mb-4">
          <label class="block font-normal text-gray-500 dark:text-white"
            >Agenda</label
          >
          <input
            v-model="form.agenda"
            type="text"
            class="input-field dark:bg-slate-600 dark:text-white"
            required
          />
        </div>

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
              class="room-btn text-white text-shadow-sm"
              :style="`background: #${room.hexColor}95;border-left: 6px solid #${room.hexColor};border:2px solid #${room.hexColor};`"
              @click.prevent="form.roomId = room.id"
            >
              {{ room.roomName }} | Pax. {{ room.pax }}
            </button>
          </div>
        </div>
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
            form.meetingEndDate = '';
            form.isRecurring = false;
          "
          @save="handleRecurrence"
        />
        <!-- <div
          v-if="form.isRecurring"
          class="text-gray-500 dark:text-white"
        >
          Meeting will repeat {{ form.frequency }} times
          {{ checkRecPattern(form.recurrencePatternId) }}
          {{ form.weekdayId ? `on ` + checkweekday(form.weekdayId) : "" }}
        </div> -->
        <div
          class="grid gap-4 grid-cols-3"
        >
          <div class="mb-4">
            <label class="block font-normal text-gray-500 dark:text-white"
              >Meeting Date</label
            >
            <input
              v-model="form.meetingDate"
              type="date"
              class="input-field dark:bg-slate-600 dark:text-white"
              required
            />
          </div>
          <!-- <div
            v-if="form.isRecurring"
            class="mb-4"
          >
            <label class="block font-normal text-gray-500 dark:text-white"
              >Meeting End Date</label
            >
            <input
              v-model="form.meetingEndDate"
              type="date"
              class="input-field dark:bg-slate-600 dark:text-white"
            />
          </div> -->
          <div>
            <label class="block font-normal text-gray-500 dark:text-white"
              >Start Time</label
            >
            <input
              v-model="form.startTime"
              type="time"
              class="input-field dark:bg-slate-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block font-normal text-gray-500 dark:text-white"
              >End Time</label
            >
            <input
              v-model="form.endTime"
              type="time"
              class="input-field dark:bg-slate-600 dark:text-white"
              required
            />
          </div>
        </div>
        <div class="my-4 max-w-[1240px]">
          <UIMoleculesMultiSelect
            :options="formattedOptions"
            @update:selected="handleSelected"
          />
        </div>
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          {{ loading ? "Booking..." : "Book Meeting" }}
        </button>
      </form>
      <div class="py-4 mb-5">
        <div class="flex items-center mt-4 space-x-4">
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
          <!-- <div class="flex flex-wrap items-center dark:text-white">
            <span class="w-6 h-6 mr-2 bg-gray-400 rounded inline-block"></span
            >Not Available
          </div>
          <div class="flex flex-wrap items-center dark:text-white">
            <span class="w-6 h-6 mr-2 bg-purple-200 rounded inline-block"></span
            >Selected Room
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoomStore } from "@/stores/roomStore";
import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { useAuthStore } from "@/stores/authStore";
import type { FormData, UserDetail } from "@/types";

const authStore = useAuthStore();
const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

const rooms = storeToRefs(roomStore).roomList;
const users = storeToRefs(userStore).usersList;

//Watch  storeToRefs(userStore).usersList and upadte users
watch(
  () => userStore.usersList,
  (newVal) => {
    console.log("Users updated:", newVal);
    users.value = newVal;
  },
  { immediate: true } // This ensures the watcher triggers immediately
);
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
const loading = ref(false);

onMounted(() => {
  let userParams = {
    pageNo: 1,
    limit: 100,
    userStatusId: 1,
  };
  roomStore.fetchRoomsData();
  userStore.fetchUsers(userParams); //fetch all users
});

const handleSelected = (newSelected: UserDetail[]) => {
  // Ensure only IDs are stored in form.memberIds
  form.value.memberIds = newSelected.map((member: any) => member.id);
  // console.log("Selected member IDs:", form.value.memberIds);
};

const checkweekday = (id: number | undefined) => {
  const day = weekdays.find((day) => day.id === id);
  return day?.name;
};

const formattedOptions = users.value?.map((user: any) => ({
  label: `${user.fullName} (${user.email})`,
  id: user.id,
  value: user.email,
}));

const sanitizeInput = (input: string) => {
  return input.replace(/<\/?[^>]+(>|$)/g, "").replace(/[^\w\s.,!?'"@()-]/g, "");
};

const showRecurrenceModal = ref(false);
// Handle recurrence data
const handleRecurrence = (options: any) => {
  // console.log("Recurrence data:", options);
  form.value.meetingEndDate = options.meetingEndDate;
  form.value.recurrencePatternId = options.frequency;
  form.value.frequency = options.until;
  form.value.weekdayId = options.weekdayId;
  // form.value.occurences=options.occurences;
  showRecurrenceModal.value = false;
};

const form = ref<FormData>({
  agenda: "",
  meetingDate: "",
  meetingEndDate: "",
  startTime: "",
  endTime: "",
  roomId: 0,
  userId: authStore.myDetails?.id,
  memberIds: [],
  isRecurring: false,
  recurrencePatternId: undefined,
  frequency: undefined,
  weekdayId: undefined,
});

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
const validateForm = () => {
  form.value.agenda = sanitizeInput(form.value.agenda).trim();

  if (!form.value.agenda || form.value.agenda.length > 40) {
    logMessage("Agenda must be 1–40 characters and not contain unsafe characters.", "error");
    return false;
  }

  if (/[^a-zA-Z0-9\s.,\-!()]/.test(form.value.agenda)) {
    logMessage("Agenda contains invalid characters.", "error");
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
    logMessage("Start Time must be in HH:MM format.", "error");
    return false;
  }

  if (!form.value.endTime || !/^\d{2}:\d{2}$/.test(form.value.endTime)) {
    logMessage("End Time must be in HH:MM format.", "error");
    return false;
  }

  const start = new Date(`1970-01-01T${form.value.startTime}:00`);
  const end = new Date(`1970-01-01T${form.value.endTime}:00`);

  if (end <= start) {
    logMessage("End time must be after start time.", "error");
    return false;
  }

  if (!form.value.roomId || isNaN(Number(form.value.roomId))) {
    logMessage("Please select a valid room.", "error");
    return false;
  }
  if (form.value.startTime < "08:00" || form.value.endTime > "20:00") {
    logMessage("Meeting must be between 08:00 and 20:00.", "error");
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

const submitBooking = async () => {
  if (!validateForm()) return;

  loading.value = true;
  // successMessage.value = "";

  try {
    let bookingData = {
      ...form.value,
      agenda: sanitizeInput(form.value.agenda),
      roomId: Number(form.value.roomId),
      userId: Number(form.value.userId),
      recurrencePatternId: Number(form.value.recurrencePatternId),
      isRecurring: !!form.value.isRecurring,
      meetingEndDate: form.value.isRecurring
        ? form.value.meetingEndDate
        : form.value.meetingDate,
    };

    if (bookingData.recurrencePatternId !== 2) {
      bookingData.weekdayId = undefined;
    }
    if (!bookingData.isRecurring) {
      bookingData.recurrencePatternId = 0;
    }

    // Call API
    const { data, error } = await meetingStore.bookMeetingRoom(bookingData);

    if (error) {
      logMessage(error, "error"); // Log error
      // logger.value.message = error; // Display error message from API
      // logger.value.type = "error";
    } else {
      // logger.value.message = data?.message || "Meeting room booked successfully";
      // logger.value.type = "success";
      logMessage(
        data?.message || "Meeting room booked successfully",
        "success"
      );
      navigateTo("/dashboard/my-bookings");
    }
  } catch (err: any) {
    // console.error("Unexpected Error:", err); // Log unexpected errors
    // logger.value.message = err.message || "An unexpected error occurred";
    // logger.value.type = "error";
    logMessage(err.message || "An unexpected error occurred", "error");
  } finally {
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

useHead({ title: "Add Bookings" });
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
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-primary:hover {
  background-color: #0056b3;
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
