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

  getCCFabricacion(ccfabricacion:any){
    return this.http.post('http://192.168.0.156:8000/api/ccfabricacion', ccfabricacion)
  }

  getCCArranque(ccarranque:any){
    return this.http.post('http://192.168.0.156:8000/api/ccarranque', ccarranque)
  }

  getCCRotura(ccrotura:any){
    return this.http.post('http://192.168.0.156:8000/api/ccrotura', ccrotura)
  }

  getBobinas(){
    return this.http.get('http://192.168.0.156:8000/api/bobinas')
  }

  getOperario(){
    return this.http.get('http://192.168.0.156:8000/api/operarioext')
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

  getOperarios2(operario2:any){
    return this.http.get('http://192.168.0.156:8000/api/operario2', operario2)
  }

  getFasesSage(fasessage:any){
    return this.http.post('http://192.168.0.156:8000/api/fasessage', fasessage)
  }

  updateOperarioExtra(opextra:any){
    return this.http.post('http://192.168.0.156:8000/api/operarioextra', opextra)
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

  updateFasesMovPos(movpos:any){
    return this.http.post('http://192.168.0.156:8000/api/fasesmovpos', movpos)
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

  setMaterialOF(materialof:any){
    return this.http.post('http://192.168.0.156:8000/api/materialof', materialof)
 
  }

  setBobinas(bobinas:any){
    return this.http.post('http://192.168.0.156:8000/api/setbobinas', bobinas)
  }

  getBobinasDescrip(bobina1:any){
    return this.http.post('http://192.168.0.156:8000/api/bobinasdescrip', bobina1)
  }


  updateBobina(bobina:any){
    return this.http.post('http://192.168.0.156:8000/api/bobina', bobina)
  }

  updateBobinaTM(tiempo:any){
    return this.http.post('http://192.168.0.156:8000/api/bobinatm', tiempo)
  }

  setOrdenRebobinado(rebobinado:any){
    return this.http.post('http://192.168.0.156:8000/api/rebobinado', rebobinado)
  }

  getArticulosOF(articulos:any){
    return this.http.post('http://192.168.0.156:8000/api/articulosof', articulos)
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

