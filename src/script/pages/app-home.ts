import { LitElement, css, html } from 'lit';

import { customElement, state } from 'lit/decorators.js';

import { classMap } from 'lit/directives/class-map.js';

import {
  smallBreakPoint,
  mediumBreakPoint,
  largeBreakPoint,
  xxLargeBreakPoint,
  xxxLargeBreakPoint,
} from '../utils/css/breakpoints';
import { fetchManifest } from '../services/manifest';

import '../components/content-header';
import '../components/resource-hub';
import '../components/loading-button';
import '../components/dropdown-menu';
import '../components/app-sidebar';

//@ts-ignore
import style from '../../../styles/error-styles.css';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { Router } from '@vaadin/router';
import { getProgress, getURL, setProgress } from '../services/app-info';
import { Lazy, ProgressList, Status } from '../utils/interfaces';

@customElement('app-home')
export class AppHome extends LitElement {
  @state() siteURL: Lazy<string>;
  @state() gettingManifest = false;

  @state() errorGettingURL = false;
  @state() errorMessage: string | undefined;

  static get styles() {
    return [
      style,
      css`
        content-header::part(main-container) {
          display: flex;

          padding-top: 0;
        }

        content-header::part(header) {
          --header-border: none;
        }

        h2 {
          font-size: var(--xlarge-font-size);
          line-height: 48px;
          letter-spacing: -0.015em;
          max-width: 526px;
          margin-bottom: 0;
        }

        h3 {
          font-size: var(--medium-font-size);
        }

        #hero-p {
          font-size: 16px;
          line-height: 24px;
          letter-spacing: -0.015em;
          color: var(--secondary-font-color);
          max-width: 406px;
        }

        ul {
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: auto auto;
        }

        .intro-grid-item {
          max-width: 200px;
        }

        .intro-grid-item h3 {
          margin-bottom: 5px;
        }

        .intro-grid-item p {
          margin-top: 0;
          color: var(--secondary-font-color);
          font-size: var(--font-size);

          width: 194px;
        }

        #input-form {
          display: flex;
          margin-top: 1em;
        }

        #input-form fast-text-field {
          width: 94%;
          margin-right: 10px;
        }

        #input-form fast-text-field::part(root) {
          border: 1px solid #e5e5e5;
          border-radius: var(--input-radius);
        }

        #input-form fast-text-field::part(control) {
          color: var(--font-color);
        }

        #input-block {
          display: flex;
          flex-direction: column;

          flex: 0.8 1 0%;
          width: 100%;
        }

        ${smallBreakPoint(css`
          content-header::part(grid-container) {
            display: none;
          }

          content-header::part(main-container) {
            padding-left: 0;
          }

          h2 {
            margin-top: 0;
            font-size: var(--large-font-size);
          }

          #hero-p {
            line-height: 22px;
          }

          #input-form {
            flex-direction: column;
            width: 100%;
            align-items: center;
          }

