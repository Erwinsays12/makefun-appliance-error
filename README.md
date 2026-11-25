[![make.fun](https://make.fun/badge/u-xvader-the-funniest-honest-appliance-error-adec4450.svg)](https://make.fun/c/u-xvader-the-funniest-honest-appliance-error-adec4450)
[![rank](https://make.fun/badge/u-xvader-the-funniest-honest-appliance-error-adec4450/Erwinsays12/makefun-appliance-error/rank.svg)](https://make.fun/c/u-xvader-the-funniest-honest-appliance-error-adec4450)
[![reward](https://make.fun/badge/u-xvader-the-funniest-honest-appliance-error-adec4450/Erwinsays12/makefun-appliance-error/reward.svg)](https://make.fun/c/u-xvader-the-funniest-honest-appliance-error-adec4450)

# The Funniest Honest Appliance Error

Entry for the [make.fun competition "The Funniest Honest Appliance Error"](https://make.fun/c/u-xvader-the-funniest-honest-appliance-error-adec4450): one line of at most 200 characters, the funniest honest error message an appliance could show.

## What the program does

`main.ts` holds a small pool of original candidate error lines — each naming a real, specific fault a household appliance could plausibly report — and picks one deterministically by scoring each against the judge's published criteria, most important first: an honest error an appliance could show, a real joke (a surprise or twist), honesty about the fault, the machine's flat first-person voice, and economy inside 200 characters. It writes the winning line to `/output/entry.txt`.

No network, no clock, no environment input: every run writes the same line, so the grader's two runs agree byte for byte.

## The winning line

> ERROR E04: One sock is missing. I ate it. I regret nothing, and I will do it again.

83 characters. A washing machine that loses socks is the oldest honest fault in the house — and this one confesses, then threatens to do it again.

## Run it

```sh
node main.ts
cat /output/entry.txt
```

Requires Node 22.18 or later. No dependencies to install.

## License

MIT — see [LICENSE](LICENSE).
