import type { User } from "~/types/user.interface"
import type { JobReservationDbWithEmployer } from "~/types/job-reservation.interface"
import type { CreateInvitePayload, Invite } from "~/types/invite.interface"

export default {
  getNotModeratedEmployers(): Promise<User[]> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<any>('/admin/employers/not-moderated', { method: 'POST' })
  },
  moderateEmployer(userId: string, value: boolean): Promise<any> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<any>('/admin/employers/moderate', {
      method: 'POST',
      body: {
        userId,
        value
      }
    })
  },
  findEmployee(email: string): Promise<User> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<User>('/admin/employees/find', {
      method: 'POST',
      body: {
        email
      }
    })
  },
  getAllReservations(): Promise<JobReservationDbWithEmployer[]> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<JobReservationDbWithEmployer[]>('/admin/job-reservations/get-all', {
      method: 'POST',
      body: {
      }
    })
  },
  getAllInvites(): Promise<Invite[]> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<Invite[]>('/invites/get-all', {
      method: 'GET',
    })
  },
  createInvite(payload: CreateInvitePayload): Promise<any> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<any>('/invites/create', {
      method: 'POST',
      body: payload
    })
  }
}