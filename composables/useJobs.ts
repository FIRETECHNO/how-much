import { toast } from "vue3-toastify"
import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface"
import type { JobReservation } from "~/types/job-reservation.interface"

export function useJobs() {
  let jobs = useState<JobForm[]>(() => [])
  let reservedJob = useState<JobReservation>()


  async function getById(jobId: string): Promise<JobForm | null> {
    try {
      let res = await JobApi.getById(jobId);
      return res
    } catch (error) {
      console.log("error useJobs/getOrganizationJobs", error);
    }

    return null
  }

  async function getAll() {
    try {
      let res = await JobApi.getAll()
      jobs.value = res;
    } catch (error) {
      console.log("error useJobs/getAll", error);
    }
  }

  async function reserveJob(jobId: string) {
    try {
      const authStore = useAuth()
      const { isEmployer } = useRole();

      if (!isEmployer) {
        toast("Вы не можете забронировать!", { type: "error" })
        return
      }

      if (!authStore.user?._id) {
        console.log("error useJobs/reserveJob: no user presented");
        return
      }

      let date = new Date()
      let res = await JobApi.reserveJob(jobId, date.toISOString(), authStore.user._id)

      reservedJob.value = res;
    } catch (error: any) {
      console.log("error useJobs/reserveJob", error);
    }
  }

  async function getReservedJob() {
    const authStore = useAuth()

    if (!authStore.user?._id) {
      console.log("error useJobs/reserveJob: no user presented");
      return
    }
    try {
      let res = await JobApi.getReservedJob(authStore.user._id)
      if (res != null)
        reservedJob.value = res;
    } catch (error: any) {
      console.log("error useJobs/getReservedJob", error);
    }
  }

  return {
    // vars
    jobs, reservedJob,
    // functions
    getById, getAll, reserveJob, getReservedJob
  }
}