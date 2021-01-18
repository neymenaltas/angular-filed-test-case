export interface CreditTransferDto {
  creditCardNumber: string;
  cardHolder: string;
  expirationDate: Date;
  securityCode?: string;
  amount?: number;
}
