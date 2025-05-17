
<img src="https://github.com/user-attachments/assets/a3055d34-0123-4097-95d8-8c633e1bbde5" width="300" />

# A Location-Based Music Discovery App


## Started at Middlebury College for CSCI 701 (Senior Seminar, Spring 2025)

This initial project template contains a few workflows (defined in `.github/workflows`) to help with your project development:

1. `checks.yml`: A workflow that runs anytime a PR is opened, or a new commit is pushed to a branch with an open PR. Eventually, we will use ESLint and testing. The repository is configured to require all status checks to pass before merging a PR.

2. `merge.yml`: A workflow that runs when a commit is pushed to the `main` branch, like when a Pull Request is merged. When this workflow succeeds, a message will be sent to your project channel in Slack.

3. `issue.yml`: A workflow that will notify your project channel in Slack that a new Issue was created.

# Tech Stack

![Static Badge](https://img.shields.io/badge/React%20Native-%2361DBFB?logo=React&labelColor=black)
![Static Badge](https://img.shields.io/badge/Expo-%23ffffff?logo=Expo&labelColor=black)
![Static Badge](https://img.shields.io/badge/PostgreSQL-%23326790?logo=PostgreSQL&labelColor=D3D3D3)
![Static Badge](https://img.shields.io/badge/Supabase-black?logo=Supabase&labelColor=black&color=%2340CE8D)
![Static Badge](https://img.shields.io/badge/Express-black?logo=Express)
![Static Badge](https://img.shields.io/badge/Node.js-red?logo=Node.js&labelColor=%23505050&color=%235E9F4E)


# Abstract (or About/Description): foreword & summary.
While traditional social media connects people through content consumption and creation, Crescendo connects people through their listening habits. 
Ultimately, our application maps what users nearby and friends are currently enjoying, creating a geosocial layer over everyday music listening.

# Installing

Our project has yet to be deployed. But, We aim to deploy our client-side code through [Expo](https://docs.expo.dev/build/setup/) and host our backend Node.js server on Vercel.
For now, the following steps will apply to building Crescendo through [Expo Go](https://expo.dev/go) which expedites the development process.

## Expo Go - Getting Started

> **_NOTE:_** Make sure you have completed the [Set Up Your Environment](https://docs.expo.dev/get-started/set-up-your-environment/) guide before proceeding. Select Expo Go when asked "How would you like to develop?"


### Compile and run your app

```sh
# for Android
npx expo run:android

# for IOS
npx expo run:ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

### Learn More

To learn more about **Expo**, check out the [Getting Started Docs](https://docs.expo.dev/get-started/introduction/):

## Setting up the Backend

Inside the backend folder, create a ```.env``` and ```.env.production``` file.

### Setting up the DB for local development

We followed this (tutorial)[https://www.youtube.com/watch?v=BceVcpiOlKM&t=719s]

To set up the 

In the ```.env``` file, copy and paste:

```
# Local Supabase (DB) credentials
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Spotify API credentials
SPOTIFY_CLIENT_ID=ac244bca6e2940e4bc0fd936c2f537af
SPOTIFY_CLIENT_SECRET=200c39338534426ca84cad4e46c23ae0
SPOTIFY_REDIRECT_URI=exp://10.3.99.237:8081/--/auth/callback
SPOTIFY_TEST_REFRESH_TOKEN=AQC5dftVZk1PVy_cWO3Ib0chEc64gvn017rgfz80eH9X43hRXIlIdPHQdm74ezC44HCO0G2cvv7rpANQOY1koQ72YX-L3Anjj_TrLTDdPVwnQZhKA-NIgoxnulc5o9miQ88

# Port configuration
PORT=3000
```





## Setting up the Frontend

# Examples

-- TODO: make a vid w/ all the features!!

# Acknowledgements
We would like to thank Professor [Philip Caplan](https://www.middlebury.edu/college/people/philip-caplan) for his guidance throughout the semester, especially regarding the ethical considerations of our project and the effective communication techniques to pitch our project and provide progress updates. 

# License
We plan to keep the repository closed-source, but in the event we open-source it, we will use the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).



