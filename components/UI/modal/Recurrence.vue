<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-[400px]">
      <h2 class="text-xl font-semibold mb-4">Custom recurrence</h2>

      <!-- Repeat Every / Duration -->
      <div class="flex items-center justify-between space-x-4 mb-4">
        <div class="flex flex-col">
          <label class="text-gray-600 text-sm mb-1">Repeat every</label>
          <input
            v-model.number="frequency"
            type="number"
            min="1"
            class="input-field w-20"
          />
          <!-- <p v-if="errors.frequency" class="text-red-500 text-sm">{{ errors.frequency }}</p> -->
        </div>

        <div class="flex flex-col">
          <label class="text-gray-600 text-sm mb-1">Duration</label>
          <select v-model="recurrencePatternId" class="input-field w-32">
            <option :value="1">Day</option>
            <option :value="2">Week</option>
            <option :value="3">Month</option>
          </select>
          <!-- <p v-if="errors.recurrencePattern" class="text-red-500 text-sm">{{ errors.recurrencePattern }}</p> -->
        </div>
      </div>

      <!-- Repeat On (only for weekly) -->
      <div v-if="recurrencePatternId === 2" class="mb-4">
        <label class="text-gray-600 text-sm mb-2 block">Repeat on</label>
        <div class="flex space-x-2 justify-between">
          <button
            v-for="(day, index) in weekdaysShort"
            :key="index"
            @click.prevent="weekdayId = index + 1"
            :class="[
              'w-10 h-10 rounded border',
              weekdayId === index + 1
                ? 'bg-blue-500 text-white'
                : 'border-blue-400 text-blue-500'
            ]"
          >
            {{ day }}
          </button>
        </div>
        <!-- <p v-if="errors.weekday" class="text-red-500 text-sm mt-1">{{ errors.weekday }}</p> -->
      </div>

      <!-- Range of Recurrence -->
      <div class="mb-4">
        <label class="text-gray-600 text-sm mb-2 block">Range of Recurrence</label>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <input type="radio" id="endBy" value="endBy" v-model="rangeOption" />
            <label for="endBy" class="text-sm">End by</label>
            <input type="date" v-model="meetingEndDate" class="input-field w-40" />
          </div>

          <!-- <div class="flex items-center space-x-2">
            <input type="radio" id="endAfter" value="endAfter" v-model="rangeOption" />
            <label for="endAfter" class="text-sm">End After</label>
            <input
              type="number"
              v-model.number="endAfterOccurrences"
              min="1"
              class="input-field w-20"
              :disabled="rangeOption !== 'endAfter'"
            />
            <span class="text-sm">Occurrences</span>
          </div> -->
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end space-x-2 mt-6">
        <button @click="$emit('close')" class="btn-secondary">Cancel</button>
        <button @click="validateAndSave" class="btn-primary">Okay</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({ show: Boolean });
const emit = defineEmits(["close", "save"]);

const recurrencePatternId = ref(0);
const frequency = ref(1);
const weekdayId = ref(null);

const rangeOption = ref("");
const meetingEndDate = ref("");
const endAfterOccurrences = ref(1);

// const errors = ref({ recurrencePattern: "", frequency: "", weekday: "" });

const weekdaysShort = ["S", "M", "T", "W", "T", "F", "S"];

const validateAndSave = () => {
  // errors.value = { recurrencePattern: "", frequency: "", weekday: "" };
  let valid = true;

  if (!recurrencePatternId.value) {
    logMessage("Please select a recurrence pattern", "error");
    valid = false;
  }

  if (recurrencePatternId.value !== 0 && (!frequency.value || frequency.value < 1)) {
    logMessage("Frequency must be at least 1");
    valid = false;
  }

  if (recurrencePatternId.value === 2 && !weekdayId.value) {
    logMessage("Please select a weekday.");
    valid = false;
  }

  if (!valid) return;

  emit("save", {
    recurrencePatternId: recurrencePatternId.value,
    frequency: frequency.value,
    weekdayId: recurrencePatternId.value === 2 ? weekdayId.value : null,
    meetingEndDate: meetingEndDate.value ? meetingEndDate.value : null,
    endAfterOccurrences: rangeOption.value === "endAfter" ? endAfterOccurrences.value : null,
  });
};
</script>

<style scoped>
.input-field {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}
.btn-primary:hover {
  background-color: #2563eb;
}
.btn-secondary {
  background-color: #e5e7eb;
  color: black;
  padding: 8px 12px;
  border-radius: 4px;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}
.text-red-500 {
  color: red;
}
.text-sm {
  font-size: 0.875rem;
}
</style>
