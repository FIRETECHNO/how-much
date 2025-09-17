import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface"

export function useAdminJobs() {
  let jobForms = useState<JobForm[]>(() => [])
  function add(data: JobForm) {
    jobForms.value.push(data)
  }


  async function getOrganizationJobs() {
    try {
      let res = await JobApi.getOrganizationJobs();

      if (res?.length > 0) {
        jobForms.value = res
      }
    } catch (error) {
      console.log("useAdminJobs/getOrganizationJobs", error);
    }
  }


  return {
    // vars
    jobForms,
    // functions
    add, getOrganizationJobs
  }
}