import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaymentPageComponent} from './pages/payment-page/payment-page.component';
import {HomeComponent} from './pages/home/home.component';


const routes: Routes = [
  { path: 'payment', component: PaymentPageComponent },
  { path: 'home', component: HomeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
