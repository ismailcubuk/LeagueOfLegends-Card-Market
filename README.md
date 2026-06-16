# League of Legends Card Market

Responsive League of Legends card market built with React.  
You can browse champions, filter by role/price/search, buy and sell cards with wallet logic, and open champion detail modals with skills and lore.

Live demo: [League of Legends Card Market](https://ismailcubuk.github.io/LeagueOfLegends-Card-Market/)

![Preview](./public/images/screenshots/preview.png)

## Features

- Champion card marketplace (buy/sell flow)
- Wallet balance tracking
- Role-based filtering
- Price sorting (high to low / low to high / unfiltered)
- Search by champion name or id
- Pagination for shop cards
- “My Cards” collection section
- Carousel by role groups
- Champion detail modal (splash image, short story, passive + spells)
- Mobile fixed bottom filter bar (price/search/class)
- Responsive layout for desktop and mobile
- Local persistence with `localStorage`

## Tech Stack

- React 18
- JavaScript
- CSS
- React Bootstrap (Modal)
- React Icons
- Riot Data Dragon API (champion data/images)

## Project Structure

```text
src/
  app/
    App.js
  components/
    common/
      BlueEssenceIcon.js
      PriceAmount.js
      RarityPill.js
    effects/
      FlightEffects.js
    layout/
      Topbar.js
    feedback/
      Alert/
    pagination/
      Pagination/
    Body/
      Cards/
      Carousel/
      Navbar/
      Sidebar/
  config/
    navigation.js
    profileIcons.js
  context/
    CardContext.js
  data/
    championOrigins.js
    Lol.json
  domain/
    championPrices.js
  features/
    cart/
      CartPanel.js
    collection/
      HomeMyCardsSection.js
    favorites/
      FavoritesPanel.js
    filters/
      FilterPanel.js
      FilterSection.js
    hero/
      HeroSection.js
      HeroStat.js
    market/
      ChampionCard.js
      TrendingCarousel.js
    pack/
      PackOpeningSection.js
      PackOverlays.js
    preview/
      ChampionPreviewModal.js
    profile/
      CollectionPanel.js
      ShowcasePickerModal.js
  hooks/
    useBodyScrollLock.js
  utils/
    championMedia.js
    championMeta.js
    packOpening.js
  styles/
    index.css
  Images/
    Passive/
    Skills/
    Stats/
  index.js

public/
  index.html
  manifest.json
  robots.txt
  favicon.ico
  regions/
  images/
```

## Code Organization

- `public/index.html` is the HTML shell used by Create React App.
- `src/styles/index.css` and component CSS files keep styling separate from JavaScript.
- `src/app/App.js` owns the main screen flow and composes the marketplace sections.
- `src/components/common` contains reusable UI pieces used across the app.
- `src/components` contains shared UI, layout, feedback, pagination, and legacy Body components.
- `src/features` groups user-facing feature areas such as market, filters, pack, profile, cart, favorites, and champion preview.
- `src/context` contains global React context providers.
- `src/domain` contains domain-specific business helpers such as champion pricing.
- `src/hooks` contains focused reusable React behavior.
- `src/config` contains app navigation and profile icon configuration.
- `src/data` contains domain mapping data such as champion origins.
- `src/utils` contains pure helper logic for media URLs, rarity metadata, scoring, and pack opening.
