import { MutationTree } from 'vuex';
import { types, Manifest, helpers, Icon, Asset, RelatedApplication, CustomMember, State } from '~/store/modules/generator';
import { Screenshot } from './generator.state';

export const mutations: MutationTree<State> = {
  [types.UPDATE_LINK](state, url: string): void {
    state.url = url;
  },

  [types.UPDATE_MANIFEST](state, manifest: Manifest): void {
    if (manifest.generated) {
      delete manifest.generated;
    }

    if (typeof (manifest.related_applications) === "string") {
      manifest.related_applications = [];
    }

    state.manifest = manifest;
  },

  [types.UPDATE_WITH_MANIFEST](state, result): void {
    /*if (result.content.generated) {
      delete result.content.generated;
    }*/

    if (typeof (result.content.related_applications) === "string") {
      result.content.related_applications = [];
    }

    state.manifest = result.content;
    state.manifestId = result.id;
    state.siteServiceWorkers = result.siteServiceWorkers;
    if (result && result.content && result.content.icons) {
      state.icons = <Icon[]>helpers.prepareIconsUrls(result.content.icons, state.manifest && state.manifest.start_url ? state.manifest.start_url : '') || [];
    }
    if (result && result.content && result.content.screenshots) {
      state.screenshots = <Screenshot[]>helpers.prepareIconsUrls(result.content.screenshots, state.manifest && state.manifest.start_url ? state.manifest.start_url : '') || [];
    }
    state.suggestions = result.suggestions;
    state.warnings = result.warnings;
    state.errors = result.errors;
    state.generated = result.generated ? result.generated : false;
  },

  [types.OVERWRITE_MANIFEST](state, result): void {

    if (result.content.generated) {
      delete result.content.generated;
    }

    if (typeof (result.content.related_applications) === "string") {
      result.content.related_applications = [];
    }
    
    state.manifest = result.content;
    state.icons = result.content.icons;
  },

  [types.SET_DEFAULTS_MANIFEST](state, payload): void {
    if (!state.manifest) {
      return;
    }


        // fix some common issues with manifest
        if (state.manifest.generated) {
          delete state.manifest.generated;
        }
    
        if (typeof (state.manifest.related_applications) === "string") {
          state.manifest.related_applications = [];
        }

    state.manifest.lang = state.manifest.lang || '';
    state.manifest.display = state.manifest.display || payload.defaultDisplay;
    state.manifest.orientation = state.manifest.orientation || payload.defaultOrientation;
    state.manifest.generated = state.generated || payload.generated;
    state.icons = state.icons || payload.icons;
  },

  [types.UPDATE_ICONS](state, icons: Icon[]): void {
    state.icons = icons;
  },

  [types.ADD_ASSETS](state, assets: Asset[]): void {
    state.assets = assets;
  },

  [types.ADD_ICON](state, icon: Icon): void {
    state.icons.push(icon);
  },

  [types.RESET_STATES](state): void {
    state.url = null;
    state.manifest = null;
    state.manifestId = null;
    state.siteServiceWorkers = null;
    state.icons = [];
    state.suggestions = null;
    state.warnings = null;
    state.errors = null;
  },

  [types.ADD_RELATED_APPLICATION](state, payload: RelatedApplication): void {
    if (!state.manifest || !state.manifest.related_applications) {
      return;
    }

    state.manifest.related_applications = state.manifest.related_applications || [];

    state.manifest.related_applications.push(payload);
  },

  [types.REMOVE_RELATED_APPLICATION](state, id: string): void {
    if (!state.manifest || !state.manifest.related_applications) {
      return;
    }

    state.manifest.related_applications = state.manifest.related_applications || [];

    const index = state.manifest.related_applications.findIndex(app => {
      return app.id === id;
    });

    if (index < 0) {
      return;
    }

    state.manifest.related_applications.splice(index, 1);
  },

  [types.UPDATE_PREFER_RELATED_APPLICATION](state, status: boolean): void {
    if (!state.manifest) {
      return;
    }

    state.manifest.prefer_related_applications = status;
  },

  [types.ADD_CUSTOM_MEMBER](state, payload: CustomMember): void {
    if (!state.members) {
      return;
    }

    state.members.push(payload);
  },

  [types.REMOVE_CUSTOM_MEMBER](state, name: string): void {
    if (!state.members) {
      return;
    }

    const index = state.members.findIndex(member => {
      return member.name === name;
    });

    if (index < 0) {
      return;
    }

    state.members.splice(index, 1);
  },

  [types.UPDATE_COLOR](state, color: string): void {
    if (!state.manifest) {
      return;
    }

    state.manifest.background_color = color;
  },
};