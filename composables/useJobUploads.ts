import type { JobForm_upload } from "~/types/job-form.interface.ts"
import JobApi from "~/api/JobApi";

export function useJobUploads() {
  let uploads = useState<JobForm_upload[]>(() => [])

  function startUploading(jobForm: { job: string, fullName: string, coverLetter: string }) {
    uploads.value.push({ ...jobForm, startDate: new Date(), tmpId: Date.now(), video: { src: "" } })
  }

  function setVideoForUpload(videoUrl: string, tmpId: number) {
    for (let i = 0; i < uploads.value.length; i++) {
      if (uploads.value[i].tmpId == tmpId) {
        uploads.value[i].video.src = videoUrl;
        break;
      }
    }
  }

  async function saveJob(tmpId: number): Promise<boolean> {
    for (let upload of uploads.value) {
      if (upload.tmpId == tmpId) {
        try {
          let res = await JobApi.saveJob(upload)
          if (res?._id) {
            useAdminJobs().add(res)
            return true
          }
        } catch (error) {
          console.error("useJobUploads/saveJob error:", error);
          return false;
        }
      }
    }
    return false
  }

  return {
    // vars
    uploads,
    // functions
    startUploading,
    setVideoForUpload,
    saveJob,
  }
}