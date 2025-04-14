<template>
  <div class="relative">
    <label class="block font-normal text-gray-500 dark:text-white"
      >Members / Guest</label
    >
    <div
      class="group rounded-sm border-gray-300 border border-input px-3 py-2 text-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0"
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
            @click.prevent="handleUnselect(option)"
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
        class="absolute left-0 top-[68px] z-10 mt-1 w-full rounded-md border bg-white shadow-lg overflow-y-scroll max-h-[200px]"
      >
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          class="cursor-pointer px-4 py-2 hover:bg-gray-100 w-full"
          @mousedown.prevent
          @click.prevent="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
    validator: (opts) =>
      Array.isArray(opts) &&
      opts.every(
        (o) =>
          typeof o.label === "string" &&
          typeof o.value === "string" &&
          typeof o.id === "number"
      ),
  },
  selectedValues: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const emit = defineEmits(["update:selected"]);

const inputRef = ref(null);
const open = ref(false);
const inputValue = ref("");

// This holds the selected full option objects (mapped from IDs)
const selected = ref([]);

// Map selected IDs to full option objects using `id`
const updateSelectedFromIds = () => {
  selected.value = props.selectedValues
    .map((id) => props.options.find((opt) => opt.id === id))
    .filter(Boolean); // Remove nulls if any id is not found
};

// Initial setup
onMounted(() => {
  updateSelectedFromIds();
});

// Watch for changes in IDs or options and remap
watch(
  [() => props.selectedValues, () => props.options],
  () => {
    updateSelectedFromIds();
  },
  { deep: true }
);

// Filter dropdown options
const filteredOptions = computed(() =>
  props.options.filter(
    (f) =>
      !selected.value.some((s) => s.id === f.id) &&
      f.label.toLowerCase().includes(inputValue.value.toLowerCase())
  )
);

// Remove selected user
const handleUnselect = (option) => {
  selected.value = selected.value.filter((f) => f.id !== option.id);
  emit(
    "update:selected",
    selected.value.map((s) => s.id)
  ); // Emit only IDs
};

// Key handling
const handleKeyDown = (e) => {
  const input = inputRef.value;
  if (!input) return;

  if (
    (e.key === "Backspace" || e.key === "Delete") &&
    inputValue.value === ""
  ) {
    selected.value.pop();
    emit(
      "update:selected",
      selected.value.map((s) => s.id)
    );
  }

  if (e.key === "Escape") {
    input.blur();
    open.value = false;
  }
};

// Add new user to selection
const selectOption = (option) => {
  selected.value.push(option);
  emit("update:selected", selected.value); // Emit only IDs
  inputValue.value = "";
};
// Watch selected and emit when it changes
watch(selected, (newVal) => {
  emit("update:selected", newVal); // Emit selected array automatically when it changes
});
</script>
