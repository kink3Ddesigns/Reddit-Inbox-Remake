# Version 1.0.0

Developed by /u/Goctionni under the MIT License.

# Version 2.0.0

Initial fork commissioned by Kink3D under private development contract.

# Version 2.1.0

Completed migration to manifest v3.

- [chore] Migrate to manifest v3
- [fix] Use `chrome.storage.local` over `localStorage`
- [fix] Use `chrome.runtime` over `chrome.extension`

# Version 2.1.1

- [fix] Explicitly limit to old.reddit to prevent bugs when loading on modern Reddit.
- [feat] Basic Kink3D branding
- [feat] Updated `config.html` by changing about page to cite the new name & author
- [feat] README

# Version 2.1.2

- [feat] Name "Reddit Inbox Remake"
- [feat] Add in all requested "About" content
- [feat] Add in developer issue requests

# Version 2.1.3

- [fix] Fix issue where changing accounts led to inability to load the inbox
  - Appears to have been something internal to Reddit. When we logged in & out, reddit would add a `cache_bust` query param. When
    we add this ourselves to the reddit login, we never run into our own login problem. Which is strange? But the bug is fixed.

# Version 2.1.4

- [fix] Return this to working on reddit.com (not exclusively old.reddit.com)

# Version 2.1.5

- [fix] Correct config.html language & branding
- [fix] Fix branding message placed bellow the lowest element, not at end of either conversation or at inbox list
- [chore] Update license for public release

