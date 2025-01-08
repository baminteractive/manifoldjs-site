export interface infoPanel {
  description: String[];
  purpose?: string | null;
  example?: String[] | null;
  code?: string;
  required: boolean;
  location?:
    | "info"
    | "settings"
    | "platform"
    | "icons"
    | "screenshots"
    | "share"
    | "handlers";
  docs_link?: string;
  image?: string;
}

export const manifest_fields: { [field: string]: infoPanel } = {
  name: {
    description: [
      `name is a required member that specifies the display name for your application. Anywhere where a name for this application would be displayed, this value will be used. This name should usually align with the store listings associate with your applications. The name of your application also must be at least two characters in length.`,
    ],
    purpose: null,
    example: null,
    code: `"name": "WebBoard: A Drawing App"`,
    location: "info",
    required: true,
    docs_link: "https://docs.pwabuilder.com/#/builder/manifest?id=name-string",
  },
  short_name: {
    description: [
      `short_name functions similarly as the name member, except that it will only be used when there is not enough character space to display the applications regular name. It is recommended that short_name be 12 characters or less in length.`,
    ],
    purpose: null,
    example: null,
    code: `"short_name": "WebBoard"`,
    location: "info",
    required: true,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=short_name-string",
  },
  description: {
    description: [
      `description is an optional member that can be used to describe the functionality and purpose of your app. Just like short_name, this data should usually align with any store listings.`,
    ],
    purpose: null,
    example: null,
    code: `"description": "WebBoard is your go to application for quick doodles, notes, or sketches!"`,
    location: "info",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=description-string",
  },
  background_color: {
    description: [
      `background_color is an optional member that represents the page color of the window that your application will be opened in. This is the color that your app will default to before any styles are loaded. Once styles are loaded, your application will use the background color defined in your CSS.  In order to package with PWABuilder, this field must be a hex encoded string.`,
    ],
    purpose: null,
    example: null,
    code: `"background_color": "#4F3FB6"`,
    location: "info",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=background_color-string",
  },
  theme_color: {
    description: [
      `theme_color is an optional member that changes the default color used by certain OS features. For example, this would change the color of your title bar when the application is installed on Windows. In order to package with PWABuilder, this field must be a hex encoded string.`,
    ],
    purpose: null,
    example: null,
    code: `"theme_color": "#4F3FB6"`,
    location: "info",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=theme_color-string",
  },
  start_url: {
    description: [
      `start_url is a required member that specifies the URL that will be launched when a user opens your application. This URL can either be an absolute or relative path.`,
    ],
    purpose: null,
    example: null,
    code: `"start_url": "https://docs.pwabuilder.com"`,
    location: "settings",
    required: true,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=start_url-string",
  },
  dir: {
    description: [
      `dir is an optional member that specifies the text direction for your PWA.`,
    ],
    purpose: null,
    example: null,
    code: `"dir": "ltr"`,
    location: "settings",
    required: false,
    docs_link: "https://docs.pwabuilder.com/#/builder/manifest?id=dir-string",
  },
  scope: {
    description: [
      `scope is an optional member that defines which URL are within the navigation scope of your application. If the user navigates outside of your app's scope, they will be navigated to a normal browser window. scope can often just be set to the base URL of your PWA.`,
    ],
    purpose:
      "Setting a scope ensures that your PWA only navigates within its desired context. Your PWA can maintain UI/UX consistency by opening external content in the browser.",
    example: null,
    code: `"scope": "https://docs.pwabuilder.com"`,
    location: "settings",
    required: false,
    docs_link: "https://docs.pwabuilder.com/#/builder/manifest?id=scope-string",
  },
  lang: {
    description: [
      `lang is an optional member that specifies the primary language of your app. The language member expects a proper subtag for each langauge. For example, to specify English, you would use "en".`,
    ],
    purpose: null,
    example: null,
    code: `"lang": "en"`,
    location: "settings",
    required: false,
    docs_link: "https://docs.pwabuilder.com/#/builder/manifest?id=lang-string",
  },
  orientation: {
    description: [
      `orientation is an optional member that specifies the default display orientation for your application.`,
    ],
    purpose: `Indicating an orientation will allow your app to opened with an orientation that matches its design. This is especially important if you expect your application to be used on mobile devices.`,
    example: null,
    code: `"orientation": "portrait"`,
    location: "settings",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=orientation-string",
  },
  display: {
    description: [
      `display is an optional member that specifies the display mode that the website should default to.`,
    ],
    purpose: `Setting a display will help you control the look and feel of your application. Using an option that minimizes browser UI can make your PWA feel more like an application and less like a website.`,
    example: null,
    code: `"display": "standalone"`,
    location: "settings",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=display-string",
  },
  display_override: {
    description: [
      `display_override is similar to the display member, but allows you to select a fallback order for different display modes. In addition to the four display values, display_override can also take the value window-controls-overlay. Window-controls-overlay is a desktop-only display mode and adds a native-style overlay to the top of your application.`,
    ],
    purpose: `Using the display_override member gives you further control over how your application is displayed. By setting a custom fallback order, you can ensure your app stays as close to its intended design as possible.`,
    example: null,
    code: `"display_override": [
  "window-control-overlay",
  "standalone",
  "browser"
]`,
    location: "settings",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=display_override-array",
    image: "assets/manifest_examples/display_override_example_image.png",
  },
  iarc_rating_id: {
    description: [
      `iarc_rating_id is an optional member that allows you to specify a suitable age range for your application. A rating ID is obtained by answering a questionnaire about an application, and then providing the associated ID for that application.`,
    ],
    purpose: `Having an IARC Rating ID associated with your app allows users to asses if your app may be suitable for children or if it is intended as a product primarily for adults.`,
    example: null,
    code: `"iarc_rating_id": "e58c174a-81d2-5c3c-32cc-34b8de4a52e9"`,
    location: "platform",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=iarc_rating_id-string",
    image: "assets/manifest_examples/iarc_example_image.jpg",
  },
  related_applications: {
    description: [
      `related_applications is an optional member that specifies applications that have similar or adjacent functionality to your application.
        This member allows users and store listings to complement your application with related technology.`,
    ],
    purpose: `Including related applications will allow users to find technology that can supplement your own PWA, or perhaps even make it more useful.`,
    example: null,
    code: `"related_applications": [
      {
        "platform": "windows",
        "url": "https://www.example-app.com",
        "id": "example.ExampleApp"
      },
      {
        "platform": "play",
        "url": "https://www.example-app-2.com"
      }
    ]`,
    location: "platform",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=related_applications-array",
  },
  prefer_related_applications: {
    description: [
      `prefer_related_aplications is an optional member that specifies whether or not related_applications should be preferred to this one. This member defaults to false, but if set to true, the browser may recommend an alternate application to the user`,
    ],
    purpose: null,
    example: ["It is important that the value of this field is a boolean."],
    code: `"prefer_related_applications": true`,
    location: "platform",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=prefer_related_applications-boolean",
  },
  shortcuts: {
    description: [
      `shortcuts is an optional member that specifies a list of key tasks within your application. These shortcuts can be displayed by the operating system to allow a user to launch directly to a specific part of the application.`,
    ],
    purpose: `Shortcuts allow users to access certain areas of your PWA quickly and easily. Effectively implemeting shortcuts can reduce friction in your app and make your PWA feel more fully integrated with the native operating system.`,
    example: null,
    code: `"shortcuts": [
  {
    "name": "About",
    "url": "/about"
  },
  {
    "name": "Send Message",
    "url": "/new-message",
    "description": "Open a chat with another user and send a message to them."
  }
]`,
    location: "platform",
    docs_link:
      "https://docs.pwabuilder.com/#/home/native-features?id=shortcuts",
    required: false,
    image: "assets/manifest_examples/shortcuts_example_image.jpg",
  },
  protocol_handlers: {
    description: [
      `protocol_handlers is an optional member that specifies an array of protocols that the application can handle. A protocol handler will contain protocol and url members to specify how each valid protocol is handled.`,
    ],
    purpose: `Making use of protocol handlers can make your application more dynamic and functional. By defining handlers for different protocol schemes, your app can navigate directly to the appropriate content for certain types of links.`,
    example: null,
    code: `"protocol_handlers": [
  {
    "protocol": "web+music",
    "url": "/play?track=%s"
  }
]`,
    location: "platform",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=protocol_handlers-array",
  },
  categories: {
    description: [
      `categories is an optional member that specifies an array of categories that the application belongs to.`,
    ],
    purpose:
      "It is often beneficial to use commonly known categories or similar categories to apps that are related to yours.",
    example: null,
    code: `"categories": ["games", "finance", "navigation"]`,
    location: "platform",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=categories-array",
  },
  icons: {
    description: [
      `icons is a required member that specifies an array of icons to be used by your application for varying contexts and situations, such as in the action bar of your preferred operating system.`,
    ],
    purpose: null,
    example: [
      `The PWABuilder service enforces several validations to keep the icons for your app optimal:`,
      `• Your icons array must have at least one icon with a size of at least 512x512.`,
      `• If your icons array includes a maskable icon, this must be included as a **separate** icon, and can't be added as a dual icon type (like 'any maskable', for example). This is because using maskable icons as any can result in icons not being displayed optimally.`,
      `These validations are implemented so that your progressive web app will always have an icon that looks appropriate, regardless of the operating system or context they are viewed in.`,
    ],
    code: `"icons": [
  {
    "src": "https://www.pwabuilder.com/assets/icons/icon_192.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "https://www.pwabuilder.com/assets/icons/icon_512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable"
  }
]`,
    location: "icons",
    required: true,
    docs_link: "https://docs.pwabuilder.com/#/builder/manifest?id=icons-array",
  },
  screenshots: {
    description: [
      `screenshots is an optional member that specifies an array of screenshots that can showcase your application in app stores.`,
    ],
    purpose: `Including screenshots will allow users to get a sneak peak of your application when it is published and packaged for stores.`,
    example: null,
    code: `"screenshots" : [
  {
    "src": "screenshot.jpg",
    "sizes": "1280x720",
    "type": "image/jpg",
    "platform": "wide",
  }
]`,
    location: "screenshots",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=screenshots-array",
  },
  share_target: {
    description: [
      `share_target is an optional member that allows installed PWAs to be registered as a target in the system's share dialog.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
  "action": "/share-target/",
  "methods": ["GET"],
  "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/home/native-features?id=web-share-api",
    image: "assets/manifest_examples/share_target_example_image.jpg",
  },
  file_handlers: {
    description: [
      `file_handlers is an optional member that specifies how your progressive web app should handle different file types.`,
    ],
    purpose: null,
    example: null,
    code: `"file_handlers": [
    {
      "action": "/open-pdf",
      "accept": {
        "application/pdf": [".pdf"]
      },
      "icons": [
        {
          "src": "pdf-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ],
      "launch_type": "single-client"
    }
  }`,
    // location: "handlers",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=file_handlers-array",
    image: "assets/manifest_examples/file_handlers_example_image.jpg",
  },
  launch_handler: {
    description: [
      `launch_handlers is an optional member that controls the launch behavior of a web application.`,
    ],
    purpose: null,
    example: null,
    code: `"launch_handler": {
      "client_mode": "navigate-existing"
  }`,
    // location: "handlers",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=launch_handlers-string-array",
  },
  handle_links: {
    description: [
      `handle_links is an optional member that specifies the default link handling for the web application.`,
    ],
    purpose: null,
    example: null,
    code: `"handle_links": "preferred"`,
    // location: "handlers",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=handle_links-string",
  },
  scope_extensions: {
    description: [
      `scope_extensions is an optional member that specifies a list of origin patterns to associate with. This allows for your app to control multiple subdomains and top-level domains as a single entity.`,
    ],
    purpose: null,
    example: null,
    code: `"scope_extensions": [
      {"origin": "*.pwabuilder.com"},
      {"origin": "docs.pwabuilder.co.uk"},
      {"origin": "*.pwabuilder.co.uk"},
    ]
  `,
    // location: "handlers",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=scope_extensions-array",
  },
  edge_side_panel: {
    description: [
      `The edge_side_panel member specifies if your app supports the side panel in the Edge browser and if you do, the preferred width for when it opens.`,
    ],
    purpose: null,
    example: null,
    code: `"edge_side_panel": {
      "preferred_width": 600
    }
  `,
    location: "platform",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=edge_side_panel-object",

  },
  id: {
    description: [
      `id is an recommended member that functions as a unique identifier for your Progressive Web App that is separate from members that may change over time (such as name or start_url).`,
    ],
    purpose: null,
    example: null,
    code: `id: "/?homescreen=1"`,
    location: "info",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=id-string",
  },
  widgets: {
    description: [`In Windows 11, PWAs can define widgets, update them, and handle user interactions within them.`],
    purpose:`Various operating systems have widgets dashboards that let users read content and perform tasks.`,
    example:null,
    code:``,
    // location: "platform",
    required: false,
    docs_link: "https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/widgets",
},
  "share_target.action": {
    description: [
      `The URL within the scope of your app that your app will handle the share action.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
  "action": "/share-target/",
  "methods": ["GET"],
  "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.method": {
    description: [
      `GET or POST. Use POST if the shared data includes binary data like images.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.enctype": {
    description: [
      `The encoding of the data when the method is a POST request. Otherwise, ignored.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.params.title": {
    description: [
      `Name of the query parameter for the title of the document being shared.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.params.text": {
    description: [
      `Name of the query parameter for the body of the message being shared.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.params.url": {
    description: [`Name of the query parameter for the URL being shared.`],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.params.files.name": {
    description: [`Name of the form field used to share files.`],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.params.files.accept": {
    description: [
      `A string or array of strings of accepted MIME types or extensions.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
    docs_link:
      "https://docs.pwabuilder.com/#/builder/manifest?id=share_target-object",
  },
  "share_target.extra-step": {
    description: [
      `When a user selects your app in the system's share dialog, your PWA is launched, and a HTTP request is made to the provided URL. You will need to add this script to your SW.`,
    ],
    purpose: null,
    example: null,
    code: `"share_target": {
"action": "/share-target/",
"methods": ["GET"],
"params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`,
    location: "share",
    required: false,
  },
};

export const service_worker_fields: {[field: string]: infoPanel} ={
  has_service_worker: {
    description: ["Service workers are a specific type of web worker that serve as a proxy between your application and the network. All requests that go to or from your PWA will pass through the service worker first. This allows your service worker to handle requests in situations where the network may be unavailable."],
    required: false,
    docs_link: "https://docs.pwabuilder.com/#/home/sw-intro"
  },
  background_sync: {
    description: ["The Background Sync API allows you to register functionality that will occur whenever internet connectivity is next available. In other words, if your app is actively connected to the network, the functionality will occur right away. Otherwise, it will occur whenever your app is next connected to the network."],
    required: false,
    docs_link: "https://docs.pwabuilder.com/#/home/native-features?id=background-sync-overview"
  },
  periodic_sync: {
    description: ["Periodic background sync is similar to regular background sync, except that instead of being executed on request, it occurs at regular intervals. For example, you could implement sync functionality that is executed once an hour, once a day, or whatever your use case requires."],
    required: false,
    docs_link: "https://docs.pwabuilder.com/#/home/native-features?id=periodic-background-sync-overview"
  },
  push_notifications: {
    description: ["The Notifications API allows for you to send a pop up notification that displays on your users operating system whether your PWA is running or not."],
    required: false,
    docs_link: "https://docs.pwabuilder.com/#/home/native-features?id=push-notifications"
  },
  offline_support: {
    description: ["Offline support is whether or not your app has a solution for offline scenarios. This can include serving a 404 page or caching previous content."],
    required: false,
    docs_link: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers"
  },
}
