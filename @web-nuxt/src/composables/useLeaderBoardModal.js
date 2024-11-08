const isModalVisible = ref(false);

const toggleModal = () => isModalVisible.value = !isModalVisible.value;

export const useLeaderBoardModal = () => {
    return {
        isModalVisible,
        toggleModal
    }
}