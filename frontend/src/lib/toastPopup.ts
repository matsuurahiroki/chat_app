import { notifications } from "@mantine/notifications";

const baseStyles = {
  root: {
    backgroundColor: "#ecfeff",
    border: "1px solid #22d3ee",
    borderRadius: "16px",
    width: "100%",
    minHeight: "60px",
    padding: "12px 16px",
  },
  title: {
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: 700,
  },
  description: {
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  closeButton: {
    color: "#0891b2",
  },
};

const TOAST_COOLDOWN = 2800;
let lastShownAt = 0;

const canShowToast = () => {
  const now = Date.now();

  if (now - lastShownAt < TOAST_COOLDOWN) {
    return false;
  }

  lastShownAt = now;
  return true;
};

export const toast = {
  success: (message: string, title = "成功") => {
    if (!canShowToast()) return;

    notifications.show({
      title,
      message,
      autoClose: 1800,
      position: "top-center",
      withBorder: false,
      styles: {
        root: {
          ...baseStyles.root,
          backgroundColor: "#ecfdf5",
          border: "1px solid #10b981",
        },
        title: {
          ...baseStyles.title,
          color: "#065f46",
        },
        description: {
          ...baseStyles.description,
          color: "#065f46",
        },
        closeButton: {
          color: "#065f46",
        },
      },
    });
  },

  success_m: (message: string, title = "成功") => {
    if (!canShowToast()) return;

    notifications.show({
      title,
      message,
      autoClose: 900,
      position: "top-right",
      withBorder: false,
      styles: {
        root: {
          ...baseStyles.root,
          backgroundColor: "#ecfdf5",
          border: "1px solid #10b981",
        },
        title: {
          ...baseStyles.title,
          color: "#065f46",
        },
        description: {
          ...baseStyles.description,
          color: "#065f46",
        },
        closeButton: {
          color: "#065f46",
        },
      },
    });
  },

  error: (message: string, title = "エラー") => {
    if (!canShowToast()) return;

    notifications.show({
      title,
      message,
      withCloseButton: false,
      autoClose: 1800,
      position: "top-center",
      styles: {
        root: {
          ...baseStyles.root,
          backgroundColor: "#fef2f2",
          border: "1px solid #ef4444",
        },
        title: {
          ...baseStyles.title,
          color: "#ef4444",
        },
        description: {
          ...baseStyles.description,
          color: "#991b1b",
        },
        closeButton: {
          color: "#991b1b",
        },
      },
    });
  },

  warning: (message: string, title = "注意") => {
    if (!canShowToast()) return;

    notifications.show({
      title,
      message,
      autoClose: 3000,
      position: "top-center",
      withBorder: false,
      styles: {
        root: {
          ...baseStyles.root,
          backgroundColor: "#fefce8",
          border: "1px solid #eab308",
        },
        title: {
          ...baseStyles.title,
          color: "#854d0e",
        },
        description: {
          ...baseStyles.description,
          color: "#854d0e",
        },
        closeButton: {
          color: "#854d0e",
        },
      },
    });
  },
};
