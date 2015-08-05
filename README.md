# Youtube Playlist

This is a chrome extension that transforms a youtube video with a list of tracks 
in its description into a playlist.

##Dependencies

To build this extension you must have node.js installed on your system. Navigate to
the directory which contains the project, and run the following in terminal/cmd:

```
npm install
gulp build
```

The unpacked extension will be placed into the `dist` subdirectory.

##Testing

To run and test the extension, navigate to `chrome://extensions/`, and click the
`Load unpacked extension` button, and select the `dist` directory created during the
build step.

##Example
The following playlist was created in [this](https://www.youtube.com/watch?v=jgpJVI3tDbY) YouTube video.
![alt tag](https://github.com/ichub/youtube-playlist/blob/master/screenshot.png)
