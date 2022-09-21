import { LitElement, html } from "lit";
import {customElement} from 'lit/decorators.js';
import './components/scanner';
import './components/package-windows';
// import './components/manifest-designer';
import '@pwabuilder/manifest-editor';

import "@shoelace-style/shoelace/dist/components/tab-group/tab-group";
import "@shoelace-style/shoelace/dist/components/tab/tab";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel";


@customElement("pwa-extension")
export class PwaExtension extends LitElement {

  render() {
    return html`
    <sl-tab-group>
      <sl-tab slot="nav" panel="validate">Validate</sl-tab>
      <sl-tab slot="nav" panel="manifest">Manifest</sl-tab>
      <sl-tab slot="nav" panel="package">Package</sl-tab>

      <sl-tab-panel name="validate">
        <pwa-scanner></pwa-scanner>
      </sl-tab-panel>

      <sl-tab-panel name="manifest">
        <pwa-manifest-editor></pwa-manifest-editor>
      </sl-tab-panel>

      <sl-tab-panel name="package">
        <package-windows></package-windows>
      </sl-tab-panel>
    </sl-tab-group>
    `
    ;
  }

}