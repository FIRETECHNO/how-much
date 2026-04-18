import { toast } from "vue3-toastify";
import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface";
import type { JobReservationDbWithEmployer, JobReservation } from "~/types/job-reservation.interface";
import { coerceBoolean } from "~/utils/coerceBoolean";

function pickEmployerVisible(raw: Record<string, unknown>): boolean | undefined {
  const keys = [
    'isEmployerVisible',
    'is_employer_visible',
    'visibleToEmployers',
    'visible_in_employer_catalog',
    'isListedForEmployers',
    'is_listed_for_employers',
    'publishedToEmployers',
    'published_to_employers',
    'employeePublished',
    'employee_published',
  ] as const
  for (const k of keys) {
    if (raw[k] !== undefined && raw[k] !== null)
      return coerceBoolean(raw[k])
  }
  if (raw.hiddenFromEmployers !== undefined && raw.hiddenFromEmployers !== null)
    return !coerceBoolean(raw.hiddenFromEmployers)
  if (raw.isHiddenFromEmployers !== undefined && raw.isHiddenFromEmployers !== null)
    return !coerceBoolean(raw.isHiddenFromEmployers)
  return undefined
}

function normalizeJobForm(raw: unknown): JobForm {
  const r = raw as Record<string, unknown>
  const isApproved = coerceBoolean(r.isApproved)
  const employerVisible = pickEmployerVisible(r)
  const next = { ...r, isApproved } as JobForm
  if (employerVisible !== undefined)
    next.isEmployerVisible = employerVisible
  return next
}

export function useEmployeeJobForms() {
  let myJobForms = useState<JobForm[]>("myJobForms", () => [])
  let myReservations = useState<JobReservationDbWithEmployer[]>('myReservations', () => [])

  let actualJobReservation = useState<JobReservationDbWithEmployer>()

  const BOOST_DELTA = 2 * 24 * 60 * 60 * 1000;

  async function getMyJobForms() {
    const authStore = useAuth()
    let { isEmployee } = useRole()
    if (!isEmployee.value) {
      console.log("error useEmployeeJobForms/getMyJobForms: you're not an employee!");
      return
    }

    if (!authStore.user?._id) {
      console.log("error useEmployeeJobForms/getMyJobForms: no user presented");
      return
    }
    try {
      let res = await JobApi.getMyJobForms(authStore.user._id)
      myJobForms.value = res.reverse().map((item) => normalizeJobForm(item))
    } catch (error: any) {
      console.log("error useEmployeeJobForms/getMyJobForms", error);
    }
  }

  async function approveJobForm(jobFormId: string) {
    try {
      await JobApi.approveJobForm(jobFormId)
      toast("Теперь анкета в общем доступе!", {
        type: "success"
      })
      await getMyJobForms()
    } catch (error: any) {
      console.log("error approveJobForm/getMyJobForms", error);
    }
  }
  async function disapproveJobForm(jobFormId: string) {
    try {
      await JobApi.disapproveJobForm(jobFormId)
      toast("Анкета спрятана!", {
        type: "warning"
      })
      await getMyJobForms()
    } catch (error: any) {
      console.log("error approveJobForm/getMyJobForms", error);
    }
  }

  async function boostJobForm(jobFormId: string) {
    try {
      let date = new Date()

      await JobApi.boostJobForm(jobFormId, date.toISOString())
      toast("Анкета поднята в поиске!", {
        type: "success"
      })
      await getMyJobForms()
    } catch (error: any) {
      console.log("error approveJobForm/getMyJobForms", error);
    }
  }

  async function getReservations() {
    let authStore = useAuth()

    if (!authStore.user?._id) {
      toast.error("Необходима авторизация")
      return;
    }

    try {
      let res = await JobApi.getReservations(authStore.user._id)

      myReservations.value = res;
    } catch (error) {
      console.log("error approveJobForm/getReservations", error);
    }
  }

  async function getActualReservedJob(jobReservation: string) {
    const authStore = useAuth()

    if (!authStore.user?._id) {
      console.log("error useEmployeeJobForms/reserveJob: no user presented");
      return
    }
    try {
      let res = await JobApi.getEmployeeReservationById(jobReservation)
      if (res != null)
        actualJobReservation.value = res;
    } catch (error: any) {
      console.log("error useEmployeeJobForms/getActualReservedJob", error);
    }
  }

  async function submitJobReservationFeedback(reservationId: string, feedback: string) {
    try {
      let res = await JobApi.submitJobReservationFeedback(reservationId, feedback, "employee")

      actualJobReservation.value = res
    } catch (error) {
      console.log("error useEmployerJobs/submitJobReservationFeedback", error);
    }
  }

  return {
    // vars
    myJobForms, BOOST_DELTA, myReservations, actualJobReservation,
    // functions
    getMyJobForms, approveJobForm, disapproveJobForm, boostJobForm, getReservations, getActualReservedJob, submitJobReservationFeedback,
  }
}