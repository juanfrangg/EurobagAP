import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { ComponentsModule } from '../components/components.module';
import { OrdenComponent } from '../components/orden/orden.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [AdminPage],
  providers:[OrdenComponent]
})
export class AdminPageModule {}
