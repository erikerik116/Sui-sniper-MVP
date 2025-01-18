import { Dex, Pool, populateLiquidity, populateMetadata } from './index';
import { SuiClient } from '@mysten/sui/client';


const Turbos: Dex = {
    Name: 'Turbos',
    MoveEventType: '0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1::pool_factory::PoolCreatedEvent',
    GetPools: async function() {
        const eventsResult: any = await this.Client.queryEvents({
            query: { MoveEventType: this.MoveEventType },
            order: "descending",
            limit: this.Limit,
        });
    
        let pools: Pool[] = []
        for(const e of eventsResult.data) {
            if(!this.PoolIds.has(e.parsedJson.pool)) {
                const pool = await parseEventToPool(this.Client, e.parsedJson)
                this.PoolIds.add(e.parsedJson.pool)
                pools.push(pool)
            }
        };
        await populateMetadata(this.Client, pools)
        await populateLiquidity(this.Client, pools)
        return pools
    },
    PoolIds: new Set<string>(),
    Client: undefined as any,
    Limit: 25,
};

async function parseEventToPool(client: SuiClient, event: any) {
    const ob: any = await client.getObject({ id: event.pool, options: { showType: true }})
    const coins = getTurbosPoolTokens(ob.data.type)
    const pool: Pool = {
        poolId: event.pool,
        coin_a: coins.coin_a,
        coin_b: coins.coin_b,
        dex: 'Turbos',
        poolCreated: Date.now()
    }
	return pool
}


function getTurbosPoolTokens(typeField: string) {
	// Match the main module and type
	const mainRegex = /^(.*?)::(.*?)::(.*?)(<.*>)?$/;
	const mainMatch = typeField.match(mainRegex);
  
	if (!mainMatch) {
	  throw new Error("Invalid SUI object event type format");
	}
  
	const [_, address, module, type, generics] = mainMatch;
  
	// Extract generic arguments
	let genericArgs: string[] = [];
	if (generics) {
	  const genericRegex = /<([^>]+)>/;
	  const genericMatch = generics.match(genericRegex);
	  if (genericMatch) {
		genericArgs = genericMatch[1].split(/\s*,\s*/);
	  }
	}
  
	if (genericArgs.length < 2) {
	  throw new Error("Insufficient generic arguments to identify coins");
	}
  
	return {
	  coin_b: genericArgs[1], // First generic argument
	  coin_a: genericArgs[0], // Second generic argument
	};
}


export default Turbos;
