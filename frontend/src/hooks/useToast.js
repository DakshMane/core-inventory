import toast from 'react-hot-toast'

export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error:   (msg) => toast.error(msg),
    info:    (msg) => toast(msg),
  }
}