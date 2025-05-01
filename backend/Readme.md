# Backend Documentation

## Auth

Helpful Links:
* [SpotifyAuth Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
* [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node?tab=readme-ov-file#usage)


<img src="https://developer-assets.spotifycdn.com/images/documentation/web-api/auth-code-flow.png" width="300" />

> Note: Change Client ID, Client Secret, and Redirect URI to match your Spotify App in .env file

### Manually testing!


### Step 0: Starting server
Run: 
```console
cd backend
npm start
```


### Step 1: Request Auth to access data

Run: 
```console
curl http://localhost:3000/api/auth/spotify/login
```

Then: click link, sign in with spotify, and allow access

### Steps 2: Request access, refresh tokens - redirect to URI Callback

Done by backend code in handleCallback

### Step 3: Use access token to make API calls

Also done by backend code in handleCallback

### Step 4: Refresh access token

Done by backend code in refreshAccessToken