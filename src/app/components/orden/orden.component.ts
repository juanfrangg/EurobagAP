import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { SessionService } from 'src/app/services/session.service';

import { MaquinasService } from 'src/app/services/maquinas.service';
import { AlertController } from '@ionic/angular';
import { MostrarComponent } from '../mostrar/mostrar.component';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { AnyARecord } from 'dns';


@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
})
export class OrdenComponent implements OnInit, OnDestroy {

  @Input () orden: any
  ejercicio: String = ''
  serie: String = ''
  numero: String = ''
  faseof: any
  produccion: any
  controlCalidadFabricacion: any = []
  ordenLaminacion: any = []
  ordenRebobinado: any = []
  estado: String = ''
  cantidad: number = 0
  totalLargo:number = 0


  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  interval: any;
  fecha: any
  inicioH: any
  finH: any
  totalT: any='00:00:00'
  motivoPausa: any
  crono: boolean=false
  cronoB: boolean=false
  horasB: number = 0;
  minutosB: number = 0;
  segundosB: number = 0;
  intervalB: any;
  pausaB:boolean=false
  stopB:boolean=false
  totalB: any='00:00:00'
  operador: any
  maquina: any
  ocultarBoton: boolean=false
  tabbar: boolean=false
  colVisible: boolean=false
  insertado:boolean=false
  horaPausa:any
  qty:number=1
  codigoStorage:string='8778'
  codmanteni:any
  horasP: number = 0;
  minutosP: number = 0;
  segundosP: number = 0;
  totalP: any='00:00:00';
  materiales:any=[];
  referenciaCaja:any;
  bolsasCaja:any;
  undFabricadas:any;
  resto:any;
  totalCajas:any;
  lote:any;
  nCajas:any;


  validar:boolean=false
  Comp1:boolean=false;numericValue1=0;
  Comp2:boolean=false;numericValue2=0;
  Comp3:boolean=false;numericValue3=0;
  Comp4:boolean=false;numericValue4=0;
  Comp5:boolean=false;numericValue5=0;
  Comp6:boolean=false;numericValue6=0;
  Comp7:boolean=false;numericValue7=0;
  Comp8:boolean=false;numericValue8=0;
  Comp9:boolean=false;numericValue9=0;
  Comp10:boolean=false;numericValue10=0;
  Comp11:boolean=false;numericValue11=0;
  Comp12:boolean=false;numericValue12=0;
  Comp13:boolean=false;numericValue13=0;
  Comp14:boolean=false;numericValue14=0;
  Comp15:boolean=false;numericValue15=0;
  Comp16:boolean=false;numericValue16=0;
  Comp17:boolean=false;numericValue17=0;
  Comp18:boolean=false;numericValue18=0;
  articulo:any;
  observaciones:any;
  finEvent:boolean=false

  dimensionesBolsas1:any;
  dimensionesBolsas2:any;
  dimensionesBolsas3:any;
  dimensionesBolsas4:any;
  dimensionesBolsas5:any;
  dimensionesBolsas6:any;
  anchoSoldaduras1:any;
  anchoSoldaduras2:any;
  anchoSoldaduras3:any;
  anchoSoldaduras4:any;
  anchoSoldaduras5:any;
  anchoSoldaduras6:any;
  sombrero:any;

  nuevasFilas: any[] = [];
  cajaUnidad:any;
  hora:any;
  posicion1:any;
  posicion2:any;
  posicion3:any;
  posicion4:any;
  posicion5:any;
  posicion6:any;
  estanqueidad:boolean=false; Estanq=0
  retractilado:boolean=false; Retrac=0
  roturas: any[]=[];

  finCalidad:boolean=false

  suscription:Subscription | any



  constructor(private ordenService: OrdenesService, private modalController: ModalController,
              private session: SessionService, private maquinaService: MaquinasService, private alertController: AlertController, private storage:Storage) { }

  //Order de fabricacion: Posicion 0 del array de documentos
  //Control de calidad fabricacion: Posición 1 del array de documentos
  //ORden de laminacion: Posicion 2 del array de documentos
  //Orden de rebobinado: Posicion 3 del array de documentos


