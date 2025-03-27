<template>
  <div class="p-8">
    {{ form }}
    <div class="mb-4 text-gray-500">
      <a
        href="#"
        class="text-blue-500"
        >Dashboard</a
      >
      / <span>Edit Booking</span>
    </div>
    <div
      class="min-w-[1440px] mx-auto px-[100px] py-[50px] mt-[100px] bg-white shadow-md rounded-lg"
    >
      <form @submit.prevent="submitEdit">
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

        <!-- Select Room -->
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
              :style="{ backgroundColor: room.hexColor }"
              @click.prevent="form.roomId = room.id"
            >
              {{ room.roomName }} | Pax. {{ room.pax }}
            </button>
          </div>
        </div>

        <!-- Recurring Meeting Toggle -->
        <div class="mb-4 flex items-center">
          <input
            v-model="form.isRecurring"
            type="checkbox"
            class="mr-2"
          />
          <label class="font-normal text-gray-500">Is Recurring?</label>
        </div>

        <!-- Recurrence Pattern and Frequency -->
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
                v-for="pattern in recurrencePatterns"
                :key="pattern.id"
                :value="pattern.id"
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

        <!-- Meeting Date, Time and Members -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block font-normal text-gray-500">Meeting Date</label>
            <input
              v-model="form.meetingDate"
              type="date"
              class="input-field"
              required
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
            multiple
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

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          {{ loading ? "Updating..." : "Update Booking" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoomStore } from "@/stores/roomStore";
import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { useRoute } from "vue-router";
import type { FormData, EditBookedMeetingRoomFormData } from "@/types";

const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

const rooms = storeToRefs(roomStore).roomList;
const user = storeToRefs(userStore).usersList;
const loading = ref(false);
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const route = useRoute();
const meetingId = Number(route.params.id);

const form = ref<FormData>({
  agenda: "",
  meetingDate: "",
  meetingEndDate: "",
  startTime: "",
  endTime: "",
  roomId: 0,
  userId: 0,
  memberIds: [],
  isRecurring: false,
  recurrencePatternId: 0,
  frequency: 0,
  weekdayId: 0,
});

onMounted(async () => {
  let params = {
    pageNo: 1,
    limit: 100,
  };
  await roomStore.fetchRoomsData();
  await userStore.fetchUsers(params);

  try {
    const meeting = await meetingStore.fetchBookedMeetingWithId(meetingId);
    if (!meeting) throw new Error("Failed to fetch meeting room");
    if (meeting) {
      // console.log('Fetching meeting:', meeting.data);
      form.value = {
        agenda: meeting.data.agenda,
        meetingDate: meeting.data.meetingDate,
        meetingEndDate: meeting.data.meetingEndDate,
        startTime: convertTo24HourFormat(
          meeting.data.startDateTime.split("T")[1].split("+")[0].split(".")[0]
        ),
        endTime: convertTo24HourFormat(
          meeting.data.endDateTime.split("T")[1].split("+")[0].split(".")[0]
        ),
        roomId: meeting.data.room.id,
        userId: meeting.data.user?.id ?? 0, // Add null check and default value
        memberIds: meeting.data.members.map((member: any) => member.id),
        isRecurring: meeting.data.isRecurring,
        recurrencePatternId: meeting.data.recurrencePattern?.id ?? 0, // Add null check and default value
        frequency: meeting.data.frequency ?? 0, // Add null check and default value
        weekdayId: meeting.data.weekday?.id ?? 0, // Add null check and default value
      };
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
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

// "startTime must be a valid representation of military time in the format HH:MM",
// "endTime must be a valid representation of military time in the format HH:MM"
//convert from 2025-04-18T09:59:00.000Z to 09:59
const convertTo24HourFormat = (time: string) => {
  const [hours, minutes] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const submitEdit = async () => {
  loading.value = true;
  try {
    // "startTime must be a valid representation of military time in the format HH:MM",
    // "endTime must be a valid representation of military time in the format HH:MM"
    const response = await meetingStore.editBookedMeetingRoom(meetingId, {
      ...form.value,
      meetingEndDate: form.value.isRecurring
        ? form.value.meetingEndDate
        : form.value.meetingDate,
    });
    console.log("Meeting updated:", response);

    alert("Meeting updated successfully!");
  } catch (error) {
    console.error("Error updating meeting:", error);
    alert("Failed to update meeting.");
  } finally {
    loading.value = false;
  }
};

const getRoomClass = (room: any) => {
  if (room.isAvailable === false) return "room-unavailable";
  const colors = ["room-a", "room-b", "room-c", "room-d", "room-e"];
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
}
.btn-primary:hover {
  background-color: #0056b3;
}
.room-btn {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.room-unavailable {
  background-color: #dc3545;
  color: white;
}
.selected-room {
  border: 2px solid #007bff;
}
</style>
