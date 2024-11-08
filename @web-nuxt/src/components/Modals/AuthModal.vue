<script setup>
import Bus from "@/composables/useBus";
import useMainStore from "@/stores/useMainStore";
import { useAxios } from "@/composables/useAxios";
import useGoogleRecaptcha from "@/composables/useGoogleRecaptcha";

const { isModalVisible, type, handleTypeChange } = useAuthModal();
const store = useMainStore();
const apiClient = useAxios();
const { $toast } = useNuxtApp();
const { t } = useI18n();
const { executeRecaptcha } = useGoogleRecaptcha();

const email = ref("");
const loginName = ref("");
const password = ref("");
const inviteCode = ref(null);
const captchaPayload = ref(null);

const openForgotPasswordModal = () => {
  Bus.$emit("modal:close");
  ForgotPasswordModal.methods.open();
};

const login = async (callback = null) => {
  const { token } = await executeRecaptcha("submit");

  store
    .login(
      {
        login: loginName.value,
        password: password.value,
        captcha: token,
      },
      callback
    )
    .then(() => {
      console.log("Logged in successfully!");
      if (this.callback) this.callback();
    })
    .catch(() => {
      $toast.error(t("general.auth.wrong_credentials"));
    });
};

const register = () => {
  apiClient
    .post(
      "/auth/register",
      {
        email: email.value,
        name: loginName.value,
        password: password.value,
        captcha: captchaPayload.value,
      }
    )
    .then(({ data }) => {
      store.setUserData(data);
      store.updateData();

      Bus.$emit("login:success");
      $toast.success(t("general.profile.verify_email"));
    })
    .catch((e) => Bus.$emit("register:fail", e));
};

const handleSubmit = () => {
  props.type == "auth" ? login() : register();
};

onMounted(async () => {
  if (typeof URLSearchParams === "function") {
    const params = new URLSearchParams(window.location.search);
    if (params.has("c")) inviteCode.value = params.get("c");
  }

  Bus.$on(
    "login:fail",
    () => $toast.error(t("general.auth.wrong_credentials")),
    true
  );

  Bus.$on("login:success", () => (model.value = false));
  Bus.$on("register:fail", (e) => {
    if (e.response.data.code === 1) {
      inviteCode.value = "";
      return $toast.error("Invalid invite code.");
    }

    const errors = e.response.data.errors;

    Object.keys(errors).forEach((key) => {
      const values = errors[key];

      switch (key) {
        case "email": {
          values.forEach((value) => {
            if (value === "validation.email") {
              $toast.error("Invalid email");
            } else if (value === "validation.unique") {
              $toast.error("This email is already registered");
            }
          });
          break;
        }
        case "name": {
          values.forEach((value) => {
            if (value === "validation.regex") {
              $toast.error(
                "Your login has less than 4 characters or contains invalid symbols"
              );
            } else if (value === "validation.unique") {
              $toast.error(
                "This login is already registered, pick something else"
              );
            }
          });
          break;
        }
        case "password": {
          values.forEach((value) => {
            if (value === "validation.min.string") {
              $toast.error("Password should have at least 5 characters");
            }
          });
          break;
        }
      }
    });
  });
});
</script>

<template>
  <Modal v-model="isModalVisible">
    <div class="auth-promo"></div>
    <div class="auth-block-1">
      <div class="auth-tabs">
        <div class="auth-tab" @click="handleTypeChange({ tabType: 'auth' })" :class="type === 'auth' ? 'active' : ''">
          {{ $t("general.auth.login") }}
        </div>
        <div class="auth-tab" @click="handleTypeChange({ tabType: 'register' })"
          :class="type === 'register' ? 'active' : ''">
          {{ $t("general.auth.register") }}
        </div>
      </div>

      <div class="mt-2 mb-2" v-if="type === 'register'">
        <input v-model="email" type="email" :placeholder="$t('general.auth.credentials.email')" />
      </div>
      <div class="mt-2 mb-2">
        <input v-model="loginName" type="text" :placeholder="$t('general.auth.credentials.login')" />
      </div>
      <div class="mt-2 mb-2">
        <input v-model="password" type="password" :placeholder="$t('general.auth.credentials.password')" />
      </div>
      <span class="forgotPassword" @click="openForgotPasswordModal">
        {{
          $t("general.auth.forgot_password")
        }}
      </span>

      <!-- theme="dark" -->

      <button class="btn btn-primary btn-block p-3" @click="handleSubmit">
        {{ $t("general.auth." + (type === "auth" ? "login" : "register")) }}
      </button>

      <div class="divide-auth"></div>
      <div class="notice">{{ $t("general.auth.notice") }}</div>
    </div>
  </Modal>
</template>

<style lang="scss">
@import "@/assets/sass/variables";

.xmodal {
  width: 700px !important;

  .divide-auth {
    height: 1px;
    margin-top: 20px;
    margin-bottom: 20px;
    background: white;
    opacity: 0.2;
  }

  .forgotPassword {
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    margin-left: auto;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .notice {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
  }

  .auth-tabs {
    display: flex;
    align-items: center;
    justify-content: center;

    .auth-tab {
      cursor: pointer;
      background: transparent;
      transition: background 0.3s ease, color 0.3s ease;
      border-radius: 25px;
      padding: 10px 25px;
      margin-bottom: 15px;

      @include themed() {
        color: t("text");
      }

      margin-right: 5px;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: white;

        @include themed() {
          background: t("input");
        }
      }
    }
  }

  .heading {
    padding: unset !important;
    margin-bottom: 15px;
  }

  .auth-promo {
    background: url("@/assets/img/misc/auth-promo.png") no-repeat center center;
    background-size: cover;
    width: 350px;
    min-height: 465px;
  }

  .auth-block-1 {
    padding: 20px;
    width: 350px;
    display: flex;
    gap: 10px;
    flex-direction: column;
  }

  .modal_content {
    padding: unset !important;
    flex-direction: unset !important;
  }

  .recaptcha {
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-button-group {
    display: flex;

    button {
      position: relative;
      display: inline-flex;
      width: 33.333%;
      margin: 0 5px;
      padding: 15px;
      align-items: center;
      justify-content: center;

      i {
        position: absolute;
      }
    }
  }

  .auth-footer {
    text-align: center;
    margin-top: 15px;

    div:first-child {
      font-size: 11px;
      margin-bottom: 10px;
    }

    span:first-of-type,
    span:last-of-type {
      @include themed() {
        color: t("link");
        transition: color 0.3s ease;
        cursor: pointer;

        &:hover {
          color: t("link-hover");
        }
      }
    }

    .or {
      display: inline-flex;
      margin: 7px 5px 0;
      cursor: default;
      user-select: none;

      @include themed() {
        background: t("link");
      }

      width: 1px;
      height: 9px;
    }
  }
}

@media (max-width: 774px) {
  .xmodal.register {
    width: 344px !important;

    .auth-promo {
      display: none;
    }
  }
}
</style>