  async ngOnInit() {
    await this.storage.create()
    this.operador=await this.session.getSession()
    this.maquina=await this.session.getMaquina()
 

    this.mostrarBobina()

    this.suscription = this.maquinaService.refresh$.subscribe(()=>{
      this.mostrarBobina()
    })

    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    this.fecha = `${this.agregarCerosIzquierda(anio)}-${this.agregarCerosIzquierda(mes)}-${this.agregarCerosIzquierda(dia)}`;



    if(this.operador.Rol!=1){

      this.tabbar=true
    }

    this.ejercicio = this.orden.EjercicioOF
    this.serie = this.orden.SerieOF
    this.numero = this.orden.NumeroOF
    this.session.getOrdenes().then( resp => {
      resp.forEach( (orden: any) => {
        if(orden.EjercicioOF == this.ejercicio && orden.SerieOF == this.serie && orden.NumeroOF == this.numero){
          this.orden = orden
        }
      })
          
      //en modo administrador lo devuelve undefined
      this.orden.Material.forEach((item:any) => {
        this.totalLargo += parseInt(item.Largo);      
      });
    
      // console.log('orden', this.orden)
      this.controlCalidadFabricacion = this.orden.ControlCalidadFabricacion
      this.ordenLaminacion = this.orden.OrdenLaminacion
      this.ordenRebobinado = this.orden.OrdenRebobinado
      // console.log('control calidad fabricacion', this.controlCalidadFabricacion)
      // console.log('orden laminacion', this.ordenLaminacion)
      // console.log('orden rebobinado', this.ordenRebobinado)
      this.ordenService.getArticulos(this.ejercicio, this.serie, this.numero).subscribe( resp => {
        this.orden.articulos = resp
        this.orden.articulos.forEach( (art: any) => {
          art.Unidades = Math.round(Number(art.Unidades) * 100) / 100
          this.cantidad += Math.round(Number(art.Unidades) * 100) / 100
        })
        this.ordenService.getPedidos(this.ejercicio, this.serie, this.numero).subscribe( resp => {
          this.orden.pedidos = resp
          this.ordenService.getFasesOF().subscribe( resp => {
            this.faseof = resp
            let existe = false
            this.faseof.forEach( (orden: any) => {
              if(this.ejercicio == orden.EjercicioOF && this.serie == orden.SerieOF && this.numero == orden.NumeroOF){
                this.produccion = orden.Fases
                existe = true
              }
            })
            if(!existe){
              this.produccion = 0
            }
          })
        })
      })
    })
    //this.orden.FechaOF = new Date(this.orden.FechaOF)
    this.estado = 'OF'


  }

  ngOnDestroy(){
    this.suscription.unsubscribe()
  }

  cerrar(){
    this.modalController.dismiss()
     window.location.reload();
  }

  cambiarEstado(estado: String){
    this.estado = estado
  }

  agregarCerosIzquierda(numero: number): string {
    return numero < 10 ? `0${numero}` : numero.toString();
  }

  finOFtoCalidad(estado: String){
    this.estado = estado
    this.crono=true
  }

  goControlCalidad(estado:String){
    this.estado=estado
   // this.finEvent=true

  }

  goOrdenFabricacion(estado:String){
    this.estado=estado

  }

  pausarBobina() {
    this.pausaB = true;
    this.cronoB=false
  }

  mostrarBobina(){
    const material:any={
      EjercicioOF: this.orden.EjercicioOF,
      SerieOF: this.orden.SerieOF,
      NumeroOF: this.orden.NumeroOF,
    }

    this.maquinaService.getMaterialOF(material).subscribe((data:any) => {
      this.materiales=data;
    });
  }

  iniciarDetenerBobina(index:number){

    if(!this.intervalB ){
      this.intervalB = setInterval(() => {
        if(!this.pausaB){
        this.segundosB++;
        if (this.segundosB === 60) {
          this.segundosB = 0;
          this.minutosB++;
          if (this.minutosB === 60) {
            this.minutosB = 0;
            this.horasB++;
          }
        }
      }
      }, 1000);
      
    }else{


    this.totalB =(this.agregarCerosIzquierda(this.horasB)+':'+this.agregarCerosIzquierda(this.minutosB)+':'+this.agregarCerosIzquierda(this.segundosB))

    this.materiales[index].TiempoMontaje=this.totalB

    this.maquinaService.updateMaterialOF(this.materiales[index]).subscribe(resp=>{console.log('TiempoMontaje insertado.')})

    clearInterval(this.intervalB);
    this.intervalB = null;
    this.horasB = 0;
    this.minutosB = 0;
    this.segundosB = 0;
    this.cronoB=false
    }
  }

  finalizarBobina() {
    this.stopB=true
   
  }
  
  // reiniciarBobina() {
  //   this.pausaB = false;
  //   this.horasB = 0;
  //   this.minutosB = 0;
  //   this.segundosB = 0;
  // }

  async mostrarCod(){
    const modal = await this.modalController.create({
      component: MostrarComponent,
      componentProps: {
        // Puedes pasar propiedades adicionales al componente modal si es necesario
      }
    });
  
    await modal.present();
  }

