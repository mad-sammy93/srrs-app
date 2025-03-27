<template>
  <div class="p-8">
    <div class="mb-4 text-gray-500">
      <a href="#" class="text-blue-500">Dashboard</a> / <span>Book Room</span>
    </div>
  <div class="min-w-[1440px] mx-auto px-[100px] py-[50px] mt-[100px] bg-white shadow-md rounded-lg">
    <!-- <h2 class="text-xl font-semibold mb-4">Book a Meeting Room</h2> -->

    <!-- {{ rooms }} -->

    {{form}}
    <!-- {{ user }} -->
    <form @submit.prevent="submitBooking">
      <!-- Agenda -->
      <div class="mb-4">
        <label class="block font-normal text-gray-500">Agenda</label>
        <input v-model="form.agenda" type="text" class="input-field" required />
      </div>

       <!-- Select Room -->
       <div class="mb-4">
        <label class="block mb-2 text-gray-500">Select Room</label>
        <!-- {{ rooms }} -->
        <!-- <select v-model="form.roomId" class="input-field">
          
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.roomName }}
          </option>
        </select> -->
        <div class="flex flex-wrap gap-2 mb-6">

        <button v-for="room in rooms" :key="room.id" 
          :class="['room-btn', form.roomId === room.id ? 'selected-room' : '', getRoomClass(room)]" 
          @click.prevent="form.roomId = room.id">
            {{ room.roomName }} | Pax. {{ room.pax }}
          </button>
          </div>
      </div>

      <!-- Recurring Meeting Toggle -->
      <div class="mb-4 flex items-center">
        <input v-model="form.isRecurring" type="checkbox" class="mr-2" />
        <label class="font-normal text-gray-500">Is Recurring?</label>
      </div>

      <!-- Recurrence Pattern (Only if Recurring) -->
      <div v-if="form.isRecurring" class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-normal text-gray-500">Recurrence Pattern</label>
          <select v-model="form.recurrencePatternId" class="input-field">
            <option :value="pattern.id" v-for="pattern in recurrencePatterns" :key="pattern.id" 
            >{{pattern.name}}</option>
          </select>
        </div>
        <div>
          <label class="block font-normal text-gray-500">Frequency</label>
          <input v-model="form.frequency" type="number" min="1" class="input-field" />
        </div>
      </div>

      <!-- Select Weekday (Only if Weekly Recurrence) -->
      <div v-if="form.isRecurring && form.recurrencePatternId == 2" class="mb-4">
        <label class="block font-normal text-gray-500">Select Weekday</label>
        <select v-model="form.weekdayId" class="input-field">
          <option v-for="(day, index) in weekdays" :key="index" :value="index + 1">
            {{ day }}
          </option>
        </select>
      </div>

      <!-- Meeting Date -->
      <div class="grid  gap-4" :class="{ 'grid-cols-2': form.isRecurring , 'grid-cols-3': !form.isRecurring}">
        <div class="mb-4">
          <label class="block font-normal text-gray-500">Meeting Date</label>
          <input v-model="form.meetingDate" type="date" class="input-field" required />
        </div>
        

      <!-- End Date (Only if Recurring) -->
        <div v-if="form.isRecurring" class="mb-4">
          <label class="block font-normal text-gray-500">Meeting End Date</label>
          <input v-model="form.meetingEndDate" type="date" class="input-field" />
        </div>
        <div>
          <label class="block font-normal text-gray-500">Start Time</label>
          <input v-model="form.startTime" type="time" class="input-field" required />
        </div>
        <div>
          <label class="block font-normal text-gray-500">End Time</label>
          <input v-model="form.endTime" type="time" class="input-field" required />
        </div>
    </div>

      <!-- Start Time & End Time -->
      <!-- <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-normal text-gray-500">Start Time</label>
          <input v-model="form.startTime" type="time" class="input-field" required />
        </div>
        <div>
          <label class="block font-normal text-gray-500">End Time</label>
          <input v-model="form.endTime" type="time" class="input-field" required />
        </div>
      </div> -->

     

      <!-- Select Members (Multiple Selection) -->
      <div class="mb-4">
        <label class="block font-normal text-gray-500">Select Members</label>
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

    <div class="flex items-center mt-8 space-x-4">
    <span class="w-6 h-6 bg-green-200 rounded inline-block"></span> Room A
    <span class="w-6 h-6 bg-lime-200 rounded inline-block"></span> Room B
    <span class="w-6 h-6 bg-yellow-200 rounded inline-block"></span> Room C
    <span class="w-6 h-6 bg-pink-200 rounded inline-block"></span> Room D
    <span class="w-6 h-6 bg-red-300 rounded inline-block"></span> Room E
    <span class="w-6 h-6 bg-gray-400 rounded inline-block"></span> Not Available
    <span class="w-6 h-6 bg-purple-200 rounded inline-block"></span> Selected Room
  </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoomStore } from "@/stores/roomStore";
import { useUserStore } from '@/stores/userStore';
import { useMeetingStore } from '@/stores/meetingStore';
import { useAuthStore } from "@/stores/authStore";
import type { FormData } from '@/types';

const authStore = useAuthStore();
const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

const rooms = storeToRefs(roomStore).roomList;
const user = storeToRefs(userStore).usersList;
const userId = computed(() => authStore.myDetails?.id);
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const loading = ref(false);
const successMessage = ref("");

onMounted(() => {
  let params = {
    pageNo: 1,
    limit: 100
  }
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

const recurrencePatterns = ref([{
  id: 1,
  name: 'Daily',
  patternId: 1
}, {
  id: 2,
  name: 'Weekly',
  patternId: 2
}, {
  id: 3,
  name: 'Monthly',
  patternId: 3
}, {
  id: 4,
  name: 'Yearly',
  patternId: 4
}]);  

const validateForm = () => {
  form.value.recurrencePatternId = form.value.recurrencePatternId ? Number(form.value.recurrencePatternId) : undefined;
  
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
      meetingEndDate: form.value.isRecurring ? form.value.meetingEndDate : form.value.meetingDate,
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

const getRoomClass = (room:any) => {
  if (room.isAvailable === false) return 'room-unavailable';
  const colors = ['room-a', 'room-b', 'room-c', 'room-d', 'room-e'];
  return colors[room.id % colors.length];
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
.room-btn {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.room-a { background-color: #cce5ff; border-left-width: 4px; border-color: #007bff; }
.room-c { background-color: #fff3cd; border-left-width: 4px; border-color: #007bff;}
.room-d { background-color: #f8d7da; border-left-width: 4px; border-color: #007bff;}
.room-e { background-color: #d1ecf1; border-left-width: 4px; border-color: #007bff;}
.room-b { background-color: #d4edda; border-left-width: 4px; border-color: #007bff;}
.room-unavailable { background-color: #dc3545; color: white; }
.selected-room { border: 2px solid #007bff; }
</style>
