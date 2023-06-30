import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { OrdenComponent } from '../components/orden/orden.component';
import { OrdenesService } from '../services/ordenes.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  ordenes: any[] = [];
  lista: any[] = []
  ordenesMostrar: any = [];
  fasesordenes: any;
  micrajeActivo: any
  etapas: any
  totalOrdenes: any[] =[]

  constructor(private route: Router,
    private session: SessionService, 
    private ordenService: OrdenesService,
    private ordenComponent: OrdenComponent,
    private modalController: ModalController) { }

  async ngOnInit() {
    await this.session.getSession().then( async resp => {
      this.getOrdenes(resp)
    })
    this.session.getEtapas().then( async resp => {
      this.etapas = resp
    })
    
  }

  async getOrdenes(resp : any){
    this.ordenes = []
    this.lista = []
    this.ordenService.getOrdenes(resp).subscribe(async ordenes => {
      ordenes.forEach( orden => {
        //let date = new Date(orden.FechaOF)
        //orden.FechaOF = date.toLocaleString().slice(0,9)//.toISOString().slice(0,10)//date.getDay().toString() + '/' + date.getMonth() + '/' + date.getFullYear()
        this.ordenes.push(orden)
        orden.articulos = []
        this.ordenService.getArticulos(orden.EjercicioOF, orden.SerieOF, orden.NumeroOF).subscribe( resp => {
          console.log('respuesta', resp)
          orden.articulos = resp
          orden.articulos.forEach( (art: any) => {
            art.Unidades = Math.round(Number(art.Unidades) * 100) / 100
            this.ordenService.getPedidos(orden.EjercicioOF, orden.SerieOF, orden.NumeroOF).subscribe( resp => {
              orden.pedidos = resp
              this.session.setOrdenes(this.ordenes)
           //   this.totalOrdenes.push(orden)

              this.ordenarOrden(orden).then( () => {
                console.log('ordenes mostrar', this.ordenesMostrar)
                if(!this.micrajeActivo){
                  this.micrajeActivo = this.lista[0].micraje
                }
                //this.ordenesMostrar = []
                this.cambiarLista(this.micrajeActivo)
              })
            })
          })
        })
      })   
    })
    this.ordenService.getFasesOF().subscribe( resp => {
      this.fasesordenes = resp
      console.log('fases ordenes', this.fasesordenes)
    })
  }

  async ordenarOrden(orden: any){
      console.log('orden', orden)
      if(this.lista.length == 0){
        orden.articulos.forEach( (linea:any) => {
          let tipo = linea.CodigoArticulo.substring(0,1)
          let proveedor = linea.CodigoArticulo.substring(1,3)
          let micraje = linea.CodigoArticulo.substring(3,6)
          let impresion = linea.CodigoArticulo.substring(6,8)
          if(impresion != '00'){
            micraje = micraje +' IMPRESO'
          }else{
            micraje = micraje +' ANONIMO'
          }
          let medidas = linea.CodigoArticulo.substring(8,12)
          let ancho = medidas.substring(0,2)+'0'
          let largo = medidas.substring(2,4)+'0'
          linea.cliente = orden.pedidos[0].RazonSocial
          linea.fecha = orden.pedidos[0].FechaPedido.substring(0,10)
          linea.medida = ancho+'X'+largo
          let existe = false
          this.fasesordenes.forEach((orden: any) => {
            if(orden.NumeroOF == linea.NumeroOF && orden.EjercicioOF == linea.EjercicioOF && orden.SerieOF == linea.SerieOF){
              existe = true
              linea.fase = orden.Fases
            }
          })
          if(!existe){
            linea.fase = 'No se encuentra en producción'
          }
          let objeto = {tipo: tipo, proveedor: proveedor, impresion: impresion, medidas: medidas, micraje: micraje,ordenes: [linea]}
          this.lista.push(objeto)
        })
      }else{
        let encontrado = false
        this.lista.forEach(codigo => {
          let micraje
          let tipo
          let proveedor
          let impresion
          let medidas
          let ancho
          let largo
          let lineaInsert
          orden.articulos.forEach((linea:any) => {
            if(!encontrado){
              lineaInsert = linea
              micraje = linea.CodigoArticulo.substring(3,6)
              tipo = linea.CodigoArticulo.substring(0,1)
              proveedor = linea.CodigoArticulo.substring(1,3)
              impresion = linea.CodigoArticulo.substring(6,8)
              if(impresion != '00'){
                micraje = micraje +' IMPRESO'
              }else{
                micraje = micraje +' ANONIMO'
              }
              medidas = linea.CodigoArticulo.substring(8,12)
              ancho = medidas.substring(0,2)+'0'
              largo = medidas.substring(2,4)+'0'
              linea.cliente = orden.pedidos[0].RazonSocial
              linea.fecha = orden.pedidos[0].FechaPedido.substring(0,10)
              linea.medida = ancho+'X'+largo
            
              if(micraje == codigo.micraje){
                encontrado = true
                codigo.ordenes.push(linea)
              }
            
              if(!encontrado){
                let existe = false
                this.fasesordenes.forEach((orden: any) => {
                  if(orden.NumeroOF == linea.NumeroOF && orden.EjercicioOF == linea.EjercicioOF && orden.SerieOF == linea.SerieOF){
                    existe = true
                    linea.fase = orden.Fases
                  }
                })
                if(!existe){
                  linea.fase = 'No se encuentra en producción'
                }
              }
            }
          })
          if(!encontrado){
            let objeto = {tipo: tipo, proveedor: proveedor, impresion: impresion, medidas: medidas, micraje: micraje,ordenes: [lineaInsert]}
            this.lista.push(objeto)
          }
        })
      }
  }

  async abrirOrden(orden: any){
    const modal = await this.modalController.create({
      component: OrdenComponent,
      cssClass: 'small-modal',
      componentProps:{
        orden: orden
      }
    })

    modal.present()

    modal.onDidDismiss().then( async () => {
      await this.session.getSession().then( async resp => {
        this.getOrdenes(resp)
      })
    })
  }

  async cerrarSesion(){
    await this.session.destruirSession().then( () => {
      this.route.navigateByUrl('/')
    })
  }

  async cambiarLista(micraje: String){
    this.micrajeActivo = micraje
    console.log('lista', this.lista)
    this.lista.forEach( item => {
      if(item.micraje == micraje){
        this.ordenesMostrar = item.ordenes
       
      }
    })
  }

  getListaUnica() {
    const micrajesUnicos = [...new Set(this.lista.map(item => item.micraje))];
    return micrajesUnicos;
  }

  // ordenarMicrajes() {
  //   this.lista.sort((a, b) => {
  //     const micrajeA = a.micraje.slice(0, 3);
  //     const micrajeB = b.micraje.slice(0, 3);
  //     return micrajeA.localeCompare(micrajeB);
  //   });
  // }
    

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
}