  iniciarCronometro() {

    this.pausaB = false;
    this.colVisible=true;

if(!this.insertado){
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    
    this.fecha = `${this.agregarCerosIzquierda(anio)}-${this.agregarCerosIzquierda(mes)}-${this.agregarCerosIzquierda(dia)}`;
    this.inicioH=`${this.agregarCerosIzquierda(horas)}:${this.agregarCerosIzquierda(minutos)}`;
    
    const maquinaService:any={
       EjercicioOF: this.orden.EjercicioOF,
       SerieOF: this.orden.SerieOF,
       NumeroOF: this.orden.NumeroOF,
       Operario: this.operador.CodigoEmpleado,
       Fecha: this.fecha,
       HoraInicio: this.inicioH,
       HoraFin: '0',
       Tiempo:'0'
    }
            this.maquinaService.setOperarios(maquinaService).subscribe(resp=>{console.log('Operacion insertada')})
  }
          const activoOF:any={
            EjercicioOF: this.orden.EjercicioOF,
            SerieOF: this.orden.SerieOF,
            NumeroOF: this.orden.NumeroOF,
            Activo: 1,
            Finalizado: 0
         }
           this.maquinaService.updateFasesOF(activoOF).subscribe(resp=>{console.log('Activo pasado a 1')})

    if(!this.crono){
    this.interval = setInterval(() => {
      this.segundos++;
      if (this.segundos === 60) {
        this.segundos = 0;
        this.minutos++;
        if (this.minutos === 60) {
          this.minutos = 0;
          this.horas++;
        }
      }
    }, 1000);
  }
  this.insertado=true
  this.crono=true
  this.cronoB=true
  this.ocultarBoton = false;

  }

  
  async detenerCronometro() {

    this.maquinaService.getOperarios(this.orden.EjercicioOF,this.orden.SerieOF,this.orden.NumeroOF,this.operador.CodigoEmpleado).subscribe((horaPausa: any) => {
     horaPausa.forEach((element:any) => {
      this.horaPausa = element.HoraInicio
    });
    });

    const alert = await this.alertController.create({
      header: 'Seleccionar opción',
      backdropDismiss: false,
      inputs: [
        {
          name: 'opcion',
          type: 'radio',
          label: 'Ir al aseo',
          value: 'Aseo',
          checked: true
        },
        {
          name: 'opcion',
          type: 'radio',
          label: 'Cambio de Bobina',
          value: 'Cambio de Bobina'
        },
        {
          name: 'opcion',
          type: 'radio',
          label: 'Mantenimiento',
          value: 'Mantenimiento'
        },
        {
          name: 'opcion',
          type: 'radio',
          label: 'Otros',
          value: 'otros'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler:async (data) => {
            this.pausarBobina()
            if (data === 'otros') {
              const alert = await this.alertController.create({
                header: 'Ingresa una opción',
                backdropDismiss: false,
                inputs: [
                  {
                    name: 'opcion',
                    type: 'text',
                    placeholder: 'Escribe aquí',
                    attributes: {
                      autocomplete: 'off'
                    }
                  }
                ],
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel'
                  },
                  {
                    text: 'Aceptar',
                    handler: (data) => {
                      this.motivoPausa=data.opcion

                      const pausaOF:any={
                        EjercicioOF: this.orden.EjercicioOF,
                        SerieOF: this.orden.SerieOF,
                        NumeroOF: this.orden.NumeroOF,
                        Operario: this.operador.CodigoEmpleado,
                        HoraInicio:this.horaPausa,
                        QtyPausa:this.qty,
                        MotivoPausa:this.motivoPausa
                      }
                      this.maquinaService.setPausa(pausaOF).subscribe(resp=>{console.log('Pausa Insertada')})
                      this.qty++;
                    }
                  }
                ]
              });
          
              await alert.present();
              
            }
            if (data === 'Mantenimiento') {
              let intervalP:any;
              if(!intervalP){
                  intervalP = setInterval(() => {
                  this.segundosP++;
                  if (this.segundosP === 60) {
                    this.segundosP = 0;
                    this.minutosP++;
                    if (this.minutosP === 60) {
                      this.minutosP = 0;
                      this.horasP++;
                    }
                  }
                
                }, 1000);
                
              }
              
           //   this.totalP = this.sumarTiempo(this.totalP,this.horasP, this.minutosP, this.segundosP);

              this.storage.set('codigMant', this.codigoStorage);
              const codMan=await this.storage.get('codigMant')
              this.codmanteni=codMan
              
              const showInputDialog = async () => {
                const alert = await this.alertController.create({
                  header: 'Avisar ha mantenimiento',
                  subHeader:'Código de Mantenimiento',
                  backdropDismiss: false,
                  inputs: [
                    {
                      name: 'codigo',
                      type: 'text',
                      placeholder: 'Ingrese el codigo',
                      attributes: {
                        autocomplete: 'off'
                      }
                    }
                  ],
                  buttons: [
                    {
                      text: 'Aceptar',
                      handler: (data) => {
                      //  this.totalP = this.sumarTiempo('00:00:00', this.horasP, this.minutosP, this.segundosP);
                        this.totalP =(this.agregarCerosIzquierda(this.horasP)+':'+this.agregarCerosIzquierda(this.minutosP)+':'+this.agregarCerosIzquierda(this.segundosP))

                          if (data.codigo === this.codmanteni) {
                            this.motivoPausa='Mantenimiento'

                            const pausaOF:any={
                              EjercicioOF: this.orden.EjercicioOF,
                              SerieOF: this.orden.SerieOF,
                              NumeroOF: this.orden.NumeroOF,
                              Operario: this.operador.CodigoEmpleado,
                              HoraInicio:this.horaPausa,
                              QtyPausa:this.qty,
                              MotivoPausa:this.motivoPausa,
                              TiempoPausa:this.totalP
                            }
                            this.maquinaService.setPausa(pausaOF).subscribe(resp=>{console.log('Pausa Insertada')})
                            this.qty++;  

                            this.horasP = 0;
                            this.minutosP = 0;
                            this.segundosP = 0;
                        
                            clearInterval(intervalP);
                          } else {
                            showInputDialog();
                          }
                  
                      }
                    }
                  ]
                });
                await alert.present();
              };
              showInputDialog();
      
          
              await alert.present();
              
            } else {
              this.motivoPausa=data

              const pausaOF:any={
                EjercicioOF: this.orden.EjercicioOF,
                SerieOF: this.orden.SerieOF,
                NumeroOF: this.orden.NumeroOF,
                Operario: this.operador.CodigoEmpleado,
                HoraInicio:this.horaPausa,
                QtyPausa:this.qty,
                MotivoPausa:this.motivoPausa
              }
              this.maquinaService.setPausa(pausaOF).subscribe(resp=>{console.log('Pausa Insertada')})
              this.qty++;
           
            }

            this.totalT = this.sumarTiempo(this.totalT, this.horas, this.minutos, this.segundos);

                this.horas = 0;
                this.minutos = 0;
                this.segundos = 0;
                this.crono=false
            
                clearInterval(this.interval);
          }
        }
      ]
    });



    await alert.present();
  
  }

  async finalizarOrden() {
    const fechaActual = new Date();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();

    this.finH=`${this.agregarCerosIzquierda(horas)}:${this.agregarCerosIzquierda(minutos)}`;

    this.totalT = this.sumarTiempo(this.totalT, this.horas, this.minutos, this.segundos);

    const timerOF:any={
      EjercicioOF: this.orden.EjercicioOF,
      SerieOF: this.orden.SerieOF,
      NumeroOF: this.orden.NumeroOF,
      HoraFin: this.finH,
      Tiempo:this.totalT
   }
   const activoOF:any={
    EjercicioOF: this.orden.EjercicioOF,
    SerieOF: this.orden.SerieOF,
    NumeroOF: this.orden.NumeroOF,
    Activo: 0,
    Finalizado: 1
 }

 const bolsas:any={
  EjercicioOF: this.orden.EjercicioOF,
  SerieOF: this.orden.SerieOF,
  NumeroOF: this.orden.NumeroOF,
  //MedidaBolsa: '',
  RefCaja: this.referenciaCaja,
  UnidadesFabricadas: this.undFabricadas,
  BolsasCaja: this.bolsasCaja,
  Resto: this.resto,
  TotalCajas: this.totalCajas,
  Lote: this.lote,
  NumeroCajas: this.nCajas
 }


 
 this.maquinaService.setBolsasOF(bolsas).subscribe(resp=>{console.log('BolsasOF Insertadas')})
   this.maquinaService.updateOperarios(timerOF).subscribe(resp=>{console.log('Operacion actualizada')})
   this.maquinaService.updateFasesOF(activoOF).subscribe(resp=>{console.log('Activo pasado a 0')})

   const alert = await this.alertController.create({
    header: 'Ha finalizado la Operación de Fabricación',
    message: 'Puedes elegir continuar la Operación o empezar el Control de Calidad',
    backdropDismiss: false,
    buttons: [{
      text: 'Cerrar'
    }]
  });

  await alert.present();

    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
    clearInterval(this.interval);
    this.ocultarBoton = true;
    this.crono=false


  }


 sumarTiempo(tiempoActual: string, horas: number, minutos: number, segundos: number): string {
  const tiempoActualArray = tiempoActual.split(':');
  let horasTotales = parseInt(tiempoActualArray[0]);
  let minutosTotales = parseInt(tiempoActualArray[1]);
  let segundosTotales = parseInt(tiempoActualArray[2]);

  segundosTotales += segundos;
  if (segundosTotales >= 60) {
    segundosTotales -= 60;
    minutosTotales++;
  }

  minutosTotales += minutos;
  if (minutosTotales >= 60) {
    minutosTotales -= 60;
    horasTotales++;
  }

  horasTotales += horas;

  return `${this.agregarCerosIzquierda(horasTotales)}:${this.agregarCerosIzquierda(minutosTotales)}:${this.agregarCerosIzquierda(segundosTotales)}`;
}
  
