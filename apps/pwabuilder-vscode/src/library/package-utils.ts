import { writeFile } from "fs/promises";
const fetch = require('node-fetch');
import { Headers, Response } from "node-fetch";
import { Manifest, MsixInfo } from "../interfaces";

import * as vscode from "vscode";
import { AndroidPackageOptions } from "../android-interfaces";
import { URL } from "url";

import { trackEvent } from "../services/usage-analytics";
import { getURL } from "../services/web-publish";

export const WindowsDocsURL =
  "https://blog.pwabuilder.com/docs/windows-platform/";

export const iosDocsURL = "https://blog.pwabuilder.com/docs/ios-platform/";

/*
 * To-Do: More code re-use
 */

const advancedAndroidSettings: AndroidPackageOptions = {
  appVersion: "1.0.0.0",
  appVersionCode: 1,
  backgroundColor: "#FFFFFF",
  display: "standalone",
  enableNotifications: true,
  enableSiteSettingsShortcut: true,
  fallbackType: "customtabs",
  features: {
    locationDelegation: {
      enabled: true,
    },
    playBilling: {
      enabled: false,
    },
  },
  host: "https://myapp.com",
  iconUrl: "https://myapp.com/icon.png",
  maskableIconUrl: "https://myapp.com/maskable-icon.png",
  monochromeIconUrl: "https://myapp.com/monochrome-icon.png",
  includeSourceCode: false,
  isChromeOSOnly: false,
  launcherName: "app name", // launcher name should be the short name. If none is available, fallback to the full app name.
  name: "app name",
  navigationColor: "#FFFFFF",
  navigationColorDark: "#FFFFFF",
  navigationDividerColor: "#FFFFFF",
  navigationDividerColorDark: "#FFFFFF",
  orientation: "any",
  packageId: "com.myapp.pwa",
  shortcuts: [],
  signing: {
    file: null,
    alias: "my-key-alias",
    fullName: "Admin",
    organization: "PWABuilder",
    organizationalUnit: "Engineering",
    countryCode: "US",
    keyPassword: "", // If empty, one will be generated by CloudAPK service
    storePassword: "", // If empty, one will be generated by CloudAPK service
  },
  signingMode: "new",
  splashScreenFadeOutDuration: 300,
  startUrl: "/",
  themeColor: "#FFFFFF",
  shareTarget: [] as any,
  webManifestUrl: "https://myapp.com/manifest.json",
};

export async function packageForWindows(options: any) {
  let response: Response | undefined;

  try {
    response = await fetch(
      "https://pwabuilder-winserver.centralus.cloudapp.azure.com/msix/generatezip",
      {
        method: "POST",
        body: JSON.stringify(options),
        headers: new Headers({ "content-type": "application/json" }),
      }
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      `
        There was an error packaging for Windows: ${err}
      `
    );
  }

  return response;
}

export function getSimpleMsixFromArray(...args: string[]): MsixInfo {
  // This creates an unsigned package. Should be considered the bare minimum.
  return {
    url: args[0],
    name: args[1],
    packageId: "com.example.pwa",
    version: "1.0.1",
    allowSigning: true,
    classicPackage: {
      generate: true,
      version: "1.0.0",
    },
  };
}

export function getPublisherMsixFromArray(...args: string[]): MsixInfo {
  return {
    url: args[0],
    name: args[1],
    packageId: args[2],
    version: args[3] || "1.0.1",
    allowSigning: true,
    classicPackage: {
      generate: true,
      version: args[4],
    },
    publisher: {
      displayName: args[5],
      commonName: args[6],
    },
  };
}

export async function buildAndroidPackage(options: AndroidPackageOptions) {
  const generateAppUrl = `https://pwabuilder-cloudapk.azurewebsites.net/generateAppPackage`;

  let response: Response | undefined;

  try {
    response = await fetch(generateAppUrl, {
      method: "POST",
      body: JSON.stringify(options),
      headers: new Headers({ "content-type": "application/json" }),
    });
  } catch (err) {
    vscode.window.showErrorMessage(
      `
        There was an error packaging for Android: ${err}
      `
    );
  }

  return response;
}

export async function buildIOSPackage(options: IOSAppPackageOptions) {
  const generateAppUrl =
    "https://pwabuilder-ios.azurewebsites.net/packages/create";

  let response: Response | undefined;

  try {
    response = await fetch(generateAppUrl, {
      method: "POST",
      body: JSON.stringify(options),
      headers: new Headers({ "content-type": "application/json" }),
    });
  } catch (err) {
    vscode.window.showErrorMessage(
      `
        There was an error packaging for iOS: ${err}
      `
    );
  }

  return response;
}

export async function packageForIOS(options: any): Promise<any> {
  const responseData = await buildIOSPackage(options);

  if (responseData) {
    const appUrl = getURL();
    trackEvent("package", { packageType: "iOS", url: appUrl, stage: "complete" });

    return await responseData.blob();
  }
}

