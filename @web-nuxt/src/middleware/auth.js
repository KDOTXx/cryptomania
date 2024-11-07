export default defineNuxtRouteMiddleware((to, from) => {
    const { openAuthModal } = useAuthModal();
    const store = useMainStore();

    if (store.isGuest) {
        openAuthModal();

        return navigateTo('/')
    }
})