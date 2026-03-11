import { Routes } from '@angular/router';
import { WizardComponent } from './features/expert/wizard/wizard.component';
import { DomainSelectComponent } from './features/expert/domain-select/domain-select.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'expert', component: DomainSelectComponent },
  { path: 'expert/:domain', component: WizardComponent },
  { path: '**', redirectTo: '' },
];
