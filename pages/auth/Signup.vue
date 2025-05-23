<template>
  <div class="bg-transparent">
    <form
      class="min-w-[300px] mx-auto"
      @submit.prevent="authStore.step === 1 ? handleSignup() : handleOTP()"
    >
      <div v-if="authStore.step === 1">
        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
            >Your email</label
          >
          <input
            type="email"
            id="email"
            v-model.trim="email"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light outline-none"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
            >Your password</label
          >
          <input
            type="password"
            id="password"
            v-model.trim="password"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light outline-none"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="fullName"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
            >Full Name</label
          >
          <input
            type="text"
            id="fullName"
            v-model.trim="fullName"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light outline-none"
            required
          />
        </div>
        <div class="flex items-start mb-5">
          <div class="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 outline-none"
              required
            />
          </div>
          <label
            for="terms"
            class="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            >I agree with the
            <NuxtLink
              to="/terms-and-conditions"
              class="text-blue-600 hover:underline dark:text-blue-500"
              >terms and conditions</NuxtLink
            ></label
          >
        </div>
        <div class="flex flex-col gap-3">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Continue Signup
          </button>
          <NuxtLink
            to="/auth/login"
            class="text-sm text-center font-medium text-gray-500 hover:underline dark:text-gray-400"
            >Already have an account? Log In</NuxtLink
          >
        </div>
      </div>

      <!-- Step 2: 2FA Verification -->
      <div v-else="authStore.step === 2 && authStore.qrCode">
        <div class="mb-5">
          <p class="text-center text-gray-900 dark:text-white">
            Scan this QR code for 2FA
          </p>
          <img
            :src="authStore.qrCode as string | undefined"
            alt="2FA QR Code"
            class="mx-auto w-40 h-40"
          />
        </div>
        <div class="mb-5">
          <label
            for="otp"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Enter OTP</label
          >
          <input
            type="number"
            id="otp"
            v-model.number="otp"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            required
          />
        </div>
        <div class="flex flex-wrap gap-3 justify-between">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Verify & Complete Signup
          </button>
          <button
            type="button"
            @click.prevent="cancelOtp"
            class="text-gray-900 dark:text-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
          >
            Go back
          </button>
        </div>
      </div>

      <!-- Google Sign-In Button -->
      <hr
        class="my-[40px] border-gray-700"
        v-if="!(authStore.step === 2)"
      />
      <button
        type="button"
        v-if="!(authStore.step === 2)"
        @click.prevent="handleGoogleSignup"
        :disabled="loading"
        class="w-full mt-3 flex items-center justify-center gap-2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8c0-14.9-1.3-29.2-3.8-43.1H250.3v81.9h134.2c-6 32.4-23.7 59.9-50.3 78.4v65.2h81.2c47.5-43.8 74.6-108.4 74.6-182.4zM250.3 500c67.6 0 124.2-22.4 165.6-60.5l-81.2-65.2c-22.2 15-50.5 23.9-84.4 23.9-65.2 0-120.3-44.1-140-103.5H3.9v64.7C44.8 437.3 140 500 250.3 500zM110.3 303.1c-5.1-15-7.8-31-7.8-47.5s2.8-32.5 7.8-47.5V144H3.9C-8 172.4-16 205.3-16 240s8 67.6 19.9 96h106.4v-32.9zM250.3 100c36.3 0 68.4 12.5 93.9 33.1l69.7-69.7C374.5 22.4 317.9 0 250.3 0 140 0 44.8 62.7 3.9 160.1l106.4 64.7c19.7-59.4 74.8-103.5 140-103.5z"
          />
        </svg>
        Sign up with Google
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

definePageMeta({ layout: "auth" });
useHead({ title: "Sign Up" });

const router = useRouter();
const authStore = useAuthStore();

// Form Data
const email = ref("");
const password = ref("");
const fullName = ref("");
const otp = ref("");

const loading = ref(false);
const cancelOtp = () => {
  authStore.step = 1;
};

const sanitizeName = (input: string) => {
  const hasSpecialChars = /[^a-zA-Z0-9 ]/.test(input);

  if (hasSpecialChars) {
    logMessage("Please enter a valid name", "error");
  }
  return null;
};

const sanitizeInput = (input: string) => {
  const element = document.createElement("div");
  element.innerText = input;
  return element.textContent || '';
};

// Step 1: Handle Signup
const handleSignup = async () => {
  loading.value = true;
  console.log('handleSignup');
  

  try {
    const sanitizedEmail = sanitizeInput(email.value);
    const sanitizedPassword = sanitizeInput(password.value);
    const sanitizedFullName = sanitizeName(fullName.value); // Add sanitization for fullName

    if (sanitizedEmail && sanitizedPassword && sanitizedFullName) {
      const response = await authStore.signup(
        sanitizedEmail,
        sanitizedPassword,
        sanitizedFullName // Pass sanitized full name
      );
      loading.value = false;
    }
    
    const success = await authStore.signup(email.value, password.value, fullName.value)
    if (success) {
      authStore.step = 2
    }else{
      logMessage( 'Signup failed. Please try again.', 'error')
    }
  } catch (err: any) {
    logMessage(err.message || "Signup failed. Please try again.", "error");
  }
};

const handleGoogleSignup = async () => {
  loading.value = true;

  try {
    await authStore.googleSSOLogin();
      navigateTo('/') 
  } catch (err: any) {
    logMessage(
      err.message || "Google Signup failed. Please try again.",
      "error"
    );
  } finally {
    loading.value = false;
  }
};

// Step 2: Verify OTP
const handleOTP = async () => {
  const sanitizedOtp = sanitizeInput(String(otp.value));

  if (sanitizedOtp == undefined) {
    logMessage("Invalid OTP. Please enter a valid OTP.", "error");
    return;
  }

  if (sanitizedOtp.length !== 6 ) {
    logMessage("Invalid OTP. Please enter a valid 6-digit OTP.", "error");
    return;
  }
  const success = await authStore.signup(
    email.value,
    password.value,
    fullName.value,
    sanitizedOtp
  );
  if (success) {
    logMessage("Signup successful.", "success");
    router.push("/");
  }
};
</script>
