<template>
  <div class="w-[75px] h-screen bg-sky-400 dark:bg-slate-800 text-white flex flex-col">
    <nav class="flex-1">
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.name"
          class="flex flex-column hover:bg-gray-700 "
        >
          <NuxtLink
            :to="item.link"
            class="p-2 py-5 text-xs w-full text-center flex-wrap flex flex-col items-center text-white "
          >
            <component
              :is="item.icon"
              class="w-5 h-5 mb-2"
            />
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { UIAtomsIconsDashboard, UIAtomsIconsMyBookings } from "#components";

const menuItems = [
  { name: "Dashboard", link: "/dashboard", icon: UIAtomsIconsDashboard },
  {
    name: "My Bookings",
    link: "/dashboard/my-bookings",
    icon: UIAtomsIconsMyBookings,
  },
  // { name: 'Logout', link: '/auth/logout',icon: 'Logout'},
];
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
