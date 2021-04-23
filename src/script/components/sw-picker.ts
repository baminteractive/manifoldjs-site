import {
  LitElement,
  css,
  html,
} from 'lit';

import { customElement, property,
  state, } from "lit/decorators.js"
import {
  chooseServiceWorker,
  getServiceWorkers,
  unsetServiceWorker,
} from '../services/service_worker';

import '../components/app-button';

//@ts-ignore
import style from '../../../styles/list-defaults.css';

interface ServiceWorkerChoice {
  id: number;
  title: string;
  description: string;
}

@customElement('sw-picker')
export class SWPicker extends LitElement {
  @property({ type: Number }) score = 0;

  @state() serviceWorkers: ServiceWorkerChoice[] | undefined;
  @state() chosenSW: number | undefined;

  static get styles() {
    return [
      style,
      css`
        :host {
          display: block;
          width: 100%;

          padding: 32px;
        }

        ul {
          margin-top: 4em;
        }

        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 35px;
          border-bottom: 0.67681px solid #e5e5e5;
        }

        h4 {
          font-size: var(--medium-font-size);
          margin-bottom: 12px;
          margin-top: 12px;
        }

        h5 {
          margin-bottom: 0;
          font-size: 22px;
        }

        #sw-picker-header {
          border-bottom: 0.67681px solid rgb(229, 229, 229);
          padding-bottom: 47px;
        }

        #summary {
          font-size: 22px;
          font-weight: var(--font-bold);
        }

        #summary-block p {
          margin-bottom: 0;
        }

        p {
          font-size: var(--font-size);
          color: var(--font-color);
          max-width: 767px;
        }

        #header-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        #header-actions {
          display: flex;
          justify-content: flex-end;
        }

        #score-block {
          font-size: var(--medium-font-size);
          font-weight: var(--font-bold);
        }

        .actions #select-button::part(underlying-button) {
          background: white;
          color: var(--font-color);
        }

        #bottom-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 64px;
          margin-bottom: 64px;
        }

        .done-button {
          width: 108px;
        }
      `,
    ];
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const swData = await getServiceWorkers();

    if (swData) {
      this.serviceWorkers = swData.serviceworkers;
      console.log(this.serviceWorkers);
    }
  }

  chooseSW(sw: ServiceWorkerChoice) {
    console.log(sw);
    this.chosenSW = sw.id;

    if (this.chosenSW) {
      chooseServiceWorker(this.chosenSW);
    }
  }

  removeSW() {
    unsetServiceWorker();
    this.chosenSW = undefined;
  }

  done() {
    const event = new CustomEvent('back-to-overview', {
      detail: {
        open: true,
      },
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div>
        <div id="sw-spicker-header">
          <div id="header-info">
            <div id="header-block">
              <h4>Service Worker</h4>

              <span id="score-block">${this.score} / 20</span>
            </div>
          </div>

          <div id="summary-block">
            <h5 id="summary">Summary</h5>

            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. ven further!
            </p>

            <div id="header-actions">
              <app-button class="done-button" @click="${() => this.done()}"
                >Done</app-button
              >
            </div>
          </div>
        </div>

        <ul>
          ${this.serviceWorkers?.map(sw => {
            return html`
              <li>
                <div class="info">
                  <h5>${sw.title}</h5>

                  <p>${sw.description}</p>
                </div>

                <div class="actions">
                  ${this.chosenSW === sw.id
                    ? html`<app-button @click="${() => this.removeSW()}"
                        >Remove</app-button
                      >`
                    : html`<app-button
                        id="select-button"
                        @click="${() => this.chooseSW(sw)}"
                        >Select</app-button
                      >`}
                </div>
              </li>
            `;
          })}
        </ul>

        <div id="bottom-actions">
          <app-button class="done-button" @click="${() => this.done()}"
            >Done</app-button
          >
        </div>
      </div>
    `;
  }
}
