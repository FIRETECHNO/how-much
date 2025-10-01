import AdminApi from "~/api/AdminApi";
import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface"
import type { User } from "~/types/user.interface";

export function useAdminJobs() {
  let jobForms = useState<JobForm[]>(() => [])
  let notModeratedEmployers = useState<User[]>(() => [])

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


  async function getNotModeratedEmployers() {
    try {
      let res = await AdminApi.getNotModeratedEmployers()

      notModeratedEmployers.value = res
    } catch (error) {
      console.log("error useAdminJobs/getNotModeratedEmployers", error);
    }
  }

  async function moderateEmployer(userId: string, value: boolean) {
    try {
      let res = await AdminApi.moderateEmployer(userId, value)
      console.log(res);

    } catch (error) {
      console.log("error useAdminJobs/moderateEmployer", error);
    }
  }


  return {
    // vars
    jobForms, notModeratedEmployers,
    // functions
    add, getJobs, getNotModeratedEmployers, moderateEmployer
  }
}