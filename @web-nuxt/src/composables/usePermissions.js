import useMainStore from "@/stores/useMainStore";

export function usePermissions() {
  const store = useMainStore();

  function $checkPermission(permissionId, checkType = "active") {
    if (process.env.NODE_ENV === "demo" && !store.isGuest) return true;

    if (store.isGuest) return false;
    if (store.user.roles.filter((e) => e.id === "*").length > 0) return true;

    return (
      store?.user.permissions.some((role) =>
        role.permissions.some(
          (permission) =>
            permission.id === permissionId && permission.permissions[checkType]
        )
      ) ?? false
    );
  }

  function $isAvailable(feature) {
    return (
      store.license?.enabledFeatures.some(
        (enabledFeature) => enabledFeature.id === feature
      ) ?? false
    );
  }

  function $hasPlugin(id) {
    return store.license?.plugins.includes(id) ?? false;
  }

  return {
    $checkPermission,
    $isAvailable,
    $hasPlugin,
  };
}
