export type ToastItem = {
  id: string;
  message: string;
  variant: "warning" | "success" | "error";
};

export type ToastContextValue = {
  warning: (message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};
