<template>
  <div class="min-w-[800px] mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Book a Meeting Room</h2>

    <!-- {{ rooms }} -->

    {{ user }}
    <form @submit.prevent="submitBooking">
      <!-- Agenda -->
      <div class="mb-4">
        <label class="block font-medium">Agenda</label>
        <input v-model="form.agenda" type="text" class="input-field" required />
      </div>

      <!-- Meeting Date -->
      <div class="mb-4">
        <label class="block font-medium">Meeting Date</label>
        <input v-model="form.meetingDate" type="date" class="input-field" required />
      </div>

      <!-- End Date (Only if Recurring) -->
      <div v-if="form.isRecurring" class="mb-4">
        <label class="block font-medium">Meeting End Date</label>
        <input v-model="form.meetingEndDate" type="date" class="input-field" />
      </div>

      <!-- Start Time & End Time -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium">Start Time</label>
          <input v-model="form.startTime" type="time" class="input-field" required />
        </div>
        <div>
          <label class="block font-medium">End Time</label>
          <input v-model="form.endTime" type="time" class="input-field" required />
        </div>
      </div>

      <!-- Select Room -->
      <div class="mb-4">
        <label class="block font-medium">Select Room</label>
        <select v-model="form.roomId" class="input-field">
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>

      <!-- Select Members (Multiple Selection) -->
      <div class="mb-4">
        <label class="block font-medium">Select Members</label>
        <select v-model="form.memberIds" multiple class="input-field">
          <option v-for="member in members" :key="member.id" :value="member.id">
            {{ member.name }}
          </option>
        </select>
      </div>

      <!-- Recurring Meeting Toggle -->
      <div class="mb-4 flex items-center">
        <input v-model="form.isRecurring" type="checkbox" class="mr-2" />
        <label class="font-medium">Is Recurring?</label>
      </div>

      <!-- Recurrence Pattern (Only if Recurring) -->
      <div v-if="form.isRecurring" class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium">Recurrence Pattern</label>
          <select v-model="form.recurrencePatternId" class="input-field">
            <option value="1">Daily</option>
            <option value="2">Weekly</option>
            <option value="3">Monthly</option>
          </select>
        </div>
        <div>
          <label class="block font-medium">Frequency</label>
          <input v-model="form.frequency" type="number" min="1" class="input-field" />
        </div>
      </div>

      <!-- Select Weekday (Only if Weekly Recurrence) -->
      <div v-if="form.isRecurring && form.recurrencePatternId === 2" class="mb-4">
        <label class="block font-medium">Select Weekday</label>
        <select v-model="form.weekdayId" class="input-field">
          <option v-for="(day, index) in weekdays" :key="index" :value="index + 1">
            {{ day }}
          </option>
        </select>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? "Booking..." : "Book Meeting" }}
      </button>
    </form>

    <!-- Success Message -->
    <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoomStore } from "@/stores/roomStore";
import { useUserStore } from '@/stores/userStore';
import { useMeetingStore } from '@/stores/meetingStore';

const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

// Form Data
const form = ref({
  agenda: "",
  meetingDate: "",
  meetingEndDate: "",
  startTime: "",
  endTime: "",
  roomId: null,
  userId: 0,
  memberIds: [],
  isRecurring: false,
  recurrencePatternId: 1,
  frequency: 1,
  weekdayId: 1,
});

// Options for Dropdowns
const rooms = storeToRefs(roomStore).roomList;
const user = storeToRefs(userStore).usersList;
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const loading = ref(false);
const successMessage = ref("");

// Fetch Rooms & Members on Page Load
onMounted(async () => {
  await roomStore.fetchRoomsData();
  await userStore.fetchUsers('pageNo=1&limit=10&userStatusId=1');
  // rooms.value = roomResponse.data.value || [];

  // const memberResponse = await useFetch("/api/members");
  // members.value = memberResponse.data.value || [];
});

const resetForm = () => {
  form.value = {
    agenda: "",
    meetingDate: "",
    meetingEndDate: "",
    startTime: "",
    endTime: "",
    roomId: null,
    userId: 0,
    memberIds: [],
    isRecurring: false,
    recurrencePatternId: 1,
    frequency: 1,
    weekdayId: 1,
  };
}
// Submit Booking
const submitBooking = async () => {
  loading.value = true;
  successMessage.value = "";

  try {
    const { data, error } = await meetingStore.bookMeetingRoom(form.value);
    console.log(data);
    
    if (error.value) throw new Error(error.value.message);

    successMessage.value = "Meeting successfully booked!";
    resetForm();
  } catch (error) {
    alert("Error booking meeting: " + error.message);
  }

  loading.value = false;
};
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
</style>
