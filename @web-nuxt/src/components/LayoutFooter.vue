<script setup lang="ts">
import useMainStore from "@/stores/useMainStore";

import btcSvg from "@/assets/img/BTC-1713787614847.svg";
import dogeSvg from "@/assets/img/DOGE-1713787614847.svg";
import xrpSvg from "@/assets/img/XRP-1713787614847.svg";
import ethSvg from "@/assets/img/ETH-1713787614847.svg";
import eosSvg from "@/assets/img/EOS-1713787614847.svg";
import ltcSvg from "@/assets/img/LTC-1713787614847.svg";
// import TermsModal from "../modals/TermsModal.vue";
// import LeaderboardModal from "../modals/LeaderboardModal.vue";

// Initialize router and store
const router = useRouter();
const store = useMainStore();

// Methods
function navigateHome() {
  router.push("/");
}

function openLeaderboard() {
  //   LeaderboardModal.methods.open();
}
</script>


<template>
  <footer>
    <div class="container">
      <div class="footer">
        <div class="column grid">
          <div class="links">
            <div style="display: flex !important">
              <NuxtLink
                to="/"
                class="logo"
                style="display: flex !important; align-items: center"
              />
              <div
                @click="navigateHome"
                style="
                  padding-left: 0 !important;
                  cursor: pointer;
                  font-size: 1.2rem;
                "
              >
                CryptoMania
              </div>
            </div>
          </div>

          <div class="links">
            <div class="name">Support</div>
            <div class="link-group">
              <NuxtLink to="/">Live Support</NuxtLink>
              <NuxtLink to="/">Help Center</NuxtLink>
              <a href="https://www.gambleaware.org/" target="_blank"
                >Game Responsibility</a
              >
            </div>
          </div>

          <div class="links">
            <div class="name">Platform</div>
            <div class="link-group">
              <NuxtLink to="/fairness">Provably Fair</NuxtLink>
              <NuxtLink to="/vip">VIP</NuxtLink>
              <a href="javascript:;" @click="openLeaderboard">Competition</a>
              <NuxtLink to="/partner">Affiliates Program</NuxtLink>
            </div>
          </div>

          <div class="links">
            <div class="name">Policy</div>
            <div class="link-group">
              <NuxtLink to="/terms">Terms of Service</NuxtLink>
              <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
              <NuxtLink to="/">AML Policy</NuxtLink>
            </div>
          </div>

          <div class="links">
            <div class="name">Community</div>
            <div class="link-group">
              <a href="https://x.com/CryptoManiagg" target="_blank">X</a>
              <a
                href="https://www.instagram.com/cryptomania.gg/"
                target="_blank"
                >Instagram</a
              >
              <a href="https://discord.gg/ZxSS9UZaqY" target="_blank"
                >Discord</a
              >
            </div>
          </div>
        </div>

        <div class="notes">
          <p>
            This website offers gaming with risk experience. To be a user of our
            site you must be over 18 y.o. We are not responsible for the
            violation of your local laws related to Vortex Holdings LLC. Play
            responsibly and have fun on CryptoMania.
          </p>
          <p>
            CryptoMania is owned and operated by Vortex Holdings LLC, a company
            incorporated under the laws of Saint Vincent and the Grenadines with
            registration number 3615.
          </p>
        </div>

        <div class="image-container">
          <img :src="btcSvg" alt="Bitcoin" width="32" height="32" />
          <img :src="dogeSvg" alt="Dogecoin" width="32" height="32" />
          <img :src="xrpSvg" alt="XRP" width="32" height="32" />
          <img :src="ethSvg" alt="Ethereum" width="32" height="32" />
          <img :src="eosSvg" alt="EOS" width="32" height="32" />
          <img :src="ltcSvg" alt="LTC" width="32" height="32" />
        </div>

        <div class="image-container" style="border-bottom: 2px solid #1f2d49">
          <div style="text-align: center">
            <a
              href="//www.dmca.com/Protection/Status.aspx?ID=cfcc00c5-5d33-4e31-ace0-14e2b2c1d546"
              title="DMCA.com Protection Status"
              class="dmca-badge"
            >
              <img
                src="https://images.dmca.com/Badges/dmca-badge-w250-5x1-02.png?ID=cfcc00c5-5d33-4e31-ace0-14e2b2c1d546"
                alt="DMCA.com Protection Status"
              />
            </a>
          </div>
        </div>

        <div style="display: flex; margin: 20px 0">
          <div>
            <!-- {{ `1 ${store.currencies[store.currency].name} = ` }} -->
            <!-- <Unit :fiat="true" :to="store.currency" :value="1" /> -->
          </div>
          <div style="margin-left: auto">
            © 2024 CryptoMania.gg | All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
