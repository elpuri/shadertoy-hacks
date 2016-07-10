# shadertoy-hacks
A greasemonkey script for adding convenience hacks to shadertoy.com


## Features

* Alt+down resets the global time also when you're in fullscreen mode. 
  This is useful for running multi-pass shaders which accumulate results 
  such as path tracers in fullscreen mode
* Ctrl+D grabs a screenshot. Works both in normal and fullscreen mode.
* Single click forking of shaders. Useful when you've made tweaks to someone
  else's stuff and want to save a copy or when you want to a retain
  intermediate versions of your own shaders during development.


## Installation

1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
   (Chrome) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
2. Go to https://github.com/elpuri/shadertoy-hacks/raw/master/shadertoy-hacks.user.js and 
   Tampermonkey / Greasemonkey should take care of the rest.
