# Introduction

Crescendo is a social music discovery app that enables users to explore music around them in real-time, engage with nearby listeners, and participate in community-driven events while offering promotional opportunities to businesses and stakeholders in the music industry through music trends.

There are 5.5 billion music listeners, and we intend to capture the enthusiasts from this market. We envision businesses such as cafes, gyms, and bars that want to use our application to integrate music into their customer experience and marketing scheme. Furthermore, stakeholders in the music industry (artists, labels, producers, etc.) who wish to grow their audience may want to join our platform.

There are a few applications that emphasize music discovery that have motivated our work. Most influential, Airbuds Widget shows you what your friends on the app are currently listening to on the homescreen. Another app, Soundmap, puts collectible songs on a map, allowing users to collect them Pokémon Go style and trade with other users. Lastly, Fan Label lets users construct fantasy record labels where they can predict the popularity of new artists and music, earning points in the process from their real-world performance.

In our minds, Crescendo is, at its core, a combination of these three apps with plenty of additional features.

Apart from the existing software, there is little research given that Crescendo’s implementation is focused more on the full-stack development side and not too reliant on novel complex algorithms. Still, we found two relevant papers regarding recommendation systems and location privacy, which are key aspects of our application.

User-based collaborative filtering identifies users with similar preferences and suggests items they’ve liked. While methods like cosine similarity are effective for identifying similar users, they struggle with sparsity (low overlap in ratings) and the cold-start problem (new users without sufficient data) (Pinela, 2018). Graph Neural Networks (GNNs) address these challenges by utilizing user and item relationships, enabling recommendations even with minimal data by incorporating information from users’ networks (Wu et al., 2022).

The deprecation of Spotify's relevant API impacted our consideration of audio features for comparing song similarities. Although alternatives like RaccoBeats were identified, they could violate Spotify TOS. Without access to audio features, we can rely on comparing listening histories to recommend songs or artists based on shared preferences.

In terms of location privacy, the review of snapshot and continuous location-based services (LBS) informed our app’s hybrid approach. Techniques like dummy locations and cloaking offer effective privacy-preserving solutions by obfuscating precise user locations. While precise location data will be stored on our server, these techniques will be applied on the front-end to protect users’ privacy in public-facing interactions.

# Ethics Statement

## 1. Possible Futures
### Positive Future:
Crescendo successfully fosters real-time music discovery while fully protecting user privacy. It builds local music communities, promotes emerging artists, and creates meaningful, social connections without compromising safety or consent.

### Negative Future:
Crescendo unintentionally becomes a tool for stalking, harassment, or misuse. Even with privacy measures in place, users can still be deanonymized. Artists could also face spam or manipulation by fake listeners or bot-driven connections.

## 2. Stakeholders
- **Users**: everyday listeners, students, music fans
- **Artists and Creators**: local musicians, DJs, and independent creators
- **Local Communities**: campus groups, neighborhood music scenes
- **Developers**: the team responsible for building and maintaining the app
- **Advertisers/Partners**: any future third parties interested in collaboration
- **Moderation Team**: responsible for enforcing community guidelines and safety
- **Potential Bad Actors**: those who might misuse location data or harass users
- **Legal and Regulatory Bodies**: organizations concerned with data privacy

## 3. Values and Moral Lenses:

### Values:
- **Privacy**: Protect users' precise locations with cloaking and dummy locations.
- **Consent**: Ensure opt-in for visibility, sharing, and access by third parties.
- **Transparency**: Clear policies on data use and user rights, such as the right to delete.
- **Safety**: Provide robust blocking and reporting tools to handle harassment.
- **Community Integrity**: Focus on genuine music sharing over gamification or competition.
- **Accessibility**: Design an intuitive interface that’s easy for diverse users to navigate.

### Moral Lenses:
- **Outcome Lens**:  
  We aim to maximize positive experiences, such as authentic music discovery and community building, and minimize harm, including location misuse and harassment. Ethical success means both enjoyment and safety for users.

- **Process Lens**:  
  Our processes center on user agency: users actively decide how visible they want to be and what data they share. Consent is prioritized at every step, from account creation to daily app use. Implementing features like radius-based visibility ensures respect for individual comfort levels in all interactions.

- **Structure/Justice Lens**:  
  We are committed to equitable outcomes: all users, regardless of background, should have equal control over their presence and safety. No group should have to deal with more risks or harm than others (like marginalized users facing more harassment). Structural tools, such as contextual reporting and strong moderation, aim to uphold justice across the platform.

# References

- Jiang, H., Li, J., Zhao, P., Zeng, F., Xiao, Z., & Iyengar, A. (2021). Location Privacy-preserving mechanisms in location-based services: A comprehensive survey. *ACM Computing Surveys*, 54(1), Article 4. https://doi.org/10.1145/3423165

- Pinela, C. (2018, March 31). Recommender Systems — User-Based and Item-Based Collaborative Filtering. Medium. https://medium.com/@cfpinela/recommender-systems-user-based-and-item-based-collaborative-filtering-5d5f375a127f

- Wu, S., Sun, F., Zhang, W., Xie, X., & Cui, B. (2022). Graph neural networks in recommender systems: A survey. *ACM Computing Surveys*, 55(5), Article 97. https://doi.org/10.1145/3535101
