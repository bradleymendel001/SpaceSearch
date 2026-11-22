Extra credits
Beautification - A custom dark “deep space” color theme in src/theme.js. Tab icons switch between filled and outline. The Favorites tab shows a count badge (App.js). There’s a horizontal row of topic chips, and the search bar has an icon and a clear button.

Something of my own design - Favorites are cached on the phone (localCache.js), so they show up right away and still work offline before Firebase answers. The app opens with a random topic already searched. Pull-to-refresh works on both screens. Old search results can’t overwrite newer ones (the latestSearchId check).

Functional favorites screen - You can un-favorite with Delete on the Favorites screen, and the list updates.

Pages upon pages - Results load 20 at a time, and the next page loads when you scroll to the bottom (handleLoadMore).

Loading, please wait - A new search replaces the whole list with a spinner. The Save and Delete buttons show a spinner and lock while saving, so they can’t be tapped twice.

Known Bugs
If your security setting are set to maximum like mine you might have trouble running the app. To run the app without changing setting would be npx expo start --localhost (if you're using mac).

Other notes
So my original nasa api (Astronomy Picture of the Day) wouldn't return pictures. Instead it would only show a picture of the nasa logo instead of the actual picture. This was nasa's api fault. So instead of trying to figure out a confusing work around I pivoted and used another simple nasa api (https://images-api.nasa.gov/search) which allows you to search photos. And just for your information you won't find an API key because it does not require one to use it.