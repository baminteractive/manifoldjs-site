import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '../components/app-header';
import '../components/app-card';
import '../components/app-modal';
import '../components/app-button';
import '../components/loading-button';
import '../components/windows-form';
import '../components/android-form';

import {
  smallBreakPoint,
  largeBreakPoint,
  mediumBreakPoint,
  xxxLargeBreakPoint,
} from '../utils/css/breakpoints';

//@ts-ignore
import style from '../../../styles/layout-defaults.css';
import { fastAnchorCss } from '../utils/css/fast-elements';
import { fileSave } from 'browser-fs-access';

import { checkResults } from '../services/publish/publish-checks';
import { generatePackage, Platform } from '../services/publish';
import { getReportErrorUrl } from '../utils/error';
import { styles as ToolTipStyles } from '../components/tooltip';
import { localeStrings } from '../../locales';

@customElement('portals-publish')
export class PortalsPublish extends LitElement {
  @state() errored = false;
  @state() errorMessage: string | undefined;

  @state() blob: Blob | File | null | undefined;
  @state() testBlob: Blob | File | null | undefined;

  @state() open_windows_options = false;
  @state() open_android_options = false;
  @state() open_samsung_modal = false;

  @state() generating = false;

  @state() finalChecks: checkResults | undefined;

  @state() reportPackageErrorUrl = '';

  constructor() {
    super();
  }

  static get styles() {
    return [
      style,
      fastAnchorCss,
      ToolTipStyles,
      css`
        .header {
          padding: 1rem 3rem;
        }

        .header p {
          width: min(100%, 600px);
        }

        #summary-block {
          padding: 16px 16px 16px 36px;
          border-bottom: var(--list-border);

          margin-right: 2em;
        }

        h2 {
          font-size: var(--xlarge-font-size);
          line-height: 46px;
        }

        #hero-p {
          font-size: var(--font-size);
          line-height: 24px;
          max-width: 406px;
        }

        h3,
        h5 {
          font-size: var(--medium-font-size);
          margin-bottom: 8px;
        }

        h4 {
          margin-bottom: 8px;
          margin-top: 0;
        }

        .container {
          padding: 16px 16px 16px 36px;
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;
        }

        .container .action-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }

        .container .action-buttons fast-anchor {
          --button-width: 127px;
          height: 44px;
          width: var(--button-width);

          padding-left: 10px;
          padding-right: 10px;

          color: white;
          box-shadow: var(--button-shadow);
          border-radius: var(--button-radius);
          font-weight: bold;
        }

        #up-next {
          width: 100%;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;

          width: 100%;
        }

        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 35px;
          padding-bottom: 35px;
          border-bottom: var(--list-border);
        }

        li h4 {
          font-size: var(--small-medium-font-size);
        }

        p {
          font-size: var(--font-size);
          color: var(--font-color);
          max-width: 530px;
        }

        .modal-image {
          width: 50px;
        }

        #error-modal::part(modal-body) {
          max-height: 36vh;
          overflow-y: auto;
          max-width: inherit;
          overflow-x: hidden;
        }

        #error-link {
          color: white;
          font-weight: var(--font-bold);
          border-radius: var(--button-radius);
          background: var(--error-color);
          margin-right: 8px;
          padding-left: 10px;
          padding-right: 10px;
          box-shadow: var(--button-shadow);
        }

        #test-package-button {
          display: block;
          margin-top: 15px;
        }

        #test-package-button::part(underlying-button) {
          --button-font-color: var(--font-color);
        }

        #platform-actions-block app-button,
        #platform-actions-block loading-button::part(underlying-button) {
          --button-width: 152px;
        }

        #actions {
          display: flex;
          flex-direction: column;
        }

        #actions fast-anchor.button,
        #actions app-button {
          margin-right: 0;
          margin-top: 8px;
        }

        .tooltip {
          height: 16px;
          width: 16px;
        }

        #hover-tooltip {
          display: none;

          position: relative;

          flex-direction: column;
          justify-content: space-around;

          padding: 8px;
          border-radius: 6px;
          position: absolute;
          z-index: 1;

          white-space: break-spaces;
          width: 14em;

          background: var(--font-color);
          right: 6em;

          color: #fff;
          text-decoration: none;
          font-weight: initial;
        }

        #test-package-button:hover #hover-tooltip {
          display: flex;
        }
      `,
      xxxLargeBreakPoint(
        css`
          #report {
            max-width: 69em;
          }

          #publish-wrapper {
            max-width: 69em;
            background: white;
          }
        `
      ),
      largeBreakPoint(
        css`
          #tablet-sidebar {
            display: block;
          }

          #desktop-sidebar {
            display: none;
          }
        `
      ),
      mediumBreakPoint(
        css`
          .publish h2 {
            font-size: 33px;
            max-width: 10em;

            margin-top: 0;
            margin-bottom: 1em;
          }

          .publish p {
            display: none;
          }

          li {
            flex-direction: column;
            align-items: flex-start;
          }

          #title-block {
            width: 100%;
          }

          #title-block p {
            width: unset;
          }

          #platform-actions-block {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 2em;
          }
        `
      ),
      mediumBreakPoint(
        css`
          loading-button {
            --loading-button-height: 64px;
          }
          loading-button::part(underlying-button) {
            --font-size: 22px;
          }
          .container .action-buttons fast-anchor,
          .container .action-buttons app-button {
            --button-width: 127px;
            font-size: var(--mobile-button-fontsize);
            height: var(--mobile-button-height);
            width: var(--button-width);
            margin: 22px;
          }
        `,
        'no-lower'
      ),
      smallBreakPoint(css`
        #error-modal::part(modal-layout) {
          width: 100vw;
        }

        #test-package-button app-button::part(underlying-button) {
          font-size: var(--font-size);
        }

        li {
          flex-direction: column;
          align-items: flex-start;
        }

        #title-block {
          width: 100%;
        }

        #title-block p {
          width: unset;
        }

        #platform-actions-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2em;
        }

        .publish h2 {
          font-size: 33px;

          margin-top: 0;
          margin-bottom: 1em;
        }

        .publish p {
          display: none;
        }
      `),
    ];
  }

