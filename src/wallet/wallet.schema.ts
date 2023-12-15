import { Schema, Document } from 'mongoose';

export interface Wallet extends Document {
  readonly address: string;
  readonly display_name: string;
  readonly favorite: boolean;
  readonly balance: string;
  readonly creation_date: string;
  readonly last_updated: string;
}

export const WalletSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  display_name: String,
  favorite: Boolean,
  balance: String,
  creation_date: String,
  last_updated: String,
});