async validaVerificacion(){
if(this.Comp1==true && this.Comp2==true && this.Comp3==true && this.Comp4==true && this.Comp5==true && this.Comp6==true && 
  this.Comp7==true && this.Comp8==true && this.Comp9==true && this.Comp10==true && this.Comp11==true && this.Comp12==true && 
  this.Comp13==true && this.Comp14==true){
    const alert = await this.alertController.create({
      header: 'VERIFICACIONES PREVIAS',
      message: 'Has completado todas las verificaciones',
      backdropDismiss: false,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.validar=true
          this.goOrdenFabricacion('OF')
        }
      }]
    });
  
    await alert.present();
 

}else{
  const alert = await this.alertController.create({
    header: 'VERIFICACIONES PREVIAS',
    message: 'Faltan verificaciones por realizar',
    backdropDismiss: false,
    buttons: [{
      text: 'Aceptar',
      handler: () => {

      }
    }]
  });

  await alert.present();

}


}

async agregarFila() {

  const alert = await this.alertController.create({
    header: 'PRESIÓN DE ROTURA',
    message: 'Vas a guardar un registro, ¿estás seguro?',
    backdropDismiss: false,
    buttons: [ {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {

      }
    },
    {
      text: 'Aceptar',
      handler: () => {
        const rotura:any={
          EjercicioOF: this.orden.EjercicioOF,
          SerieOF: this.orden.SerieOF,
          NumeroOF: this.orden.NumeroOF,
          CajaUnidad: this.cajaUnidad,
          Hora: this.hora,
          Posicion1: this.posicion1,
          Posicion2: this.posicion2,
          Posicion3: this.posicion3,
          Posicion4: this.posicion4,
          Posicion5: this.posicion5,
          Posicion6: this.posicion6,
          Estanqueidad: this.Estanq,
          Retractilado: this.Retrac
        }
        this.roturas.push(rotura)

        this.maquinaService.setControlRotura(rotura).subscribe(resp=>{console.log('Control Rotura insertado')})
      
        this.cajaUnidad= '';
        this.hora= '';
        this.posicion1= '';
        this.posicion2= '';
        this.posicion3= '';
        this.posicion4= '';
        this.posicion5= '';
        this.posicion6= '';
        this.estanqueidad= false;
        this.retractilado= false;
      }
    }]
  });

  await alert.present();

  const nuevaFila = {};
  this.nuevasFilas.push(nuevaFila);

}

    

