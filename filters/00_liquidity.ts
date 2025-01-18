import { SuiClient } from '@mysten/sui/client'
import { TradeFilterPlugin } from './index'
import { Trade, TradeStatus } from '../trade'

const Liquidity: TradeFilterPlugin = {
    Name: "Liquidity Filter",
    Client: undefined as any,
    TradeFilterRule: undefined as any,
    CheckTrades: async function name(tradeList:Trade[]) {
        const config: Object = this.TradeFilterRule?.Params || {}
        const minLiquidity: number = config['minLiquidity'] || 500
        console.log(`Checking for minimum liquidity of '${minLiquidity}'`)
        for(const trade of tradeList.filter(t => t.status === TradeStatus.New)) {
            if(!trade.liquidity || parseInt(trade.liquidity) < minLiquidity) {
                trade.status = TradeStatus.Invalid
                trade.note = "Liquidity too low"
            }
        }
        return true   
    }
}

export default Liquidity;