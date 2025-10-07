import { toast } from "vue3-toastify";
import JobApi from "~/api/JobApi"
import type { JobForm } from "~/types/job-form.interface";

export function useEmployeeJobForms() {
  let myJobForms = useState<JobForm[]>(() => [])


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
      myJobForms.value = res;
      console.log(res);

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



  return {
    // vars
    myJobForms,
    // functions
    getMyJobForms, approveJobForm, disapproveJobForm
  }
}