async controlCalidad(){
  
  const alert = await this.alertController.create({
    header: 'CONTROL DE CALIDAD FABRICACIÓN',
    message: 'Vas a  finalizar el control de calidad, ¿estás seguro?',
    backdropDismiss: false,
    buttons: [ {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {

      }
    },
    {
      text: 'Aceptar',
      handler: () => {
        const rotura:any={
    EjercicioOF: this.orden.EjercicioOF,
    SerieOF: this.orden.SerieOF,
    NumeroOF: this.orden.NumeroOF,
    CajaUnidad: this.cajaUnidad,
    Hora: this.hora,
    Posicion1: this.posicion1,
    Posicion2: this.posicion2,
    Posicion3: this.posicion3,
    Posicion4: this.posicion4,
    Posicion5: this.posicion5,
    Posicion6: this.posicion6,
    Estanqueidad: this.estanqueidad,
    Retractilado: this.retractilado
  }

  this.maquinaService.setControlRotura(rotura).subscribe(resp=>{console.log('Control Rotura insertado')})


  const arranqueProd:any={
    EjercicioOF: this.orden.EjercicioOF,
    SerieOF: this.orden.SerieOF,
    NumeroOF: this.orden.NumeroOF,
    DimensionesBolsas1: this.dimensionesBolsas1,
    DimensionesBolsas2: this.dimensionesBolsas2,
    DimensionesBolsas3: this.dimensionesBolsas3,
    DimensionesBolsas4: this.dimensionesBolsas4,
    DimensionesBolsas5: this.dimensionesBolsas5,
    DimensionesBolsas6: this.dimensionesBolsas6,
    AnchoSoldaduras1: this.anchoSoldaduras1,
    AnchoSoldaduras2: this.anchoSoldaduras2,
    AnchoSoldaduras3: this.anchoSoldaduras3,
    AnchoSoldaduras4: this.anchoSoldaduras4,
    AnchoSoldaduras5: this.anchoSoldaduras5,
    AnchoSoldaduras6: this.anchoSoldaduras6,
    Sombrero: this.sombrero
  }
  
  this.maquinaService.setControlArranqueProd(arranqueProd).subscribe(resp=>{console.log('Arranque Prod insertado')})


  this.ordenService.getArticulos(this.orden.EjercicioOF, this.orden.SerieOF, this.orden.NumeroOF).subscribe( (resp:any) => {
    this.articulo = resp
    this.articulo.forEach( (art: any) => {

const calidadFabricacion:any={
  EjercicioOF: this.orden.EjercicioOF,
  SerieOF: this.orden.SerieOF,
  NumeroOF: this.orden.NumeroOF,
  Fecha: this.fecha,
  Articulo: art.DescripcionArticulo,
  Comp1: this.numericValue1,
  Comp2: this.numericValue2,
  Comp3: this.numericValue3,
  Comp4: this.numericValue4,
  Comp5: this.numericValue5,
  Comp6: this.numericValue6,
  Comp7: this.numericValue7,
  Comp8: this.numericValue8,
  Comp9: this.numericValue9,
  Comp10: this.numericValue10,
  Comp11: this.numericValue11,
  Comp12: this.numericValue12,
  Comp13: this.numericValue13,
  Comp14: this.numericValue14,
  Comp15: this.numericValue15,
  Comp16: this.numericValue16,
  Comp17: this.numericValue17,
  Comp18: this.numericValue18,
  Observaciones: this.observaciones,
  Operario: this.operador.CodigoEmpleado
}
this.maquinaService.setControlCalidadFabricacion(calidadFabricacion).subscribe(resp=>{console.log('Calidad Fabricación insertado')})
})
})
  this.finCalidad=true

  
}
}]
});

await alert.present();
}


