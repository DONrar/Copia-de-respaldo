import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TabsComponent } from './shared/tabs/tabs.component';
import { WhatsappButtonComponent } from './shared/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, TabsComponent, WhatsappButtonComponent],
})
export class AppComponent {
    constructor() {}
}
