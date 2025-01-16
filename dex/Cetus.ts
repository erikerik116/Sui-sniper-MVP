import { Dex, Pool } from './index';

const Cetus: Dex = {
    MoveEventType: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::factory::CreatePoolEvent',
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
        return pools
    },
    PoolIds: new Set<string>(),
    Client: undefined as any,
    Limit: 25,
};


async function parseEventToPool(event: any) {
    console.log(event)
    const pool: Pool = {
        poolId: event.pool_id,
        coin_a: `0x${event.coin_type_a}`,
        coin_b: `0x${event.coin_type_b}`,
        dex: 'Cetus',
        poolCreated: Date.now()
    }
	return pool
}

export default Cetus;
