<template>
  <div class="min-w-[800px] mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Book a Meeting Room</h2>

    <!-- {{ rooms }} 

    {{form}}-->
    <!-- {{ user }} -->
    <form @submit.prevent="submitBooking">
      <!-- Agenda -->
      <div class="mb-4">
        <label class="block font-medium">Agenda</label>
        <input v-model="form.agenda" type="text" class="input-field" required />
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
      <div v-if="form.isRecurring && form.recurrencePatternId == 2" class="mb-4">
        <label class="block font-medium">Select Weekday</label>
        <select v-model="form.weekdayId" class="input-field">
          <option v-for="(day, index) in weekdays" :key="index" :value="index + 1">
            {{ day }}
          </option>
        </select>
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
        <!-- {{ rooms }} -->
        <select v-model="form.roomId" class="input-field">
          
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.roomName }}
          </option>
        </select>
      </div>
      <!-- Select Members (Multiple Selection) -->
      <div class="mb-4">
        <label class="block font-medium">Select Members</label>
        <select v-model="form.memberIds"Multiple class="input-field">
          <option v-for="member in user" :key="member.id" :value="member.id">
            {{ member.fullName }}
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

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoomStore } from "@/stores/roomStore";
import { useUserStore } from '@/stores/userStore';
import { useMeetingStore } from '@/stores/meetingStore';
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

// Options for Dropdowns
const rooms = storeToRefs(roomStore).roomList;
const user = storeToRefs(userStore).usersList;
const userId = computed(() => authStore.myDetails?.id);
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const loading = ref(false);
const successMessage = ref("");

// Form Data
const form = ref({
  agenda: "",
  meetingDate: "",
  meetingEndDate: "",
  startTime: "",
  endTime: "",
  roomId: 0,
  userId: authStore.myDetails?.id,
  memberIds: [],
  isRecurring: false,
  recurrencePatternId: 1,
  frequency: 1,
  weekdayId: 1,
});

const validateForm = () => {
  if (!form.value.agenda || form.value.agenda.length > 40) {
    alert("Agenda must be between 1 to 40 characters.");
    return false;
  }
  if (!form.value.meetingDate || !/^\d{4}-\d{2}-\d{2}$/.test(form.value.meetingDate)) {
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
  // if (!form.value.userId || isNaN(Number(form.value.userId))) {
  //   alert("Please select a valid user.");
  //   return false;
  // }
  return true;
};


// Fetch Rooms & Members on Page Load
onMounted(async () => {
  const userParams = {
  pageNo: 1,
  limit: 10,
  userStatusId:1
}
  await roomStore.fetchRoomsData();
  await userStore.fetchUsers(userParams);
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
    roomId: 0,
    userId: 0,
    memberIds: [],
    isRecurring: false,
    recurrencePatternId: 1,
    frequency: 1,
    weekdayId: 1,
  };
}
const meetingEndDate = computed(() => {
  if (form.value.isRecurring === false) {
    return form.value.meetingDate;
  }
  return form.value.meetingEndDate;
});
// Submit Booking
const submitBooking = async () => {
  if (!validateForm()) return;

  loading.value = true;
  successMessage.value = "";

  try {
    const bookingData = {
      ...form.value,
      roomId: Number(form.value.roomId),
      userId: Number(form.value.userId),
      isRecurring: !!form.value.isRecurring,
      meetingEndDate: meetingEndDate.value,
    };
    console.log('[BOOKING DATA]',bookingData);
    

    const response = await meetingStore.bookMeetingRoom(bookingData);
    successMessage.value = "Meeting successfully booked!";
    resetForm();
  } catch (error) {
    console.error("Error booking meeting:", error);
    alert("Error booking meeting. Please check your details and try again.");
  } finally {
    loading.value = false;
  }
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
