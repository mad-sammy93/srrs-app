<template>
  <div class="p-8">
    <!-- {{ form }} -->
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
                getRoomClass(room.roomName),
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
      <!-- Confirmation Modal -->
      <div
        v-if="confirmModalVisible"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold mb-4">Apply Changes</h3>
          <p class="text-gray-600 mb-4">Do you want to apply the changes to:</p>

          <div class="flex flex-col gap-3" v-if="form.isRecurring">
            <button
              @click="confirmEdit('SELECTED')"
              class="btn-secondary"
            >
              Only this meeting
            </button>

            <button
              @click="confirmEdit('SELECTED_AND_UPCOMING')"
              class="btn-primary"
            >
              This and upcoming meetings
            </button>
          </div>

          <button v-if="!form.isRecurring" @click="confirmEdit('SELECTED')" class="mt-4 btn-primary">Confirm</button>
          <button
            @click="confirmModalVisible = false"
            class="mt-4 text-gray-500 hover:text-gray-700"
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
import type { FormData, EditBookedMeetingRoomFormData } from "@/types";

const roomStore = useRoomStore();
const userStore = useUserStore();
const meetingStore = useMeetingStore();

const confirmModalVisible = ref(false);
const selectedOption = ref("");

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
        id: meetingId,
        agenda: meeting.data.agenda,
        meetingDate: meeting.data.meetingDate,
        meetingEndDate: meeting.data.meetingEndDate,
        startTime: convertTo24HourFormat(meeting.data.startDateTime),
        endTime: convertTo24HourFormat(meeting.data.endDateTime),
        roomId: meeting.data.room.id,
        userId: meeting.data.user?.id , // Add null check and default value
        memberIds: meeting.data.members.map((member: any) => member.id),
        isRecurring: meeting.data.isRecurring,
        option:  (form.value.isRecurring) ? 'SELECTED' : 'SELECTED_AND_UPCOMING',
        recurrencePatternId: meeting.data.recurrencePattern?.id , // Add null check and default value
        frequency: meeting.data.frequency , // Add null check and default value
        weekdayId: meeting.data.weekday?.id , // Add null check and default value
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
  selectedOption.value = option;
  confirmModalVisible.value = false;
  loading.value = true;


      console.log('[confirmEdit]form.value:', form.value);
      
  try {
    const response = await meetingStore.editBookedMeetingRoom(meetingId, {
      ...form.value,
      option: selectedOption.value, // Send selected option to API
      meetingEndDate: form.value.isRecurring ? form.value.meetingEndDate : form.value.meetingDate,
    });

    if (response) {
      console.log("Meeting updated successfully:", response);
      alert("Meeting updated successfully!");
    }
  } catch (error) {
    console.error("Error updating meeting:", error);
    alert("Failed to update meeting.");
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
.diversity {
  background-color: #cce5ff;
  border-left-width: 4px;
  border-color: #007bff;
}
.excellence {
  background-color: #0000cc;
  color: white;
  border-left-width: 4px;
  border-color: #007bff;
}
.positive-attitude {
  background-color: #f8d7da;
  border-left-width: 4px;
  border-color: #007bff;
}
</style>
