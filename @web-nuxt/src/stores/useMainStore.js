import axios from "axios";
import Bus from "@/composables/useBus";
import { useAxios } from "@/composables/useAxios";

export default defineStore("main", () => {
  const license = ref(null);
  const user = ref(null);
  const demo = ref(false);
  const theme = ref("main");
  const unit = ref("btc");
  const currency = ref(null);
  const liveFeedEntries = ref(10);
  const sound = ref(true);
  const quick = ref(false);
  const chat = ref(true);
  const betSlip = ref(false);
  const channel = ref("casino_en");
  const liveChannel = ref("all");
  const sidebar = ref(true);
  const fiatView = ref(false);
  const gameInstance = ref([]);
  const vip = ref(null);
  const games = ref([]);
  const providers = ref([]);
  const currencies = ref([]);
  const notifications = ref([]);
  const sportFilter = ref("live");
  const sportGames = ref([]);
  const recentGameHistory = ref([]);
  const phoenixConsoleSettings = ref([]);

  const apiClient = useAxios();

  // Actions
  function setSportFilter(filter) {
    sportFilter.value = filter;
  }

  function setFiatView(view) {
    fiatView.value = view;
  }

  function setGameInstance(instance) {
    gameInstance.value = { ...gameInstance.value, instance };
  }

  function setUserData(userData) {
    user.value = userData;
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  }

  function login(credentials, callback = null) {
    return apiClient.get('/sanctum/csrf-cookie').then(() => {
      apiClient.post('/auth/login', credentials, {
        withCredentials: true
      }).then(({ data }) => {
        setUserData(data);
        updateData();
        if (callback) callback();
      }).catch((e) => {
        console.log("lgiin fail", e);
        Bus.$emit('login:fail', e)
      });
    });
  }

  function logout() {
    user.value = null;
    axios.defaults.headers.common["Authorization"] = null;
  }

  function switchTheme(newTheme = null) {
    theme.value = newTheme || (theme.value === "main" ? "alternate" : "main");
    document
      .querySelector("html")
      ?.classList.replace(`theme--${theme.value}`, `theme--${newTheme}`);
  }

  function setCurrencies(newCurrencies) {
    currencies.value = newCurrencies;
  }

  function setProviders(newProviders) {
    providers.value = newProviders;
  }

  function setDemo(status) {
    demo.value = status;
  }

  function setUnit(newUnit) {
    unit.value = newUnit;
  }

  function setCurrency(newCurrency) {
    currency.value = newCurrency;
  }

  function setLiveFeedEntryCount(count) {
    liveFeedEntries.value = count;
  }

  function setSoundState(state) {
    sound.value = state;
  }

  function setQuickState(state) {
    quick.value = state;
  }

  function toggleChat(toggle = null) {
    chat.value = toggle !== null ? toggle : !chat.value;
    Bus.$emit("layoutSizeChange");
  }

  function toggleBetSlip(toggle = null) {
    betSlip.value = toggle !== null ? toggle : !betSlip.value;
  }

  function toggleSidebar(toggle = null) {
    sidebar.value = toggle !== null ? toggle : !sidebar.value;
    Bus.$emit("layoutSizeChange");
  }

  async function updateData() {
    try {
      const licenseResponse = await apiClient.post("/license");
      license.value = licenseResponse.data;

      const [gamesResponse, providersResponse, currenciesResponse, notificationsResponse, vipResponse] =
        await Promise.all([
          apiClient.post("/api/data/games"),
          apiClient.post("/api/data/providers"),
          apiClient.post("/api/data/currencies"),
          apiClient.post("/api/data/notifications"),
          apiClient.post("/api/vip"),
        ]);

      games.value = gamesResponse.data;
      providers.value = providersResponse.data;
      currencies.value = currenciesResponse.data;
      notifications.value = notificationsResponse.data;
      vip.value = vipResponse.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function setChatChannel(newChannel) {
    channel.value = newChannel;
  }

  function setLiveChannel(newChannel) {
    liveChannel.value = newChannel;
  }

  function pushRecentGame(id) {
    if (recentGameHistory.value.includes(id)) {
      recentGameHistory.value = recentGameHistory.value.filter((e) => e !== id);
    }
    recentGameHistory.value.push(id);
  }

  function phoenixConsoleToggle(value) {
    if (phoenixConsoleSettings.value.includes(value)) {
      phoenixConsoleSettings.value = phoenixConsoleSettings.value.filter((e) => e !== value);
    } else {
      phoenixConsoleSettings.value.push(value);
    }
  }

  function update() {
    if (user.value) axios.post('/auth/update').then(({ data }) => {
      setUserData({
        user: data,
        token: this.state.user.token
      })

      if (data.discord && !data.discord_bonus) {
        axios.post('/auth/discord_bonus');
      }
    }).catch(() => {
      const logOut = () => {
        // InvalidTokenModal.methods.open();

        // localStorage.clear();
        window.location.reload();
      };

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.$fixAuthError = logOut;
        console.log('');
        console.log(' * If you\'ve changed database, you can clear cache and fix errors above by entering following command:');
        console.log('window.$fixAuthError();');
        return;
      }

      logOut();
    });
  }

  // Getters
  const isGuest = computed(() => !user.value);
  const isCasino = computed(() => sportFilter.value === "casino");
  const demoMode = computed(() => !user.value || demo.value);
  const liveChannelAdjusted = computed(() =>
    !user.value && liveChannel.value === "mine" ? "all" : liveChannel.value
  );

  const showChat = computed(() => chat.value)

  return {
    // State
    showChat,
    license,
    user,
    demo,
    theme,
    unit,
    currency,
    liveFeedEntries,
    sound,
    quick,
    chat,
    betSlip,
    channel,
    liveChannel,
    sidebar,
    fiatView,
    gameInstance,
    vip,
    games,
    providers,
    currencies,
    notifications,
    sportFilter,
    sportGames,
    recentGameHistory,
    phoenixConsoleSettings,

    // Actions
    setSportFilter,
    setFiatView,
    setGameInstance,
    setUserData,
    login,
    logout,
    update,
    switchTheme,
    setCurrencies,
    setProviders,
    setDemo,
    setUnit,
    setCurrency,
    setLiveFeedEntryCount,
    setSoundState,
    setQuickState,
    toggleChat,
    toggleBetSlip,
    toggleSidebar,
    updateData,
    setChatChannel,
    setLiveChannel,
    pushRecentGame,
    phoenixConsoleToggle,

    // Getters
    isGuest,
    isCasino,
    demoMode,
    liveChannelAdjusted,
  };
});
