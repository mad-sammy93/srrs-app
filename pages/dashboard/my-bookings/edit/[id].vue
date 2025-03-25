<template>
  <div> 
    {{ id }}
  </div>
</template>

<script setup lang="ts">
import { useMeetingStore } from '@/stores/meetingStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const meetingStore = useMeetingStore()
const bookings = computed(() => meetingStore.bookings)


  
// meetingStore.fetchBookedMeetingWithId(id)


</script>

<style scoped>

</style>