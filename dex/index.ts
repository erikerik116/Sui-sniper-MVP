import * as fs from 'fs';
import * as path from 'path';

import { CoinMetadata, SuiClient } from '@mysten/sui/client';

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
    CoinMetadata?: CoinMetadata | null;
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
