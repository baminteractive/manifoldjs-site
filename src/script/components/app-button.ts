import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { AppButtonElement } from '../utils/interfaces.components';

@customElement('app-button')
export class AppButton extends LitElement implements AppButtonElement {
  @property({ type: String }) type = '';
  @property({ type: String }) colorMode = 'primary';
  @property({ type: String }) appearance = 'neutral';
  @property({ type: Boolean }) disabled = false;

  static get styles() {
    return css`
      :host {
        border-radius: var(--button-radius);
        display: block;

        --button-font-color: white;
      }

      fast-button {
        color: var(--button-font-color);
        width: 100%;

        border-radius: var(--button-radius);
        box-shadow: var(--button-shadow);
      }

      fast-button:disabled::part(control) {
        cursor: not-allowed;
      }

      fast-button.secondary {
        color: var(--font-color);
        border-color: transparent;
      }

      fast-button::part(control) {
        font-size: var(--desktop-button-font-size);
        font-weight: var(--font-bold);
        padding-left: 34px;
        padding-right: 34px;
      }

      fast-button.link {
        --accent-foreground-active: var(--font-color);
        --accent-foreground-hover: var(--font-color);

        width: auto;

        border-radius: unset;
        box-shadow: none;
      }

      fast-button.link::part(control) {
        width: auto;
        padding: 0;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <fast-button
        part="underlying-button"
        class="${classMap({
          link: this.appearance === 'lightweight',
          secondary: this.appearance === 'outline',
        })}"
        .appearance="${this.appearance}"
        .type="${this.type}"
        .color="${this.colorMode}"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </fast-button>
    `;
  }
}
