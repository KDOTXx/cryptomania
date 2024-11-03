const type = ref("auth");
const isModalVisible = ref(false);

const openAuthModal = (typeModal = "auth") => {
  type.value = typeModal == "auth" ? "auth" : "register";

  isModalVisible.value = true;
}

const handleTypeChange = ({ tabType }) => type.value = tabType

export const useAuthModal = () => {
  return {
    type, isModalVisible, openAuthModal, handleTypeChange
  }
}
