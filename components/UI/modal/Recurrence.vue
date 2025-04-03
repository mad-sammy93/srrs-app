<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-semibold mb-4">Recurrence Options</h2>

      <label class="block font-normal text-gray-500">Recurrence Pattern</label>
      <select v-model="recurrencePatternId" class="input-field">
        <option v-for="pattern in recurrencePatterns" :key="pattern.id" :value="pattern.id">
          {{ pattern.name }}
        </option>
      </select>
      <p v-if="errors.recurrencePattern" class="text-red-500 text-sm">{{ errors.recurrencePattern }}</p>

      <div v-if="recurrencePatternId !== 0" class="mt-4">
        <label class="block font-normal text-gray-500">Frequency</label>
        <input v-model.number="frequency" type="number" min="1" class="input-field" />
        <p v-if="errors.frequency" class="text-red-500 text-sm">{{ errors.frequency }}</p>
      </div>

      <div v-if="recurrencePatternId === 2" class="mt-4">
        <label class="block font-normal text-gray-500">Select Weekday</label>
        <select v-model="weekdayId" class="input-field">
          <option v-for="(day, index) in weekdays" :key="index" :value="index + 1">
            {{ day }}
          </option>
        </select>
        <p v-if="errors.weekday" class="text-red-500 text-sm">{{ errors.weekday }}</p>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button @click="$emit('close')" class="btn-secondary">Cancel</button>
        <button @click="validateAndSave" class="btn-primary">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["close", "save"]);

const recurrencePatternId = ref(0);
const frequency = ref(1);
const weekdayId = ref(null);
const errors = ref({ recurrencePattern: "", frequency: "", weekday: "" });

const recurrencePatterns = [
  { id: 1, name: "Daily" },
  { id: 2, name: "Weekly" },
  { id: 3, name: "Monthly" },
];

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const validateAndSave = () => {
  errors.value = { recurrencePattern: "", frequency: "", weekday: "" };

  let valid = true;

  if (!recurrencePatternId.value) {
    errors.value.recurrencePattern = "Please select a recurrence pattern.";
    valid = false;
  }

  if (recurrencePatternId.value !== 0 && (!frequency.value || frequency.value < 1)) {
    errors.value.frequency = "Frequency must be at least 1.";
    valid = false;
  }

  if (recurrencePatternId.value === 2 && !weekdayId.value) {
    errors.value.weekday = "Please select a weekday.";
    valid = false;
  }

  if (!valid) return;

  emit("save", {
    recurrencePatternId: recurrencePatternId.value,
    frequency: frequency.value,
    weekdayId: recurrencePatternId.value === 2 ? weekdayId.value : null,
  });
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
.btn-secondary {
  background-color: #ccc;
  color: black;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #bbb;
}
.text-red-500 {
  color: red;
}
.text-sm {
  font-size: 0.875rem;
}
</style>
