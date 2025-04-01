<template>
  <div class="p-8">
    <div class="mb-4 text-gray-500">
      <a
        href="#"
        class="text-blue-500"
        >Dashboard</a
      >
      / <span>Book Room</span>
    </div>
    <div class="p-4 mb-4">
      <h1 class="text-4xl font-light mb-4">Book Room</h1>
    </div>
    <div
      class="min-w-[1440px] mx-auto px-[100px] py-[50px] mt-[50px] bg-white shadow-md rounded-lg"
    >
      <form @submit.prevent="submitBooking">
        <!-- Agenda -->
        <div class="mb-4">
          <label class="block font-normal text-gray-500">Agenda</label>
          <input
            v-model="form.agenda"
            type="text"
            class="input-field"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 text-gray-500">Select Room</label>
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
          <input
            v-model="form.isRecurring"
            type="checkbox"
            class="mr-2"
          />
          <label class="font-normal text-gray-500">Is Recurring?</label>
        </div>
        <div
          v-if="form.isRecurring"
          class="grid grid-cols-2 gap-4"
        >
          <div>
            <label class="block font-normal text-gray-500"
              >Recurrence Pattern</label
            >
            <select
              v-model="form.recurrencePatternId"
              class="input-field"
            >
              <option
                :value="pattern.id"
                v-for="pattern in recurrencePatterns"
                :key="pattern.id"
              >
                {{ pattern.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block font-normal text-gray-500">Frequency</label>
            <input
              v-model="form.frequency"
              type="number"
              min="1"
              class="input-field"
            />
          </div>
        </div>
        <div
          v-if="form.isRecurring && form.recurrencePatternId == 2"
          class="mb-4"
        >
          <label class="block font-normal text-gray-500">Select Weekday</label>
          <select
            v-model="form.weekdayId"
            class="input-field"
          >
            <option
              v-for="(day, index) in weekdays"
              :key="index"
              :value="index + 1"
            >
              {{ day }}
            </option>
          </select>
        </div>
        <div
          class="grid gap-4"
          :class="{
            'grid-cols-2': form.isRecurring,
            'grid-cols-3': !form.isRecurring,
          }"
        >
          <div class="mb-4">
            <label class="block font-normal text-gray-500">Meeting Date</label>
            <input
              v-model="form.meetingDate"
              type="date"
              class="input-field"
              required
            />
          </div>
          <div
            v-if="form.isRecurring"
            class="mb-4"
          >
            <label class="block font-normal text-gray-500"
              >Meeting End Date</label
            >
            <input
              v-model="form.meetingEndDate"
              type="date"
              class="input-field"
            />
          </div>
          <div>
            <label class="block font-normal text-gray-500">Start Time</label>
            <input
              v-model="form.startTime"
              type="time"
              class="input-field"
              required
            />
          </div>
          <div>
            <label class="block font-normal text-gray-500">End Time</label>
            <input
              v-model="form.endTime"
              type="time"
              class="input-field"
              required
            />
          </div>
        </div>
        <div class="mb-4">
          <label class="block font-normal text-gray-500">Select Members</label>
          <select
            v-model="form.memberIds"
            Multiple
            class="input-field"
          >
            <option
              v-for="member in user"
              :key="member.id"
              :value="member.id"
            >
              {{ member.fullName }}
            </option>
          </select>
        </div>
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          {{ loading ? "Booking..." : "Book Meeting" }}
        </button>
      </form>
      <p
        v-if="successMessage"
        class="text-green-600 mt-4"
      >
        {{ successMessage }}
      </p>
      <div class="py-4 mb-5">
        <div class="flex items-center mt-4 space-x-4">
          <div
            v-for="room in rooms"
            :key="room.id"
            class="flex flex-wrap items-center"
          >
            <span
              class="w-6 h-6 bg-green-200 mr-2 rounded inline-block"
              :style="`background-color: #${room.hexColor}`"
            ></span
            >{{ room.roomName }} Room
          </div>
          <div class="flex flex-wrap items-center">
            <span class="w-6 h-6 mr-2 bg-gray-400 rounded inline-block"></span
            >Not Available
          </div>
          <div class="flex flex-wrap items-center">
            <span class="w-6 h-6 mr-2 bg-purple-200 rounded inline-block"></span
            >Selected Room
          </div>
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
import type { FormData } from "@/types";

const authStore = useAuthStore();
const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

const rooms = storeToRefs(roomStore).roomList;
const user = storeToRefs(userStore).usersList;
const userId = computed(() => authStore.myDetails?.id);
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const loading = ref(false);
const successMessage = ref("");

onMounted(() => {
  let params = {
    pageNo: 1,
    limit: 100,
  };
  roomStore.fetchRoomsData();
  userStore.fetchUsers(params); //fetch all users
});

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
  {
    id: 4,
    name: "Yearly",
    patternId: 4,
  },
]);

const validateForm = () => {
  form.value.recurrencePatternId = form.value.recurrencePatternId
    ? Number(form.value.recurrencePatternId)
    : undefined;

  if (!form.value.agenda || form.value.agenda.length > 40) {
    alert("Agenda must be between 1 to 40 characters.");
    return false;
  }
  if (
    !form.value.meetingDate ||
    !/^\d{4}-\d{2}-\d{2}$/.test(form.value.meetingDate)
  ) {
    alert("Meeting Date must be in YYYY-MM-DD format.");
    return false;
  }
  if (!form.value.startTime || !/^\d{2}:\d{2}$/.test(form.value.startTime)) {
    alert("Start Time must be in HH:MM (24-hour) format.");
    return false;
  }
  if (!form.value.endTime || !/^\d{2}:\d{2}$/.test(form.value.endTime)) {
    alert("End Time must be in HH:MM (24-hour) format.");
    return false;
  }
  if (!form.value.roomId || isNaN(Number(form.value.roomId))) {
    alert("Please select a valid room.");
    return false;
  }
  return true;
};

const submitBooking = async () => {
  if (!validateForm()) return;

  loading.value = true;
  successMessage.value = "";

  try {
    let bookingData = {
      ...form.value,
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

    // console.log('[BOOKING DATA]', bookingData);

    const response = await meetingStore.bookMeetingRoom(bookingData);
    successMessage.value = "Meeting successfully booked!";
  } catch (error) {
    console.error("Error booking meeting:", error);
    alert("Error booking meeting. Please check your details and try again.");
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
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.room-unavailable {
  background-color: #dc3545;
  color: white;
}
.selected-room {
  border-left-width: 4px !important;
  color: white;
  text-shadow: rgba(0, 0, 0, 0.601) 2px 2px 10px;
}
</style>
