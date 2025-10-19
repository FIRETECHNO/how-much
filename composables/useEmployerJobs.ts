import { toast } from "vue3-toastify"
import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface"
import type { JobReservation, JobReservationDbWithEmployer } from "~/types/job-reservation.interface"

export function useEmployerJobs() {
  let jobs = useState<JobForm[]>(() => [])
  let reservedJob = useState<JobReservation | any>()

  function removeCurrentReservedJob() {
    reservedJob.value = null
  }

  async function getById(jobId: string): Promise<JobForm | null> {
    try {
      let res = await JobApi.getById(jobId);
      return res
    } catch (error) {
      console.log("error useEmployerJobs/getOrganizationJobs", error);
    }

    return null
  }

  async function getAll() {
    try {
      let {
        selectedJob,
        selectedExperience,
        selectedWorkFormat,
        salaryFrom,
        salaryTo
      } = useJobFormsFilters();

      let res = await JobApi.getAll(
        selectedJob.value,
        selectedExperience.value,
        selectedWorkFormat.value,
        salaryFrom.value,
        salaryTo.value
      )
      jobs.value = res;
    } catch (error) {
      console.log("error useEmployerJobs/getAll", error);
    }
  }

  async function reserveJob(jobId: string, employeeId: string) {
    try {
      const authStore = useAuth()
      const { isEmployer } = useRole();

      if (!isEmployer) {
        toast("Вы не можете забронировать!", { type: "error" })
        return
      }

      if (!authStore.user?._id) {
        console.log("error useEmployerJobs/reserveJob: no user presented");
        return
      }

      let date = new Date()
      let res = await JobApi.reserveJob(jobId, date.toISOString(), authStore.user._id, employeeId)

      reservedJob.value = res;
    } catch (error: any) {
      console.log("error useEmployerJobs/reserveJob", error);
    }
  }

  async function getReservedJob() {
    const authStore = useAuth()

    if (reservedJob.value?._id)
      return

    if (!authStore.user?._id) {
      console.log("error useEmployerJobs/reserveJob: no user presented");
      return
    }
    try {
      let res = await JobApi.getReservedJob(authStore.user._id)
      if (res != null)
        reservedJob.value = res;
    } catch (error: any) {
      console.log("error useEmployerJobs/getReservedJob", error);
    }
  }

  return {
    // vars
    jobs, reservedJob,
    // functions
    getById, getAll, reserveJob, getReservedJob, removeCurrentReservedJob
  }
}