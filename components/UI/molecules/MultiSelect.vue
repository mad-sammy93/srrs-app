<template>
  <div class="relative">
    <div
      class="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      @keydown="handleKeyDown"
    >
      <div class="flex flex-wrap gap-1">
        <span
          v-for="option in selected"
          :key="option.value"
          class="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-sm"
        >
          {{ option.label }}
          <button
            @click="handleUnselect(option)"
            @keydown.enter.prevent="handleUnselect(option)"
            @mousedown.prevent
            class="ml-1 focus:outline-none"
          >
            ✕
          </button>
        </span>

        <input
          ref="inputRef"
          v-model="inputValue"
          @focus="open = true"
          @blur="open = false"
          type="text"
          :placeholder="filteredOptions.length ? 'Select members...' : ''"
          class="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>

      <ul
        v-if="open && filteredOptions.length > 0"
        class="absolute left-0 top-[38px] z-10 mt-1 w-full rounded-md border bg-white shadow-lg overflow-y-scroll max-h-[200px]"
      >
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          class="cursor-pointer px-4 py-2 hover:bg-gray-100 w-full"
          @mousedown.prevent
          @click="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
    validator: (opts) =>
      Array.isArray(opts) &&
      opts.every(
        (o) => typeof o.label === "string" && typeof o.value === "number" && typeof o.value === "string"
      ),
  },
});

// watch(
//   () => props.options,
//   (newOptions) => {
//     // Optional: Reset input or re-validate selected if needed
    
//     console.log("Options updated:", newOptions);
//   },
//   { deep: true, immediate: true }
// );
const emit = defineEmits(["update:selected"]);

const inputRef = ref(null);
const open = ref(false);
const inputValue = ref("");
const selected = ref([]);

const filteredOptions = computed(() =>
  props.options.filter(
    (f) =>
      f?.label &&
      !selected.value.some((s) => s.value === f.value) &&
      f.label.toLowerCase().includes(inputValue.value.toLowerCase())
  )
);

const handleUnselect = (option) => {
  selected.value = selected.value.filter((f) => f.value !== option.value);
};

const handleKeyDown = (e) => {
  const input = inputRef.value;
  if (!input) return;

  if (
    (e.key === "Backspace" || e.key === "Delete") &&
    inputValue.value === ""
  ) {
    selected.value.pop();
  }

  if (e.key === "Escape") {
    input.blur();
    open.value = false;
  }
};

const selectOption = (option) => {
  selected.value.push(option); // Add the selected option
  emit("update:selected", selected.value); // Emit the updated selected array
  inputValue.value = ""; // Clear the input field
};
// Watch selected and emit when it changes
watch(selected, (newVal) => {
  emit("update:selected", newVal); // Emit selected array automatically when it changes
});
</script>
