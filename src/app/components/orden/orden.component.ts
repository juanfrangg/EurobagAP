import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { SessionService } from 'src/app/services/session.service';
import { MaquinasService } from 'src/app/services/maquinas.service';
import { AlertController } from '@ionic/angular';
import { MostrarComponent } from '../mostrar/mostrar.component';
import { Storage } from '@ionic/storage-angular';
import { Subscription, isEmpty } from 'rxjs';
import { TimermodalComponent } from '../timermodal/timermodal.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

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
  materialID:any
  materialList:any

  colorFondo:string='white'
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  interval: any;
  fecha: any
  inicioH: any
  finH: any
  totalT: any='00:00:00';
  motivoPausa: any
  crono: boolean=false
  cronoB: boolean=false
  horasB: number = 0;
  minutosB: number = 0;
  segundosB: number = 0;
  intervalB: any;
  pausaB:boolean=false
  stopB:boolean=false
  totalB: any='00:00:00';
  totalMontaje :any
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
  partidaOF:string[] = [];
  colorFondoBobi:string='white'

  validar:boolean=false
  Comp1:boolean=false;numericValue1=0;
  Comp2:boolean=false;numericValue2=0;
  Comp4:boolean=false;numericValue4=0;
  Comp5:boolean=false;numericValue5=0;
  Comp6:boolean=false;numericValue6=0;
  Comp7:boolean=false;numericValue7=0;
  Comp8:boolean=false;numericValue8=0;
  Comp9:boolean=false;numericValue9=0;
  Comp11:boolean=false;numericValue11=0;
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
  todosoperarios: any[]=[]
  suscription:Subscription | any

  articulos: any=[];
  material: any=[];
  movpos: any;
  fase: any;


  constructor(private ordenService: OrdenesService, private modalController: ModalController,
              private session: SessionService, private maquinaService: MaquinasService, 
              private alertController: AlertController, private storage:Storage, private changeDetectorRef: ChangeDetectorRef) { }

  //Order de fabricacion: Posicion 0 del array de documentos
  //Control de calidad fabricacion: Posición 1 del array de documentos
  //ORden de laminacion: Posicion 2 del array de documentos
  //Orden de rebobinado: Posicion 3 del array de documentos

  async ngOnInit() {

    this.orden.Etapas.forEach((etapas:any)=>{
      if(etapas.Activo==1){
        this.movpos=etapas.MovPos
        this.fase=etapas.Etapa
      }
    })

    registerLocaleData(localeEs);
    await this.storage.create()
    this.operador=await this.session.getSession()
    this.maquina=await this.session.getMaquina()
 
    this.maquinaService.getBobinas().subscribe(resp => {
      this.bobi = resp;
      this.bobi.forEach((registro: any) => {
        this.bobinas.push(registro);
      });
    });

    this.maquinaService.getOperario().subscribe((data:any) => {
      this.todosoperarios.push(data);
    });

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
   
      // console.log('orden', this.orden)
      this.controlCalidadFabricacion = this.orden.ControlCalidadFabricacion
      this.ordenLaminacion = this.orden.OrdenLaminacion
      this.ordenRebobinado = this.orden.OrdenRebobinado
      // console.log('control calidad fabricacion', this.controlCalidadFabricacion)
      // console.log('orden laminacion', this.ordenLaminacion)
      // console.log('orden rebobinado', this.ordenRebobinado)
      this.ordenService.getArticulos(this.ejercicio, this.serie, this.numero).subscribe( resp => {
        //this.orden.articulos = resp
        this.orden.articulos.forEach( (art: any) => {
          // art.Unidades = Math.round(Number(art.Unidades) * 100) / 100
          this.cantidad = art.Unidades
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
    this.estado = 'COF' 
  }
  
  refrescarComponente() {
    this.ngOnInit();
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

  async operarioExtra(){
    const select: HTMLIonSelectElement|any = document.querySelector('#operarioext');
    select.open();
  }

  selectChange(event: any) {
    console.log('Opción seleccionada:', event.detail.value);

    const opextra:any={
      EjercicioOF: this.orden.EjercicioOF,
      SerieOF: this.orden.SerieOF,
      NumeroOF: this.orden.NumeroOF,
      MovPos: this.movpos,
      OperarioExtra: event.detail.value
    }

  this.maquinaService.updateOperarioExtra(opextra).subscribe(resp=>{console.log('Operario Extra insertado.')})
  }

  pausarOrden() {
    this.colorFondo='white';
    this.pausaB = true;
    this.cronoB=false
  }

  mostrarBobina(){
    const material:any={
      EjercicioOF: this.orden.EjercicioOF,
      SerieOF: this.orden.SerieOF,
      NumeroOF: this.orden.NumeroOF,
    }
    this.totalLargo=0
    this.maquinaService.getMaterialOF(material).subscribe((data:any) => {
      this.materiales=data;
           // en modo administrador lo devuelve undefined
           this.materiales.forEach((item:any) => {
            this.totalLargo += parseInt(item.Largo);      
          });
    });
  }

async iniciarDetenerBobina(){

    if(!this.intervalB ){
      this.colorFondoBobi='rgb(97, 207, 111)';
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
      const modals = await this.modalController.create({
        component: TimermodalComponent,
        cssClass: 'modalOF',
        componentProps: {
          materiales: this.materiales,
          ejercicio: this.orden.EjercicioOF,
          numero: this.orden.NumeroOF,
          serie: this.orden.SerieOF
        },
        backdropDismiss: false
      });
      modals.onDidDismiss().then((result) => {
        this.materialID = result.data;
        console.log(this.materialID);
      });
      await modals.present();
    }else{
      this.colorFondoBobi='white'
      this.totalB = this.sumarTiempo(this.totalB, this.horasB, this.minutosB, this.segundosB);
      const orden = {
        EjercicioOF: this.orden.EjercicioOF,
        SerieOF: this.orden.SerieOF,
        NumeroOF: this.orden.NumeroOF,
      }; 
      let totalBobi:any
      const materialMap: { [id: string]: any } = {};      
      this.maquinaService.getMaterialOF(orden).subscribe((resp:any) => {
        if (resp.length > 0) {
          resp.forEach((bobina: any) => {
            this.materialID.forEach((id:any) => {
              if (id == bobina.ID) {
                totalBobi = bobina.TiempoMontaje;
               if(totalBobi!==null){
                 this.totalB = this.sumarTiempo(totalBobi, this.horasB, this.minutosB, this.segundosB);
               } 
               materialMap[id] = { 
                ID: id,
                EjercicioOF: this.orden.EjercicioOF,
                SerieOF: this.orden.SerieOF,
                NumeroOF: this.orden.NumeroOF,
                TiempoMontaje: this.totalB
              };              
             }
            })
          });
        }
          this.materialList = Object.values(materialMap); 
          this.maquinaService.updateBobinaTM(this.materialList).subscribe(resp=>{console.log('Tiempo de Montaje insertado.'),   
          this.maquinaService.getMaterialOF(orden).subscribe((data:any) => {this.materiales=data});
        });

      clearInterval(this.intervalB);
        this.totalB='00:00:00'
        this.intervalB = null;
        this.horasB = 0;
        this.minutosB = 0;
        this.segundosB = 0;
        this.cronoB=false
      });
    }
  }

  finalizarBobina() {
    this.stopB=true   
  }

  async mostrarCod() {

  }

  iniciarCronometro() {
    this.colorFondo='rgb(97, 207, 111)';
    this.pausaB = false;
    this.colVisible=true;

    const operario2:any={
      EjercicioOF: this.orden.EjercicioOF,
      SerieOF: this.orden.SerieOF,
      NumeroOF: this.orden.NumeroOF,
      Operario: this.operador.CodigoEmpleado,
   }

    this.maquinaService.getOperarios2(operario2).subscribe((resp: any) => {
     });
if(!this.insertado){
  this.goOrdenFabricacion('COF');
 
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
       MovPos: this.movpos,
       Operario: this.operador.CodigoEmpleado,
       Fecha: this.fecha,
       HoraInicio: this.inicioH,
       HoraFin: '0',
       Tiempo:'0'
    }
            this.maquinaService.setOperarios(maquinaService).subscribe(resp=>{console.log('Operacion insertada')})
  }
        //   const activoOF:any={
        //     MovPos: this.movpos,
        //     Activo: 1,
        //     Finalizado: 0
        //  }
        //    this.maquinaService.updateFasesMovPos(activoOF).subscribe(resp=>{console.log('Activo pasado a 1')})
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
    this.storage.set('codigMant', this.codigoStorage);
    const codMan=await this.storage.get('codigMant')
    this.codmanteni=codMan

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
          label: 'Comida',
          value: 'Comida'
        },
        {
          name: 'opcion',
          type: 'radio',
          label: 'Revision de Bolsas',
          value: 'Revision de Bolsas'
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
            if(data === 'Revision de Bolsas'){
             // console.log('pausa BOLSAS')
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
              const alert = await this.alertController.create({
                header: 'Revisión de Bolsas',
                subHeader: 'Acepte cuando haya revisado las bolsas.',
                backdropDismiss: false,
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: (data) => {
                      this.motivoPausa='Revision de Bolsas'
                      this.totalP =(this.agregarCerosIzquierda(this.horasP)+':'+this.agregarCerosIzquierda(this.minutosP)+':'+this.agregarCerosIzquierda(this.segundosP))
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
                    }
                  }
                ]
              });          
              await alert.present();              
            }
            else if(data === 'Cambio de Bobina'){
            //  console.log('pausa BOBINA')
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
              const modal = await this.modalController.create({
                component: MostrarComponent,
                componentProps: { },
                backdropDismiss: false
              });
              modal.onDidDismiss().then((result) => {
                if (result && result.data) {                  
                  this.motivoPausa='Cambio de Bobina'
                  this.totalP =(this.agregarCerosIzquierda(this.horasP)+':'+this.agregarCerosIzquierda(this.minutosP)+':'+this.agregarCerosIzquierda(this.segundosP))

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
                  this.maquinaService.setPausa(pausaOF).subscribe(resp=>{console.log('Pausa Bobina Insertada')})
                  this.qty++;  
                  this.horasP = 0;
                  this.minutosP = 0;
                  this.segundosP = 0;              
                  clearInterval(intervalP);
                }                
              });
              await modal.present();            
            }
            else if (data === 'otros') {           
             // console.log('pausa OTROS')
              this.pausarOrden()
              this.totalT = this.sumarTiempo(this.totalT, this.horas, this.minutos, this.segundos);

              this.horas = 0;
              this.minutos = 0;
              this.segundos = 0;
              this.crono=false          
              clearInterval(this.interval);

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
           else if (data === 'Mantenimiento') {           
            //console.log('pausa Mantenimiento')
            this.pausarOrden()
            this.totalT = this.sumarTiempo(this.totalT, this.horas, this.minutos, this.segundos);

            this.horas = 0;
            this.minutos = 0;
            this.segundos = 0;
            this.crono=false
        
            clearInterval(this.interval);
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
                  this.pausarOrden()
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
    // ESTE totalT REPLICARLO EN LAS OPCIONES QUE AÑADE EL TRAMO AL TOTAL DE LA OF
                  this.totalT = this.sumarTiempo(this.totalT, this.horas, this.minutos, this.segundos);

                  this.horas = 0;
                  this.minutos = 0;
                  this.segundos = 0;
                  this.crono=false          
                  clearInterval(this.interval);
                }
          }
        }
      ]
    });
    await alert.present();
  }

  validarCCRot=false
  validarCCArra=false
  validarCCFabri=false
