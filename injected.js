/*
 Class representing each individual track in a track list.
 */
function PlayItem(time, count, timeLink, description) {
  this.count = count;              // the track's index in the track list, starting with 1
  this.time = time;                // hh:mm:ss formatted time of this track in the video
  this.timeLink = timeLink;        // the 'yt.www.watch ... ' onclick event scraped from the time link
  this.description = description;  // the name, artist of the song, in reality all the text other than
                                   // the time on the same line as the time
}

/*
 Converts the PlayItem to html which is inserted into the
 playlistContainer as a playlist item. It displays all the
 known info about the track, and seeks the video to its time
 when clicked.
 */
PlayItem.prototype.toHtml = function () {
  var html = $('<div class="play-item"><span class="count">' +
    '</span><span class="title"></span><span class="time"></span></div>');

  html.find('.title').text(this.description);
  html.find('.time').text(this.time);
  html.find('.count').text(this.count);
  html.attr('onclick', this.timeLink);

  var that = this;
  html.click(function () {
    $('#currentlyPlaying').text(that.description);
  });

  return html;
};

/*
 A lot of track lists have useless leading text, for example:
 1- something
 2- another
 etc...
 This function removes '1- ', '2- ', and other stuff of that nature
 */
function removeLeadingGarbage(text) {
  return text.replace(/^([\s\.,-\/#!$%\^&\*;:{}=\-_`~()]|\d)+/, '');
}

/*
 A lot of track lists contain times in the following formats:
 (dd:dd)
 [dd:dd]
 This function removes brackets and parenthesis from around time
 */
function removeTimeGarbage(time) {
  return time.replace(/\(|\[|]|\)/g, '');
}

function scrapeTrackList() {
  var timeRegex = /\[?\(?(\d\d?:)?\d\d?:\d\d?\)?]?/;
  var description = $('#eow-description');

  var onclickEvents = description
    .find('a')
    .map(function () {
      return $(this).attr('onclick');
    });

  return description
    .get(0)                          // convert from JQuery object to html element
    .innerText                       // get text as a string rather than tree of elements
    .split('\n')                     // divide into lines
    .filter(function (line) {
      return timeRegex.test(line);   // only use lines that have a time in them as tracks
    })
    .map(function (line, index) {
      var time = removeTimeGarbage(line.match(timeRegex)[0]);
      var text = removeLeadingGarbage(line.replace(timeRegex, ''));

      return new PlayItem(time, index + 1, onclickEvents[index], text);
    });
}

function injectPlaylist() {
  $('#playlistContainer').remove();

  var links = scrapeTrackList();

  if ('/watch' === location.pathname) {
    $.get(chrome.extension.getURL('/injected.html'), function (data) {
      var playlistContainer = $(data);
      var itemsContainer = playlistContainer.find('#itemsContainer');

      links.forEach(function (link) {
        itemsContainer.append(link.toHtml());
      });

      $('#minimize').click(function () {
        playlistContainer.toggleClass('hidden');
        $(this).toggleClass('hidden');
      });

      if (links.length == 0) {
        playlistContainer.toggleClass('hidden');
        $(this).toggleClass('hidden');
        $('#no-playlist').removeClass('hidden');
      }

      playlistContainer.insertBefore('#watch-header');
    });
  }
}
/*
 YouTube actually is a single-page app, so the only way to be notified
 of a new 'page' being loaded is to subscribe to the 'end of transition'
 event on the little red progress bar at the top of the page. This literally
 gets called when the progress bar becomes the width of the page. It is
 VERY bad, and will most certainly break eventually, but as of right now
 it's the only way to be notified of a new page being loaded.

 More info here:
 http://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube
 */
(document.body || document.documentElement).addEventListener('transitionend',
  function (event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
      injectPlaylist();
    }
  }, true);

/*
 Inject into the page on first load
 */
injectPlaylist();