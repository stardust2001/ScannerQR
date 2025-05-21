import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonMenu, IonButtons,IonMenuButton, IonButton, IonItem, IonLabel, IonList,IonInput,IonFab, IonFabButton, IonIcon} from '@ionic/angular/standalone';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { RouterModule } from '@angular/router'; 
import { IonMenuToggle } from '@ionic/angular/standalone';





@Component({
  selector: 'app-escaneo',
  templateUrl: './escaneo.page.html',
  styleUrls: ['./escaneo.page.scss'],
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonHeader,
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonInput,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterModule,
    IonMenuToggle,
     
   
    
  ]
})
export class EscaneoPage implements OnInit {
   isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private alertController: AlertController) {

   }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    // this.barcodes.push(...barcodes);
    this.barcodes = barcodes;
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

}