loadCompState(compName: string) {
  const compStateKey = `${compName}State`;

  // Cargar el estado del checkbox desde el almacenamiento local
  this.storage.get(compStateKey).then(state => {
    if (state !== null) {
      compName = state;
    }
  });
}

onCheckboxChange(event: any, compName: string, compValue: number) {
  const compStateKey = `${compName}State`;

  // Guardar el estado en el almacenamiento local
  this.storage.set(compStateKey, compName);

  // Actualizar el valor numérico correspondiente
  compValue = event.target.checked ? 0 : 1;

  // Obtener el valor del artículo y realizar las operaciones necesarias
  this.ordenService.getArticulos(this.orden.EjercicioOF, this.orden.SerieOF, this.orden.NumeroOF).subscribe((resp: any) => {
    this.articulo = resp;
    this.articulo.forEach((art: any) => {
      const calidadFabricacion: any = {
        EjercicioOF: this.orden.EjercicioOF,
        SerieOF: this.orden.SerieOF,
        NumeroOF: this.orden.NumeroOF,
        Fecha: this.fecha,
        Articulo: art.DescripcionArticulo,
        Comp1: this.Comp1,
        Comp2: this.Comp2,
        Comp3: this.Comp3,
        Comp4: this.Comp4,
        Comp5: this.Comp5,
        Comp6: this.Comp6,
        Comp7: this.Comp7,
        Comp8: this.Comp8,
        Comp9: this.Comp9,
        Comp10: this.Comp10,
        Comp11: this.Comp11,
        Comp12: this.Comp12,
        Comp13: this.Comp13,
        Comp14: this.Comp14,
        Comp15: this.Comp15,
        Comp16: this.Comp16,
        Comp17: this.Comp17,
        Comp18: this.Comp18,
        Observaciones: this.observaciones,
        Operario: this.operador.CodigoEmpleado
      };

      this.maquinaService.setControlCalidadFabricacion(calidadFabricacion).subscribe(resp => {'MODIFICADO'});
    });
  });
}


onCheckboxChange15(event:any) {
  this.numericValue15 = event.target.checked ? 0 : 1;
}

onCheckboxChange16(event:any) {
  this.numericValue16 = event.target.checked ? 0 : 1;
}

onCheckboxChange17(event:any) {
  this.numericValue17 = event.target.checked ? 0 : 1;
}

onCheckboxChange18(event:any) {
  this.numericValue18 = event.target.checked ? 0 : 1;
}

onCheckboxChangeEstanq(event:any) {
  this.estanqueidad = event.detail.checked;
   this.Estanq = this.estanqueidad ? 1 : 0;
}

onCheckboxChangeRetrac(event:any) {
  this.retractilado = event.detail.checked;
   this.Retrac = this.retractilado ? 1 : 0;
}


                                                                      //ORDEN DE LAMINACION
