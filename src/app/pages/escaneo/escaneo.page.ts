import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonMenu, IonButtons,IonMenuButton, IonButton, IonItem, IonLabel, IonList,IonInput,IonFab, IonFabButton, IonIcon} from '@ionic/angular/standalone';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';



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
  datosGuardados: { id: number; nombre: string }[] = [];


  constructor(
    private alertController: AlertController,
  
     private dbService: DatabaseService

  ) 
  { 

  }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

async scan(): Promise<void> {
    // const granted = await this.requestPermissions();
    // if (!granted) {
    //   this.presentAlert();
    //   return;
    // }
    // const { barcodes } = await BarcodeScanner.scan();
    // this.barcodes.push(...barcodes);
    const granted = await this.requestPermissions();
  if (!granted) {
    this.presentAlert();
    return;
  }

  const { barcodes } = await BarcodeScanner.scan();

  for (const barcode of barcodes) {
    try {
      const data = JSON.parse(barcode.rawValue || '');

      if (data.id && data.nombre) {
        await this.dbService.addDato(data.id, data.nombre);
      } else {
        console.warn('El código QR no tiene la estructura esperada');
      }
    } catch (err) {
      console.error('QR mal formado:', err);
    }
  }

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
 async ionViewWillEnter() {
  this.datosGuardados = await this.dbService.getDatos();
}
async addUser() {
  // Obtener todos los datos para saber el último ID
  const datos = await this.dbService.getDatos();

  // Sacar el id más alto o 0 si no hay datos
  let lastId = 0;
  if (datos.length > 0) {
    lastId = Math.max(...datos.map(d => d.id));
  }

  const newId = lastId + 1;
  const defaultName = `Usuario ${newId}`; // O cualquier nombre por defecto que quieras

  try {
    await this.dbService.addDato(newId, defaultName);
    // Actualizar lista local
    this.datosGuardados = await this.dbService.getDatos();

    // Mostrar alerta o toast si quieres confirmar al usuario
    const alert = await this.alertController.create({
      header: 'Usuario agregado',
      message: `Usuario con ID ${newId} agregado.`,
      buttons: ['OK']
    });
    await alert.present();
  } catch (error) {
    console.error('Error al agregar usuario:', error);
  }
}

}
