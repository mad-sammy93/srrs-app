import { ref } from "vue";

export function useLogger() {
  const message = ref<string | null>(null);
  const type = ref<"success" | "error" | "info" | "warning">("info");

  /**
   * Log a message with a specific type.
   * @param msg The message to display.
   * @param msgType The type of message (success, error, info, warning).
   */
  const logMessage = (msg: string, msgType: "success" | "error" | "info" | "warning" = "info") => {
    message.value = msg;
    type.value = msgType;

    // Auto-clear the message after 5 seconds
    setTimeout(() => {
      message.value = null;
    }, 3000);
  };

  return {
    message,
    type,
    logMessage,
  };
}
