import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface"

export function useAdminJobs() {
  let jobForms = useState<JobForm[]>(() => [])
  function add(data: JobForm) {
    jobForms.value.push(data)
  }


  async function getJobs() {
    try {
      let res = await JobApi.getJobs();

      if (res?.length > 0) {
        jobForms.value = res
      }
    } catch (error) {
      console.log("error useAdminJobs/getOrganizationJobs", error);
    }
  }


  return {
    // vars
    jobForms,
    // functions
    add, getJobs
  }
}