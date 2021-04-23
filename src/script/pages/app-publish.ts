import {
  css,
  html,
  LitElement,
} from 'lit';
import { customElement,
  state, } from "lit/decorators.js"
import { classMap } from 'lit/directives/class-map.js';

import '../components/app-header';
import '../components/app-card';
import '../components/app-modal';
import '../components/app-button';
import '../components/loading-button';
import '../components/windows-form';
import '../components/android-form';
import { Router } from '@vaadin/router';

import {
  BreakpointValues,
  smallBreakPoint,
  largeBreakPoint,
  mediumBreakPoint,
  xxxLargeBreakPoint,
} from '../utils/css/breakpoints';

//@ts-ignore
import style from '../../../styles/layout-defaults.css';
import { fileSave } from 'browser-fs-access';
import { fetchManifest } from '../services/manifest';
import { Manifest } from '../utils/interfaces';
import {
  checkResults,
  finalCheckForPublish,
} from '../services/publish/publish-checks';
import { generatePackage } from '../services/publish';
import { getReportErrorUrl } from '../utils/error';

@customElement('app-publish')
export class AppPublish extends LitElement {
  @state() errored = false;
  @state() errorMessage: string | undefined;

  @state() blob: Blob | File | undefined;
  @state() testBlob: Blob | File | undefined;

  @state() mql = window.matchMedia(
    `(min-width: ${BreakpointValues.largeUpper}px)`
  );

  @state() isDeskTopView = this.mql.matches;

  @state() open_windows_options = false;
  @state() open_android_options = false;

  @state() generating = false;

  @state() finalChecks: checkResults | undefined;

  @state() reportPackageErrorUrl: string;

  constructor() {
    super();

    this.mql.addEventListener('change', e => {
      this.isDeskTopView = e.matches;
    });
  }

  static get styles() {
    return [
      style,
      css`
        .header {
          padding: 1rem 3rem;
        }

        .header p {
          width: min(100%, 600px);
        }

        #tablet-sidebar {
          display: none;
        }

        #desktop-sidebar {
          display: block;
        }

        #summary-block {
          padding: 16px;
          border-bottom: var(--list-border);

          margin-right: 2em;
        }

        h2 {
          font-size: var(--xlarge-font-size);
          line-height: 46px;
          max-width: 526px;
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
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;

          padding-right: 2em;
        }

        .container .action-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .container .action-buttons > app-button {
          margin: 1rem;
        }

        .container .action-buttons fast-anchor {
          /** 
             Seems like a magic value but really
             this is just to match the back button next to it
           */
          width: 100px;

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

        content-header::part(header) {
          display: none;
        }

        .modal-image {
          width: 6em;
        }

        #error-modal::part(modal-layout),
        #download-modal::part(modal-layout),
        #test-download-modal::part(modal-layout) {
          max-width: 50vw;
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

        #actions {
          display: flex;
        }

        #windows-options-modal::part(modal-layout),
        #android-options-modal::part(modal-layout) {
          width: 64vw;
        }

        #test-package-button {
          display: block;
          margin-top: 15px;

          --neutral-fill-rest: white;
          --neutral-fill-active: white;
          --neutral-fill-hover: white;
        }

        #test-package-button::part(underlying-button) {
          --button-font-color: var(--font-color);
        }

        #platform-actions-block app-button::part(underlying-button) {
          width: 152px;
        }

        ${xxxLargeBreakPoint(
          css`
            #report {
              max-width: 69em;
            }

            app-sidebar {
              display: block;
            }

            #tablet-sidebar {
              display: none;
            }