async finalizarOrden() {
  const ccTodos={
    EjercicioOF: this.orden.EjercicioOF,
    SerieOF: this.orden.SerieOF,
    NumeroOF: this.orden.NumeroOF,
    MovPos: this.movpos
  }
  //revisamos que la orden haya pasado por calidad antes de finalizar la orden
  this.maquinaService.getCCFabricacion(ccTodos).subscribe((resp:any) => {
    if (resp.length>0) {this.validarCCFabri=true;}});
  this.maquinaService.getCCArranque(ccTodos).subscribe((resp:any)=>{
    if (resp.length>0) {this.validarCCArra=true;}});
  this.maquinaService.getCCRotura(ccTodos).subscribe((resp:any)=>{
    if (resp.length>0) {this.validarCCRot=true;}});

    if(this.validarCCFabri && this.validarCCArra && this.validarCCRot){
    const fechaActual = new Date();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    this.finH=`${this.agregarCerosIzquierda(horas)}:${this.agregarCerosIzquierda(minutos)}`;
    this.totalT = this.sumarTiempo(this.totalT, this.horas, this.minutos, this.segundos);

    const timerOF:any={
      EjercicioOF: this.orden.EjercicioOF,
      SerieOF: this.orden.SerieOF,
      NumeroOF: this.orden.NumeroOF,
      MovPos: this.movpos,
      HoraFin: this.finH,
      Tiempo:this.totalT
    }
    const activoOF:any={
      MovPos: this.movpos,
      Activo: 0,
      Finalizado: 1
    }
    const bolsas:any={
      EjercicioOF: this.orden.EjercicioOF,
      SerieOF: this.orden.SerieOF,
      NumeroOF: this.orden.NumeroOF,
      MovPos: this.movpos,
      RefCaja: this.referenciaCaja,
      UnidadesFabricadas: this.undFabricadas,
      BolsasCaja: this.bolsasCaja,
      Resto: this.resto,
      TotalCajas: this.totalCajas,
      Lote: this.lote,
      NumeroCajas: this.nCajas
    }

 this.colorFondo='white';
 
  this.maquinaService.setBolsasOF(bolsas).subscribe(resp=>{console.log('BolsasOF Insertadas')})
  this.maquinaService.updateOperarios(timerOF).subscribe(resp=>{console.log('Operacion actualizada')})
  this.maquinaService.updateFasesMovPos(activoOF).subscribe(resp=>{console.log('Finalizado pasado a 1')})

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
    }else{
        const alert = await this.alertController.create({
          header: 'Error al finalizar la Orden de Fabricación',
          message: 'Comprueba los distintos campos',
          backdropDismiss: false,
          buttons: [{
            text: 'Cerrar'
          }]
        });
      await alert.present();
    }
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

modificarPartida(index:number) {
  console.log(index)
  this.materiales[index].Partida = this.partidaOF[index];
  console.log(this.materiales[index])
  this.maquinaService.updateBobina( this.materiales[index]).subscribe(resp => {console.log('Partida Modificada');});
  this.partidaOF[index]=''
  this.botonPartida = -1;
}

                      // ------------------------------------CONTROL DE CALIDAD------------------------------------------- //

async validaVerificacion(){
  if(this.Comp1==true && this.Comp2==true && this.Comp4==true && this.Comp5==true && this.Comp6==true && 
    this.Comp7==true && this.Comp8==true && this.Comp9==true && this.Comp11==true && this.Comp13==true && this.Comp14==true){
      const alert = await this.alertController.create({
        header: 'VERIFICACIONES PREVIAS',
        message: 'Has completado todas las verificaciones',
        backdropDismiss: false,
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.validar=true
          //  this.goOrdenFabricacion('OF')
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
        handler: () => { }
      }]
    });
    await alert.present();
  }
}

