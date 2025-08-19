export interface ApiInterface {
  status: number;
  message: string;
  data?: any;
}


export type ExchangeType = "direct" | "topic" | "fanout" | "headers";

export interface publishConfigInterface {
  type: ExchangeType;
  key?: string;
  queue?: string;
  exchange?: string;
}
