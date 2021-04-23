import {
  LitElement,
  css,
  html
} from 'lit';

import { customElement, property, query } from "lit/decorators.js"

import { hidden } from '../utils/css/hidden';
import { fastButtonCss } from '../utils/css/fast-elements';
import { FileInputDetails, Lazy } from '../utils/interfaces';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('app-file-input')
export class FileInput extends LitElement {
  @property({ type: String }) inputId: string;
  @query('.file-input') fileInput: Lazy<HTMLInputElement>;

  static get styles() {
    return [
      css`

      `,
      hidden,
      fastButtonCss,
    ];
  }

  get input() {
    return this.fileInput;
  }

  get value() {
    return this.fileInput?.value;
  }

  get files() {
    return this.fileInput?.files;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <fast-button
          class="file-button"
          appearance="lightweight"
          @click=${this.clickModalInput}
          >${this.buttonText()}</fast-button
        >
        <input
          id="${ifDefined(this.inputId)}"
          class="file-input hidden"
          type="file"
          aria-hidden="true"
          @change=${this.handleModalInputFileChosen}
        />
      </div>
    `;
  }

  clickModalInput() {
    this.fileInput?.click();
  }

  buttonText() {
    if (this.input?.files?.length) {
      return this.input?.files?.item(0)?.name;
    }

    return 'Choose File';
  }

  handleModalInputFileChosen() {
    if (this.input) {
      const changeEvent = new CustomEvent<FileInputDetails>('input-change', {
        detail: {
          input: this.input,
        },
        composed: true,
        bubbles: true,
      });

      this.dispatchEvent(changeEvent);
      this.requestUpdate();
    }
  }
}
