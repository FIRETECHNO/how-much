import JobApi from "~/api/JobApi";
import JobReqApi from "~/api/JobReqApi";
import type { JobFormFillRequest, JobFormFillRequestDB, JobFormFillRequestDBPopulatedManager } from "~/types/job-form-fill-request.interface";
import type { User } from "~/types/user.interface";

export function useEmployeeJobFormFillRequest() {
  let jobFormFillRequests = useState<JobFormFillRequestDB[]>(() => [])

  let shortJobFormFillRequest = computed<JobFormFillRequestDB | null>(() => {
    if (jobFormFillRequests.value.length == 1) {
      // if (!jobFormFillRequests.value[0].startDate && !jobFormFillRequests.value[0].endDate)
      return jobFormFillRequests.value[0]
    }
    return null
  })

  let latestRequest = computed<JobFormFillRequestDB | null>(() => {
    return jobFormFillRequests.value[jobFormFillRequests.value.length - 1]
  })

  let isLatestRequestShort = computed<boolean>(() => {
    if (!latestRequest.value?.startDate || !latestRequest.value?.endDate) {
      return true
    }
    return false;
  })

  async function createJobFormFillRequestShort(employeeId: string, job: string, tgId: User["tgId"]) {
    try {
      let requestFromDb = await JobApi.createJobFormFillRequestShort(employeeId, job, tgId)
      jobFormFillRequests.value.push(requestFromDb)
    } catch (error) {
      console.log("error useEmployeeJobFormFillRequest/createJobFormFillRequestShort", error);
    }
  }

  async function getMyRequests(employeeId: string) {
    if (jobFormFillRequests.value.length > 0) return;

    try {
      let requestsFromDb = await JobApi.getMyJobFormFillRequests(employeeId)
      jobFormFillRequests.value = requestsFromDb
    } catch (error) {
      console.log("error useEmployeeJobFormFillRequest/createJobFormFillRequestShort", error);
    }
  }
  async function createJobFormFillRequest(request: JobFormFillRequest) {
    try {
      let requestFromDb = await JobApi.createJobFormFillRequest(request)
      jobFormFillRequests.value.push(requestFromDb)
    } catch (error) {
      console.log("error useEmployeeJobFormFillRequest/createJobFormFillRequest", error);
    }
  }

  async function updateJobFormFillRequest(requestId: string, request: JobFormFillRequest) {
    try {
      let user = useAuth().user
      if (!user) return;

      let requestFromDb = await JobApi.updateJobFormFillRequest(requestId, request, user?.tgId)

      for (let i = 0; i < jobFormFillRequests.value.length; i++) {
        if (jobFormFillRequests.value[i]._id == requestFromDb._id) {
          jobFormFillRequests.value[i] = requestFromDb
        }
      }
    } catch (error) {
      console.log("error useEmployeeJobFormFillRequest/updateJobFormFillRequest", error);
    }
  }

  async function getRequestById(requestId: string): Promise<JobFormFillRequestDB | null> {
    try {
      let requestFromDb = await JobApi.getJobFormFillRequestById(requestId)
      return requestFromDb
    } catch (error) {
      console.log("error useEmployeeJobFormFillRequest/getRequestById", error);
      return null
    }
  }

  async function getRequestByIdForConfirmation(requestId: string): Promise<JobFormFillRequestDBPopulatedManager | null> {
    let requestFromDb = await JobApi.getRequestByIdForConfirmation(requestId)
    return requestFromDb
  }

  async function getPossibleTimeSlots(): Promise<{
    startDate: string,
    availableManagers: number
  }[] | null> {
    try {
      return await JobReqApi.getPossibleTimeSlots()
    } catch (error) {
      console.log("error useEmployeeJobFormFillRequest/getPossibleTimeSlots", error);
      return null
    }
  }

  async function employeeConfirmFormFillReq(requestId: string) {
    return await JobReqApi.employeeConfirmFormFillReq(requestId)
  }

  return {
    // vars
    jobFormFillRequests, shortJobFormFillRequest, latestRequest, isLatestRequestShort,
    // functions
    createJobFormFillRequestShort, getMyRequests, createJobFormFillRequest, updateJobFormFillRequest, getRequestById, getPossibleTimeSlots,
    getRequestByIdForConfirmation, employeeConfirmFormFillReq,
  }
}