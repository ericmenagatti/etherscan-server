import { Schema, Document } from 'mongoose';

export interface Status extends Document {
  readonly eth_usd: string;
  readonly eth_eur: string;
  readonly eur_usd: string;
  readonly last_updated: string;
}

export const StatusSchema = new Schema({
  eth_usd: String,
  eth_eur: String,
  eur_usd: String,
  last_updated: String,
});
