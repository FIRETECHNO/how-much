import { toast } from "vue3-toastify";
import JobApi from "~/api/JobApi";
import type { JobReservationDb } from "~/types/job-reservation.interface";


export function useEmployer() {
  let jobFormsHistory = useState<JobReservationDb[]>("jobFormsHistory", () => [])
  let RESERVATION_DURATION = 30 * 60 * 1000

  async function getJobFormsHistory() {
    let { user } = useAuth()
    if (!user?._id) {
      toast.error("Необходима авторизация")
      return;
    }
    try {
      let res = await JobApi.getEmployerJobFormsHistory(user._id)
      jobFormsHistory.value = res.reverse();
    } catch (error) {
      console.log("useEmployer/getJobFormsHistory error: ", error);
    }
  }

  return {
    // vars
    jobFormsHistory, RESERVATION_DURATION,
    // functions
    getJobFormsHistory
  }
}