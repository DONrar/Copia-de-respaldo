import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
  standalone: true,
  imports:[CommonModule,IonicModule]
})
export class WhatsappButtonComponent   {

  whatsappLink = 'https://wa.me/573203316548';
}
