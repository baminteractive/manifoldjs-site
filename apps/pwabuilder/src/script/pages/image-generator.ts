import { LitElement, css, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { localeStrings } from '../../locales';

import '../components/app-header';
import '../components/app-file-input';
import { FileInputDetails, Lazy } from '../utils/interfaces';

import { recordProcessStep, AnalyticsBehavior } from '../utils/analytics';
import { env } from '../utils/environment';

interface PlatformInformation {
  label: string;
  value: string;
}

type ColorRadioValues = 'transparent' | 'custom';
const loc = localeStrings.imageGenerator;
const platformsData: Array<PlatformInformation> = [
  { label: loc.windows11, value: 'windows11' },
  { label: loc.android, value: 'android' },
  { label: loc.ios, value: 'ios' }
];
const baseUrl = env.imageGeneratorUrl;

function boolListHasChanged<T>(value: T, unknownValue: T): boolean {
  if (!value || !unknownValue) {
    return false;
  }

  return (value as Object).toString() === (unknownValue as Object).toString();
}

@customElement('image-generator')
export class ImageGenerator extends LitElement {
  @state({ hasChanged: boolListHasChanged })
  platformSelected: Array<boolean> = platformsData.map(() => true);

  @state() files: Lazy<FileList>;

  @state() padding = 0.3;

  @state() colorOption: ColorRadioValues = 'transparent';

  // hex color
  @state() color: string = '#ffffff';

  @state() selectAllState = false;

  @state() generating = false;

  @state() generateEnabled = false;

  @state() error: Lazy<string>;

  static get styles() {
    return [
      css`
        :host {
          --loader-size: 1.8em;
          --sl-input-height-medium: 1.5rem;
        }

        h1 {
          font-size: var(--xlarge-font-size);
          line-height: 48px;
          letter-spacing: -0.015em;
          margin: 0;
        }

        h2 {
          font-size: var(--large-font-size);
        }

        h3 {
          font-size: var(--medium-font-size);
        }

        p {
          font-size: var(--font-size);
        }

        small {
          display: block;
          font-size: 10px;
        }


        app-file-input:hover {
          cursor: pointer;
        }

        sl-button {
          height: 24px;
          padding: 8px 0;
        }

        sl-button::part(base) {
          margin: 0 16px;
        }

        #image-generator-card {
          background: #ffffff;
          padding: 16px;
        }

        #submit {
          margin-top: 8px;
        }

        .background {
          background-color: var(--primary-color);
          color: var(--font-color);
        }

        .main {
          padding: 32px;
        }

        sl-input {
          width: 30%;
          font-size: 16px;
        }
        small {
          margin-top: 10px;
        }
      `,
    ];
  }

  constructor() {
    super();
  }

  firstUpdated() {
    recordProcessStep('image-generation', `page-loaded`, AnalyticsBehavior.StartProcess);
  }

  render() {
    return html`
      <div>
        <app-header></app-header>
        <main id="main" role="presentation" class="main background">
          <div id="image-generator-card">
            <h1>${loc.image_generator}</h1>
            <p>${loc.image_generator_text}</p>
            <form id="imageFileInputForm" enctype="multipart/form-data" role="form" class="form">
              <section class="form-left">
                <div class="image-section">
                  <h3>${loc.input_image}</h3>
                  <p>${loc.input_image_help}</p>
                  <app-file-input @input-change=${this.handleInputChange}></app-file-input>
                </div>
                <div class="padding-section">
                  <h3>${loc.padding}</h3>
                  <sl-input name="padding" type="number" max="1" min="0" step="0.1" value=${this.padding}
                    @sl-change=${this.handlePaddingChange} required></sl-input>
                  <small>${loc.padding_text}</small>
                </div>
                <div class="color-section">
                  <h3>${loc.background_color}</h3>
                  <div class="color-radio">
                    <sl-radio-group orientation="vertical" .value=${this.colorOption}
                      @sl-change=${this.handleBackgroundRadioChange}>
                      <sl-radio name="colorOption" value="transparent">
                        ${loc.transparent}
                      </sl-radio>
                      <sl-radio name="colorOption" value="custom">
                        ${loc.custom_color}
                      </sl-radio>
                    </sl-radio-group>
                  </div>
                  ${this.renderColorPicker()}
                </div>
              </section>
              <section class="form-right platforms-section">
                <h4>${loc.platforms}</h4>
                <p>${loc.platforms_text}</p>
                <div role="group" class="platform-list">
                  ${this.renderPlatformList()}
                </div>
              </section>
              <section id="submit" class="form-bottom">
                <sl-button id="generateButton" class="primary" ?disabled=${!this.generateEnabled || this.generating}
                  @click=${this.generateZip}
                  ?loading=${this.generating}>
                  ${localeStrings.button.generate}

                </sl-button>

                ${this.renderError()}
              </section>
            </form>
          </div>
        </main>
      </div>
    `;
  }

  renderPlatformList() {
    return platformsData.map(
      (platform, i) => html`
        <sl-checkbox type="checkbox" name="platform" value="${platform.value}" ?checked=${this.platformSelected[i]}
          @sl-change=${this.handleCheckbox} data-index=${i}>
          ${platform.label}
        </sl-checkbox>
      `
    );
  }

  renderColorPicker() {
    if (this.colorOption === 'custom') {
      return html`<div class="custom-color-block">
  <label for="theme-custom-color">${localeStrings.values.custom}</label>
  <input type="color" id="theme-custom-color" name="color" .value=${this.color}
    @change=${this.handleThemeColorInputChange} />
</div>`;
    }

    return undefined;
  }

  renderError(): TemplateResult {
    if (this.error) {
      return html`<p style="font-size: 16px; color: red;">${this.error}</p>`;
    }

    return html``;
  }

  handleInputChange(event: CustomEvent<FileInputDetails>) {
    recordProcessStep('image-generation', 'choose-file-clicked', AnalyticsBehavior.ProcessCheckpoint);

    const input = event.detail.input;
    if (input.files) {
      this.files = input.files;
    }
    this.checkGenerateEnabled();
  }

  handlePaddingChange(event: Event) {
    recordProcessStep('image-generation', `padding-changed`, AnalyticsBehavior.ProcessCheckpoint);
    const input = <HTMLInputElement>event.target;
    let updatedValue = input.value;
    this.padding = parseFloat(updatedValue);
  }

  handleCheckbox(event: Event) {
    recordProcessStep('image-generation', `toggled-platforms`, AnalyticsBehavior.ProcessCheckpoint);
    const input = event.target as HTMLInputElement;
    const index = input.dataset['index'];
    this.platformSelected[index as any] = input.checked;

    this.checkGenerateEnabled();
  }

  handleBackgroundRadioChange(event: CustomEvent) {
    recordProcessStep('image-generation', `toggled-color-radios`, AnalyticsBehavior.ProcessCheckpoint);
    const value: ColorRadioValues = (<HTMLInputElement>event.target)
      .value as ColorRadioValues;
    this.colorOption = value;
    this.checkGenerateEnabled();
  }

  handleThemeColorInputChange(event: Event) {
    recordProcessStep('image-generation', `custom-color-selected`, AnalyticsBehavior.ProcessCheckpoint);
    const input = event.target as HTMLInputElement;
    this.color = input.value;
    this.checkGenerateEnabled();
  }

  async generateZip() {
    const file = this.files ? this.files[0] : null;
    if (!file) {
      const errorMessage = 'No file available to generate zip';
      console.error(errorMessage);
      this.error = errorMessage;
      return;
    }

    try {
      this.generateEnabled = false;
      this.generating = true;

      const form = new FormData();
      const colorValue =
        this.colorOption === 'custom' ? this.color : // custom? Then send in the chosen color
        'transparent'; // otherwise, it must be transparent

      form.append('fileName', file as Blob);
      form.append('padding', String(this.padding));
      form.append('color', colorValue);

      let selectedPlatforms = platformsData.filter((_, index) => this.platformSelected[index])

      selectedPlatforms.forEach(data => form.append('platform', data.value));

      let platformsForAnalytics: String[] = [];
      selectedPlatforms.forEach(data => platformsForAnalytics.push(data.value));

      recordProcessStep('image-generation', 'generate-zip-clicked', AnalyticsBehavior.ProcessCheckpoint, {
        color: colorValue,
        padding: String(this.padding),
        platforms: platformsForAnalytics
      });

      const res = await fetch(`${baseUrl}/api/generateIconsZip`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        recordProcessStep('image-generation', 'generate-zip-failed', AnalyticsBehavior.CompleteProcess, {
          error: res.statusText
        });
        throw new Error('Error from service: ' + res.statusText);
      }

      const postRes = await res.blob();
      this.downloadZip(postRes);
    } catch (e) {
      console.error(e);
      this.error = (e as Error).message;
      recordProcessStep('image-generation', 'generate-zip-failed', AnalyticsBehavior.CompleteProcess, {
        error: this.error
      });
    } finally {
      this.generating = false;
      this.generateEnabled = true;
    }
  }

  downloadZip(blob: Blob) {
    recordProcessStep('image-generation', 'generate-zip-successful', AnalyticsBehavior.CompleteProcess);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "AppImages.zip";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  checkGenerateEnabled() {
    this.generateEnabled =
      this.files !== undefined &&
      this.platformSelected.reduce((a, b) => a || b);
    return this.generateEnabled;
  }
}
