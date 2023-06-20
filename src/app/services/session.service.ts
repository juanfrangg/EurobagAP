import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { OrdenesService } from './ordenes.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _storage: Storage | null = null

  constructor(private session: Storage, private ordenesService: OrdenesService) {
    this.initDB()
  }

  async initDB(){
    const storage = await this.session.create()
    this._storage = storage
  }

  async guardarSesion(sesion: any){
    sesion.created = new Date()
    this.session.set('sesion', sesion)
  }

  async getSession(){
    return this.session.get('sesion')
  }

  async getEtapas(){
    this.ordenesService.getEtapas().subscribe((resp: any) => {
      this.session.set('etapas', resp)
    })

    return this.session.get('etapas')
  }

  async getOrdenes(){
    return this.session.get('ordenes')
  }

  async setOrdenes(ordenes: any){
    this.session.set('ordenes', ordenes)
  }

  async destruirSession(){
    this.session.clear()
  }

  async getMaquina(){
    return this.session.get('maquina')
  }

  async setMaquina(maquina: any){
    this.session.set('maquina',maquina)
  }
}

