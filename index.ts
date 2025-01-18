import { getFullnodeUrl, MoveStruct, SuiClient, SuiObjectResponse, SuiParsedData, TransactionEffects, BalanceChange, ObjectOwner } from '@mysten/sui/client';
import { loadDexes } from './dex';
import { TradeConfig, FilterPlugins, loadFilters } from './filters';
import { sleep } from './utils'

const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

const main = async () => {
    const dexes = await loadDexes(client);
    const config: TradeConfig = {
        DatabasePath: '',
        MaxTradeAmount: '',
        TradeBalancePercent: 0,
        TargetGain: 0,
        MaxTradeDuration: 0,
        SlippagePercent: 0,
        MaxOpenAttempts: 0,
        MaxCloseAttempts: 0,
        SecretKey: '',
        TradeFilterRules: {
            "Liquidity Filter": {
                Params: {
                    minLiquidity: 100,
                },
                Plugin: "Liquidity Filter",
                RuleName: "Liquidity Rules",
            }
        }
    }

    const filter = await FilterPlugins(client, config);

    for (const _dex of Object.keys(dexes)) {
        const dex = dexes[_dex]
        dex.Limit = 10
        const pools = await dex.GetPools();
        console.log(`Pools for ${dex.Name}:`, pools.length);
        const trades = await filter.filterPools(pools)
        console.log("TRADES:", trades)
        //await sleep(5000)
    }
};

main().catch(console.error);