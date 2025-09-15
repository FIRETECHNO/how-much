export default {
  async saveJob(jobForm: any): Promise<boolean> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch("/job-form/create", {
      method: "POST",
      body: {
        jobForm
      }
    })
  }
}