            #desktop-sidebar {
              display: block;
            }
          `
        )}

        ${largeBreakPoint(
          css`
            #tablet-sidebar {
              display: block;
            }

            #desktop-sidebar {
              display: none;
            }
          `
        )}

        ${mediumBreakPoint(
          css`
            .publish h2 {
              font-size: 33px;
              max-width: 10em;
            }

            .publish p {
              display: none;
            }
          `
        )}

        ${smallBreakPoint(css`
          #test-package-button app-button::part(underlying-button) {
            width: 152px;
            font-size: var(--font-size);
            height: 40px;
          }

          #title-block p {
            width: 200px;
          }

          .publish h2 {
             font-size: 33px;
            }

            .publish p {
              display: none;
            }
        `)}
      `,
    ];
  }

  async firstUpdated() {
    const checks = await finalCheckForPublish();

    if (checks) {
      this.finalChecks = checks;
    }
  }

  async grabBackupManifest() {
    console.error(
      'Error generating package because manifest information is missing, trying fallback'
    );
    const search = new URLSearchParams(location.search);
    let site: string | null = null;
    if (search) {
      site = search.get('site');
    }

    let localManifest: Manifest | null = null;

    if (site) {
      const maniResults = await fetchManifest(site);

      if (maniResults && maniResults.content) {
        localManifest = maniResults.content;
      }
    }

    return localManifest;
  }

  async generate(type: platform, form?: HTMLFormElement) {
    if (type === 'windows') {
      // Final checks for Windows
      if (this.finalChecks) {
        const maniCheck = this.finalChecks.manifest;
        const baseIcon = this.finalChecks.baseIcon;
        const validURL = this.finalChecks.validURL;

        if (maniCheck === false || baseIcon === false || validURL === false) {
          this.generating = false;
          this.open_windows_options = false;

          let err = '';

          if (maniCheck === false) {
            err = 'Your PWA does not have a valid Web Manifest';
          } else if (baseIcon === false) {
            err = 'Your PWA needs atleast a 512x512 PNG icon';
          } else if (validURL === false) {
            err = 'Your PWA does not have a valid URL';
          }

          this.showAlertModal(err, type);

          return;
        }
      }
    } else if (type === 'android') {
      // Final checks for Android
      if (this.finalChecks) {
        const maniCheck = this.finalChecks.manifest;
        const baseIcon = this.finalChecks.baseIcon;
        const validURL = this.finalChecks.validURL;
        const offlineCheck = this.finalChecks.offline;

        if (maniCheck === false || baseIcon === false || validURL === false) {
          this.generating = false;
          this.open_android_options = false;

          let err = '';

          if (maniCheck === false) {
            err = 'Your PWA does not have a valid Web Manifest';
          } else if (baseIcon === false) {
            err = 'Your PWA needs atleast a 512x512 PNG icon';
          } else if (validURL === false) {
            err = 'Your PWA does not have a valid URL';
          } else if (offlineCheck === false) {
            // Extra offline check for Android
            err = 'Your PWA does not work offline';
          }

          this.showAlertModal(err, type);

          return;
        }
      }
    }

    try {
      this.generating = true;

      const packageData = await generatePackage(type, form);

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

      this.showAlertModal(err, type);
    }
  }

  async download() {
    if (this.blob || this.testBlob) {
      await fileSave((this.blob as Blob) || (this.testBlob as Blob), {
        fileName: 'your_pwa.zip',
        extensions: ['.zip'],
      });

      this.blob = undefined;
      this.testBlob = undefined;
    }
  }

  showAlertModal(error: string, platform) {
    this.errored = true;
    this.errorMessage = error;

    this.reportAnError(error, platform);
  }

  showWindowsOptionsModal() {
    this.open_windows_options = !this.open_windows_options;
  }

  showAndroidOptionsModal() {
    this.open_android_options = !this.open_android_options;
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
            <app-button
              @click="${platform.title.toLowerCase() === 'windows'
                ? () => this.showWindowsOptionsModal()
                : () => this.showAndroidOptionsModal()}"
              >Publish</app-button
            >

            ${platform.title.toLocaleLowerCase() === 'windows'
              ? html`<loading-button
                  ?loading=${this.generating}
                  id="test-package-button"
                  @click="${() => this.generate('windows')}"
                  >Test Package</loading-button
                >`
              : null}
          </div>
        </li>`
    );
  }

  returnToFix() {
    const resultsString = sessionStorage.getItem('results-string');

    // navigate back to report-card page
    // with current manifest results
    Router.go(`/reportcard?results=${resultsString}`);
  }

  reportAnError(errorDetail: string, platform: string) {
    this.reportPackageErrorUrl = getReportErrorUrl(errorDetail, platform);
  }

  render() {
    return html`
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
            .href="${this.reportPackageErrorUrl}"
            >Report A Problem</fast-anchor
          >

          <app-button @click="${() => this.returnToFix()}"
            >Return to Manifest Options</app-button
          >
        </div>
      </app-modal>

      <app-modal
        ?open="${this.blob ? true : false}"
        title="Download your package"
        body="Your app package is ready for download."
        id="download-modal"
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

      <app-modal
        ?open="${this.testBlob ? true : false}"
        title="Test Package Download"
        body="Want to test your files first before publishing? No problem! Description here about how this isn’t store ready and how they can come back and publish their PWA after doing whatever they need to do with their testing etc etc tc etc."
        id="test-download-modal"
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

      <app-modal
        id="windows-options-modal"
        title="Microsoft Store Options"
        body="Customize your Windows package below!"
        ?open="${this.open_windows_options}"
      >
        <windows-form
          slot="modal-form"
          .generating=${this.generating}
          @init-windows-gen="${ev => this.generate('windows', ev.detail.form)}"
        ></windows-form>
      </app-modal>

      <app-modal
        id="android-options-modal"
        title="Google Play Store Options"
        body="Customize your Android package below!"
        ?open="${this.open_android_options}"
      >
        <android-form
          slot="modal-form"
          .generating=${this.generating}
          @init-android-gen="${ev => this.generate('android', ev.detail.form)}"
        ></android-form>
      </app-modal>

      <div>
        <app-header></app-header>

        <div
          id="grid"
          class="${classMap({
            'grid-mobile': this.isDeskTopView == false,
          })}"
        >
          <app-sidebar id="desktop-sidebar"></app-sidebar>

          <div>
            <content-header class="publish">
              <h2 slot="hero-container">Small details go a long way.</h2>
              <p id="hero-p" slot="hero-container">
                Description about what is going to take place below and how they
                are on their way to build their PWA. Mention nav bar for help.
              </p>
            </content-header>

            <app-sidebar id="tablet-sidebar"></app-sidebar>

            <section id="summary-block">
              <h3>Publish your PWA to stores</h3>

              <p>
                Ready to build your PWA? Tap "Build My PWA" to package your PWA
                for the app stores or tap "Feature Store" to check out the
                latest web components from the PWABuilder team to improve your
                PWA even further!
              </p>
            </section>

            <section class="container">
              <ul>
                ${this.renderContentCards()}
              </ul>

              <div id="up-next">
                <h5>Up next</h5>

                <p>
                  Ready to build your PWA? Tap "Build My PWA" to package your
                  PWA for the app stores or tap "Feature Store" to check out the
                  latest web components from the PWABuilder team to improve your
                  PWA even further!
                </p>
              </div>

              <div class="action-buttons">
                <app-button @click="${() => this.returnToFix()}"
                  >Back</app-button
                >
                <fast-anchor href="/congrats">Next</fast-anchor>
              </div>
            </section>
          </div>
        </div>
      </div>
    `;
  }
}

type platform = 'windows' | 'android' | 'samsung';

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
  {
    title: 'Samsung',
    description:
      'Publish your PWA to the Google Play Store to make your app more discoverable for Android users.',
    isActionCard: true,
    icon: '/assets/samsung_icon.svg',
  },
];
