import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonMenu, IonButtons,IonMenuButton, IonButton, IonItem, IonLabel, IonList,IonInput,IonFab, IonFabButton, IonIcon} from '@ionic/angular/standalone';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';



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
        IonFabButton, IonIcon
  ]
})
export class EscaneoPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }
// async scanQr() {
//   console.log('Botón presionado');

//   // Verificar permisos
//   const permissionStatus = await BarcodeScanner.checkPermissions();
//   if (!permissionStatus.camera) {
//     const requestStatus = await BarcodeScanner.requestPermissions();
//     if (!requestStatus.camera) {
//       alert('Permiso de cámara denegado.');
//       return;
//     }
//   }

//   // Escanear QR
//   const result = await BarcodeScanner.scan();

//   if (result?.barcodes?.length > 0) {
//     const qr = result.barcodes[0].rawValue;
//     console.log('QR escaneado:', qr);

//     const fecha = new Date().toISOString();
//     localStorage.setItem('registroQR', JSON.stringify({ valor: qr, fecha }));

//     alert(`Código QR: ${qr}\nFecha: ${fecha}`);
//   } else {
//     alert('No se detectó ningún código QR.');
//   }
// }
async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
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
