import { Router } from '@vaadin/router';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '../../components/arrow-link'
import { SlDetails, SlInput } from '@shoelace-style/shoelace';
import { cleanUrl, isValidURL, resolveUrl } from '../../utils/url';
import { localeStrings } from '../../../locales';
import { env } from '../../utils/environment'
import { getHeaders } from '../../utils/platformTrackingHeaders';
import { Icon, Manifest } from '@pwabuilder/manifest-validation';
import { AuthModule } from '../../services/auth_service';

import style from './app-token.style';
import { decideHeroSection, qualificationStrings, renderAppCard } from './app-token.template';

@customElement('app-token')
export class AppToken extends LitElement {

  @state() siteURL: string = "";
  @state() testsInProgress: boolean = false;
  @state() dupeURL: boolean = false;
  @state() testsPassed: boolean = false;
  @state() appCard = {
    siteName: 'Site Name',
    description: "Your site's description",
    siteUrl: 'Site URL',
    iconURL: '',
    iconAlt: 'Your sites logo'
  };
  @state() installablePassed: boolean = true;
  @state() installableRatio = 0;
  @state() installableTodos: TemplateResult[] = [];
  @state() installableClassMap = {red: false, yellow: false, green: false};

  @state() requiredPassed: boolean = true;
  @state() requiredRatio = 0;
  @state() requiredTodos: TemplateResult[] = [];
  @state() requiredClassMap = {red: false, yellow: false, green: false};

  @state() enhancementsPassed: boolean = true;
  @state() enhancementsRatio = 0;
  @state() enhancementsTodos: TemplateResult[] = [];
  @state() enhancementsClassMap = {red: false, yellow: false, green: false};
  @state() enhancementsIndicator = "";

  @state() errorGettingURL = false;
  @state() errorGettingToken = false;
  @state() errorMessage: string | undefined;

  @state() testResults: any = {};
  @state() manifest: Manifest = {};
  @state() manifestUrl: string = '';
  @state() noManifest: boolean = false;

  @state() proxyLoadingImage: boolean = false;

  @state() userAccount = {
    accessToken: '',
    email: '',
    name: '',
    loggedIn: false
  };
  @state() authModule = new AuthModule();


  static get styles() {
    return [
      style
    ]
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    const search = new URLSearchParams(location.search);
    const site = search.get('site');
    if (site) {
      this.siteURL = site;
      this.runGiveawayTests();
    }
  }

  async runGiveawayTests(){
    // run giveaway validation suite.
    this.testsInProgress = true;

    // pretending to test for now replace with: call to api for test results
    await this.validateUrl();

    this.testsInProgress = false;

    this.handleInstallable(this.testResults.installable);
    this.handleRequired(this.testResults.additional);
    this.handleEnhancements(this.testResults.progressive);
    this.populateAppCard();

  }

  async validateUrl(){
    const encodedUrl = encodeURIComponent(this.siteURL);

    const validateGiveawayUrl = env.validateGiveawayUrl + `/validateurl?site=${encodedUrl}`;
    let headers = getHeaders();

    try {
      const response = await fetch(validateGiveawayUrl, {
        method: 'GET',
        headers: new Headers(headers)
      });
      
      if (!response.ok) {
        console.warn('Validation Failed', response.statusText);

        throw new Error(
          `Unable to fetch response using ${validateGiveawayUrl}. Response status  ${response}`
        );
      }

      const responseData = await response.json();

      if(!responseData){
        console.warn(
          'Validating url failed due to no response data',
          response
        );
        throw new Error(`Unable to get JSON from ${validateGiveawayUrl}`);
      }

      console.log(responseData);

      if(responseData.error){
        console.error(responseData.error)
        this.noManifest = true;
      }

      this.testResults = responseData.testResults;
      this.manifest = responseData.manifestJson;
      this.manifestUrl = responseData.manifestUrl;
      this.testsPassed = responseData.isEligibleForToken;

    } catch (e) {
      console.error(e);
    }
  }