  async generate(type: platform, form?: HTMLFormElement, signingFile?: string) {
    try {
      this.generating = true;

      const packageData = await generatePackage(type, form, signingFile);

      if (packageData) {
        if (packageData.type === 'test') {
          this.testBlob = packageData.blob;
        } else {
          this.blob = packageData.blob;
        }
      }

      this.generating = false;
      this.open_android_options = false;
      this.open_windows_options = false;
    } catch (err) {
      console.error(err);
      this.generating = false;
      this.open_android_options = false;
      this.open_windows_options = false;

      this.showAlertModal(err as Error, type);
    }
  }

  async download() {
    if (this.blob || this.testBlob) {
      await fileSave((this.blob as Blob) || (this.testBlob as Blob), {
        fileName: 'your_portals_pwa.zip',
        extensions: ['.zip'],
      });

      this.blob = undefined;
      this.testBlob = undefined;
    }
  }

  showAlertModal(error: string | Error, platform: Platform) {
    this.errored = true;
    this.errorMessage = (error || '').toString();

    this.reportAnError(error, platform);
  }

  showWindowsOptionsModal() {
    this.open_windows_options = true;
  }

  showAndroidOptionsModal() {
    this.open_android_options = true;
  }

  showSamsungModal() {
    this.open_samsung_modal = true;
  }

  renderContentCards() {
    return platforms.map(
      platform =>
        html`<li>
          <div id="title-block">
            <img src="${platform.icon}" alt="platform icon" />
            <h4>${platform.title}</h4>
            <p>${platform.description}</p>
          </div>

          <div id="platform-actions-block">
            ${platform.title.toLowerCase() === 'windows'
              ? html`
                  <app-button
                    class="navigation"
                    @click="${() => this.showWindowsOptionsModal()}"
                    >Store Package</app-button
                  >

                  <div>
                    <loading-button
                      class="navigation secondary"
                      ?loading=${this.generating}
                      id="test-package-button"
                      @click="${() => this.generate('windows')}"
                      >Test Package

                      <!-- todo after release: refactor this into a <hover-tooltip /> component -->
                      <a
                        id="hover-tooltip"
                        target="_blank"
                        href="https://github.com/pwa-builder/pwabuilder-windows-chromium-docs/blob/master/next-steps.md#1-test-your-app-on-your-windows-machine"
                        >Generate a package you can use to test your app on your
                        Windows Device before going to the Microsoft Store.</a
                      >
                    </loading-button>
                  </div>
                `
              : null}
            ${platform.title.toLowerCase() === 'android'
              ? html`
                  <app-button
                    class="navigation"
                    @click="${() => this.showAndroidOptionsModal()}"
                    >Store Package</app-button
                  >
                `
              : null}
          </div>
        </li>`
    );
  }

  reportAnError(errorDetail: string | Object, platform: string) {
    this.reportPackageErrorUrl = getReportErrorUrl(errorDetail, platform);
  }

