const selectedTab = ref("lobby");

const setSelectedTab = (tabName) => selectedTab.value = tabName

export const useGameCategory = () => {
    return {
        setSelectedTab,
        selectedTab
    }
}