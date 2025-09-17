import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface"

export function useJobs() {
  async function getById(jobId: string): Promise<JobForm | null> {
    try {
      let res = await JobApi.getById(jobId);
      return res
    } catch (error) {
      console.log("error useJobs/getOrganizationJobs", error);
    }

    return null
  }


  return {
    // vars
    // functions
    getById
  }
}