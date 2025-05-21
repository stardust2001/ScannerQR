import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonBackButton,IonList, IonItem, IonLabel, IonMenuButton  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons,IonBackButton,IonToolbar,IonButtons,IonBackButton,IonList, IonItem, IonLabel, IonMenuButton, IonContent]
})
export class AsistenciaPage implements OnInit {
datosGuardados: { id: number; nombre: string }[] = [];
  constructor() { }

  ngOnInit() {
  }



}
