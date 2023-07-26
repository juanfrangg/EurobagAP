import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.scss'],
/*  template: `
  <ion-content>
    <div [innerHTML]="codigoHTML"></div>
  </ion-content>
`*/
})

export class MostrarComponent implements OnInit {

  @Input() codigoHTML: string|any;

  Comp1:boolean=false;
  Comp2:boolean=false;
  Comp3:boolean=false;
  Comp4:boolean=false;
  Comp5:boolean=false;
  Comp6:boolean=false;
  Comp7:boolean=false;
  Comp8:boolean=false;
  Comp9:boolean=false;
  Comp10:boolean=false;
  Comp11:boolean=false;
  Comp12:boolean=false;
  Comp13:boolean=false;
  Comp14:boolean=false;


  constructor(private modalController: ModalController) { }

  ngOnInit() {

  }

  
  validarBobi(){
    if(this.Comp1 && this.Comp2 && this.Comp4 && this.Comp5 && this.Comp6 && 
      this.Comp7 && this.Comp8 && this.Comp9 && this.Comp11 && this.Comp13 && this.Comp14){
        this.cerrarModal(true)  
      }
  }
  

  cerrarModal(checkeado:boolean) {
    this.modalController.dismiss(checkeado);
  }

}
