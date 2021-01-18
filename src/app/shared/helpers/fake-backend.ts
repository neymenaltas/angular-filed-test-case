import {HTTP_INTERCEPTORS, HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {delay} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {CreditTransferDto} from '../models/creditTransferDto';

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.handleRequests(req, next);
  }

  handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
    const trueCreditTransfer: CreditTransferDto = {
      cardHolder: 'Nurullah Altas',
      creditCardNumber: '1111 1111 1111 1111',
      expirationDate: new Date('2021-11'),
      securityCode: '111',
    };
    const { url, method } = req;
    if (url.endsWith('/transfer') && method === 'POST') {
      const { body } = req.clone();
      if (
        body.cardHolder === trueCreditTransfer.cardHolder &&
        body.creditCardNumber === trueCreditTransfer.creditCardNumber &&
        body.expirationDate.getTime() === trueCreditTransfer.expirationDate.getTime() &&
        body.securityCode === trueCreditTransfer.securityCode) {
        return of(new HttpResponse({ status: 200, body: 'Payment is successful' })).pipe(delay(500));
      } else {
        return throwError({ error: { message: 'Credit card information is wrong' } });
      }

    }
    return next.handle(req);
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendHttpInterceptor,
  multi: true,
};
