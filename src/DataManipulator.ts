import { ServerRespond } from './DataStreamer';

export interface Row { // determines the structure of the object returned by the generateRow function
//   stock: string,
//   top_ask_price: number,
//   timestamp: Date,
    price_abc: number,
    price_def: number,
    ratio: number,
    timestamp: Date,
    upper_bound: number,
    lower_bound: number,
    trigger_alert: number | undefined,
} // must correspond to the schema of the table in the Graph component


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05; // +10% of the 12 month historical average ratio
    const lowerBound = 1 - 0.05; // -10% of the 12 month historical average ratio
    return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
            serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio: undefined,
    }; // return
  } // generateRow
} // class DataManipulator
