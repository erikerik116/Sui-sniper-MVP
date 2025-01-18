import { Decimal } from 'decimal.js'; // Use decimal.js for precise calculations

const MYST_PER_SUI = new Decimal(10).pow(9); // 1 SUI = 10^9 MYST

export function convertMYSTtoSUI(mystAmount: Decimal.Value) {
	return new Decimal(mystAmount).dividedBy(MYST_PER_SUI).toFixed(9); // Convert and format to 9 decimals
}

export function formatUSDC(usdcAmount: Decimal.Value) {
	return new Decimal(usdcAmount).dividedBy(new Decimal(10).pow(6)).toFixed(2);
}
