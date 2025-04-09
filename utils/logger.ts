import { ref } from "vue";

export const logger = ref({
  message: "",
  type: "info", // Can be "success", "error", "warning", etc.
});

/**
 * Logs messages for the application.
 * @param {string} message - The message to log.
 * @param {"success" | "error" | "info" | "warning"} type - The type of message.
 */
export function logMessage(message: string, type: "success" | "error" | "info" | "warning" = "info") {
  logger.value.message = message;
  logger.value.type = type;

  // Automatically clear message after some time (optional)
  setTimeout(() => {
    logger.value.message = "";
  }, 2000);
}