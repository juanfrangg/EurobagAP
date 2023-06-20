import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(private http: HttpClient) { }

  public getOrdenes(session: any){
    return this.http.get<any[]>(`http://192.168.0.156:8000/api/ordenes`,{params: session})
  }

  public getPedidos(ejercicio: String, serie: String, numero: String){
    return this.http.get<any[]>(`http://192.168.0.156:8000/api/pedidosorden/${ejercicio}/${serie}/${numero}`)
  }

  public getArticulos(ejercicio: String, serie: String, numero: String){
    return this.http.get<any[]>(`http://192.168.0.156:8000/api/articulosorden/${ejercicio}/${serie}/${numero}`)
  }

  public getFases(){
    return this.http.get<any[]>(`http://192.168.0.156:8000/api/fases`)
  }

  public getFasesOF(){
    return this.http.get<any[]>(`http://192.168.0.156:8000/api/fasesof`)
  }

  public getEtapas(){
    return this.http.get<any[]>(`http://192.168.0.156:8000/api/etapas`)
  }
}
