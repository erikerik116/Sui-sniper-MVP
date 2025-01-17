import { Pool } from "../dex";

export enum TradeStatus {
    New = "NEW",
    Open = "OPEN",
    Closed = "CLOSED",
    Rugpull = "RUGPULL",
    Invalid = "INVALID",
    Failed = "FAILED",
}

export interface Trade extends Pool {
    status: TradeStatus;
    liquidity: number;
    created: number;
    opened: number;
    cost: number;
    closedValue: number;
    baseCoin: string;
    openAttempts: number;
    closeAttempts: number;
    price: number;
    balance: number;
    manualClose: boolean;
    creator?: string;
    note?: string;
}
