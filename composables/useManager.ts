import { toast } from "vue3-toastify";
import JobReqApi from "~/api/JobReqApi";
import type { JobFormFillRequestDBPopulated } from "~/types/job-form-fill-request.interface";

//!!! use only for manager role!
export function useManager() {
  const jobRequests = useState<JobFormFillRequestDBPopulated[]>(() => [])
  const myJobRequests = useState<JobFormFillRequestDBPopulated[]>(() => [])


  // all temporary job form fill requests for manager
  async function getAllRequests() {
    try {
      let res = await JobReqApi.getAllRequests()
      jobRequests.value = res;
    } catch (error) {
      console.error("useManager/getAllRequests error: ", error);
    }
  }

  async function setManager(requestId: string) {
    try {
      let { user } = useAuth()
      if (!user?._id) {
        return
      }
      let reqToSend: JobFormFillRequestDBPopulated | null = null;
      for (let r of jobRequests.value) {
        if (r._id == requestId) {
          reqToSend = r
        }
      }

      if (!reqToSend) return

      let res = await JobReqApi.setManager(requestId, reqToSend.employee.tgId, user._id, user.name)

      if (res) {
        for (let i = 0; i < jobRequests.value.length; i++) {
          if (jobRequests.value[i]._id == requestId) {
            jobRequests.value.splice(i, 1)
            break
          }
        }
        toast.success("Вы успешно назначили себя менеджером!")
      }
    } catch (error) {
      console.error("useManager/setManager error: ", error);
    }
  }

  async function getMyJobRequests() {
    try {
      let { user } = useAuth()
      if (!user?._id) {
        return
      }

      let res = await JobReqApi.getJobRequestsByManager(user._id)

      myJobRequests.value = res
    } catch (error) {
      console.error("useManager/getMyJobRequests error: ", error);
    }
  }


  return {
    // vars
    jobRequests, myJobRequests,
    // functions
    getAllRequests, setManager, getMyJobRequests
  }
}