'use client';

import { toast } from 'sonner';

type ToastOptions = {
  description?: string;
};

export function showSuccessToast(title: string, options?: ToastOptions) {
  return toast.success(title, options);
}

export function showErrorToast(title: string, options?: ToastOptions) {
  return toast.error(title, options);
}

export function showInfoToast(title: string, options?: ToastOptions) {
  return toast.info(title, options);
}

export function showLoadingToast(title: string, options?: ToastOptions) {
  return toast.loading(title, options);
}

export function dismissToast(id?: string | number) {
  toast.dismiss(id);
}
