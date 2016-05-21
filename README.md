# [Game of Life](http://gameoflife.aissam.me)
This is a simple implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life)
![](https://i.imgur.com/AbOyxFM.gif)

To test this locally, clone the repo, then run:
```sh
npm install
npm run build
```
Open index.html in the browser.

The actual script is the file `index.js`, since it's written in es2015, it should be compiled with babel (that's what `npm run build` does) to generate `build.js` (the file that the browser will run).

