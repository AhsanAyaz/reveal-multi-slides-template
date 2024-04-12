import Deck, { VERSION } from './reveal.js';

/**
 * Expose the Reveal class to the window. To create a
 * new instance:
 * let deck = new Reveal( document.querySelector( '.reveal' ), {
 *   controls: false
 * } );
 * deck.initialize().then(() => {
 *   // reveal.js is ready
 * });
 */
let Reveal = Deck;

/**
 * The below is a thin shell that mimics the pre 4.0
 * reveal.js API and ensures backwards compatibility.
 * This API only allows for one Reveal instance per
 * page, whereas the new API above lets you run many
 * presentations on the same page.
 *
 * Reveal.initialize( { controls: false } ).then(() => {
 *   // reveal.js is ready
 * });
 */

let enqueuedAPICalls = [];

Reveal.initialize = (options) => {
  // Create our singleton reveal.js instance
  Object.assign(Reveal, new Deck(document.querySelector('.reveal'), options));

  // Invoke any enqueued API calls
  enqueuedAPICalls.map((method) => method(Reveal));

  return Reveal.initialize();
};

/**
 * The pre 4.0 API let you add event listener before
 * initializing. We maintain the same behavior by
 * queuing up premature API calls and invoking all
 * of them when Reveal.initialize is called.
 */
[
  'configure',
  'on',
  'off',
  'addEventListener',
  'removeEventListener',
  'registerPlugin',
].forEach((method) => {
  Reveal[method] = (...args) => {
    enqueuedAPICalls.push((deck) => deck[method].call(null, ...args));
  };
});

Reveal.isReady = () => false;

Reveal.VERSION = VERSION;

const main = async () => {
  const resp = await fetch('data/slides.json');
  const slides = await resp.json();
  const grid = document.getElementById('talksGrid');
  slides.forEach((slide) => {
    const { link, title } = slide;
    const sectionEl = document.createElement('section');
    sectionEl.className =
      'shadow-md border border-slate-300 rounded-md hover:bg-purple-700 duration-200 hover:text-white cursor-pointer';
    const anchorEl = document.createElement('a');
    anchorEl.className = 'p-4 w-full h-full block';
    anchorEl.href = `content/${link}`;
    anchorEl.target = '_blank';
    anchorEl.textContent = title;
    sectionEl.appendChild(anchorEl);
    grid.appendChild(sectionEl);
  });
};

main();

export default Reveal;
