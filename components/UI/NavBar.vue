<template>
  <div>
    <nav class="bg-sky-400 border-gray-200 dark:bg-slate-800 relative">
      <div class="flex flex-wrap items-center justify-between mx-auto px-4">
        <NuxtLink
          to="/"
          class="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <UIAtomsLogo
            :color="`#fff`"
            width="140"
          />
        </NuxtLink>
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-language"
        >
          
          <button @click="showUserMenu = !showUserMenu" class="flex flex-row items-center gap-2 text-white text-lg ">
            <span
              class="text-md font text-gray-700 hover:border-gray  h-8 min-w-8 bg-white dark:bg-slate-600 dark:text-white  rounded-2xl p-2 justify-center m-auto flex items-center"
              
            >
              {{ getInitials(authStore.myDetails?.fullName) }}
            </span>
              {{ authStore.myDetails?.fullName }}
              <span
            class="flex w-3 h-3 me-3 bg-green-500 rounded-full"
            aria-hidden="true"
            tooltip="Online"
            v-if="authStore.isAuthenticated"
          ></span>
          </button>
          <div
            id="dropdownAvatar"
            :class="(showUserMenu)? 'absolute top-[70px] right-2':'hidden' "
            class="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
          >
            <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div>{{ authStore.myDetails?.fullName }}</div>
              <div class="font-medium truncate">{{ authStore.myDetails?.email }}</div>
            </div>
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownUserAvatarButton"
            >
              <li>
                <NuxtLink
                  :to="'/'"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Dashboard</NuxtLink
                >
              </li>
            </ul>
            <div class="py-2">
              <NuxtLink
                v-if="authStore.isAuthenticated"
                to="/auth/logout"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >Sign out</NuxtLink
              >
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();

const showUserMenu = ref(false);

const getInitials = (fullName: string | undefined)  => {
  if( fullName ){
    return fullName
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0].toUpperCase())
      .join('');
  }
}
</script>

<style scoped></style>
