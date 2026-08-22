# Portfolio

Personal portfolio site. Hand-built with HTML, CSS, Bootstrap (grid only) and vanilla JavaScript. No build step — open `index.html` and it runs.

## Structure

portfolio/
├── index.html # all markup, sections marked with <!-- EDIT ME --> comments
├── css/style.css # design tokens + all styling (numbered sections at the top)
├── js/main.js # theme toggle, parallax, reveal, mock game console
├── assets/ # put your screenshots / certificate logos here
└── README.md

## Notes

- The theme remembers your choice in `localStorage`, and falls back to your OS preference on a first visit.
- The dot-grid background parallaxes on scroll and is disabled automatically for visitors with "reduce motion" enabled.
- The game in Project 02 is a **visual mock** — CSS animation only, no game logic.
- If the GitHub contribution image fails to load, `main.js` draws a placeholder grid so the section never looks broken.

## Future Featured

- [x] Website icon
- [ ] Embedded game
- [ ] Title animation change (type writing animation)
- [ ] Multi-language support (i18n)
- [ ] Chatbot widget
- [ ] Clean responsive
