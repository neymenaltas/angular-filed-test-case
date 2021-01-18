import {Component, OnDestroy, OnInit} from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { CreditTransferDto } from '../../shared/models/creditTransferDto';
import { PaymentService } from '../../shared/services/payment.service';
import {take} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit, OnDestroy {

  public creditCardNumberValidator: FormControl = new FormControl('', [Validators.required]);
  public cardHolderValidator: FormControl = new FormControl('', [Validators.required]);
  public amountValidator: FormControl = new FormControl('', [Validators.required, Validators.min(0.000001)]);
  public expirationDateValidator: FormControl = new FormControl('', [Validators.required, ValidateExpirationDate]);
  public securityCodeValidator: FormControl = new FormControl('');

  public transferSubscription: Subscription;

  constructor(public paymentService: PaymentService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.transferSubscription.unsubscribe();
  }

  public getCardNumberErrorMessage(): string {
    if (this.creditCardNumberValidator.hasError('required')) {
      return 'You must enter a value';
    }
  }

  public getCardHolderErrorMessage(): string {
    if (this.cardHolderValidator.hasError('required')) {
      return 'You must enter a value';
    }
  }

  public getAmountErrorMessage(): string {
    if (this.amountValidator.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.amountValidator.hasError('min')) {
      return 'You must a value greater than 0';
    }
  }

  public getExpirationDateErrorMessage(): string {
    if (this.expirationDateValidator.hasError('required')) {
      return 'You must select a date';
    }
    if (this.expirationDateValidator.hasError('invalidExpirationDate')) {
      return 'You must select a date which is not passed';
    }

  }

  public submit() {
    console.log(this.amountValidator);
    if (
      this.creditCardNumberValidator.invalid ||
      this.cardHolderValidator.invalid ||
      this.amountValidator.invalid ||
      this.expirationDateValidator.invalid
      ) {
      this.creditCardNumberValidator.markAsTouched();
      this.cardHolderValidator.markAsTouched();
      this.amountValidator.markAsTouched();
      this.expirationDateValidator.markAsTouched();
    }
    else {
      const creditTransfer: CreditTransferDto = {
        amount: this.amountValidator.value,
        cardHolder: this.cardHolderValidator.value,
        creditCardNumber: this.creditCardNumberValidator.value,
        expirationDate: new Date(this.expirationDateValidator.value),
        securityCode: this.securityCodeValidator.value ? this.securityCodeValidator.value : null,
      };
      this.transferSubscription = this.paymentService.sendTransfer(creditTransfer).pipe(
        take(1)
      ).subscribe((res: CreditTransferDto) => {
          this.toastr.info(`${res.cardHolder}, your payment has been successfully received` );
      }, err => {
        this.toastr.error(err.error.message);
      });
    }
  }
}

function ValidateExpirationDate(control: AbstractControl): {[key: string]: any} | null  {
  if (control.value && new Date(control.value) < new Date()) {
    return { invalidExpirationDate: true };
  }
  return null;
}
