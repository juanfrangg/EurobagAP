import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OrdenComponent } from '../components/orden/orden.component';
import { MaquinasService } from '../services/maquinas.service';
import { OrdenesService } from '../services/ordenes.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  ordenes: any[] = [];
  lista: any[] = []
  ordenesMostrar: any = [];
  fasesordenes: any;
  micrajeActivo: any
  etapas: any
  maquinaActual: any
  ordenesFase: any = []

selectMaq: any =[]
  maquina: any
  fase: any
  descripcion: any
  interr: boolean = false

  articulos: any=[];
  material: any=[];

 

  constructor(private route: Router,
    private session: SessionService,
    private modalController: ModalController,
    private ordenService: OrdenesService,
    private data: MaquinasService) { }

  async ngOnInit() {

    await this.session.getSession().then( async resp => {
       this.getOrdenes(resp)
    })    

    this.session.getEtapas().then( async resp => {
      this.etapas = resp
    })

    this.data.getMaquinas().subscribe(resp=>{
      this.maquina=resp
    })

   // this.ordenarFases()

  }

  refresh(){
    window.location.reload();
  }

  async onMaquinaSelec(event: any) {

    this.ordenesFase = []
  
    const maquinaSeleccionada = event.detail.value;

    this.data.getMaquinas2(maquinaSeleccionada).subscribe(resp => {
        this.fase = resp;
      this.data.getFases2(this.fase[0].Etapa).subscribe(resp => {
        this.fase=resp;
        this.descripcion=this.fase[0].Descripcion
      })  
      });

      this.session.setMaquina(maquinaSeleccionada)

      this.ordenes.forEach( orden => {
        orden.Etapas.forEach((ordenetapa:any) => {
          if(ordenetapa.CodigoMaquina == maquinaSeleccionada && ordenetapa.Activo == 1){
            this.ordenesFase.push(orden)
          }
        })
      })
  
  }

  ordenarFases(){
    const primerosElementos: any[] = [];
   // console.log('holaaaa 1')
    this.ordenes.forEach((orden: any) => {
      const primerElemento = orden.Etapas.find((ordenetapa: any) => ordenetapa.Finalizado == 0);
   //   console.log('holaaaa 2')
      if (primerElemento) {
        primerosElementos.push(primerElemento);
    //    console.log('holaaaa 3')
      }
    });
  //  console.log('holaaaa 4')
    primerosElementos.forEach(orden=>{
      const movpos={
        MovPos: orden.MovPos,
        Activo: 1,
        Finalizado: 0
      }
    //  console.log('holaaaa 5')
      this.data.updateFasesMovPos(movpos).subscribe(resp=>{console.log('Activado los primeros de las ordenes')})
    })
  //  console.log('holaaaa 6')

  }
  


  async cerrarSesion(){
    await this.session.destruirSession().then( () => {
      this.route.navigateByUrl('/')
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
          // console.log('respuesta', resp)
          orden.articulos = resp
          orden.articulos.forEach( (art: any) => {
            art.Unidades = Math.round(Number(art.Unidades) * 100) / 100
            this.ordenService.getPedidos(orden.EjercicioOF, orden.SerieOF, orden.NumeroOF).subscribe( resp => {
              orden.pedidos = resp
              this.session.setOrdenes(this.ordenes)
              this.ordenarOrden(orden).then( () => {
                // console.log('ordenes mostrar', this.ordenesMostrar)
                if(!this.micrajeActivo){
                  this.micrajeActivo = this.lista[0].micraje
                  // console.log(this.ordenesMostrar)
                }
              })
            })
          })
        })
      })
      this.cargarMats()   
      this.ordenarFases()
    })
    this.ordenService.getFasesOF().subscribe( resp => {
      this.fasesordenes = resp
      // console.log('fases ordenes', this.fasesordenes)
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
          linea.Impreso = '1'
          micraje = micraje +' IMPRESO'
        }else{
          linea.Impreso = '0'
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
              linea.Impreso = '1'
              micraje = micraje +' IMPRESO'
            }else{
              linea.Impreso = '0'
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

cargarMats(){
  //  este codigo es para leer la tabla de Sage de _EB_ArticulosOF e insertarlo en Eurobag con los datos necesarios
this.ordenes.forEach(ord=>{
  const orden={
    EjercicioOF: ord.EjercicioOF,
    SerieOF: ord.SerieOF,
    NumeroOF: ord.NumeroOF,
  }
  this.data.getArticulosOF(orden).subscribe(resp => {
    this.articulos.push(resp);
    this.articulos.forEach((resp:any)=>{
      this.material=resp
      });
      this.material.forEach((item:any) => {     
        const descripcion={
          CodigoArticulo: item.CodigoArticulo
        }
          this.data.getBobinasDescrip(descripcion).subscribe((resp:any)=>{

          const materialof={
            ID: item.ID,
            EjercicioOF: item.EjercicioOF,
            SerieOF: item.SerieOF,
            NumeroOF:item.NumeroOF,
            Partida: item.Partida,
            Cantidad: item.UnidadesNecesarias,
            Material: item.DescripcionArticulo,
            Ancho: resp[0].Ancho_,
            Largo: resp[0].Largo_
          }
          this.data.setMaterialOF(materialof).subscribe(resp=>{console.log('Material guardado en Eurobag BD')})
          });
      });

});
});
}

}
