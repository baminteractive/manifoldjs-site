import {
  LitElement,
  customElement,
  css,
  html,
  property,
  query,
} from 'lit-element';

import { hidden } from '../utils/css/hidden';
import { fastButtonCss } from '../utils/css/fast-elements';
import { FileInputDetails, Lazy } from '../utils/interfaces';

@customElement('app-file-input')
export class FileInput extends LitElement {
  @property({ type: String }) inputId: Lazy<string>;
  @query('.file-input') fileInput: Lazy<HTMLInputElement>;

  static get styles() {
    return [
      css`
        :host {
        }
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
          id="${this.inputId}"
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
      this.requestUpdateInternal();
    }
  }
}
