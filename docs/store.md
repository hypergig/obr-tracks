---
title: Tracks
description: Play long looping background music and ambiance from your own library with builtin search and synchronized playback
author: Jordan Cohen
image: https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/header.png
icon: https://obr-tracks.web.app/tracks_256.png
tags:
  - audio
manifest: https://obr-tracks.web.app/manifest.json
learn-more: https://github.com/hypergig/obr-tracks
---

# Tracks

Play long looping background music and ambiance from your own library with builtin search and synchronized playback

## What you need to know

### ⚠️ Google Drive no longer supports this kind of usage ⚠️

As of January 10th, 2024 Google drive has stopped supporting embedded files in web applications. This means you can **no longer** use a full access Google Drive url directly with any website. Unfortunately this includes audio files with Tracks, but also extends to maps, tokens, images and any other Google drive file in any other web application. We are recommending users switch over to **[Dropbox](https://www.dropbox.com)** as they still support direct content embedding.

More information can be found in this [Google issue tracker](https://issuetracker.google.com/issues/319531488?pli=1). We are super sorry about how this has affected our users and understand how annoying it is to move file sharing services. Hopefully this _never happens again_.

### Public access

Tracks will **only** play audio files that are publicly available on the internet. This means your music needs to be hosted from a provider that offers public file sharing without having to login, such as **Dropbox**. If you already use a free TTRPG music site check to see if they offer download links of the audio files (most do), if so those URLs should work great with Tracks.

### Designed for GMs

Tracks was designed to be distraction free and super easy to use in session. We do this by:

- Keeping controls minimal
- The UI streamlined
- Employing a powerful builtin search

Your attention should be on the game, not fiddling with music.

Tracks automatically loops audio forever which makes it perfect for long running background music and ambience. **Tracks It isn't awesome at playing short sound effects and bites.** This may change in the future, keep checking back for updates.

## Quick start with [Dropbox](https://www.dropbox.com)

1. Share an **mp3** from [Dropbox](https://www.dropbox.com)

![share](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/share.png)

2. Make sure it says
   > Anyone with this link **can view**

and click **Copy link**

![copy](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/copy-link.png)

3. Switch back to **Tracks** and click **Add Track** in the menu

![menu](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/add.png)

4. Fill in the **Title**, paste the **Url**, and set some **Tags** so you can quickly find the track later

![add](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/add-track.png)

5. Save!

## Search

![link](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/search.png)

Tracks searches as you type, highlighting matching keywords on the fly. It specifically looks in two locations, track **title** and **tags**. Be sure use descriptive titles and _lots_ of tags, so you can easily locate your music later while in session. The search is also **fuzzy**, which means minor misspellings or mistakes should be overlooked, because who has time to spell _fantacy_ correctly when your trying to TPK the group?

## Menu

![menu](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/menu.png)

You can locate the main menu in the top left corner of the extension

### Add a Track

![add](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/add.png)

![add-track](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/add-track.png)

Fill in a descriptive **title**, publicly accessible **URL**, attach a bunch of **tags**, and click save to add a new track to your library.

#### Having trouble filling up your library?

Just ask for some help on [discord](https://discord.gg/u5RYMkV98s) and a community member will be happy to share an importable CSV of their library with you. This is the quickest way to get started.

### CSV

![csv](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/csv.png)

Tracks stores your library data in the browser. So if you would like to switch computers or browsers use a **CSV** to easily backup your entire library and restore it in a new location.

**TIP:** Sharing **CSV**s is a fun way of sharing your music library with others in the community.

#### Import

To import a CSV, click the **Import csv** button in the menu. The format looks like:

```
title,url,tags
Descriptive Track Title,https://some-place-on-the-internet.com/some.mp3,descriptive tag|another descriptive tag|one more descriptive tag
```

**NOTE:** Tags are separated by the `|` character.

Imports always **merge** into your library keyed off URL. This means, new URLs will become new tracks in your library, and existing URLs update existing tracks _already_ present in your library.

#### Export

To export a CSV, click the **Export csv** button in the menu. A file named `tracks.csv` will be downloaded to your computer. Use this file to import into another computer and/or browser.

It's probably a good idea to backup your library regularly by exporting it.

### Clear All Tracks

![clear](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/clear.png)

As it says on the tin, this clears all your tracks. **You might want to export a CSV _before_ doing this**.

## Context Menu

![context](https://raw.githubusercontent.com/hypergig/obr-tracks/main/docs/context.png)

You can **Edit** and **Delete** tracks via the track context menu (ie, right click a track).

**Note:** You can not change the url of a track, only it's **title** and **tags**. If you would like to change the url, simply delete the track and [re-add](#add-a-track) it.

## Support

The best way to get support is to ping me **`Jordan`** in [discord](https://discord.gg/u5RYMkV98s). If that doesn't work for you, you can also email me at [hypergig@gmail.com](mailto:hypergig@gmail.com).
