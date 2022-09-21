import { LitElement, css, html, PropertyValueMap, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Manifest, ProtocolHandler, RelatedApplication, ShortcutItem } from '../utils/interfaces';
import { standardCategories } from '../locales/categories';
//import { validateSingleField } from 'manifest-validation';

// import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
// import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';

const overrideOptions: Array<string> =  ['browser', 'fullscreen', 'minimal-ui', 'standalone', 'window-controls-overlay'];
const platformOptions: Array<String> = ["windows", "chrome_web_store", "play", "itunes", "webapp", "f-droid", "amazon"]
const platformText: Array<String> = ["Windows Store", "Google Chrome Web Store", "Google Play Store", "Apple App Store", "Web apps", "F-droid", "Amazon App Store"]




@customElement('manifest-platform-form')
export class ManifestPlatformForm extends LitElement {

  @property({type: Object}) manifest: Manifest = {};

  @state() manifestInitialized: boolean = false;

  @state() activeOverrideItems: string[] = [];
  @state() inactiveOverrideItems: string[] = [];

  @state() shortcutHTML: TemplateResult[] = [];
  @state() protocolHTML: TemplateResult[] = [];
  @state() relatedAppsHTML: TemplateResult[] = [];

  static get styles() {
    return css`
      sl-input::part(base),
      sl-select::part(control),
      sl-menu-item::part(base),
      sl-button::part(base),
      sl-checkbox::part(base),
      sl-checkbox::part(control) {
        --sl-input-font-size-medium: 16px;
        --sl-button-font-size-medium: 12px;
        --sl-font-size-medium: 16px;
        --sl-input-height-medium: 3em;
        --sl-toggle-size: 16px;
      }
      #form-holder {
        display: flex;
        flex-direction: column;
        row-gap: 1em;
      }
      .form-row {
        display: flex;
        column-gap: 1em;
      }
      .form-row h3 {
        font-size: 18px;
        margin: 0;
      }
      .form-row p {
        font-size: 14px;
        margin: 0;
      }
      .form-field {
        width: 50%;
        row-gap: .25em;
        display: flex;
        flex-direction: column;
      }
      .field-header{
        display: flex;
        align-items: center;
        column-gap: 5px;
      }
      .color_field {
        display: flex;
        flex-direction: column;
      }
      .color-holder {
        display: flex;
        align-items: center;
        column-gap: 10px;
      }
      .toolTip {
        visibility: hidden;
        width: 200px;
        background-color: #f8f8f8;
        color: black;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        /* Position the tooltip */
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1;
      }
      .field-header a {
        display: flex;
        align-items: center;
        position: relative;
        color: black;
      }
      a:hover .toolTip {
        visibility: visible;
      }
      a:visited, a:focus {
        color: black;
      }
      sl-menu {
         width: 100%;
      }
      #cat-field {
        display: grid;
        grid-template-rows: repeat(6, auto);
        grid-auto-flow: column;
        column-gap: 10px;
        padding: 0 5px 5px 5px;
        background: white;
      }
      #override-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 5px;
      }
      #override-item {
        display: flex;
        align-items: center;
        column-gap: 10px;
      }
      sl-details {
        width: 100%;
      }
      sl-details::part(base){
        width: 100%;
        max-height: fit-content
      }
      sl-details::part(header){
        padding: 10px 15px;
        font-size: 16px;
      }
      .shortcut-holder {
        display: flex;
        flex-direction: column;
      }
      .shortcut-header{
        margin-bottom: 5px;
        margin-top: 0;
        font-size: 16px;
      }
      .shortcut-details::part(content){
        display: flex;
        flex-direction: column;
        row-gap: 10px;
      }
      .shortcut-holder sl-button {
        width: 50%;
        align-self: flex-end;
      }
      .long-items {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
      }
      .long-items h3 {
        font-size: 18px;
        margin: 0;
      }
      .long-items p {
        font-size: 14px;
        margin: 0;
      }
      .long-items .form-field {
        width: 100%;
      }
      .items-holder {
        display: flex;
        column-gap: 10px;
        overflow-x: scroll;
        padding-bottom: 10px;
      }
      .editable {
        display: flex;
        align-items:center;
        justify-content: space-between;
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated(){

  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {

    /* The first two checks are to reset the view with the most up to date manifest fields.
     The last check prevents the dropdown selector in related apps from causing everything
     to reset when it changes. It triggers an update event which would cause all of this to
     run again. Its true purpose is to keep the view aligned with the manifest. */
     
    if(_changedProperties.has("manifest") &&
      !this.manifestInitialized && this.manifest.name){

      this.manifestInitialized = true;
      this.reset();
    } else {
      this.manifestInitialized = false;
    }
  }

  reset() {
    this.initCatGrid();
    this.initOverrideList();
    this.requestUpdate();
  }

  initCatGrid(){
    if(this.manifest.categories){
      let checks = this.shadowRoot!.querySelectorAll(".cat-check");
      checks.forEach((cat: any) => {
          if(this.manifest.categories!.includes(cat.value)){
              cat.checked = true;
          } else {
              cat.checked = false;
          }
      });
    }
  }

  initOverrideList() {
    this.activeOverrideItems = [];
    this.inactiveOverrideItems = [];

    if(this.manifest.display_override){
      this.manifest.display_override!.forEach((item: string) => {
        this.activeOverrideItems.push(item);
      });
    }
    overrideOptions.forEach((item) => {
      if(!this.activeOverrideItems.includes(item)){
        this.inactiveOverrideItems.push(item);
      }
    });
  }

  async handleInputChange(event: InputEvent){

    const input = <HTMLInputElement | HTMLSelectElement>event.target;
    let updatedValue = input.value;
    const fieldName = input.dataset['field'];

    if(fieldName === "prefer_related_applications"){
        updatedValue = JSON.parse(updatedValue);
    }

    //if(await validateSingleField(fieldName!, updatedValue)){
      // Since we already validated, we only send valid updates.
      let manifestUpdated = new CustomEvent('manifestUpdated', {
        detail: {
            field: fieldName,
            change: updatedValue
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(manifestUpdated);
    //} else {
    //  console.error("input invalid.");
      // realistically we'll do some visual thing to show it is invalid.
    //}

  }

  updateCategories(){
    let categories: string[] = [];
    let checks = this.shadowRoot!.querySelectorAll(".cat-check");
    checks.forEach((cat: any) => {
        if(cat.checked){
            categories.push(cat.value);
        }
    });

    let manifestUpdated = new CustomEvent('manifestUpdated', {
        detail: {
            field: "categories",
            change: categories
        },
        bubbles: true,
        composed: true
    });
    this.dispatchEvent(manifestUpdated);
  }

  toggleOverrideList(label: string){
    let menuItem = (this.shadowRoot!.querySelector('sl-menu-item[value=' + label + ']') as HTMLElement);

    if(menuItem!.dataset.type === 'active'){
      // remove from active list
      let remIndex = this.activeOverrideItems.indexOf(label);
      this.activeOverrideItems.splice(remIndex, 1);

      // push to inactive list
      this.inactiveOverrideItems.push(label);
    } else {
      // remove from inactive list
      let remIndex = this.inactiveOverrideItems.indexOf(label);
      this.inactiveOverrideItems.splice(remIndex, 1);

      // push to active list
      this.activeOverrideItems.push(label);
    }

    // update manifest
    let manifestUpdated = new CustomEvent('manifestUpdated', {
      detail: {
          field: "display_override",
          change: [...this.activeOverrideItems]
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(manifestUpdated);

    this.requestUpdate();
  }

  addFieldToHTML(field: string){
    if(field === "shortcuts"){
      this.shortcutHTML.push(
        html`
          <form @submit=${(e: any) => this.addShortcutToManifest(e)} class="shortcut-holder">
            <h4 class="shortcut-header">Shortcut #${this.manifest.shortcuts ? this.manifest.shortcuts.length + 1 : 1}</h4>
            <sl-input class="shortcut-input" name="name" placeholder="Shortcut name" /></sl-input>
            <sl-input class="shortcut-input" name="url" placeholder="Shortcut url" /></sl-input>
            <sl-input class="shortcut-input" name="src" placeholder="Shortcut icon src" /></sl-input>
            <sl-input class="shortcut-input" name="desc" placeholder="Shortcut description" /></sl-input>
            <sl-button type="submit">Add to Manifest</sl-button>
          </form>
        `
      );
    } else if(field === "protocol_handlers"){
      this.protocolHTML.push(
        html`
          <form class="shortcut-holder" @submit=${(e: any) => this.addProtocolToManifest(e)}>
            <h4 class="shortcut-header">Protocol Handler #${this.manifest.protocol_handlers ? this.manifest.protocol_handlers.length + 1 : 1}</h4>
            <sl-input class="shortcut-input" name="protocol" placeholder="Protocol" /></sl-input>
            <sl-input class="shortcut-input" name="url" placeholder="URL" /></sl-input>
            <sl-button type="submit">Add to Manifest</sl-button>
          </form>
        `
      );
    } else {
      this.relatedAppsHTML!.push(
        html`
          <form class="shortcut-holder" @submit=${(e: any) => this.addRelatedAppToManifest(e)}>
            <h4 class="shortcut-header">Related App #${this.manifest.related_applications ? this.manifest.related_applications.length + 1 : 1}</h4>
            <sl-select placeholder="Select a Platform" placement="bottom">
              ${platformOptions.map((_, i: number) => html`<sl-menu-item value=${platformOptions[i]}>${platformText[i]}</sl-menu-item>` )}
            </sl-select>
            <sl-input class="shortcut-input" name="url" placeholder="App URL" /></sl-input>
            <sl-input class="shortcut-input" name="id" placeholder="App ID" /></sl-input>
            <sl-button type="submit">Add to Manifest</sl-button>
          </form>
        `
      );
    }
    this.requestUpdate();
  }

  addShortcutToManifest(e: any){
    e.preventDefault();
    this.shortcutHTML = [];
    const inputs = [...e.target.querySelectorAll('sl-input')];

    this.updateShortcutsInManifest(inputs, -1);
  }

  updateShortcutsInManifest(inputs: any, index: number){
    let name = inputs.filter((input: any) => input.name === "name")[0].value;
    let url = inputs.filter((input: any) => input.name === "url")[0].value;
    let src = inputs.filter((input: any) => input.name === "src")[0].value;
    let desc = inputs.filter((input: any) => input.name === "desc")[0].value;

    let scObject: ShortcutItem;

    if(src.length == 0){
      scObject = {
        name: name,
        url: url,
        description: desc
      }
    } else {
      scObject = {
        name: name,
        url: url,
        icons: [
          {
            src: src
          }
        ],
        description: desc
      }
    }
    

    if(index == -1){

      if(!this.manifest.shortcuts){
        this.manifest.shortcuts = []
      }

      this.manifest.shortcuts?.push(scObject)
    } else {
      this.manifest.shortcuts![index] = scObject;
    }

    let manifestUpdated = new CustomEvent('manifestUpdated', {
      detail: {
          field: "shortcuts",
          change: this.manifest.shortcuts
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(manifestUpdated);
  }

  addProtocolToManifest(e: any){
    e.preventDefault();
    this.protocolHTML = [];
    const inputs = [...e.target.querySelectorAll('sl-input')];

    this.updateProtocolsInManifest(inputs, -1);
  }

  updateProtocolsInManifest(inputs: any, index: number){
    let protocol: string = inputs.filter((input: any) => input.name === "protocol")[0].value;
    let url: string= inputs.filter((input: any) => input.name === "url")[0].value;

    const pObject: ProtocolHandler  = {
      protocol: protocol,
      url: url
    }

    if(index === -1){
      if(!this.manifest.protocol_handlers){
        this.manifest.protocol_handlers = []
      }
  
      this.manifest.protocol_handlers?.push(pObject);
    } else {
      this.manifest.protocol_handlers![index] = pObject;
    }

    let manifestUpdated = new CustomEvent('manifestUpdated', {
      detail: {
          field: "protocol_handlers",
          change: this.manifest.protocol_handlers
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(manifestUpdated);
  }

  addRelatedAppToManifest(e: any){
    e.preventDefault();
    this.relatedAppsHTML = [];
    const inputs = [...e.target.querySelectorAll('sl-input')];
    const select = e.target.querySelector('sl-select');

    this.updateRelatedAppsInManifest(inputs, select, -1);
  }

  updateRelatedAppsInManifest(inputs: any, select: any, index: number){
    let platform: string = select.value;
    let url: string = inputs.filter((input: any) => input.name === "url")[0].value;
    let id: string = inputs.filter((input: any) => input.name === "id")[0].value;

    const appObject: RelatedApplication  = {
      platform: platform,
      url: url,
      id: id
    }

    if(index == -1){
      if(!this.manifest.related_applications){
        this.manifest.related_applications = []
      }
  
      this.manifest.related_applications?.push(appObject);
    } else {
      this.manifest.related_applications![index] = appObject;
    }

    let manifestUpdated = new CustomEvent('manifestUpdated', {
      detail: {
          field: "related_applications",
          change: this.manifest.related_applications
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(manifestUpdated);
  }


  toggleEditing(tag: string){
    let inputs = [...this.shadowRoot!.querySelectorAll('[data-tag= \"' + tag + '\"]:not(sl-icon-button):not(sl-select)')];
    inputs.forEach((input: any) =>  input.disabled = !input.disabled);

    let select: any = this.shadowRoot!.querySelector('sl-select[data-tag= \"' + tag + '\"]');
    console.log(select);
    if(select){
      select.disabled = !select.disabled;
    }

    let button: any = this.shadowRoot!.querySelector('sl-icon-button[data-tag= \"' + tag + '\"]');
    
    if(button!.name === "pencil"){
      button.name = "save";
    } else {
      button.name = "pencil";

      const split_tag = tag.split(" ");
      const field = split_tag[0]
      const index = split_tag[1];

      if(field === "shortcuts"){
        this.updateShortcutsInManifest(inputs, parseInt(index));
      } else if(field === "protocol"){
        this.updateProtocolsInManifest(inputs, parseInt(index));
      } else {
        this.updateRelatedAppsInManifest(inputs, select, parseInt(index));
      }
    }
  }

  render() {
    return html`
      <div id="form-holder">
        <div class="form-row">
          <div class="form-field">
            <div class="field-header">
              <h3>IARC Rating ID</h3>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/iarc_rating_id"
                target="_blank"
                rel="noopener"
              >
                <ion-icon name="information-circle-outline"></ion-icon>
                <p class="toolTip">
                  Click for more info on the IARC rating id option in your manifest.
                </p>
              </a>
            </div>
            <p>Displays what ages are appropriate for your PWA</p>
            <sl-input placeholder="PWA IARC Rating ID" .value=${this.manifest.iarc_rating_id! || ""} data-field="iarc_rating_id" @sl-change=${this.handleInputChange}></sl-input>
          </div>
          <div class="form-field">
            <div class="field-header">
              <h3>Prefer Related Applications</h3>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/prefer_related_applications"
                target="_blank"
                rel="noopener"
              >
                <ion-icon name="information-circle-outline"></ion-icon>
                <p class="toolTip">
                  Click for more info on the prefer related applications option in your manifest.
                </p>
              </a>
            </div>
            <p>Should a user prefer a related app to this one</p>
            <sl-select placeholder="Select an option" data-field="prefer_related_applications" @sl-change=${this.handleInputChange} .value=${JSON.stringify(this.manifest.prefer_related_applications!) || ""}>
              <sl-menu-item value="true">true</sl-menu-item>
              <sl-menu-item value="false">false</sl-menu-item>
            </sl-select>
          </div>
        </div>
        <div class="long-items">
          <div class="form-field">
            <div class="field-header">
              <h3>Related Applications</h3>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/related_applications"
                target="_blank"
                rel="noopener"
              >
                <ion-icon name="information-circle-outline"></ion-icon>
                <p class="toolTip">
                  Click for more info on the related applications option in your manifest.
                </p>
              </a>
            </div>
            <p>related apps desc</p>
            <sl-details class="shortcut-details" summary="Click to edit related apps">
              <sl-button @click=${() => this.addFieldToHTML("related_applications")} ?disabled=${this.relatedAppsHTML.length != 0}>Add App</sl-button>
              <div class="items-holder">
                ${ this.manifest.related_applications ? this.manifest.related_applications.map((app: any, i: number) =>
                  html`
                    <div class="shortcut-holder">
                      <div class="editable">
                        <h4 class="shortcut-header">Related App #${i + 1}</h4>
                        <sl-icon-button name="pencil" label="Edit" style="font-size: 1rem;" data-tag=${"related " + i.toString()} @click=${() => this.toggleEditing("related " + i.toString())}></sl-icon-button>
                      </div>
                      <sl-select placeholder="Select a Platform" placement="bottom" .value=${app.platform || ""} name="platform" data-tag=${"related " + i.toString()} disabled>
                        ${platformOptions.map((_, i: number) => html`<sl-menu-item value=${platformOptions[i]}>${platformText[i]}</sl-menu-item>` )}
                      </sl-select>
                      <sl-input class="shortcut-input" placeholder="App URL" value=${app.url || ""} name="url" data-tag=${"related " + i.toString()} disabled></sl-input>
                      <sl-input class="shortcut-input" placeholder="App ID" value=${app.id || ""} name="id" data-tag=${"related " + i.toString()} disabled></sl-input>
                    </div>
                  `
                ): html``}
                ${this.relatedAppsHTML ? this.relatedAppsHTML.map((ele: TemplateResult) => ele) : html``}
              </div>
            </sl-details>
          </div>
          <div class="form-field">
            <div class="field-header">
              <h3>Display Override</h3>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override"
                target="_blank"
                rel="noopener"
              >
                <ion-icon name="information-circle-outline"></ion-icon>
                <p class="toolTip">
                  Click for more info on the display override option in your manifest.
                </p>
              </a>
            </div>
            <p>Used to determine the preferred display mode</p>
            <div id="override-list">
            <sl-details summary="Click to edit display override">
              <sl-menu>
                <sl-menu-label>Active Override Items</sl-menu-label>
                ${this.activeOverrideItems.length != 0 ?
                this.activeOverrideItems.map((item: string) =>
                  html`
                    <sl-menu-item class="override-item" value=${item} data-type="active" @click=${() => this.toggleOverrideList(item)} checked>
                      ${item}
                    </sl-menu-item>
                  `) :
                html`<sl-menu-item disabled>-</sl-menu-item>`}
              <sl-divider></sl-divider>
              <sl-menu-label>Inactive Override Items</sl-menu-label>
              ${this.inactiveOverrideItems.map((item: string) =>
                  html`
                    <sl-menu-item class="override-item" value=${item} data-type="inactive" @click=${() => this.toggleOverrideList(item)}>
                      ${item}
                    </sl-menu-item>
                  `)}
              </sl-menu>
              </sl-details>
            </div>
          </div>
          <div class="form-field">
            <div class="field-header">
              <h3>Shortcuts</h3>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/shortcuts"
                target="_blank"
                rel="noopener"
              >
                <ion-icon name="information-circle-outline"></ion-icon>
                <p class="toolTip">
                  Click for more info on the shortcuts option in your manifest.
                </p>
              </a>
            </div>
            <p>Links to key tasks or pages within a web app</p>
            <sl-details class="shortcut-details" summary="Click to edit shortcuts">
              <sl-button @click=${() => this.addFieldToHTML("shortcuts")} ?disabled=${this.shortcutHTML.length != 0}>Add Shortcut</sl-button>
              <div class="items-holder">
                ${this.manifest.shortcuts ? this.manifest.shortcuts!.map((sc: any, i: number) =>
                  html`
                    <div class="shortcut-holder">
                      <div class="editable">
                        <h4 class="shortcut-header">Shortcut #${i + 1}</h4>
                        <sl-icon-button name="pencil" label="Edit" style="font-size: 1rem;" data-tag=${"shortcut " + i.toString()} @click=${() => this.toggleEditing("shortcut " + i.toString())}></sl-icon-button>
                      </div>
                      <sl-input class="shortcut-input" name="name" placeholder="Shortcut name" value=${sc.name || ""} data-tag=${"shortcut " + i.toString()} disabled></sl-input>
                      <sl-input class="shortcut-input" name="url" placeholder="Shortcut url" value=${sc.url || ""} data-tag=${"shortcut " + i.toString()} disabled></sl-input>
                      <sl-input class="shortcut-input" name="src" placeholder="Shortcut icon src" value=${sc.icons ? sc.icons[0].src : ""} data-tag=${"shortcut " + i.toString()} disabled></sl-input>
                      <sl-input class="shortcut-input" name="desc" placeholder="Shortcut description" value=${sc.description || ""} data-tag=${"shortcut " + i.toString()} disabled></sl-input>
                    </div>
                  `
                ) : html``}
                ${this.shortcutHTML.map((ele: TemplateResult) => ele)}
                </div>
            </sl-details>
          </div>
          <div class="form-field">
            <div class="field-header">
              <h3>Protocol Handlers</h3>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/protocol_handlers"
                target="_blank"
                rel="noopener"
              >
                <ion-icon name="information-circle-outline"></ion-icon>
                <p class="toolTip">
                  Click for more info on the protocol handlers option in your manifest.
                </p>
              </a>
            </div>
            <p>Protocols this web app can register and handle</p>
            <sl-details class="shortcut-details" summary="Click to edit protocol handlers">
              <sl-button @click=${() => this.addFieldToHTML("protocol_handlers")} ?disabled=${this.protocolHTML.length != 0}>Add Protocol</sl-button>
              <div class="items-holder">
                ${this.manifest.protocol_handlers ? this.manifest.protocol_handlers.map((p: any, i: number) =>
                  html`
                    <div class="shortcut-holder">
                      <div class="editable">
                        <h4 class="shortcut-header">Protocol Handler #${i + 1}</h4>
                        <sl-icon-button name="pencil" label="Edit" style="font-size: 1rem;" data-tag=${"protocol " + i.toString()} @click=${() => this.toggleEditing("protocol " + i.toString())}></sl-icon-button>
                      </div>
                      <sl-input class="shortcut-input" name="protocol" placeholder="Protocol" value=${p.protocol || ""} data-tag=${"protocol " + i.toString()} disabled></sl-input>
                      <sl-input class="shortcut-input" name="url" placeholder="URL" value=${p.url || ""} data-tag=${"protocol " + i.toString()} disabled></sl-input>
                    </div>
                  `
                ): html``}
                ${this.protocolHTML.map((ele: TemplateResult) => ele)}
                </div>
            </sl-details>
          </div>
          <div class="form-field">
            <div class="field-header">
              <h3>Categories</h3>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/categories"
                target="_blank"
                rel="noopener"
              >
                <ion-icon name="information-circle-outline"></ion-icon>
                <p class="toolTip">
                  Click for more info on the categories option in your manifest.
                </p>
              </a>
            </div>
            <p>The categories your PWA fall in to</p>
              <div id="cat-field">
                ${standardCategories.map((cat: string) =>
                    this.manifest.categories?.includes(cat) ?
                      html`<sl-checkbox class="cat-check" @click=${() => this.updateCategories()} value=${cat} chekced>${cat}</sl-checkbox>`
                    :
                      html`<sl-checkbox class="cat-check" @click=${() => this.updateCategories()} value=${cat}>${cat}</sl-checkbox>`
                  )}
              </div>
          </div>
        </div>
      </div>
    `;
  }
}