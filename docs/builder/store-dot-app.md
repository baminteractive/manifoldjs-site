# Publishing PWAs to Store.app

[Store.app](https://store.app) is an open web app store, is free to use, and is a great place to showcase your PWA. Listing on Store.app will provide additional third-party search results and allow you to take advantage of ratings/reviews and other tools including Store.app managed install modal, verified reviews, and more.

PWABuilder’s Store.app integration utilizes PWABuilder’s best-in-class PWA set-up to make listing your PWA on Store.app a breeze.

## Prerequisites

Before you list your app on Store.app, you will need:
- A valid PWA with a web manifest, published to the web and secured through HTTPS
- Your manifest must include data for:
  - `name`
  - `short_name`
  - `icons`
  - `start_url`
  - `description`

Once you have checked all these boxes, you are ready to list!

## Publish

Head over to Store.app to create your listing:

1. Go to [Store.app](https://store.app) and click "Login" on the top right
2. Next to "Don’t have an account yet?", click "Sign Up" 
3. Enter your details and click "Create Account" 
4. Go to your email and find the Store.app verification email - click the link to verify your email address
5. Go back to Store.app, and click "Request Developer Access" 
6. Enter your details and click "Submit"
7. You’ll receive a confirmation email momentarily. Now log back into Store.app
8. Click "Developer" in the sidebar
9. Click "Claim or add new app" 
10. Enter the URL of your app or search for it by name (if it’s already listed) 
11. Follow the instructions to claim your listing
12. Once claimed, return to your listing in your dev panel. You’ll now be able to publish your listing
13. To update your listing, go back to your dev panel and either re-fetch your manifest or enter manual overrides, and publish updates

## Next Steps

Progressive web apps are cross-platform and can be used anywhere!

After you've successfully published your app to the Google Play Store, you can package and publish for other platforms:

- [How to Package for Microsoft Store](/builder/windows)
- [How to Package for Meta Quest](/builder/meta)
- [How to Package for the App Store](/builder/app-store)