cronoL: boolean=false
ocultarBotonL: boolean=false
horasL: number = 0;
minutosL: number = 0;
segundosL: number = 0;
intervalL: any;
totalL: any='00:00:00'
observacionesL:any
consumidoB:any
loteB:any
anchoB:any
tipoB:any
laminado:any
consumidoA:any
loteA:any
anchoA:any
tipoA:any
loteL:any
horasMaq:any
endurecedor:any
resina:any
horaH:any
horaF: any

iniciarLaminado(){
  const fechaActual = new Date();
  const horas = fechaActual.getHours();
  const minutos = fechaActual.getMinutes();

  this.horaH=`${this.agregarCerosIzquierda(horas)}:${this.agregarCerosIzquierda(minutos)}`;

    
  if(!this.cronoL){
    this.intervalL = setInterval(() => {
      this.segundosL++;
      if (this.segundosL === 60) {
        this.segundosL = 0;
        this.minutosL++;
        if (this.minutosL === 60) {
          this.minutosL = 0;
          this.horasL++;
        }
      }
    }, 1000);
  }
this.ocultarBotonL=true
this.cronoL=true
}


finalizarLaminado(){

  const fechaActual = new Date();
  const horas = fechaActual.getHours();
  const minutos = fechaActual.getMinutes();

  this.horaF=`${this.agregarCerosIzquierda(horas)}:${this.agregarCerosIzquierda(minutos)}`;

  this.totalL = this.sumarTiempo(this.totalL, this.horasL, this.minutosL, this.segundosL);

 const laminas={
  EjercicioOF: this.orden.EjercicioOF,
  SerieOF: this.orden.SerieOF,
  NumeroOF: this.orden.NumeroOF,
  FechaOrden: this.orden.FechaOF,
  TipoA: this.tipoA,
  TipoB: this.tipoB,
  AnchoA: this.anchoA,
  AnchoB: this.anchoB,
  LotesA: this.loteA,
  LotesB: this.loteB,
  MetrosNoConsumidosA: this.consumidoA,
  MetrosNoConsumidosB: this.consumidoB,
  MetrosALaminar: this.laminado,
  Fecha: this.fecha,
  HoraInicio: this.horaH,
  HoraFin: this.horaF,
  Endurecedor: this.endurecedor,
  Resina: this.resina,
  LoteProduccion: this.loteL,
  ContadorHorasMaquina: this.horasMaq,
  Operario: this.operador.CodigoEmpleado,
  Observaciones: this.observacionesL
 }

 this.maquinaService.setOrdenLaminacion(laminas).subscribe(resp=>{console.log('Laminacion Insertado')})

  this.endurecedor = '';
  this.resina = '';
  this.loteL = '';
  this.horasMaq = '';
  this.tipoA = '';
  this.anchoA = '';
  this.loteA = '';
  this.consumidoA = '';
  this.tipoB = '';
  this.anchoB = '';
  this.loteB = '';
  this.consumidoB = '';
  this.observacionesL = '';
  this.laminado='';
  // this.horaH='';
  // this.horaF='';


 this.horasL = 0;
 this.minutosL = 0;
 this.segundosL = 0;
 clearInterval(this.intervalL);
 this.ocultarBotonL = false;
 this.cronoL=false
}

                                                                //ORDEN DE REBOBINADO
cronoR: boolean=false
horasR: number = 0;
minutosR: number = 0;
segundosR: number = 0;
intervalR: any;
totalR: any='00:00:00'
ocultarBotonR:boolean=false
observacionesR:any

iniciarRebobinado(){
  
  if(!this.cronoR){
    this.intervalR = setInterval(() => {
      this.segundosR++;
      if (this.segundosR === 60) {
        this.segundosR = 0;
        this.minutosR++;
        if (this.minutosR === 60) {
          this.minutosR = 0;
          this.horasR++;
        }
      }
    }, 1000);
  }
this.ocultarBotonR=true
this.cronoR=true
}


finalizarRebobinado(){
  this.totalR = this.sumarTiempo(this.totalR, this.horasR, this.minutosR, this.segundosR);

  const rebobinado={
    FechaOrden:this.orden.FechaOF,
    EjercicioOF: this.orden.EjercicioOF,
    SerieOF: this.orden.SerieOF,
    NumeroOF: this.orden.NumeroOF,
    Operario: this.operador.CodigoEmpleado,
    TiempoInvertido: this.totalR,
    Observaciones:this.observacionesR
  }
 this.maquinaService.setOrdenRebobinado(rebobinado).subscribe(resp=>{console.log('Rebobinado Insertado')})

 this.observacionesR='';
this.totalR='00:00:00';

  this.horasR = 0;
  this.minutosR = 0;
  this.segundosR = 0;
  clearInterval(this.intervalR);
  this.ocultarBotonR = false;
  this.cronoR=false
}


                                                                  //ORDEN DE IMPRESION

