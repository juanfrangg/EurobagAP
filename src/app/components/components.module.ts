import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrdenComponent } from './orden/orden.component';
import { FormsModule } from '@angular/forms';
import { MostrarComponent } from './mostrar/mostrar.component';


@NgModule({
  declarations: [OrdenComponent, MostrarComponent],
  exports:[
    OrdenComponent,
    MostrarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class ComponentsModule { }