export interface RuneBalance {
  runeName: string;
  amount: number;
  spendableBalance: number;
  symbol?: string;
  divisibility?: number;
  inscriptionId?: string;
id?:string;
mintable?: boolean;
}

export interface RawRuneBalance {
  runeName: string;
  amount: string;
  spendableBalance: string;
  symbol?: string;
  divisibility?: number;
  inscriptionId?: string | null;
  id:string;
mintable?: boolean;
}