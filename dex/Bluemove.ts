import { Dex, Pool, populateLiquidity, populateMetadata } from './index';

const Bluemove: Dex = {
    Name: 'Bluemove',
    MoveEventType: '0xb24b6789e088b876afabca733bed2299fbc9e2d6369be4d1acfa17d8145454d9::swap::Created_Pool_Event',
    GetPools: async function() {
        const eventsResult: any = await this.Client.queryEvents({
            query: { MoveEventType: this.MoveEventType },
            order: "descending",
            limit: this.Limit,
        });
    
        let pools: Pool[] = []
        for(const e of eventsResult.data) {
            if(!this.PoolIds.has(e.parsedJson.pool_id)) {
                const pool = await parseEventToPool(e.parsedJson)
                this.PoolIds.add(e.parsedJson.pool_id)
                pools.push(pool)
            }
        };
        await populateLiquidity(this.Client, pools)
        await populateMetadata(this.Client, pools)
        return pools
    },
    PoolIds: new Set<string>(),
    Client: undefined as any,
    Limit: 25,
};

async function parseEventToPool(event: any) {
    const pool: Pool = {
        poolId: event.pool_id,
        coin_a: `0x${event.token_y_name}`,
        coin_b: `0x${event.token_x_name}`,
        dex: 'Bluemove',
        poolCreated: Date.now()
    }
	return pool
}

export default Bluemove;
