import * as fs from 'fs';
import * as path from 'path';

import { CoinMetadata, SuiClient } from '@mysten/sui/client';
import { convertMYSTtoSUI } from '../utils';

export interface Dex {
    Name: string;
    MoveEventType: string;
    GetPools: () => Promise<Pool[]>;
    PoolIds: Set<string>;
    Client: SuiClient;
    Limit: number;
}

export interface Pool {
    poolId: string;
    coin_a: string;
    coin_b: string;
    dex: string;
    poolCreated: number;
    metadata?: CoinMetadata | null;
    liquidity?: string;
}

export const loadDexes = async (client: SuiClient): Promise<Record<string, Dex>> => {
    const dexes: Record<string, Dex> = {};
    const files = fs.readdirSync(__dirname);

    for (const file of files) {
        if (file !== 'index.ts' && file.endsWith('.ts')) {
            const modulePath = path.join(__dirname, file);
            const dexModule = await import(modulePath);

            if (dexModule.default) {
                const dex: Dex = dexModule.default;
                dex.Client = client; // Assign the passed SuiClient instance
                dexes[dex.Name] = dex; // Use the MoveEventType as the key
            }
        }
    }
    return dexes;
};

export async function getLiquidity(client: SuiClient, poolId: any) {
	const ob: any = await client.getObject({ id: poolId, options: { showContent: true }})
	const content: any = ob.data.content
	const liq0 = content.fields.coin_b || content.fields.reserve_x
	const liquidity: string = convertMYSTtoSUI(liq0*2)
	return liquidity
}

type PoolListFunc = (client: SuiClient, pools: Pool[]) => Promise<boolean>

export const populateLiquidity: PoolListFunc = async (client: SuiClient, pools: Pool[]) => {
    for(const pool of pools) {
        const liquidity = await getLiquidity(client, pool.poolId)
        pool.liquidity = liquidity
    }
    return true
}

export const populateMetadata: PoolListFunc = async (client: SuiClient, pools: Pool[]) => {
    for(const pool of pools) {
        const metadata = await client.getCoinMetadata({ coinType: pool.coin_a })
        pool.metadata = metadata
    }
    return true
}