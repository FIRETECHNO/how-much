export function useJobFormsFilters() {
  const savedFilters = useCookie('job-filters', {
    default: () => ({
      job: null as string | null,
      experience: null as string | null,
      workFormat: null as string | null,
      salaryFrom: null as number | null,
      salaryTo: null as number | null,
    })
  });

  const selectedJob = useState(() => savedFilters.value.job);
  const selectedExperience = useState(() => savedFilters.value.experience);
  const selectedWorkFormat = useState(() => savedFilters.value.workFormat);
  const salaryFrom = useState(() => savedFilters.value.salaryFrom);
  const salaryTo = useState(() => savedFilters.value.salaryTo);

  function clearFilters() {
    selectedJob.value = null;
    selectedExperience.value = null;
    selectedWorkFormat.value = null;
    salaryFrom.value = null;
    salaryTo.value = null;

    applyFilters()
  }

  async function applyFilters() {
    // save filters
    savedFilters.value = { job: selectedJob.value, experience: selectedExperience.value, workFormat: selectedWorkFormat.value, salaryFrom: salaryFrom.value, salaryTo: salaryTo.value }
    await useEmployerJobs().getAll()
  }


  return {
    // vars
    selectedJob,
    selectedExperience,
    selectedWorkFormat,
    salaryFrom,
    salaryTo,

    // funcs
    clearFilters,
    applyFilters
  };
}