import type { User } from "~/types/user.interface"

export default {
  getNotModeratedEmployers(): Promise<User[]> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<any>('/admin/employers/not-moderated', { method: 'POST' })
  },
}