import {
  LitElement,
  css,
  html,
  customElement,
  internalProperty,
} from 'lit-element';

import {
  smallBreakPoint,
  mediumBreakPoint,
  largeBreakPoint,
  xxLargeBreakPoint,
  xxxLargeBreakPoint,
} from '../utils/breakpoints';
import { fetchManifest } from '../services/manifest';

import '../components/content-header';
import '../components/resource-hub';
import '../components/loading-button';
import '../components/app-modal';
import '../components/dropdown-menu';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { Router } from '@vaadin/router';

@customElement('app-home')
export class AppHome extends LitElement {
  @internalProperty() siteURL: string | null = null;
  @internalProperty() gettingManifest = false;

  static get styles() {
    return css`
      content-header::part(main-container) {
        display: flex;
        justify-content: space-around;
        padding-top: 0;
      }

      h2 {
        font-size: 44px;
        line-height: 46px;
        letter-spacing: -0.015em;
        max-width: 526px;
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
      }

      #input-form {
        display: flex;
        margin-top: 1em;
      }

      #input-form fast-text-field {
        flex: 0.8;
        margin-right: 10px;
      }

      #input-form loading-button {
        flex: 0.21;
      }

      #input-form loading-button::part(underlying-button) {
        display: flex;
      }

      #input-form fast-text-field::part(root) {
        border: 1px solid #e5e5e5;
        border-radius: var(--input-radius);
      }

      #input-form fast-text-field::part(control) {
        color: var(--font-color);
      }

      ${smallBreakPoint(css`
        content-header::part(grid-container) {
          display: none;
        }

        content-header::part(main-container) {
          padding-left: 0;
        }

        h2 {
          line-height: 34px;
          margin-top: 0;
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

        #input-form loading-button {
          margin-top: 54px;
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
          line-height: 34px;
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

        #input-form loading-button::part(underlying-button) {
          width: 216px;
          margin-top: 44px;
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

        #input-form {
          width: 32em;
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
          padding-left: 18em;
          justify-content: flex-start;
        }
      `)}
    `;
  }

  constructor() {
    super();
  }

  handleURL(inputEvent: InputEvent) {
    if (inputEvent) {
      this.siteURL = (inputEvent.target as any).value;
    }
  }

  async start(inputEvent: InputEvent) {
    inputEvent.preventDefault();

    if (this.siteURL) {
      this.gettingManifest = true;

      try {
        const data = await fetchManifest(this.siteURL);

        if (data) {
          Router.go(`/testing?site=${this.siteURL}`);
        }
      } catch (err) {
        console.error(err);
      }

      this.gettingManifest = false;
    }
  }

  render() {
    return html`
      <content-header>
        <h2 slot="hero-container">
          Transform your website to an app at lightning speed.
        </h2>
        <p id="hero-p" slot="hero-container">
          Ready to build your PWA? Tap "Build My PWA" to package your PWA for
          the app stores or tap "Feature Store".
        </p>

        <ul slot="grid-container">
          <div class="intro-grid-item">
            <h3>Test</h3>

            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut.
            </p>
          </div>

          <div class="intro-grid-item">
            <h3>Manage</h3>

            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut.
            </p>
          </div>

          <div class="intro-grid-item">
            <h3>Package</h3>

            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut.
            </p>
          </div>

          <div class="intro-grid-item">
            <h3>Explore</h3>

            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut.
            </p>
          </div>
        </ul>

        <form
          id="input-form"
          slot="input-container"
          @submit="${(e: InputEvent) => this.start(e)}"
        >
          <fast-text-field
            slot="input-container"
            type="text"
            placeholder="Enter URL"
            @change="${(e: InputEvent) => this.handleURL(e)}"
          ></fast-text-field>
          <loading-button
            ?loading="${this.gettingManifest}"
            type="submit"
            @click="${(e: InputEvent) => this.start(e)}"
            >Start</loading-button
          >
        </form>
      </content-header>

      <app-modal
        title="Modal Title"
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, sit scelerisque vestibulum magnis. Auctor dolor, tincidunt enim."
        ?open="${true}"
      >
        <div slot="modal-actions">
          <app-dropdown .menuItems=${['A', 'B', 'C']}></app-dropdown>

          <app-button>Test Button</app-button>
        </div>
      </app-modal>

      <resource-hub page="home" all>
        <h2 slot="title">PWABuilder Resource Hub</h2>
        <p slot="description">
          Ready to build your PWA? Tap "Build My PWA" to package your PWA for
          the app stores or tap "Feature Store" to check out the latest web
          components from the PWABuilder team to improve your PWA even further!
        </p>
      </resource-hub>
    `;
  }
}
