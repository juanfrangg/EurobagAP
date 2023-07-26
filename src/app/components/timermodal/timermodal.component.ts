import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { MaquinasService } from 'src/app/services/maquinas.service';

@Component({
  selector: 'app-timermodal',
  templateUrl: './timermodal.component.html',
  styleUrls: ['./timermodal.component.scss'],
})
export class TimermodalComponent implements OnInit {

  @Input() materiales:any 
  @Input() ejercicio:any 
  @Input() numero:any 
  @Input() serie:any

  @ViewChild('miSelect') miSelect: IonSelect | any;

constructor(private modalController: ModalController, private maquinaService: MaquinasService) { }

horas: number = 0;
minutos: number = 0;
segundos: number = 0;
interval: any;
materialesSeleccionados:any[]=[]
materialID:any
material:any

  ngOnInit() {
    this.crono();

    const orden={
      EjercicioOF: this.ejercicio,
      NumeroOF: this.numero,
      SerieOF: this.serie
    }
  this.maquinaService.getMaterialOF(orden).subscribe(resp=>{this.material=resp});
  }

  abrirSelect() {
    this.miSelect.open();
  }

  onMatsSelec(event:any){
  this.materialID=event.detail.value;
  this.compararBobinas()
  }

  compararBobinas() {
    const nuevaListaSeleccionados: any = [];
    this.material.forEach((bobina: any) => {
      if (this.materialID.includes(bobina.ID)) {
        nuevaListaSeleccionados.push(bobina);
      }
    });
    this.materialesSeleccionados = nuevaListaSeleccionados;
  }  

  crono(){
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
  

  cerrarModal() {
    this.modalController.dismiss(this.materialID);
    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
    clearInterval(this.interval);
  }

}
