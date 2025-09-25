export const useRole = () => {
  const authStore = useAuth();
  const config = useRuntimeConfig();

  const isAdmin = computed(() => {
    if (!authStore.user) {
      return false;
    }

    const hasManagerRole = authStore.user.roles.includes('manager');
    if (!hasManagerRole) {
      return false;
    }
    const adminEmails = config.public.adminEmails ? config.public.adminEmails.split(',') : [];
    console.log(authStore.user.email, adminEmails);

    for (let email of adminEmails) {
      if (email === authStore.user.email) {
        return true
      }
    }
    return false;
  });

  const isManager = computed(() => {
    if (!authStore.user) {
      return false;
    }

    const hasManagerRole = authStore.user.roles.includes('manager');
    if (!hasManagerRole) {
      return false;
    }

    return true;
  })

  return {
    isAdmin, isManager
  };
};