# [Project Title]

## Middlebury College, CSCI 701 (Senior Seminar, Spring 2025)

This is your main project README which will contain instructions on how to build and run your project. You can delete and overwrite the contents of this README file at any point. We'll talk about what should be included in this file later in the semester.

This initial project template contains a few workflows (defined in `.github/workflows`) to help with your project development:

1. `checks.yml`: A workflow that runs anytime a PR is opened, or a new commit is pushed to a branch with an open PR. At some point in the semester, please modify/add steps for the checks you wish to run (e.g. adding checks for tests & style). Your repository is configured to require all status checks to pass before merging a PR.

2. `merge.yml`: A workflow that runs when a commit is pushed to the `main` branch, like when a Pull Request is merged. If you need to deploy your project, you should add some steps in this file. When this workflow succeeds, a message will be sent to your project channel in Slack.

3. `issue.yml`: A workflow that will notify your project channel in Slack that a new Issue was created.

In general, your development workflow will be to open one (or more) Issues in any given week, write the code in the coming week, and then open and merge one (or more) PRs that address the corresponding Issue(s) from the previous week. When opening an Issue & Pull Request, please complete the relevant fields in the description (the templates are defined in the `.github` directory).

Your first task is to create/review/merge a Pull Request that addresses Issue #1, which consists of creating a `CODE_OF_CONDUCT.md` file for your project.

**React-Native**

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

//Trying jira itnegrations again CRES11
