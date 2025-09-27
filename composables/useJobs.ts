import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface"

export function useJobs() {
  let jobs = useState<JobForm[]>(() => [])

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

  return {
    // vars
    jobs,
    // functions
    getById, getAll
  }
}