@import "@/assets/sass/variables";

footer {
  @include themed() {
    background: t("footer");
    margin-top: 15px;

    .logo {
      height: 30px;
      width: 30px;
      display: flex;
      cursor: pointer;
      background: url("@/assets/img/misc/logo.png") no-repeat center;
      background-size: contain;
      margin-left: unset;

      @media (min-width: 991px) {
        display: none;
      }
    }

    .footer {
      display: flex;
      flex-direction: column;
      padding: 0 50px;

      @media (max-width: 991px) {
        padding: 0;
      }

      .notes {
        display: flex;
        flex-direction: column;
        margin: 15px 0;
        border-bottom: 2px solid t("border");

        @media (max-width: 991px) {
          margin-top: 10px;
        }

        i {
          width: 36px;
          height: 36px;
          border: 2px solid #fff;
          border-radius: 50%;
          text-align: center;
          line-height: 32px;
          font-style: normal;
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 15px;
        }

        small {
          font-size: 11px;
          opacity: 0.4;
        }
      }

      .column {
        display: flex;
        width: 100%;
        align-items: center;
        padding: 25px 0;
        border-bottom: 2px solid t("border");

        &.payment {
          img {
            width: 0;
            flex: 1;
          }

          @media (max-width: 991px) {
            display: none;
          }
        }

        &:last-child {
          border-bottom: none;
        }

        &.grid {
          display: flex; // grid;
          // grid-gap: 15px;
          gap: 15px;
          // grid-template-columns: auto auto 576px;
          align-items: flex-start;
          justify-content: space-between;
          padding: 40px 0;

          @media (max-width: 1456px) {
            // display: flex;
            // flex-direction: column;
          }

          @media (max-width: 991px) {
            display: flex;
          }
        }

        .links {
          display: flex;
          flex-direction: column;

          .name {
            text-transform: uppercase;
            margin-bottom: 15px;
            // opacity: .6;
            font-weight: 600;
          }

          .link-group {
            display: flex;
            flex-direction: column;

            a {
              // opacity: .4;
              color: #828998;
              margin-bottom: 5px;
              transition: opacity 0.3s ease;

              &:last-child {
                margin-bottom: 0;
              }

              &:hover {
                // opacity: 1;
                color: rgb(221, 218, 218);
              }
            }
          }
        }

        .social-icons {
          display: flex;

          .social-icon {
            margin-right: 10px;
            border-radius: 10px;
            background: t("block");
            padding: 5px 10px;
            transition: background 0.3s ease, color 0.3s ease;
            cursor: pointer;

            &:hover {
              color: white;
              background: lighten(t("block"), 5%);
            }

            &:last-child {
              margin-right: 0;
            }
          }
        }

        .copy {
          opacity: 0.3;
          font-size: 11px;
        }
      }
    }
  }
}

@include media_breakpoint_down(md) {
  footer .footer {
    padding-bottom: 53px !important;

    .column {
      flex-direction: column;

      .copy {
        text-align: center;
        margin-bottom: 5px;
      }
    }
  }
}

.image-container {
  display: flex; /* Use flexbox to align items */
  justify-content: center; /* Center items horizontally */
  align-items: center; /* Center items vertically */
  padding: 10px;
}

.image-container img {
  margin-right: 10px; /* Add spacing between images */
}
</style>
