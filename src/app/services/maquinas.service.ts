import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaquinasService {

  private _refresh$ = new Subject<void>() 
  

  constructor(private http: HttpClient) { }

  get refresh$(){
    return this._refresh$
  }


  getMaquinas(){
    return this.http.get(`http://192.168.0.156:8000/api/maquinas`)
  }

  getMaquinas2(CodigoMaquina: string){
    return this.http.get(`http://192.168.0.156:8000/api/maquinas2?CodigoMaquina=${CodigoMaquina}`)
  }

  getFases(){
    return this.http.get('http://192.168.0.156:8000/api/fases')
  }

  getFases2(ID: string){
    return this.http.get(`http://192.168.0.156:8000/api/fases2?ID=${ID}`)
  }
  
  getFasesOF(CodigoMaquina: string){
    return this.http.get(`http://192.168.0.156:8000/api/fasesof?CodigoMaquina=${CodigoMaquina}`)
  }

  getOperarios(EjercicioOF:any,SerieOF:any,NumeroOF:any,Operario:any){
    return this.http.get(`http://192.168.0.156:8000/api/operario?EjercicioOF=${EjercicioOF}&SerieOF=${SerieOF}&NumeroOF=${NumeroOF}&Operario=${Operario}`)
  }

  setOperarios(operariosOF:any){
    return this.http.post('http://192.168.0.156:8000/api/operarios', operariosOF)
  }

  updateOperarios(timerOF:any){
    return this.http.post('http://192.168.0.156:8000/api/operarios2', timerOF)
  }

  setPausa(pausaOF:any){
    return this.http.post('http://192.168.0.156:8000/api/pausa', pausaOF)
  }

  updateFasesOF(activoOF:any){
    return this.http.post('http://192.168.0.156:8000/api/fasesupdate', activoOF)
  }

  setControlCalidadFabricacion(calidadFabricacion:any){
    return this.http.post('http://192.168.0.156:8000/api/calidadfabricacion', calidadFabricacion)
  }

  setControlArranqueProd(arranqueProd:any){
    return this.http.post('http://192.168.0.156:8000/api/arranqueprod', arranqueProd)
  }

  setControlRotura(rotura:any){
    return this.http.post('http://192.168.0.156:8000/api/rotura', rotura)
  }

  setBolsasOF(bolsas:any){
    return this.http.post('http://192.168.0.156:8000/api/bolsas', bolsas)
  }

  getMaterialOF(material:any){
    return this.http.post('http://192.168.0.156:8000/api/materiales', material)
 
  }

  updateMaterialOF(montaje:any){
    return this.http.post('http://192.168.0.156:8000/api/material', montaje)
    .pipe(
      tap(()=>{
        this._refresh$.next()
      })
    );
  }

  setOrdenRebobinado(rebobinado:any){
    return this.http.post('http://192.168.0.156:8000/api/rebobinado', rebobinado)
  }

  setOrdenLaminacion(laminas:any){
    return this.http.post('http://192.168.0.156:8000/api/laminacion', laminas)
  }

  setDetallePanton(panton:any){
    return this.http.post('http://192.168.0.156:8000/api/panton', panton)
  }

  setTintaImpresion(tinta:any){
    return this.http.post('http://192.168.0.156:8000/api/tinta', tinta)
  }

  setOrdenImpresion(impresion:any){
    return this.http.post('http://192.168.0.156:8000/api/impresion', impresion)
  }
}
