import { toast } from "vue3-toastify";
import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface";
import type { JobReservationDbWithEmployer, JobReservation } from "~/types/job-reservation.interface";

export function useEmployeeJobForms() {
  let myJobForms = useState<JobForm[]>("myJobForms", () => [])
  let myReservations = useState<JobReservationDbWithEmployer[]>('myReservations', () => [])

  let actualJobReservation = useState<JobReservationDbWithEmployer>()

  const BOOST_DELTA = 2 * 24 * 60 * 60 * 1000;

  async function getMyJobForms() {
    const authStore = useAuth()
    let { isEmployee } = useRole()
    if (!isEmployee.value) {
      console.log("error useEmployeeJobForms/getMyJobForms: you're not an employee!");
      return
    }

    if (!authStore.user?._id) {
      console.log("error useEmployeeJobForms/getMyJobForms: no user presented");
      return
    }
    try {
      let res = await JobApi.getMyJobForms(authStore.user._id)
      myJobForms.value = res.reverse();
    } catch (error: any) {
      console.log("error useEmployeeJobForms/getMyJobForms", error);
    }
  }

  async function approveJobForm(jobFormId: string) {
    try {
      let res = await JobApi.approveJobForm(jobFormId)
      if (res._id) {
        for (let i = 0; i < myJobForms.value.length; i++) {
          if (myJobForms.value[i]._id == res._id) {
            myJobForms.value[i].isApproved = true;
            toast("Теперь анкета в общем доступе!", {
              type: "success"
            })
            break;
          }
        }
      }

    } catch (error: any) {
      console.log("error approveJobForm/getMyJobForms", error);
    }
  }
  async function disapproveJobForm(jobFormId: string) {
    try {
      let res = await JobApi.disapproveJobForm(jobFormId)
      if (res._id) {
        for (let i = 0; i < myJobForms.value.length; i++) {
          if (myJobForms.value[i]._id == res._id) {
            myJobForms.value[i].isApproved = false;
            toast("Анкета спрятана!", {
              type: "warning"
            })
            break;
          }
        }
      }

    } catch (error: any) {
      console.log("error approveJobForm/getMyJobForms", error);
    }
  }

  async function boostJobForm(jobFormId: string) {
    try {
      let date = new Date()

      let res = await JobApi.boostJobForm(jobFormId, date.toISOString())
      if (res._id) {
        for (let i = 0; i < myJobForms.value.length; i++) {
          if (myJobForms.value[i]._id == res._id) {
            myJobForms.value[i].isApproved = true;
            myJobForms.value[i].lastRaiseDate = res.lastRaiseDate;
            toast("Анкета поднята в поиске!", {
              type: "success"
            })
            break;
          }
        }
      }

    } catch (error: any) {
      console.log("error approveJobForm/getMyJobForms", error);
    }
  }

  async function getReservations() {
    let authStore = useAuth()

    if (!authStore.user?._id) {
      toast.error("Необходима авторизация")
      return;
    }

    try {
      let res = await JobApi.getReservations(authStore.user._id)

      myReservations.value = res;
    } catch (error) {
      console.log("error approveJobForm/getReservations", error);
    }
  }

  async function getActualReservedJob(jobReservation: string) {
    const authStore = useAuth()

    if (!authStore.user?._id) {
      console.log("error useEmployeeJobForms/reserveJob: no user presented");
      return
    }
    try {
      let res = await JobApi.getEmployeeReservationById(jobReservation)
      if (res != null)
        actualJobReservation.value = res;
    } catch (error: any) {
      console.log("error useEmployeeJobForms/getActualReservedJob", error);
    }
  }

  async function submitJobReservationFeedback(reservationId: string, feedback: string) {
    try {
      let res = await JobApi.submitJobReservationFeedback(reservationId, feedback, "employee")

      actualJobReservation.value = res
    } catch (error) {
      console.log("error useEmployerJobs/submitJobReservationFeedback", error);
    }
  }

  return {
    // vars
    myJobForms, BOOST_DELTA, myReservations, actualJobReservation,
    // functions
    getMyJobForms, approveJobForm, disapproveJobForm, boostJobForm, getReservations, getActualReservedJob, submitJobReservationFeedback,
  }
}