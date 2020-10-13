# COVID Tracker Jersey

## Open Access
This is a transparent project, the source code for the Jersey COVID Alert app is available for you to inspect on GitHub.
 
If you have found a bug, please email us at covidalert[at]gov.je with “Bug detected” in the subject and full details of the issue including attempts to reproduce it and screenshots if possible.
 
If you are a developer and want to help, we ask that you focus your efforts on [the Covid Green codebase](https://github.com/covidgreen) which is managed by the Linux Foundation for Public Health and is accepting pull requests in full open development.
 
If you are a security researcher and have found a vulnerability or problem, please email covidalert[at]gov.je with “Responsible Disclosure” in the subject.
EXTERNAL LINK BUTTON See the documentation [Github logo and link]


## Getting Started

Following these instructions will allow you to run and build the project on your local machine for development and testing purposes.

**Currently, Google / Apple are only making the ENS entitlement (GAEN API) required by this application to function available to one app per country / state and the account has to be associated with the government or public health authority. It's not currently possible for individual developers to have this entitlement enabled on their accounts. See https://www.google.com/covid19/exposurenotifications/ and https://developer.apple.com/contact/request/download/Exposure_Notification_Addendum.pdf for details. The Linux Foundation Public Health Project provides a [template](https://github.com/lfph/exposure-notification-playbook/blob/master/entitlement.md) that may be used to start the process of requesting entitlement.**

### Prerequisites

Follow the official guide "[Setting up the development environment](https://reactnative.dev/docs/environment-setup)" to set up your local machine to develop iOS and Android applications with React Native.

Install an Xcode version that supports iOS 13.5, required by the [ExposureNotification framework](https://developer.apple.com/documentation/exposurenotification) used by the app. The Exposure Notification capability is not yet available in iOS 14 beta (last beta published: beta 2).

Install `yarn` globally:

```bash
npm install -g yarn
```

For other installation methods, follow the official [Installation guide](https://classic.yarnpkg.com/en/docs/install).

### Installing

Clone this repository.

Install the npm dependencies:

```bash
yarn install
```

Create your `.env` file or copy it from the `.env.sample`:

```bash
cp .env.sample .env
```

Move to `ios/` folder and install the CocoaPods dependencies:

```bash
cd ios && pod install
```

## Running the applications locally

Start the React Native bundler:

```bash
yarn start
```

To start the Android application, run:

```bash
yarn android
```

To start the iOS one, run:

```bash
yarn ios
```

## Adding and optimizing icons

Any new SVG icons which are included within `assets/icons` should be optimized with `npm run optimize:svg`.

## Translations

There are import and export scripts located in `translations-script`. These can be run with `npm run translations:import` and `npm run:translations:export`. The output file(`output.xlsx`) is output in the `translations-script` directory.

The import script expects an `input.xlsx` file to be located in the `translations-script` directory.

## Conventional Commits

This repo follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

[Commitizen](https://github.com/commitizen/cz-cli) is used to help write commits in the correct format.

You can run either `yarn cz` or [set up commitizen globally](https://github.com/commitizen/cz-cli#using-the-command-line-tool) to be able to run `git cz` to run the interactive tool to help write your commit message.

If you'd prefer to write your commit message manually you can, we use [Commitlint](https://github.com/conventional-changelog/commitlint) to lint the commit message so any formatting issues will be picked up before code is committed.

## Creating a test/beta build

### Install fastlane

```bash
bundle install
```

### Build for iOS

In order to build, sign, and upload your app to TestFlight, you need to have configured a provisioning profile (with the Exposure Notification entitlement) and added a signing key to your Keychain.

Copy and then customize the dotenv file with your developer account information:

```bash
cd ios
cp .env.default.sample .env.default
```

Use fastlane to build the app and upload it to TestFlight:

```bash
cd ios
fastlane beta
```

This command will increment the build number. It will not change the app version. That must be done in the project settings manually.

### Build for Android

In order to build, sign, and upload your app to an internal test track, you need to have configured an app in the Play console that has been enabled for the Exposure Notification API, and installed an upload key and API access key locally. You will also need to know the keystore and key passwords.

Copy and then customize the dotenv file with your signing information:

```bash
cd android
cp .env.default.sample .env.default
```

Use fastlane to build the app and push it to a draft Internal Test Track:

```bash
cd android
fastlane internal
```

This command will increment the build number. It will not change the app version. That must be done in the project settings manually.

## License

Copyright (c) 2020 HSEIreland
Copyright (c) The COVID Green Contributors

[Licensed](LICENSE) under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
