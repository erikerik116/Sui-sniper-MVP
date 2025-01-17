import { getFullnodeUrl, MoveStruct, SuiClient, SuiObjectResponse, SuiParsedData, TransactionEffects, BalanceChange, ObjectOwner } from '@mysten/sui/client';
import { loadDexes } from './dex';
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

const main = async () => {
    const dexes = await loadDexes(client);

    for (const _dex of Object.keys(dexes)) {
        const dex = dexes[_dex]
        dex.Limit = 2
        const pools = await dex.GetPools();
        console.log(`Pools for ${dex.Name}:`, pools);
    }
};

main().catch(console.error);