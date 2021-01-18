import { Injectable } from '@angular/core';
import { CreditTransferDto } from '../models/creditTransferDto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  public sendTransfer(transfer: CreditTransferDto): Observable<CreditTransferDto> {
    return this.http.post<CreditTransferDto>('localhost:4200/transfer', transfer);
  }
}