          #input-form fast-text-field {
            width: 100%;
            margin-right: 0;
          }

          #input-form fast-text-field::part(root) {
            height: 64px;
          }

          #input-form fast-text-field::part(control) {
            font-size: 22px;
          }
        `)}

        ${mediumBreakPoint(css`
          content-header::part(grid-container) {
            display: none;
          }

          content-header::part(main-container) {
            padding-left: 0;
          }

          h2 {
            font-size: var(--large-font-size);
            margin-top: 0;
          }

          #hero-p {
            line-height: 22px;
            text-align: center;
            max-width: initial;
          }

          #input-form {
            flex-direction: column;
            width: 100%;
            align-items: center;
          }

          #input-form fast-text-field {
            width: 100%;
            margin-right: 0;
          }

          #input-form fast-text-field::part(root) {
            height: 64px;
          }

          #input-form fast-text-field::part(control) {
            font-size: 22px;
          }

          #input-block {
            margin-bottom: 30px;
          }
        `)}


      ${largeBreakPoint(css`
          content-header::part(main-container) {
            padding-left: 16px;
          }
        `)}

      ${xxLargeBreakPoint(css`
          .intro-grid-item {
            max-width: 280px;
          }

          h2 {
            max-width: 600px;
          }

          content-header::part(main-container) {
            padding-left: 5em;
            justify-content: flex-start;
          }
        `)}

      ${xxxLargeBreakPoint(css`
          content-header::part(main-container) {
            padding-left: 10em;
            justify-content: flex-start;
          }
        `)}
      `,
    ];
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const search = new URLSearchParams(location.search);
    const site = search.get('site');

    if (site) {
      this.siteURL = site;
      await this.doTest();
    }
  }

  handleURL(inputEvent: InputEvent) {
    if (inputEvent) {
      this.siteURL = (inputEvent.target as HTMLInputElement).value;
    }
  }

  async start(inputEvent: InputEvent) {
    inputEvent.preventDefault();

    await this.doTest();
  }

  async doTest() {
    if (this.siteURL) {
      this.gettingManifest = true;

      try {
        const data = await fetchManifest(this.siteURL);

        if (data.error) {
          this.errorGettingURL = true;
          this.errorMessage = data.error;
          throw new Error(`Error getting URL: ${data.error}`);
        } else {
          this.errorGettingURL = false;
          this.errorMessage = undefined;

          const progress = getProgress();
          this.updateProgress(progress);

          const goodURL = getURL();

          if (goodURL !== undefined) {
            // couldnt get manifest, thats ok
            // lets continue forward with the default
            // zeroed out results.
            Router.go(`/testing?site=${goodURL}`);
          }
        }
      } catch (err) {
        console.error('Error getting site', err.message);

        this.gettingManifest = false;

        this.errorGettingURL = true;
        this.errorMessage = err;
      }

      this.gettingManifest = false;
    }
  }

  updateProgress(progressData: ProgressList) {
    if (progressData) {
      progressData.progress[0].items[0].done = Status.DONE;

      const newProgress = progressData;
      setProgress(newProgress);
    }
  }

  render() {
    return html`
      <content-header class="home">
        <h2 slot="hero-container">
          Ship your PWA to the app stores at lightning speed.
        </h2>

        <ul slot="grid-container">
          <div class="intro-grid-item">
            <h3>Test</h3>

            <p>
              PWABuilder will make sure your web app is a PWA and ready for the
              stores!
            </p>
          </div>

          <div class="intro-grid-item">
            <h3>Manage</h3>

            <p>
              Our Report Card will let you know if your PWA is store-ready. If
              not, PWABuilder will help you get there!
            </p>
          </div>

          <div class="intro-grid-item">
            <h3>Package</h3>

            <p>
              Once you are ready, PWABuilder can package your PWA for the app
              stores in minutes!
            </p>
          </div>

          <div class="intro-grid-item">
            <h3>Explore</h3>

            <p>
              PWAs are moving forward fast, learn about new web APIs, store
              readiness, and more!
            </p>
          </div>
        </ul>

        <form
          id="input-form"
          slot="input-container"
          @submit="${(e: InputEvent) => this.start(e)}"
        >
          <div id="input-block">
            <fast-text-field
              slot="input-container"
              type="text"
              placeholder="Enter URL"
              name="url-input"
              class="${classMap({ error: this.errorGettingURL })}"
              @input="${(e: InputEvent) => this.handleURL(e)}"
              autofocus
            ></fast-text-field>

            ${this.errorMessage && this.errorMessage.length > 0
              ? html`<span class="error-message">${this.errorMessage}</span>`
              : null}
          </div>

          <loading-button
            type="submit"
            class="navigation"
            ?loading="${this.gettingManifest}"
            @click="${(e: InputEvent) => this.start(e)}"
            >Start</loading-button
          >
        </form>
      </content-header>

      <resource-hub page="home" all>
        <h2 slot="title">PWABuilder Resource Hub</h2>
        <p slot="description">
          Jump to our blog, find our documentation and check out demos and
          components from the PWABuilder team!
        </p>
      </resource-hub>
    `;
  }
}