pantones: any[]=[];
nuevasFilasPanton: any[] = [];
numPanton:any;
color:any;
kg:any;
loteTinta:any;

async agregarPanton() {

  const alert = await this.alertController.create({
    header: 'DETALLES DE PANTÓN',
    message: 'Vas a guardar un registro, ¿estás seguro?',
    backdropDismiss: false,
    buttons: [ {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {

      }
    },
    {
      text: 'Aceptar',
      handler: () => {
        const panton:any={
          NumeroPanton:this.numPanton,
          EjercicioOF: this.orden.EjercicioOF,
          SerieOF: this.orden.SerieOF,
          NumeroOF: this.orden.NumeroOF,
          Color:this.color,
          Kg:this.kg,
          LoteTinta:this.loteTinta
        }

        this.pantones.push(panton)

        this.maquinaService.setDetallePanton(panton).subscribe(resp=>{console.log('Detalles de Pantón insertado')})
      
        this.color= '';
        this.kg= '';
        this.loteTinta= '';

      }
    }]
  });

  await alert.present();

  const nuevaFilaPanton = {};
  this.nuevasFilasPanton.push(nuevaFilaPanton);

}

nombreD:any
loteD:any
kgD:any
aniloxD:any
posicionD:number=1
tintasD: any[]=[];
nuevasFilasTintasD: any[] = [];

async agregarCaraDelantera() {

  const alert = await this.alertController.create({
    header: 'IMPRESIÓN CARA DELANTERA',
    message: 'Vas a guardar un registro, ¿estás seguro?',
    backdropDismiss: false,
    buttons: [ {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {

      }
    },
    {
      text: 'Aceptar',
      handler: () => {
        const tinta:any={
          EjercicioOF: this.orden.EjercicioOF,
          SerieOF: this.orden.SerieOF,
          NumeroOF: this.orden.NumeroOF,
          Nombre:this.nombreD,
          LoteTinta:this.loteD,
          Kg:this.kgD,
          Anilox:this.aniloxD,
          Posicion:this.posicionD,
        }

        this.tintasD.push(tinta)

        this.maquinaService.setTintaImpresion(tinta).subscribe(resp=>{console.log('Cara Delantera insertado')})

        this.nombreD=''
        this.loteD=''
        this.kgD=''
        this.aniloxD=''
        this.posicionD++

      }
    }]
  });

  await alert.present();

  const nuevaFilaTintasD = {};
  this.nuevasFilasTintasD.push(nuevaFilaTintasD);

}

nombreT:any
loteT:any
kgT:any
aniloxT:any
posicionT:number=1
tintasT: any[]=[];
nuevasFilasTintasT: any[] = [];

async agregarCaraTrasera() {

  const alert = await this.alertController.create({
    header: 'IMPRESIÓN CARA TRASERA',
    message: 'Vas a guardar un registro, ¿estás seguro?',
    backdropDismiss: false,
    buttons: [ {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {

      }
    },
    {
      text: 'Aceptar',
      handler: () => {
        const tintas:any={
          EjercicioOF: this.orden.EjercicioOF,
          SerieOF: this.orden.SerieOF,
          NumeroOF: this.orden.NumeroOF,
          Nombre:this.nombreT,
          LoteTinta:this.loteT,
          Kg:this.kgT,
          Anilox:this.aniloxT,
          Posicion:this.posicionT,
        }

        this.tintasT.push(tintas)

        this.maquinaService.setTintaImpresion(tintas).subscribe(resp=>{console.log('Cara Trasera insertado')})
      
        this.nombreT=''
        this.loteT=''
        this.kgT=''
        this.aniloxT=''
        this.posicionT++


      }
    }]
  });

  await alert.present();

  const nuevaFilaTintasT = {};
  this.nuevasFilasTintasT.push(nuevaFilaTintasT);

}

checkboxCliches() {
  this.revisionCliches = this.revisionCliches ? 1 : 0;
}

checkboxDiseno() {
  this.confirDiseno = this.confirDiseno ? 1 : 0;
}


revisionCliches: number|any;
impresionCheck:any
adjuntadoCheck:any
clichesCheck:any
impresion2Check:any
observacionesImpresion:any
observacionesDurante:any
observacionesDiseno:any
clichesGrosor:any
numCliches:any
refClichesComunes:any
clichesRef:any
tipoImpresion:any
montajeMaquina:any
montajeRodillo:any
motivos:any
tratamientoMat:any
bobinaDel:any
materialDel:any
totalDel:any
bobinaTras:any
materialTras:any
totalTras:any
metoxi:any
r15:any
acetato:any
ccImpresion:any
confirDiseno:number|any

agregarOrdenImpresion(){

}

}