  downloadCancel() {
    this.blob = undefined;
    this.errorMessage = undefined;
    this.errored = false;
  }

  downloadTestCancel() {
    this.testBlob = undefined;
    this.errorMessage = undefined;
    this.errored = false;
  }

  storeOptionsCancel() {
    this.open_windows_options = false;
    this.open_android_options = false;
    this.open_samsung_modal = false;
  }

  render() {
    return html`
      <!-- error modal -->
      <app-modal
        title="Wait a minute!"
        .body="${this.errorMessage || ''}"
        ?open="${this.errored}"
        id="error-modal"
      >
        <img
          class="modal-image"
          slot="modal-image"
          src="/assets/warning.svg"
          alt="warning icon"
        />

        <div id="actions" slot="modal-actions">
          <fast-anchor
            target="__blank"
            id="error-link"
            class="button"
            .href="${this.reportPackageErrorUrl}"
            >Report A Problem</fast-anchor
          >
        </div>
      </app-modal>

      <!-- download modal -->
      <app-modal
        ?open="${this.blob ? true : false}"
        title="Download your package"
        body="Your app package is ready for download."
        id="download-modal"
        @app-modal-close="${() => this.downloadCancel()}"
      >
        <img
          class="modal-image"
          slot="modal-image"
          src="/assets/images/store_fpo.png"
          alt="publish icon"
        />

        <div slot="modal-actions">
          <app-button @click="${() => this.download()}">Download</app-button>
        </div>
      </app-modal>

      <!-- test package download modal -->
      <app-modal
        ?open="${this.testBlob ? true : false}"
        title="Test Package Download"
        body="${localeStrings.input.publish.windows.test_package}"
        id="test-download-modal"
        @app-modal-close="${() => this.downloadTestCancel()}"
      >
        <img
          class="modal-image"
          slot="modal-image"
          src="/assets/images/warning.svg"
          alt="warning icon"
        />

        <div slot="modal-actions">
          <app-button @click="${() => this.download()}">Download</app-button>
        </div>
      </app-modal>

      <!-- windows store options modal -->
      <app-modal
        id="windows-options-modal"
        title="Microsoft Store Options"
        body="Customize your Windows package below!"
        ?open="${this.open_windows_options}"
        @app-modal-close="${() => this.storeOptionsCancel()}"

      >
        <windows-form
          slot="modal-form"
          .generating=${this.generating}
          @init-windows-gen="${(ev: CustomEvent) =>
            this.generate('windows', ev.detail.form)}"
        ></windows-form>
      </app-modal>

      <!-- android options modal -->
      <app-modal
        id="android-options-modal"
        title="Google Play Store Options"
        body="Customize your Android package below!"
        ?open="${this.open_android_options === true}"
        @app-modal-close="${() => this.storeOptionsCancel()}"
      >
        <android-form
          slot="modal-form"
          .generating=${this.generating}
          @init-android-gen="${(ev: CustomEvent) =>
            this.generate('android', ev.detail.form, ev.detail.signingFile)}"
        ></android-form>
      </app-modal>

      <div id="publish-wrapper">
        <app-header></app-header>

            <section id="summary-block">
              <h3>Publish your PWA to stores</h3>

              <p>
                Generate store-ready packages for the Microsoft Store, Google
                Play and more!
              </p>
            </section>

            <section class="container">
              <ul>
                ${this.renderContentCards()}
              </ul>

              <div id="up-next">
                <h5>Congrats!</h5>

                <p>
                  Make sure you check our documentation for help submitting your
                  generated packages! Click next to see what else you can do
                  with your PWA!
                </p>
              </div>

              <div class="action-buttons">
                <fast-anchor class="button" href="https://blog.pwabuilder.com/docs/">Documentation</fast-anchor>
              </div>
            </section>
          </div>
        </div>
      </div>
    `;
  }
}

type platform = 'windows' | 'android';

interface ICardData {
  title: string;
  description: string;
  isActionCard: boolean;
  icon: string;
}

const platforms: ICardData[] = [
  {
    title: 'Windows',
    description:
      'Publish your PWA to the Microsoft Store to make it available to the 1 billion Windows users worldwide.',
    isActionCard: true,
    icon: '/assets/windows_icon.svg',
  },
  {
    title: 'Android',
    description:
      'Publish your PWA to the Google Play Store to make your app more discoverable for Android users.',
    isActionCard: true,
    icon: '/assets/android_icon.svg',
  },
];