export async function buildIOSOptions(): Promise<any | undefined> {
  const appUrl = await vscode.window.showInputBox({
    prompt: "Enter the URL to your app",
  });

  if (!appUrl) {
    await vscode.window.showErrorMessage("Please enter a URL");
    return;
  }

  const manifestUrl = await vscode.window.showInputBox({
    prompt: "Enter the URL to your manifest",
  });

  let manifest: Manifest | undefined = undefined;

  if (manifestUrl) {
    // fetch manifest from manifestUrl using node-fetch
    let manifestData: Manifest | undefined | any;

    try {
      manifestData = await (await fetch(manifestUrl)).json();

      if (manifestData) {
        manifest = manifestData;
      }
    } catch (err) {
      // show error message
      vscode.window.showErrorMessage(
        `Error generating package: The Web Manifest could not be found at the URL entered.
          This most likely means that the URL you entered for your Web Manifest is incorrect.
          However, it can also mean that your Web Manifest is being served with the incorrect mimetype by
          your web server or hosting service. More info: ${err}
            `
      );
    }

    const host =
      [appUrl, manifestUrl].map((i) => tryGetHost(i)).find((i) => !!i) || "";

    // find icon with a size of 512x512 from manifest.icons
    const icon = manifest?.icons?.find((icon: any) => {
      if (icon.sizes && icon.sizes.includes("512x512")) {
        return icon;
      }
    });

    let packageResults = undefined;

    if (manifest && icon) {
      packageResults = {
        name: manifest.short_name || manifest.name || "My PWA",
        bundleId: iosGenerateBundleId(host),
        url: new URL(manifest.start_url || "/", manifestUrl).toString(),
        imageUrl: `${appUrl}/${icon.src}`,
        splashColor: manifest.background_color || "#ffffff",
        progressBarColor: manifest.theme_color || "#000000",
        statusBarColor:
          manifest.theme_color || manifest.background_color || "#ffffff",
        permittedUrls: [],
        manifestUrl: manifestUrl,
        manifest: manifest,
      };
    }

    return packageResults;
  } else {
    return undefined;
  }
}

export async function buildAndroidOptions(): Promise<
  AndroidPackageOptions | undefined
> {
  const appUrl = await vscode.window.showInputBox({
    prompt: "Enter the URL to your app",
  });

  if (!appUrl) {
    await vscode.window.showErrorMessage("Please enter a URL");
    return;
  }

  const manifestUrl = await vscode.window.showInputBox({
    prompt: "Enter the URL to your manifest",
  });

  const packageId = await vscode.window.showInputBox({
    prompt: "Enter the package ID",
  });

  const version = await vscode.window.showInputBox({
    prompt: "Enter your app's version number",
    placeHolder: "1.0.0.0",
  });

  const advancedSettings = await vscode.window.showQuickPick(
    [
      {
        label: "Yes",
        description: "Advanced settings will be enabled",
      },
      {
        label: "No",
        description: "Advanced settings will not be enabled",
      },
    ],
    {
      title: "Change Advanced Settings such as signing information?",
    }
  );

  if (manifestUrl && packageId) {
    // fetch manifest from manifestUrl using node-fetch

    let manifestData: Manifest | undefined | unknown;
    let manifest: Manifest | undefined;
    try {
      manifestData = await (await fetch(manifestUrl)).json();

      if (manifestData) {
        manifest = (manifestData as Manifest);
      }
    } catch (err) {
      // show error message
      vscode.window.showErrorMessage(
        `Error generating package: The Web Manifest could not be found at the URL entered.
          This most likely means that the URL you entered for your Web Manifest is incorrect.
          However, it can also mean that your Web Manifest is being served with the incorrect mimetype by
          your web server or hosting service. More info: ${err}
        `
      );
    }

    // find icon with a size of 512x512 from manifest.icons
    const icon = manifest?.icons?.find((icon: any) => {
      if (icon.sizes && icon.sizes.includes("512x512")) {
        return icon;
      }
    });

    const maskableIcon = manifest?.icons?.find((icon: any) => {
      if (icon.purpose && icon.purpose.includes("maskable")) {
        return icon;
      }
    });

    if (!icon) {
      await vscode.window.showErrorMessage(
        "Your app cannot be packaged, please add an icon with a size of 512x512"
      );

      return;
    }

    if (!maskableIcon) {
      await vscode.window.showWarningMessage(
        "We highly recommend adding a maskable icon to your app, however your app can still be packaged without one"
      );
    }

    // make sure we have manifestUrl and packageId first
    if (advancedSettings && advancedSettings.label === "Yes") {
      // handle advanced settings
      const uri = await vscode.window.showSaveDialog({
        title: "Save advanced Android settings file to continue",
        defaultUri: vscode.Uri.file(
          `${vscode.workspace.workspaceFolders?.[0].uri.fsPath}/android-settings.json`
        ),
      });
      if (uri) {
        await writeFile(
          uri.fsPath,
          JSON.stringify(advancedAndroidSettings, null, 2)
        );

        const textEditor = await vscode.window.showTextDocument(uri);

        try {
          const answer = await vscode.window.showQuickPick(
            [
              {
                label: "Save and Generate",
              },
              {
                label: "Cancel",
              },
            ],
            {
              title:
                "Save advanced settings and generate my package? Ensure you have edited your settings first.",
            }
          );

          if (answer && answer.label === "Save and Generate") {
            await textEditor.document.save();
            const options = await textEditor.document.getText();

            return JSON.parse(options);
          }
        } catch (err: any) {
          await vscode.window.showErrorMessage(
            err ? err.message : "Error writing android settings file"
          );
        }
      }
    }

    let packageResults: AndroidPackageOptions | undefined = undefined;

    if (manifest && icon) {
      packageResults = {
        appVersion: version || "1.0.0.0",
        appVersionCode: 1,
        backgroundColor:
          manifest.background_color || manifest.theme_color || "#FFFFFF",
        display: manifest.display || "standalone",
        enableNotifications: true,
        enableSiteSettingsShortcut: true,
        fallbackType: "customtabs",
        features: {
          locationDelegation: {
            enabled: true,
          },
          playBilling: {
            enabled: false,
          },
        },
        host: appUrl,
        iconUrl: `${appUrl}/${icon.src}`,
        maskableIconUrl: maskableIcon ? `${appUrl}/${maskableIcon.src}` : null,
        monochromeIconUrl: null,
        includeSourceCode: false,
        isChromeOSOnly: false,
        launcherName:
          manifest.short_name?.substring(0, 30) || manifest.name || "", // launcher name should be the short name. If none is available, fallback to the full app name.
        name: manifest.name || "My PWA",
        navigationColor:
          manifest.background_color || manifest.theme_color || "#FFFFFF",
        navigationColorDark:
          manifest.background_color || manifest.theme_color || "#FFFFFF",
        navigationDividerColor:
          manifest.background_color || manifest.theme_color || "#FFFFFF",
        navigationDividerColorDark:
          manifest.background_color || manifest.theme_color || "#FFFFFF",
        orientation: manifest.orientation || "default",
        packageId: packageId || "com.android.pwa",
        shortcuts: manifest.shortcuts || [],
        signing: {
          file: null,
          alias: "my-key-alias",
          fullName: `${manifest.short_name || manifest.name || "App"} Admin`,
          organization: manifest.name || "PWABuilder",
          organizationalUnit: "Engineering",
          countryCode: "US",
          keyPassword: "", // If empty, one will be generated by CloudAPK service
          storePassword: "", // If empty, one will be generated by CloudAPK service
        },
        signingMode: "new",
        splashScreenFadeOutDuration: 300,
        startUrl: manifest.start_url || "/",
        themeColor: manifest.theme_color || "#FFFFFF",
        shareTarget: manifest.share_target || [],
        webManifestUrl: manifestUrl,
      };
    }

    return packageResults;
  }
}