  async populateAppCard() {
    let cleanURL = this.siteURL.replace(/(^\w+:|^)\/\//, '')

    if(this.manifest) {

      let icons = this.manifest.icons;

      let chosenIcon: any;

      if(icons){
        let maxSize = 0;
        for(let i = 0; i < icons.length; i++){
          let icon = icons[i];
          let size = icon.sizes?.split("x")[0];
          if(size === '512'){
            chosenIcon = icon;
            break;
          } else{
            if(parseInt(size!) > maxSize){
              maxSize = parseInt(size!);
              chosenIcon = icon;
            }
          }
        }
      }

      let iconUrl: string;
      if(chosenIcon){
        iconUrl = this.iconSrcListParse(chosenIcon);
      } else {
        iconUrl = "/assets/icons/icon_512.png"
      }

      
      this.proxyLoadingImage = true;
      await this.testImage(iconUrl).then(
        function fulfilled(_img) {
          //console.log('That image is found and loaded', img);
        },

        function rejected() {
          //console.log('That image was not found');
          iconUrl = `https://pwabuilder-safe-url.azurewebsites.net/api/getSafeUrl?url=${iconUrl}`;
        }
      );
      this.proxyLoadingImage = false;

      this.appCard = {
        siteName: this.manifest.short_name
          ? this.manifest.short_name
          : (this.manifest.name ? this.manifest.name : 'Untitled App'),
        siteUrl: cleanURL,
        iconURL: iconUrl,
        iconAlt: "Your sites logo",
        description: this.manifest.description
          ? this.manifest.description
          : 'Add an app description to your manifest',
      };
    } else {
        this.appCard = {
          siteName: "Missing Name",
          siteUrl: cleanURL,
          description: "Your manifest description is missing.",
          iconURL: "/assets/new/icon_placeholder.png",
          iconAlt: "A placeholder for you sites icon"
        };
    }
  }

  // Gets full icon URL from manifest given a manifest icon object
  iconSrcListParse(icon: any) {
    let manifest = this.manifest;
    let manifestURL = this.manifestUrl;
    let iconURL: string = this.handleImageUrl(icon, manifest, manifestURL) || '';

    return iconURL;
  }

  // Tests if an image will load
  // If it fails, we use our proxy service to fetch it
  // If it succeeds, we load it
  testImage(url: string) {

    // Define the promise
    const imgPromise = new Promise(function imgPromise(resolve, reject) {

        // Create the image
        const imgElement = new Image();

        // When image is loaded, resolve the promise
        imgElement.addEventListener('load', function imgOnLoad() {
            resolve(this);
        });

        // When there's an error during load, reject the promise
        imgElement.addEventListener('error', function imgOnError() {
            reject();
        })

        // Assign URL
        imgElement.src = url;

    });

    return imgPromise;
  }

  // Makes sure the icon URL is valid
  handleImageUrl(icon: Icon, manifest: Manifest, manifestURL: string) {
    if (icon.src.indexOf('data:') === 0 && icon.src.indexOf('base64') !== -1) {
      return icon.src;
    }

    let url = resolveUrl(manifestURL, manifest?.startUrl);
    url = resolveUrl(url?.href, icon.src);

    if (url) {
      return url.href;
    }

    return undefined;
  }

  // Rotates the icon on each details drop down to 0 degrees
  rotateZero(card: string, e?: Event){
    //recordPWABuilderProcessStep(card + "_details_expanded", AnalyticsBehavior.ProcessCheckpoint);
    e?.stopPropagation();
    let icon: HTMLImageElement = this.shadowRoot!.querySelector('img[data-card="' + card + '"]')!;

    if(icon){
      icon!.style.transform = "rotate(0deg)";
    }
  }

  // Rotates the icon on each details drop down to 90 degrees
  rotateNinety(card: string, e?: Event){
    //recordPWABuilderProcessStep(card + "_details_closed", AnalyticsBehavior.ProcessCheckpoint);
    e?.stopPropagation();
    let icon: HTMLImageElement = this.shadowRoot!.querySelector('img[data-card="' + card + '"]')!;

    if(icon){
      icon!.style.transform = "rotate(90deg)";
    }

    // only allow one details to be open at a time
    let details = this.shadowRoot!.querySelectorAll("sl-details");
    details.forEach((detail: SlDetails) => {
      if(detail.dataset.card !== card){
        detail.hide();
      }
    })
  }

  handleInstallable(installable: any){

    let passedCount = 0;

    for (let key in installable) {
      let test = installable[key]
      this.installableTodos.push(
        html`
          <div class="inner-todo">
            ${test.valid ? 
              html`<img src=${valid_src} alt="passed test icon" />` : 
              html`
                ${test.errorString ? 
                  html`<sl-tooltip content=${test.errorString} placement="right">
                        <img src=${stop_src} alt="failed test icon" />
                      </sl-tooltip>` : 
                  html`
                    <img src=${stop_src} alt="failed test icon" />
                  `
                  }
              `}
            <p>${test.displayString}</p>
          </div>
        `
      )
      this.installablePassed = this.installablePassed && test.valid;
      if(test.valid) passedCount++;
    }

    this.installableRatio = (passedCount / Object.keys(installable).length) * 100;

    if(this.installablePassed){
      this.installableClassMap["green"] = true;
    } else {
      this.installableClassMap["red"] = true;
    }
    
  }

  handleRequired(required: any){

    let passedCount = 0;

    for (let key in required) {
      let test = required[key]
      this.requiredTodos.push(
        html`
          <div class="inner-todo">
            ${test.valid ? 
              html`<img src=${valid_src} alt="passed test icon" />` : 
              html`
                ${test.errorString ? 
                  html`<sl-tooltip content=${test.errorString} placement="right">
                        <img src=${stop_src} alt="failed test icon" />
                      </sl-tooltip>` : 
                  html`
                    <img src=${stop_src} alt="failed test icon" />
                  `
                  }
              `}
            <p>${test.displayString}</p>
          </div>
        `
      )
      this.requiredPassed = this.requiredPassed && test.valid;
      if(test.valid) passedCount++;
    }

    this.requiredRatio = (passedCount / Object.keys(required).length) * 100;

    if(this.requiredPassed){
      this.requiredClassMap["green"] = true;
    } else {
      this.requiredClassMap["red"] = true;
    }
    
  }

  handleEnhancements(enhancements: any){
    let passedCount = 0;

    for (let key in enhancements) {
      let test = enhancements[key]
      this.enhancementsTodos.push(
        html`
          <div class="inner-todo">
            ${test.valid ? 
              html`<img src=${valid_src} alt="passed test icon" />` : 
              html`
                ${test.errorString ? 
                  html`<sl-tooltip content=${test.errorString} placement="right">
                        <img src=${stop_src} alt="failed test icon" />
                      </sl-tooltip>` : 
                  html`
                    <img src=${stop_src} alt="failed test icon" />
                  `
                  }
              `}
            <p>${test.displayString}</p>
          </div>
        `
      )
      if(test.valid) passedCount++;
    }

    if(passedCount > 1){
      this.enhancementsRatio = 100;
      this.enhancementsClassMap["green"] = true;
      this.enhancementsPassed = true;
      this.enhancementsIndicator = "assets/new/macro_passed.svg";
    } else if (passedCount == 1) {
      this.enhancementsRatio = 50;
      this.enhancementsClassMap["yellow"] = true;
      this.enhancementsPassed = false;
      this.enhancementsIndicator = "assets/new/yellow_exclamation.svg";
    } else {
      this.enhancementsRatio = 0;
      this.enhancementsClassMap["red"] = true;
      this.enhancementsPassed = false;
      this.enhancementsIndicator = "assets/new/macro_error.svg";
    }
  }

  async signInUser() {
    try {
    const result = await this.authModule.signIn();
    if(result != null && result != undefined && "idToken" in result){
      return result;
    }
    else
      return null;
    }
    catch(e) {
      console.log("Authentication Error");
    } 
    return null;
  }

  async getUserToken() {
    const userResult = await this.signInUser();
    if(userResult != null) {
      console.log(userResult);
      this.userAccount = userResult;
      this.userAccount.loggedIn = true;
    }
  }

  async signOut() {
    try {
      await this.authModule.signOut();
      this.userAccount.loggedIn = false;
      this.requestUpdate();
    }
    catch(e) {
      console.log(e, "Authentication Error");
    } 
  }

  async claimToken() {
    const encodedUrl = encodeURIComponent(this.siteURL);

    const validateGiveawayUrl = env.validateGiveawayUrl + `/GetTokenForUser?site=${encodedUrl}`;
    let headers = getHeaders();

    try {
      const request = await fetch(validateGiveawayUrl, {
        method: 'GET',
        headers: {
          ...new Headers(headers),
          'Authorization': `Bearer ${this.userAccount.accessToken}`
        }
      });
      const response = await request.json() as {tokenId: string, errorMessage: string, rawError: unknown}
      // better way to do this?
      if (response.tokenId) { // :token/:appurl/:appname/:appicon/:user
        Router.go(`/congratulations/${response.tokenId}/${encodeURIComponent(this.appCard.siteUrl)}/${this.appCard.siteName}/${encodeURIComponent(this.appCard.iconURL)}/${this.userAccount.name}`)
      }
      else {
        this.errorGettingToken = true;
        this.errorMessage = response.errorMessage;
      }
    }
    catch(e){}
  }

  handleEnteredURL(){
    let input: SlInput = this.shadowRoot!.querySelector(".url-input") as unknown as SlInput;
    let url: string = input.value;

    try {
      url = cleanUrl(url);
    } catch {
      input.setCustomValidity(localeStrings.input.home.error.invalidURL);
      input.reportValidity();
      return;
    }

    const isValidUrl = isValidURL(url);

    if(isValidUrl){
      input.setCustomValidity("");
      this.siteURL = url;
      Router.go(`/giveaway?site=${this.siteURL}`)
    } else {
      input.setCustomValidity(localeStrings.input.home.error.invalidURL);
      input.reportValidity();
      this.requestUpdate();
      return;
    }
  }

  render(){
    return html`
    <div id="wrapper">
      <div id="hero-section">
        ${decideHeroSection(
          this.siteURL,
          {
            testsInProgress: this.testsInProgress,
            testsPassed: this.testsPassed,
            noManifest: this.noManifest,
            dupeURL: this.dupeURL
          },
          this.userAccount,
          this.errorGettingToken,
          this.handleEnteredURL
        )}
      </div>
      ${this.siteURL ? 
        html`
          <div id="app-info-section">
            ${renderAppCard(
              this.siteURL,
              {
                testsInProgress: this.testsInProgress,
                dupeURL: this.dupeURL,
                requiredPassed: this.requiredPassed,
                installablePassed: this.installablePassed,
              },
              this.appCard,
              {
                installableClassMap: this.installableClassMap,
                enhancementsClassMap: this.enhancementsClassMap,
                requiredClassMap: this.requiredClassMap,
              },
              {
                installableRatio: this.installableRatio,
                enhancementsRatio: this.enhancementsRatio,
                requiredRatio: this.requiredRatio,
                enhancementsIndicator: this.enhancementsIndicator,
              }
            )}
          </div>
          ${!this.userAccount.loggedIn ? html`
          <div id="action-items-section">
            <div id="qual-div">
              <div id="qual-sum">
                <h2>Technical Qualifications</h2>
              </div>
              <div id="categories">
                ${this.testsInProgress ? 
                  html`
                    <sl-skeleton effect="sheen"></sl-skeleton>
                    <sl-skeleton effect="sheen"></sl-skeleton>
                    <sl-skeleton effect="sheen"></sl-skeleton>
                  ` :
                  html`
                    <sl-details
                      id="installable-details" 
                      class="inner-details"
                      @sl-show=${(e: Event) => this.rotateNinety("installable-details", e)}
                      @sl-hide=${(e: Event) => this.rotateZero("installable-details", e)}
                      data-card="installable-details">
                      <div slot="summary" class="inner-summary">
                        <div class="summary-left">
                          ${this.installablePassed ? html`<img class="" src=${valid_src} alt="installable tests passed icon"/>` : html`<img class="" src=${stop_src} alt="installable tests failed icon"/>`}
                          <h3>PWA is installable</h3>
                        </div>
                        <img class="dropdown_icon" data-card="installable-details" src="/assets/new/dropdownIcon.svg" alt="dropdown toggler"/>
                      </div>
                      <div class="todos">
                        ${this.installableTodos.length > 0 ? this.installableTodos.map((todo: TemplateResult) => todo) : html``}
                      </div>
                    </sl-details>
                    <sl-details 
                      id="required-details" 
                      class="inner-details"
                      @sl-show=${(e: Event) => this.rotateNinety("required-details", e)}
                      @sl-hide=${(e: Event) => this.rotateZero("required-details", e)}
                      data-card="required-details">
                      <div slot="summary" class="inner-summary">
                        <div class="summary-left">
                          ${this.requiredPassed ? html`<img class="" src=${valid_src} alt="required tests passed icon"/>` : html`<img class="" src=${stop_src} alt="required tests failed icon"/>`}
                          <h3>Manifest has required fields</h3>
                        </div>
                        <img class="dropdown_icon" data-card="required-details" src="/assets/new/dropdownIcon.svg" alt="dropdown toggler"/>
                      </div>
                      <div class="todos">
                        ${this.requiredTodos.length > 0 ? this.requiredTodos.map((todo: TemplateResult) => todo) : html``}
                      </div>
                    </sl-details>
                    <sl-details 
                      id="enhancements-details" 
                      class="inner-details"
                      @sl-show=${(e: Event) => this.rotateNinety("enhancements-details", e)}
                      @sl-hide=${(e: Event) => this.rotateZero("enhancements-details", e)}
                      data-card="enhancements-details">
                      <div slot="summary" class="inner-summary">
                        <div class="summary-left">
                          ${this.enhancementsPassed ? html`<img class="" src=${valid_src} alt="enhancements tests passed icon"/>` : html`<img class="" src=${stop_src} alt="enhancements tests failed icon"/>`}
                          <h3>Includes two or more desktop enhancements</h3>
                        </div>
                        <img class="dropdown_icon" data-card="enhancements-details" src="/assets/new/dropdownIcon.svg" alt="dropdown toggler"/>
                      </div>
                      <div class="todos">
                        ${this.enhancementsTodos.length > 0 ? this.enhancementsTodos.map((todo: TemplateResult) => todo) : html``}
                      </div>
                    </sl-details>
                    `
                }
              </div>
            </div>
          </div> ` : html``}
        ` : 
        html``
      }
      
      ${ !this.userAccount.loggedIn ? html`
      <div id="qual-section">
        <h2>Qualifications</h2>
        <ul>
          ${qualificationStrings.map((point: string) => html`<li>${point}</li>`)}
        </ul>
        <arrow-link .link=${"https://pwabuilder.com"} .text=${"Full Terms and conditions"}></arrow-link>
      </div>` : html``}
      ${this.siteURL ? 
        html`
          ${ !this.userAccount.loggedIn ? 
            html`
              <div id="sign-in-section">
                ${this.testsPassed ? html`<sl-button class="primary" @click=${this.getUserToken}>Sign in with a Microsoft account</sl-button>` : html`<sl-button class="primary" @click=${() => Router.go(`/reportcard?site=${this.siteURL}`) }>Back to PWABuilder</sl-button>`}
              </div>
            ` : html `
                <div id="terms-and-conditions">
                  <label><input type="checkbox" /> By clicking this button, you accept the Terms of Service and our Privacy Policy.</label>
                  <sl-button class="primary" @click=${this.claimToken}>View Token Code</sl-button>
                  <p>You are signed in as ${this.userAccount.email} <a @click=${this.signOut}>Sign out</a></p>
                </div>
            `}
        ` : html``}
      ${!this.siteURL ?
        html`
          <div id="footer-section">
            <div id="footer-section-grid">
              <img id="marketing-img" src="/assets/new/pwabuilder-sc.png" alt="pwabuilder home page" />
              <div class="footer-text">
                <p class="subheader">Ship your PWAs to App Store</p>
                <p class="body-text">Companies of all sizes—from startups to Fortune 500s—have used PWABuilder to package their PWAs.</p>
                <sl-button class="primary" @click=${() => Router.go("/")} >PWABuilder</sl-button>
              </div>
              <div class="footer-text">
                <p class="large-subheader">Find your success in the Microsoft Store</p>
                <p class="large-body-text">Companies of all sizes—from startups to Fortune 500s—have used PWABuilder to package their PWAs.</p>
              </div>
              <img class="wheel-img" src="/assets/new/marketing-img2.png" alt="Logos of PWAs in the microsoft store" />
            </div>
          </div>
        ` : html``
      }
     
    </div>
    `
  }
}

const valid_src = "/assets/new/valid.svg";
const stop_src = "/assets/new/stop.svg";