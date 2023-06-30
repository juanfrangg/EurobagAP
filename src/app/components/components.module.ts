import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrdenComponent } from './orden/orden.component';
import { FormsModule } from '@angular/forms';
import { MostrarComponent } from './mostrar/mostrar.component';
import { TimermodalComponent } from './timermodal/timermodal.component';


@NgModule({
  declarations: [OrdenComponent, MostrarComponent, TimermodalComponent],
  exports:[
    OrdenComponent,
    MostrarComponent,
    TimermodalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class ComponentsModule { }