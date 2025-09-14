import type { JobForm_upload } from "~/types/job-form.interface.ts"

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

  return {
    // vars
    uploads,
    // functions
    startUploading,
    setVideoForUpload
  }
}