import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    show: false,
    message: '',
    color: 'error',
    timeout: 3000
  }),
  actions: {
    showMessage(message: string, color = 'error') {
      this.message = message
      this.color = color
      this.show = true
    }
  }
})
