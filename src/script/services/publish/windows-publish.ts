import { env } from '../../utils/environment';
import { findBestAppIcon } from '../../utils/icons';
import { Manifest } from '../../utils/interfaces';
import {
  generateWindowsPackageId,
  validateWindowsOptions,
  WindowsPackageOptions,
} from '../../utils/win-validation';
import { getURL, getManifestUrl } from '../app-info';
import { fetchOrCreateManifest } from '../manifest';

export let windows_generated = false;

export async function generateWindowsPackage(
  windowsOptions: WindowsPackageOptions
) {
  if (!windowsOptions) {
    // this.showErrorMessage("Invalid Windows options. No options specified.");
    throw new Error('Invalid Windows options. No options specified.');
  }

  const validationErrors = validateWindowsOptions(windowsOptions);
  if (validationErrors.length > 0 || !windowsOptions) {
    throw new Error(
      'Invalid Windows options. ' +
      validationErrors.map(a => a.error).join('\n')
    );
  }

  const response = await fetch(`${env.windowsPackageGeneratorUrl}`, {
    method: 'POST',
    body: JSON.stringify(windowsOptions),
    headers: new Headers({ 'content-type': 'application/json' }),
  });
  if (response.status === 200) {
    const data = await response.blob();

    //set generated flag
    windows_generated = true;

    return data;
  } else {
    const responseText = await response.text();
    throw new Error(
      `Failed. Status code ${response.status}, Error: ${response.statusText}, Details: ${responseText}`
    );
  }
}

export async function createWindowsPackageOptionsFromManifest(
  localManifest?: Manifest
): Promise<WindowsPackageOptions> {
  let manifest: Manifest | undefined;

  if (localManifest) {
    manifest = localManifest;
  } else {
    const manifestContext = await fetchOrCreateManifest();
    manifest = manifestContext.manifest;
  }

  if (manifest) {
    const maniURL = getManifestUrl();
    const pwaURL = getURL();

    if (!pwaURL) {
      throw new Error("Can't find the current URL");
    }

    if (!maniURL) {
      throw new Error('Cant find the manifest URL');
    }

    const name = manifest.short_name || manifest.name || 'My PWA';
    const packageID = generateWindowsPackageId(new URL(pwaURL).hostname);
    const manifestIcons = manifest.icons || [];

    const icon = findBestAppIcon(manifestIcons);
    const options: WindowsPackageOptions = {
      name: name as string,
      packageId: packageID,
      url: pwaURL,
      version: '1.0.1',
      allowSigning: true,
      publisher: {
        displayName: 'Contoso, Inc.',
        commonName: 'CN=3a54a224-05dd-42aa-85bd-3f3c1478fdca',
      },
      generateModernPackage: true,
      classicPackage: {
        generate: true,
        version: '1.0.0',
        url: pwaURL,
      },
      edgeHtmlPackage: {
        generate: false,
      },
      manifestUrl: maniURL,
      manifest: manifest,
      images: {
        baseImage: icon?.src || '',
        backgroundColor: 'transparent',
        padding: 0.0,
      },
      resourceLanguage: manifest?.lang,
    };

    return options;
  } else {
    // temporary link until the home page has the logic to handle
    // a query string with the URL or the app so the user could re-run
    // the test here.
    throw new Error(`No manifest found, Double check that you have a manifest`);
  }
}

export async function createWindowsPackageOptionsFromForm(
  form: HTMLFormElement
): Promise<WindowsPackageOptions> {
  let manifest: Manifest;
  try {
    const manifestContext = await fetchOrCreateManifest();
    manifest = manifestContext.manifest;
  } catch {
    return createEmptyPackageOptions();
  }

  const name = form.appName.value || manifest.short_name || manifest.name;
  const packageID = form.packageId.value;
  const manifestIcons = manifest.icons || [];
  const icon = findBestAppIcon(manifestIcons);
  return {
    name: name,
    packageId: packageID,
    url: form.url.value || getURL(),
    version: form.appVersion.value || '1.0.1',
    allowSigning: true,
    publisher: {
      displayName: form.publisherDisplayName.value,
      commonName: form.publisherId.value,
    },
    generateModernPackage: true,
    classicPackage: {
      generate: true,
      version: form.classicVersion.value || '1.0.0',
      url: form.url.value || getURL(),
    },
    edgeHtmlPackage: {
      generate: false,
    },
    manifestUrl: form.manifestUrl.value || getManifestUrl(),
    manifest: manifest,
    images: {
      baseImage: form.iconUrl.value || icon,
      backgroundColor: 'transparent',
      padding: 0.0,
    },
    resourceLanguage: form.windowsLanguageInput.value || 'EN-US',
  };
}

function createEmptyPackageOptions(): WindowsPackageOptions {
  return {
    name: '',
    packageId: '',
    url: '',
    version: '',
    publisher: {
      displayName: '',
      commonName: '',
    },
  };
}
