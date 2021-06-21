import { LitElement, css, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import debounce from 'lodash-es/debounce';
import { getEditorState, emitter } from '../utils/codemirror';
import { domEventEmitter } from '../utils/events';

import { Lazy } from '../utils/interfaces';
import {
  CodeEditorEvents,
  CodeEditorSyncEvent,
} from '../utils/interfaces.codemirror';
import { increment } from '../utils/id';

import "./app-button";

@customElement('code-editor')
export class CodeEditor extends LitElement {
  @property({ type: String }) startText: Lazy<string>;

  @state()
  editorState: Lazy<EditorState>;

  @state() editorView: Lazy<EditorView>;

  @state() editorId: string;

  @state() editorEmitter = emitter;

  @state() copied = false;
  @state() copyText = "Copy Manifest";

  protected static editorIdGenerator = increment();

  static get styles() {
    return [
      css`
        #copy-block {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
      `,
    ];
  }

  constructor() {
    super();

    this.editorId = `editor-${CodeEditor.editorIdGenerator.next().value}`;

    this.editorEmitter.addEventListener(
      CodeEditorEvents.sync,
      (event: Event) => {
        const e = event as CustomEvent<CodeEditorSyncEvent>;

        this.startText = e.detail.text;
        this.updateEditor();
      }
    );

    this.editorEmitter.addEventListener(
      CodeEditorEvents.update,
      debounce((event: Event) => {
        this.dispatchEvent(event);
      })
    );

    domEventEmitter.addEventListener('resize', () => {
      this.requestUpdate();
    });
  }

  firstUpdated() {
    this.updateEditor();
  }

  async copyManifest() {
    const doc = this.editorState?.doc;

    if (doc) {
      try {
        await navigator.clipboard.writeText(doc.toString());
        this.copyText = "Copied";
        this.copied = true;
      }
      catch(err) {
        // We should never really end up here but just in case
        // lets put the error in the console
        console.warn("Copying failed with the following err", err);
      }
    }
  }

  render() {
    return html`
      <div id="copy-block">
        <app-button ?disabled="${this.copied}" @click="${() => this.copyManifest()}" appearance="outline" class="secondary">${this.copyText}</app-button>
      </div>

      <div id=${this.editorId} class="editor-container ${this.className}"></div>
    `;
  }

  updateEditor = debounce(() => {
    this.editorState = getEditorState(this.startText || "", 'json');

    if (this.editorView) {
      this.editorView.setState(this.editorState);
    } else {
      this.editorView = new EditorView({
        state: this.editorState,
        root: this.shadowRoot || undefined,
        parent: this.shadowRoot?.getElementById(this.editorId) || undefined,
      });
    }
  }, 2000);
}
