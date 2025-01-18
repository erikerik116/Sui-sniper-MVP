import { SuiClient } from '@mysten/sui/client'
import { TradeFilterPlugin } from './index'
import { Trade, TradeStatus } from '../trade'

const DenyList: TradeFilterPlugin = {
    Name: "DenyList Filter",
    Client: undefined as any,
    CheckTrades: async function name(tradeList:Trade[]) {
        const config: Object = this.TradeFilterRule?.Params || {}
        if(config['disabled']) {
            console.log(`${this.Name} is disabled`)
            return true;
        }
        console.log(`Checking for deny list`)
        for(const trade of tradeList.filter(t => t.status === TradeStatus.New)) {
            const _denyList = await _hasDenyList(this.Client, trade.coin_a)
            if(_denyList) {
                trade.status = TradeStatus.Invalid
                trade.note = "Coin has deny list"
            }
        }
        return true
    }
}

async function _hasDenyList(client: SuiClient, coin: string) {
	const coinObject = coin.split('::')[0]
	const ob: any = await client.getObject({ id: coinObject, options: { showContent: true, showDisplay: true, showBcs: true, showPreviousTransaction: true, showType: true }})
	for(const key of Object.keys(ob.data.content.disassembled)) {
		const bytecode = ob.data.content.disassembled[key]
		if(bytecode.includes('DenyCap')) {
			return true
		}
	}
	return false
}

export default DenyList;