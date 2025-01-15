# sui-token-sniper

A TypeScript token sniping tool and UI for the SUI blockchain.

Monitors liquidity events on chain, not from delayed DEX API backends.

# Extendable DEX Plugins

Currently including built-in support for:

- Bluemove
- Turbos
- Cetus

# Trade UI

Monitor, track and manually close trades using the simple UI.

# Token Validation Plugins

Select from and build your own token filtering plugins to trade only the tokens that meet various criteria configured for each plugin.

Included valiation plugins:

- Liquidity Levels
- Metadata filter
- Creator Address + funded address chain ignore list
- Etc.

# DEX Plugin

Trades are made using aggregation via 7k.ag

Will add support for others via future DEX Plugins.
