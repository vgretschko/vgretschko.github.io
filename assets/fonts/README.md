# Self-hosted fonts

Served from this site so that visitors' browsers never contact Google's font servers.

| Family | Used by | Files |
| --- | --- | --- |
| Fraunces (variable: opsz, wght; roman + italic) | Corten display face | `fraunces-*` |
| Inter (variable: wght) | body text in all skins except Terminal | `inter-*` |
| Caveat (variable: wght) | Blackboard skin | `caveat-*` |
| Archivo (variable: wght; italic 600) | Swiss skin | `archivo-*` |
| JetBrains Mono (variable: wght; italic 400) | Terminal skin | `jetbrains-mono-*` |

Each family is split into a `latin` and a `latin-ext` file; the `unicode-range` in the
`@font-face` rules at the top of `styles.css` makes browsers download only the files a page needs.
The files are the woff2 files Google Fonts serves for the same weights, downloaded on 2026-10-18.

All five families are licensed under the SIL Open Font License 1.1 (see `OFL.txt`).