mostrarHora = false;
checkboxHora = false;
async toggleHora() {

    this.mostrarHora = this.checkboxHora;
    this.fechaActual()
    this.hora = this.horaFormateada
    this.storage.set('Hora_PresionRotura',this.hora);
}

async agregarFila() {

  const alert = await this.alertController.create({
    header: 'PRESIÓN DE ROTURA',
    message: 'Vas a guardar un registro, ¿estás seguro?',
    backdropDismiss: false,
    buttons: [ {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => { }
    },
    {
      text: 'Aceptar',
      handler: () => {
        const rotura:any={
          EjercicioOF: this.orden.EjercicioOF,
          SerieOF: this.orden.SerieOF,
          NumeroOF: this.orden.NumeroOF,
          MovPos: this.movpos,
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
        this.checkboxHora= false;
      }
    }]
  });
  await alert.present();
  const nuevaFila = {};
  this.nuevasFilas.push(nuevaFila);
}

fechaFormateada:any
horaFormateada:any
fechaActual(){
  const fecha = new Date();

  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  const horas = fecha.getHours();
  const minutos = fecha.getMinutes();
  const segundos = fecha.getSeconds();

  const diaFormateado = dia.toString().padStart(2, '0');
  const mesFormateado = mes.toString().padStart(2, '0');
  const anioFormateado = anio.toString();
  const horasFormateadas = horas.toString().padStart(2, '0');
  const minutosFormateados = minutos.toString().padStart(2, '0');
  const segundosFormateados = segundos.toString().padStart(2, '0');

  this.fechaFormateada = `${anioFormateado}-${mesFormateado}-${diaFormateado} ${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
  this.horaFormateada = `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
}

mostrarDimension1 = false;
checkboxDimension1 = false;
async toggleDimension1() {
  const check1=await this.storage.get('dimensionesBolsas1');
    if(check1){
      this.mostrarDimension1 = this.checkboxDimension1;
      this.dimensionesBolsas1=check1;
    }else{
      this.mostrarDimension1 = this.checkboxDimension1;
      this.fechaActual()
      this.dimensionesBolsas1 = this.fechaFormateada
      this.storage.set('dimensionesBolsas1',this.dimensionesBolsas1);
    }
}

mostrarDimension2 = false;
checkboxDimension2 = false;
async toggleDimension2() {
  const check2=await this.storage.get('dimensionesBolsas2');
  if(check2){
    this.mostrarDimension2 = this.checkboxDimension2;
    this.dimensionesBolsas2=check2;
  }else{
  this.mostrarDimension2 = this.checkboxDimension2;
  this.fechaActual()
  this.dimensionesBolsas2 = this.fechaFormateada
  this.storage.set('dimensionesBolsas2',this.dimensionesBolsas2)
  }
}

mostrarDimension3 = false;
checkboxDimension3 = false;  
async toggleDimension3() {
  const check3=await this.storage.get('dimensionesBolsas3');
  if(check3){
    this.mostrarDimension3 = this.checkboxDimension3;
    this.dimensionesBolsas3=check3;
  }else{
  this.mostrarDimension3 = this.checkboxDimension3;
  this.fechaActual()
  this.dimensionesBolsas3=this.fechaFormateada
  this.storage.set('dimensionesBolsas3',this.dimensionesBolsas3)
  }
}

mostrarDimension4 = false;
checkboxDimension4 = false;  
async toggleDimension4() {
  const check4=await this.storage.get('dimensionesBolsas4');
  if(check4){
    this.mostrarDimension4 = this.checkboxDimension4;
    this.dimensionesBolsas4=check4;
  }else{
  this.mostrarDimension4 = this.checkboxDimension4;
  this.fechaActual()
  this.dimensionesBolsas4=this.fechaFormateada
  this.storage.set('dimensionesBolsas4',this.dimensionesBolsas4)
  }
}

mostrarDimension5 = false;
checkboxDimension5 = false;
async toggleDimension5() {
  const check5=await this.storage.get('dimensionesBolsas5');
  if(check5){
    this.mostrarDimension5 = this.checkboxDimension5;
    this.dimensionesBolsas5=check5;
  }else{
  this.mostrarDimension5 = this.checkboxDimension5;
  this.fechaActual()
  this.dimensionesBolsas5=this.fechaFormateada
  this.storage.set('dimensionesBolsas5',this.dimensionesBolsas5)
  }
}

mostrarDimension6 = false;
checkboxDimension6 = false;
async toggleDimension6() {
  const check6=await this.storage.get('dimensionesBolsas6');
  if(check6){
    this.mostrarDimension6 = this.checkboxDimension6;
    this.dimensionesBolsas6=check6;
  }else{
  this.mostrarDimension6 = this.checkboxDimension6;
  this.fechaActual()
  this.dimensionesBolsas6=this.fechaFormateada
  this.storage.set('dimensionesBolsas6',this.dimensionesBolsas6)
  }
}
// ANCHO
mostrarAncho1 = false;
checkboxAncho1 = false; 
async toggleAncho1() {
  const check1=await this.storage.get('anchoSoldaduras1');
  if(check1){
    this.mostrarAncho1 = this.checkboxAncho1;
    this.anchoSoldaduras1=check1;
  }else{
  this.mostrarAncho1 = this.checkboxAncho1;
  this.fechaActual()
  this.anchoSoldaduras1=this.fechaFormateada
  this.storage.set('anchoSoldaduras1', this.anchoSoldaduras1)
  }
}

mostrarAncho2 = false;
checkboxAncho2 = false;  
async toggleAncho2() {
  const check2=await this.storage.get('anchoSoldaduras2');
  if(check2){
    this.mostrarAncho2 = this.checkboxAncho2;
    this.anchoSoldaduras2=check2;
  }else{
  this.mostrarAncho2 = this.checkboxAncho2;
  this.fechaActual()
  this.anchoSoldaduras2=this.fechaFormateada
  this.storage.set('anchoSoldaduras2', this.anchoSoldaduras2)
  }
}

mostrarAncho3 = false;
checkboxAncho3 = false;  
async toggleAncho3() {
  const check3=await this.storage.get('anchoSoldaduras3');
  if(check3){
    this.mostrarAncho3 = this.checkboxAncho3;
    this.anchoSoldaduras3=check3;
  }else{
  this.mostrarAncho3 = this.checkboxAncho3;
  this.fechaActual()
  this.anchoSoldaduras3=this.fechaFormateada
  this.storage.set('anchoSoldaduras3', this.anchoSoldaduras3)
  }
}

mostrarAncho4 = false;
checkboxAncho4 = false;  
async toggleAncho4() {
  const check4=await this.storage.get('anchoSoldaduras4');
  if(check4){
    this.mostrarAncho4 = this.checkboxAncho4;
    this.anchoSoldaduras4=check4;
  }else{
  this.mostrarAncho4 = this.checkboxAncho4;
  this.fechaActual()
  this.anchoSoldaduras4=this.fechaFormateada
  this.storage.set('anchoSoldaduras4', this.anchoSoldaduras4)
  }
}

mostrarAncho5 = false;
checkboxAncho5 = false;   
async toggleAncho5() {
  const check5=await this.storage.get('anchoSoldaduras5');
  if(check5){
    this.mostrarAncho5 = this.checkboxAncho5;
    this.anchoSoldaduras5=check5;
  }else{
  this.mostrarAncho5 = this.checkboxAncho5;
  this.fechaActual()
  this.anchoSoldaduras5=this.fechaFormateada
  this.storage.set('anchoSoldaduras5', this.anchoSoldaduras5)
  }
}

mostrarAncho6 = false;
checkboxAncho6 = false; 
async toggleAncho6() {
  const check6=await this.storage.get('anchoSoldaduras6');
  if(check6){
    this.mostrarAncho6 = this.checkboxAncho6;
    this.anchoSoldaduras6=check6;
  }else{
  this.mostrarAncho6 = this.checkboxAncho6;
  this.fechaActual()
  this.anchoSoldaduras6=this.fechaFormateada
  this.storage.set('anchoSoldaduras6', this.anchoSoldaduras6)
  }
}

async controlCalidad(){
  const alert = await this.alertController.create({
    header: 'CONTROL DE CALIDAD FABRICACIÓN',
    message: 'Vas a  finalizar el control de calidad, ¿estás seguro?',
    backdropDismiss: false,
    buttons: [ {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => { }
    },
    {
      text: 'Aceptar',
      handler: () => {
        const rotura:any={
    EjercicioOF: this.orden.EjercicioOF,
    SerieOF: this.orden.SerieOF,
    NumeroOF: this.orden.NumeroOF,
    MovPos: this.movpos,
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
    MovPos: this.movpos,
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
    AnchoSoldaduras6: this.anchoSoldaduras6
  }
  this.maquinaService.setControlArranqueProd(arranqueProd).subscribe(resp=>{console.log('Arranque Prod insertado')})
  this.agregarFila();

  this.ordenService.getArticulos(this.orden.EjercicioOF, this.orden.SerieOF, this.orden.NumeroOF).subscribe( (resp:any) => {
    this.articulo = resp
    this.articulo.forEach( (art: any) => {

  const calidadFabricacion:any={
    EjercicioOF: this.orden.EjercicioOF,
    SerieOF: this.orden.SerieOF,
    NumeroOF: this.orden.NumeroOF,
    MovPos: this.movpos,
    Fecha: this.fecha,
    Articulo: art.DescripcionArticulo,
    Comp1: this.Comp1,
    Comp2: this.Comp2,
    Comp4: this.Comp4,
    Comp5: this.Comp5,
    Comp6: this.Comp6,
    Comp7: this.Comp7,
    Comp8: this.Comp8,
    Comp9: this.Comp9,
    Comp11: this.Comp11,
    Comp13: this.Comp13,
    Comp14: this.Comp14,
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
  //limpiar el storage de los registros de la orden presente
  this.storage.remove('dimensionesBolsas1');  this.storage.remove('anchoSoldaduras1');
  this.storage.remove('dimensionesBolsas2');  this.storage.remove('anchoSoldaduras2');
  this.storage.remove('dimensionesBolsas3');  this.storage.remove('anchoSoldaduras3');
  this.storage.remove('dimensionesBolsas4');  this.storage.remove('anchoSoldaduras4');
  this.storage.remove('dimensionesBolsas5');  this.storage.remove('anchoSoldaduras5');
  this.storage.remove('dimensionesBolsas6');  this.storage.remove('anchoSoldaduras6');

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

  this.ordenService.getArticulos(this.orden.EjercicioOF, this.orden.SerieOF, this.orden.NumeroOF).subscribe((resp: any) => {
    this.articulo = resp;
    this.articulo.forEach((art: any) => {
      const calidadFabricacion: any = {
        EjercicioOF: this.orden.EjercicioOF,
        SerieOF: this.orden.SerieOF,
        NumeroOF: this.orden.NumeroOF,
        MovPos: this.movpos,
        Fecha: this.fecha,
        Articulo: art.DescripcionArticulo,
        Comp1: this.Comp1,
        Comp2: this.Comp2,
        Comp4: this.Comp4,
        Comp5: this.Comp5,
        Comp6: this.Comp6,
        Comp7: this.Comp7,
        Comp8: this.Comp8,
        Comp9: this.Comp9,
        Comp11: this.Comp11,
        Comp13: this.Comp13,
        Comp14: this.Comp14,
        Comp15: this.Comp15,
        Comp16: this.Comp16,
        Comp17: this.Comp17,
        Comp18: this.Comp18,
        Observaciones: this.observaciones,
        Operario: this.operador.CodigoEmpleado
      };
      this.maquinaService.setControlCalidadFabricacion(calidadFabricacion).subscribe(resp => {console.log('MODIFICADO')});
    });
  });
}


onCheckboxChange15(event:any) {
  this.numericValue15 = event.target.checked ? 1 : 0;
}

onCheckboxChange16(event:any) {
  this.numericValue16 = event.target.checked ? 1 : 0; 
}

onCheckboxChange17(event:any) {
  this.numericValue17 = event.target.checked ? 1 : 0;
}

onCheckboxChange18(event:any) {
  this.numericValue18 = event.target.checked ? 1 : 0;
}

onCheckboxChangeEstanq(event:any) {
  this.estanqueidad = event.detail.checked;
   this.Estanq = this.estanqueidad ? 1 : 0;
}

onCheckboxChangeRetrac(event:any) {
  this.retractilado = event.detail.checked;
   this.Retrac = this.retractilado ? 1 : 0;
}

                            // ----------------------------------------------ORDEN DE LAMINACION------------------------------------ //
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
  MovPos: this.movpos,
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

 const activoOF:any={
  MovPos: this.movpos,
  Activo: 0,
  Finalizado: 1
}
 this.maquinaService.updateFasesMovPos(activoOF).subscribe(resp=>{console.log('Finalizado pasado a 1')})
  // this.endurecedor = '';
  // this.resina = '';
  // this.loteL = '';
  // this.horasMaq = '';
  // this.tipoA = '';
  // this.anchoA = '';
  // this.loteA = '';
  // this.consumidoA = '';
  // this.tipoB = '';
  // this.anchoB = '';
  // this.loteB = '';
  // this.consumidoB = '';
  // this.observacionesL = '';
  // this.laminado='';
 this.horasL = 0;
 this.minutosL = 0;
 this.segundosL = 0;
 clearInterval(this.intervalL);
 this.ocultarBotonL = false;
 this.cronoL=false
}

                          // ----------------------------------------------ORDEN DE REBOBINADO------------------------------------ //
cronoR: boolean=false
horasR: number = 0;
minutosR: number = 0;
segundosR: number = 0;
intervalR: any;
totalR: any='00:00:00'
ocultarBotonR:boolean=false
observacionesR:any
bobinas: any=[]
bobi:any
bobinaFiltrada=[...this.bobinas]
selectedBobina: any[]=[];
compararBobina: any;
escribir: string='';
bobinaOrigin: any;
anchoBobi: number [] = [];
largoBobi: number [] = [];
cont: number = 0;
checkSage:boolean[]=[] 

buscarBobina(event:any) {
  this.escribir = event.target.value.toLowerCase();
  this.bobinaFiltrada = this.bobinas.filter((d: any) => d.DescripcionArticulo.toLowerCase().indexOf(this.escribir) > -1);
}
limpiarBusqueda() {
  this.bobinaFiltrada = [];
  this.escribir = '';
}

async seleccionarBobina(item: any) {
//  const materiales = this.materiales; // Asignar this.materiales a una variable local
  const alert = await this.alertController.create({
    header: `${item.DescripcionArticulo}`,
    message: '¿Quieres añadir esta bobina?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => { }
      },
      {
        text: 'Aceptar',
        handler: (selectedOption) => {
          this.selectedBobina.push(item);
          this.compararBobina = selectedOption;
        }
      }
    ]
  });

  await alert.present();
}

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

botonPartida: number = -1;
camposPartida: boolean = true;
verificarCamposVacios(index: number) {
  this.camposPartida = true; 
  if (this.partidaOF[index]) {
    this.camposPartida = false;
    this.botonPartida = index; // Establece el índice del botón activo
  } else {
    this.botonPartida = -1; // Si los campos están vacíos, establece el índice del botón activo a -1
  }
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
  this.materiales.forEach((bobinaOriginal:any) => {
    const descripcion={
      DescripcionArticulo: bobinaOriginal.Material
    }
      this.maquinaService.getBobinasDescrip(descripcion).subscribe((resp:any)=>{
        this.bobinaOrigin=resp[0].CodigoArticulo    
        this.fechaActual()
          const bobina1={
          CodigoEmpresa: this.orden.CodigoEmpresa,
          EjercicioOF: this.orden.EjercicioOF,
          SerieOF: this.orden.SerieOF,
          Periodo: 99 ,
          Fecha: this.fechaFormateada,
          FechaRegistro: this.fechaFormateada,
          Documento: 0,
          CodigoArticulo: this.bobinaOrigin,
          Ancho: bobinaOriginal.Ancho,
          Largo: bobinaOriginal.Largo,
          Unidades: bobinaOriginal.Largo,
          Partida: bobinaOriginal.Partida,
          TipoMovimiento: 1,
          OrigenMovimiento: 'T',
          Procesado: 0
        }
          this.maquinaService.setBobinas(bobina1).subscribe(resp=>{console.log('Bobina Insertada en MovimientoStock')})
      });
  });

  this.selectedBobina.forEach((bobinaMod:any) => {
    this.fechaActual()
        const bobina2={
        CodigoEmpresa: this.orden.CodigoEmpresa,
        EjercicioOF: this.orden.EjercicioOF,
        SerieOF: this.orden.SerieOF,
        Periodo: 99 ,
        Fecha: this.fechaFormateada,
        FechaRegistro: this.fechaFormateada,
        Documento: 0,
        CodigoArticulo: bobinaMod.CodigoArticulo,
        Ancho: this.anchoBobi[this.cont],
        Largo: this.largoBobi[this.cont],
        Unidades: this.largoBobi[this.cont],
        Partida: '',
        TipoMovimiento: 2,
        OrigenMovimiento: 'T',
        Procesado: 0
      }
    if(this.checkSage[this.cont]){
      this.maquinaService.setBobinas(bobina2).subscribe(resp=>{console.log('Bobina Insertada en MovimientoStock')})
    }
    this.cont++;
  });
 this.maquinaService.setOrdenRebobinado(rebobinado).subscribe(resp=>{console.log('Rebobinado Insertado')})

  this.observacionesR='';
  this.totalR='00:00:00';
  this.horasR = 0;
  this.minutosR = 0;
  this.segundosR = 0;
  clearInterval(this.intervalR);
  this.ocultarBotonR = false;
  this.cronoR=false
  this.limpiarBusqueda();
  this.cont=0
  this.largoBobi=[]
  this.checkSage=[]
  this.selectedBobina=[]

  const activoOF:any={
    MovPos: this.movpos,
    Activo: 0,
    Finalizado: 1
  }
   this.maquinaService.updateFasesMovPos(activoOF).subscribe(resp=>{console.log('Finalizado pasado a 1')})
}
                        // ----------------------------------------------ORDEN DE IMPRESION------------------------------------ //

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
      handler: () => { }
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
      handler: () => { }
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
      handler: () => { }
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

checkboxOperario2() {
  this.operarioImpre2 = this.operarioImpre2 ? 1 : 0;
}

checkboxOperario() {
  this.operarioImpre = this.operarioImpre ? 1 : 0;
}

intervalCD:any
pausaCD:any
segundosCD:number = 0
minutosCD:number = 0
horasCD:number = 0
totalCD:any = '00:00:00'
cronoCD:boolean=false
iniciarDetenerClichesD(){
  if(!this.intervalCD ){
    this.cronoCD=false
    this.intervalCD = setInterval(() => {
      if(!this.pausaCD){
      this.segundosCD++;
      if (this.segundosCD === 60) {
        this.segundosCD = 0;
        this.minutosCD++;
        if (this.minutosCD === 60) {
          this.minutosCD = 0;
          this.horasCD++;
        }
      }
    }
    }, 1000);    
  }else{
  this.totalCD =(this.agregarCerosIzquierda(this.horasCD)+':'+this.agregarCerosIzquierda(this.minutosCD)+':'+this.agregarCerosIzquierda(this.segundosCD))

  clearInterval(this.intervalCD);
  this.intervalCD = null;
  this.horasCD = 0;
  this.minutosCD = 0;
  this.segundosCD = 0;
  this.cronoCD=true
  }
}

intervalCT:any
pausaCT:any
segundosCT:number = 0
minutosCT:number = 0
horasCT:number = 0
totalCT:any = '00:00:00'
cronoCT:boolean=false
iniciarDetenerClichesT(){
  if(!this.intervalCT ){
    this.cronoCT=false
    this.intervalCT = setInterval(() => {
      if(!this.pausaCT){
      this.segundosCT++;
      if (this.segundosCT === 60) {
        this.segundosCT = 0;
        this.minutosCT++;
        if (this.minutosCT === 60) {
          this.minutosCT = 0;
          this.horasCT++;
        }
      }
    }
    }, 1000);    
  }else{
  this.totalCT =(this.agregarCerosIzquierda(this.horasCT)+':'+this.agregarCerosIzquierda(this.minutosCT)+':'+this.agregarCerosIzquierda(this.segundosCT))

  clearInterval(this.intervalCT);
  this.intervalCT = null;
  this.horasCT = 0;
  this.minutosCT = 0;
  this.segundosCT = 0;
  this.cronoCT=true
  }
}

intervalIT:any
pausaIT:any
segundosIT:number = 0
minutosIT:number = 0
horasIT:number = 0
totalIT:any = '00:00:00'
cronoIT:boolean=false
iniciarDetenerImpresionT(){
  if(!this.intervalIT ){
    this.cronoIT=false
    this.intervalIT = setInterval(() => {
      if(!this.pausaIT){
      this.segundosIT++;
      if (this.segundosIT === 60) {
        this.segundosIT = 0;
        this.minutosIT++;
        if (this.minutosIT === 60) {
          this.minutosIT = 0;
          this.horasIT++;
        }
      }
    }
    }, 1000);   
  }else{
  this.totalIT =(this.agregarCerosIzquierda(this.horasIT)+':'+this.agregarCerosIzquierda(this.minutosIT)+':'+this.agregarCerosIzquierda(this.segundosIT))

  clearInterval(this.intervalIT);
  this.intervalIT = null;
  this.horasIT = 0;
  this.minutosIT = 0;
  this.segundosIT = 0;
  this.cronoIT=true
  }
}

intervalID:any
pausaID:any
segundosID:number = 0
minutosID:number = 0
horasID:number = 0
totalID:any = '00:00:00'
cronoID:boolean=false
iniciarDetenerImpresionD(){
  if(!this.intervalID ){
    this.cronoID=false
    this.intervalID = setInterval(() => {
      if(!this.pausaID){
      this.segundosID++;
      if (this.segundosID === 60) {
        this.segundosID = 0;
        this.minutosID++;
        if (this.minutosID === 60) {
          this.minutosID = 0;
          this.horasID++;
        }
      }
    }
    }, 1000);   
  }else{
  this.totalID =(this.agregarCerosIzquierda(this.horasID)+':'+this.agregarCerosIzquierda(this.minutosID)+':'+this.agregarCerosIzquierda(this.segundosID))

  clearInterval(this.intervalID);
  this.intervalID = null;
  this.horasID = 0;
  this.minutosID = 0;
  this.segundosID = 0;
  this.cronoID=true
  }
}

intervalCD2:any
pausaCD2:any
segundosCD2:number = 0
minutosCD2:number = 0
horasCD2:number = 0
totalCD2:any = '00:00:00'
cronoCD2:boolean=false
iniciarDetenerClichesD2(){
  if(!this.intervalCD2 ){
    this.cronoCD2=false
    this.intervalCD2 = setInterval(() => {
      if(!this.pausaCD2){
      this.segundosCD2++;
      if (this.segundosCD2 === 60) {
        this.segundosCD2 = 0;
        this.minutosCD2++;
        if (this.minutosCD2 === 60) {
          this.minutosCD2 = 0;
          this.horasCD2++;
        }
      }
    }
    }, 1000);    
  }else{
  this.totalCD2 =(this.agregarCerosIzquierda(this.horasCD2)+':'+this.agregarCerosIzquierda(this.minutosCD2)+':'+this.agregarCerosIzquierda(this.segundosCD2))

  clearInterval(this.intervalCD2);
  this.intervalCD2 = null;
  this.horasCD2 = 0;
  this.minutosCD2 = 0;
  this.segundosCD2 = 0;
  this.cronoCD2=true
  }
}

intervalCT2:any
pausaCT2:any
segundosCT2:number = 0
minutosCT2:number = 0
horasCT2:number = 0
totalCT2:any = '00:00:00'
cronoCT2:boolean=false
iniciarDetenerClichesT2(){
  if(!this.intervalCT2 ){
    this.cronoCT2=false
    this.intervalCT2 = setInterval(() => {
      if(!this.pausaCT2){
      this.segundosCT2++;
      if (this.segundosCT2 === 60) {
        this.segundosCT2 = 0;
        this.minutosCT2++;
        if (this.minutosCT2 === 60) {
          this.minutosCT2 = 0;
          this.horasCT2++;
        }
      }
    }
    }, 1000);    
  }else{
  this.totalCT2 =(this.agregarCerosIzquierda(this.horasCT2)+':'+this.agregarCerosIzquierda(this.minutosCT2)+':'+this.agregarCerosIzquierda(this.segundosCT2))

  clearInterval(this.intervalCT2);
  this.intervalCT2 = null;
  this.horasCT2 = 0;
  this.minutosCT2 = 0;
  this.segundosCT2 = 0;
  this.cronoCT2=true
  }
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
operarioImpre:number=0
operarioImpre2:number=0

agregarOrdenImpresion(){
const impresion={
  EjercicioOF: this.orden.EjercicioOF,
  SerieOF: this.orden.SerieOF,
  NumeroOF: this.orden.NumeroOF,
  Impresion: this.orden.articulos[0].Impreso,
  Anonima: 333,
  Medida: 'MEDIDA',
  Fecha: this.orden.FechaOF,
  Cantidad: this.cantidad,
  NumeroPedido: 666,
  Cliente: this.orden.pedidos[0].RazonSocial,
  RevisionCliches: this.revisionCliches,
  ImpresionCheck: this.impresionCheck,
  AdjuntadoCheck: this.adjuntadoCheck,
  ClichesCheck: this.clichesCheck,
  Impresion2Check: this.impresion2Check,
  Observaciones: this.observacionesImpresion,
  ClichesGrosor: this.clichesGrosor,
  NumeroCliches: this.numCliches,
  RefClichesComunes: this.refClichesComunes,
  ClichesRef: this.clichesRef,
  TipoImpresion: this.tipoImpresion,
  MontajeMaquina: this.montajeMaquina,
  MontajeRodillo: this.montajeRodillo,
  Motivos: this.motivos,
  DiaImpreso: this.fecha,
  TratamientoMaterial: this.tratamientoMat,
  BobinaDelantera: this.bobinaDel,
  MaterialDelantera: this.materialDel,
  TotalDelantera: this.totalDel,
  BobinaTrasera: this.bobinaTras,
  MaterialTrasera: this.materialTras,
  TotalTrasera: this.totalTras,
  Metoxipropanol: this.metoxi,
  R15: this.r15,
  Acetato: this.acetato,
  ControlCalidadImpresion: this.ccImpresion,
  ObservacionesImpresion: this.observacionesDurante,
  Boceto: 'BOCETO',
  ObservacionesDiseño: this.observacionesDiseno,
  ConfirmacionDiseño: this.confirDiseno,
  TiempoTotalMontajeClichesDelantera: this.totalCD,
  TiempoTotalMontajeClichesTrasera: this.totalCT,
  TiempoTotalImpresionDelantera: this.totalID,
  TiempoTotalImpresionTrasera: this.totalIT,
  TiempoTotalDesmontajeClichesDelantera: this.totalCD2,
  TiempoTotalDesmontajeClichesTrasera: this.totalCT2,
  OperarioImpresion: this.operarioImpre
}
this.maquinaService.setOrdenImpresion(impresion).subscribe(resp=>{console.log('Orden de Impresion insertado.')})

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
this.maquinaService.setTintaImpresion(tinta).subscribe(resp=>{console.log('Cara Delantera insertado')})

this.nombreD=''
this.loteD=''
this.kgD=''
this.aniloxD=''
this.posicionD++

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
this.maquinaService.setTintaImpresion(tintas).subscribe(resp=>{console.log('Cara Trasera insertado')})

this.nombreT=''
this.loteT=''
this.kgT=''
this.aniloxT=''
this.posicionT++

const panton:any={
  NumeroPanton:this.numPanton,
  EjercicioOF: this.orden.EjercicioOF,
  SerieOF: this.orden.SerieOF,
  NumeroOF: this.orden.NumeroOF,
  Color:this.color,
  Kg:this.kg,
  LoteTinta:this.loteTinta
}
this.maquinaService.setDetallePanton(panton).subscribe(resp=>{console.log('Detalles de Pantón insertado')})

this.color= '';
this.kg= '';
this.loteTinta= '';

const activoOF:any={
  MovPos: this.movpos,
  Activo: 0,
  Finalizado: 1
}
 this.maquinaService.updateFasesMovPos(activoOF).subscribe(resp=>{console.log('Finalizado pasado a 1')})
}

}