/**
 * Package options for PWABuilder's iOS platform. Should match https://github.com/pwa-builder/pwabuilder-ios/blob/main/Microsoft.PWABuilder.IOS.Web/Models/IOSAppPackageOptions.cs
 */
export interface IOSAppPackageOptions {
  name: string;
  bundleId: string;
  url: string;
  imageUrl: string;
  splashColor: string;
  progressBarColor: string;
  statusBarColor: string;
  permittedUrls: string[];
  manifestUrl: string;
  manifest: any;
}

export function iosGenerateBundleId(host: string): string {
  const parts = host
    .split(".")
    .reverse()
    .map((p) => p.trim().toLowerCase())
    .filter((p) => p.length > 0);
  return parts.join(".");
}

/**
 * Validates the iOS app package options and returns errors as an array of strings.
 * The array will be empty if there are no errors.
 * @param options The options to validate.
 */
export function validateIOSOptions(options: IOSAppPackageOptions): string[] {
  const errors: string[] = [];

  if (!options.bundleId) {
    errors.push("Bundle ID required");
  }
  if (options.bundleId.length < 3) {
    errors.push("Bundle ID must be at least 3 characters in length");
  }
  if (options.bundleId.includes("*")) {
    errors.push("Bundle ID cannot contain asterisk");
  }

  if (!options.imageUrl) {
    errors.push("Image URL required");
  }

  if (!options.manifest) {
    errors.push("Manifest required");
  }

  if (!options.manifestUrl) {
    errors.push("Manifest URL required");
  }

  if (!options.name) {
    errors.push("Name required");
  }
  if (options.name.length < 3) {
    errors.push("Name must be at least 3 characters in length");
  }

  if (!options.progressBarColor) {
    errors.push("Progress bar color required");
  }

  if (!options.splashColor) {
    errors.push("Splash color required");
  }

  if (!options.statusBarColor) {
    errors.push("Status bar color required");
  }

  if (!options.url) {
    errors.push("URL required");
  }

  return errors;
}

export function emptyIOSPackageOptions(): IOSAppPackageOptions {
  return {
    name: "",
    bundleId: "",
    url: "",
    imageUrl: "",
    splashColor: "#ffffff",
    progressBarColor: "#000000",
    statusBarColor: "#ffffff",
    permittedUrls: [],
    manifestUrl: "",
    manifest: {},
  };
}

function tryGetHost(url: string): string | null {
  try {
    return new URL(url).host;
  } catch (hostError) {
    console.warn("Unable to parse host URL due to error", url, hostError);
    return null;
  }
}
