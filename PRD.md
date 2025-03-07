# Product Requirements Document (PRD)

**NOTE: AI was used to help create this document!**

## 1. Project Overview
**Purpose:**  
A social music discovery app that enables users to explore music around them in real-time, engage with nearby listeners, and participate in community-driven events, while also offering businesses and stakeholders in the music industry promotional opportunities through music trends.

## 2. Target Audience
**Primary Users:**  
- Music listeners  
- Market size: 5.5 Billion  

**Secondary Users:**  
- Businesses such as cafes, gyms, and bars who wish to integrate music into their customer experience and marketing scheme  
- Stakeholders in the music industry (artists, labels, producers, etc.) who wish to grow their audience  

## 3. User Stories

### User Stories for General Users

#### **Core Functionality**
- As a user, I want to see a map with a dynamic radius showing what songs people around me are listening to, so I can discover new music.
- As a user, I want to control my privacy and decide who can see my music activity or if I want to listen anonymously.
- As a user, I want to follow other users and have them follow me to connect over music interests.
- As a user, I want to denote some followers as close friends.
- As a user, I want to see my close friend’s/all followers' songs at all times (and vice-versa).
- As a user, I want to filter songs on the map by genre/artist/user reputation/just close friends/followers for increased privacy.

#### **Gamifying the Social Aspect**
- As a user, I want to earn a reputation to climb leaderboards, be considered a local curator, and earn music-related prizes like free Spotify premium.
- As a user, I want to participate in daily/weekly/etc. missions for reputation.

##### **Example Missions - Focus on Music Discovery**
- As a user, I want to earn profile badges for my music taste.  
  - **Trendsetter Badge:** You're one of the first in a city or area to listen to a trending song/artist before it blows up.  
  - **Niche Listener Badge:** If you often play songs that are unique in an area (e.g., playing classical in a gym dominated by rock/rap).  
  - **King of the Underground:** If you often listen to songs with low play counts, you get rewarded.

#### **Echo Sessions (Local & Global)**
- As a user, I want to participate in local/global "Echo Sessions" with nearby listeners to share/discover music with other users, with the ability to vote on the queue.
  - **Local:**
    - Any user can start a session and set the rules (e.g., open to all, invite-only, voting rules).
    - Other nearby users see it on the map and get an optional notification.
    - Hosts can invite nearby users (invites go to a dedicated "Echo Invites" tab to avoid spam).
  - **Global:**  
    - Users join their friends/followers from anywhere.
    - Maybe let randoms join? Host decides.  
    - **Featured:** Most popular local/global Echo Sessions can be highlighted.  
    - Curators/artists/etc. can host Echo Sessions that may be promoted.

#### **User Interaction & Customization**
- As a user, I want to react/chat/suggest a song I might like to someone actively listening.
- As a user, I want to customize my profile (profile pic, avatar/artist skins, bio, favorite genre/song/album, etc.).

#### **Record Label Mode (Fantasy League for Music)**
- As a user, I want to join record labels as a talent scout, compete against others, and work together with my record label.
  - **Season-based gameplay (1 month)**
    - Sign 4 artists you think will blow up.
    - Simple rankings based on new release calendar.
    - Every week (since new releases drop), head-to-head matchups are based on song/album predictions.
    - Pick 2 singles and 1 album from that week (this is your lineup).
    - Winning matchups allow you to replace 1 artist.
    - Track weekly performance within the record label.
    - At the end of the season, compare performance against other record labels.

### **Business Logic - External Partners**
- As a user, I want to earn location-based hidden discounts based on my listening activity.
- As a user, I want to access exclusive event-based (and location-based) music content.

### **User Stories for Curators**
- As a curator, I want to earn revenue/rewards/recognition for building a large following and fostering engagement by “putting others onto new music.”
  - Similar to verification on IG, X, etc.

### **User Stories for Businesses**
- As a business, I want to sponsor areas on the map to offer hidden discounts to customers based on their listening activity.
- As a business, I want to receive insights and auto-suggestions about local music trends to better curate in-store playlists.
- As a business, I want to engage users with "Crowd DJ Mode" and allow them to vote on songs played in my venue.

---

## 4. Design & User Flow

### **General User / Influencer UI Flow**
📍 **Home Screen (Music Map)**
- **Top Navbar:**
  - 🔍 Search (Profiles & possibly music).
  - 🏆 Daily Challenge Button (Shows progress & remaining time).
  - 🎶 Your Listening Status (Toggle visibility).

- **Main Map Interface:**
  - 🟢 Live songs playing nearby (Pulsing dots).
  - 🎚️ Filters (Genre, Reputation, Close Friends/Followers).
  - 🏠 Echo Session Markers (Live rooms appearing as clusters).
  - 🔥 Featured Curators overlay.

- **Bottom Navbar:**
  - 🏠 Home (Music Map)
  - 🎧 Echo Sessions (Live & Upcoming)
  - 📈 Record Label Mode
  - 👤 Profile & Reputation

### **Echo Sessions UI**
- **Accessing Echo Sessions (From Bottom Navbar)**
  - 🔥 Featured | 📍 Local | 🌍 Global | 🎟️ Your Invites
  - Start New Session button (Top right).
- **Inside an Echo Session:**
  - 🎶 Now Playing + Upcoming Queue.
  - 🗳️ Vote on songs.
  - 💬 Chat with reactions.
  - 🎟️ Invite others.

### **Record Label Mode UI**
- **Tabs:** 🏆 Leaderboard | 🎙️ Your Label | 🔍 Create/Discover Labels
- **Inside a Record Label:**
  - 📊 Internal Scout Leaderboard.
  - 🎙️ Your Artists (Swap based on weekly wins).
  - 🔄 Weekly Matchup Predictions (Pick 2 singles & 1 album).
  - 💬 Label Chat & Strategy Discussion.

### **Business & Venue UI Flow**
🏠 **Business Dashboard**
- 📊 Analytics (Local music trends & recommendations).
- 🎟️ Sponsored Discounts (Manage location-based offers).
- 🎶 Crowd DJ Mode (Voting-based in-store music).

🎶 **Crowd DJ Mode UI**
- 🔵 Start Voting Session → Customers vote on next songs.
- 📊 Live Vote Display → Shows customer selections.
- 🎚️ Control Preferences → Limit genres, auto-play top vote.

---

## 5. Technical Specs
**//TODO: Expand before sprint planning**
- **Authentication**
- **Map API + Location Access**
- **Clustering Algorithms for Map**
- **Spotify API + In-app media player**
- **Specialized Algorithms for User Interactivity**
- **Prediction Algorithms for Record Label Mode**
- **Data Analytics for Business Insights**

---

## 6. Similar Apps & Key Differences
| **App**      | **Description** |
|-------------|----------------|
| **SoundMap** | Pokemon Go-style app where users collect and trade songs. |
| **AirBuds** | Allows you to see what your friends are listening to. |
| **FanLabel** | Fantasy-based app where users act as a record label. |

---

## 7. Concerns
- **Data Privacy**
- **User Safety**
