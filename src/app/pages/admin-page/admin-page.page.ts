import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsService } from 'src/app/services/events/events.service';
import { BarcodeScanner, CameraDirection } from '@capacitor-community/barcode-scanner';
import { AdminRegisterListPage } from '../../modals/admin-register-list/admin-register-list.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
  standalone: false
})
export class AdminPagePage implements OnInit {
  dataList: any = [];
  scanActive: boolean = false;
  qty: number = 0;
  constructor(
    private _EventsService: EventsService,
    private _AlertController: AlertController,
    private _AuthService: AuthService,
    private _LoadingController: LoadingController,
    private _ToastController: ToastController,
    private _ModalController: ModalController,
    private _Router: Router,
  ) { }

  async ngOnInit() {
    
    this.init();
  }

  async init() {
    const loading = await this._LoadingController.create({
      message: 'Cargando',
      spinner: 'dots',
    });
    loading.present();
    this.dataList = await this.getData();
    loading.dismiss();
  }

  async close() {
    console.log('close')
    const alert = await this._AlertController.create({
      header: 'Cerrar sesion',
      message: 'Desea salir ?',
      cssClass: 'custom-alert-horizontal',
      buttons: [ {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Ok',
        role: 'confirm',
        handler: () => {
          console.log('Alert confirmed');
          this._AuthService.signout();
          this._Router.navigate(['/login']);
        },
      },]
    });

    await alert.present();
  }

  async qtyAlert(ev: any) {
    console.log('close');
    const alert = await this._AlertController.create({
      header: 'Cantidad de items',
      message: 'Ingrese un número para confirmar:',
      cssClass: 'custom-alert-horizontal',
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Ej. 1',
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Ingrese una descripción',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'Ok',
          role: 'confirm',
          handler: (data) => {
            console.log('Número ingresado:', data.cantidad);
            if (data.cantidad === '') {
              this.presentToast('El campo no puede estar vacio', 'warning');
              return;
            }
            const qtyAux = parseInt(data.cantidad);
            if (qtyAux <= 0) {
              this.presentToast('Tiene que ver al menos un item', 'warning');
              return;
            }


            this.scanQr(ev, qtyAux, data.descripcion, 1, null)

            // qty
          },
        },
      ]
    });
  
    await alert.present();
  }

  async newUserAlert(ev: any) {
    console.log('close');
    const alert = await this._AlertController.create({
      header: 'Usuario sin cuenta',
      message: 'agrega los datos del usuario',
      cssClass: 'custom-alert-horizontal',
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Ej. 1',
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Ingrese una descripción',
        },
        {
          name: 'Nombre',
          type: 'text',
          placeholder: 'Nombre',
        },
        {
          name: 'ApellidoPaterno',
          type: 'text',
          placeholder: 'Apellido Paterno',
        },
        {
          name: 'ApellidoMaterno',
          type: 'text',
          placeholder: 'Apellido Materno',
        },
        {
          name: 'Telefono',
          type: 'text',
          placeholder: 'Telefono',
        },
        {
          name: 'Correo',
          type: 'email',
          placeholder: 'Correo',
        },
        
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'Ok',
          role: 'confirm',
          handler: (data) => {
            console.log('Número ingresado:', data.cantidad);
            if (data.cantidad === '') {
              this.presentToast('El campo no puede estar vacio', 'warning');
              return;
            }
            const qtyAux = parseInt(data.cantidad);
            if (qtyAux <= 0) {
              this.presentToast('Tiene que ver al menos un item', 'warning');
              return;
            }

            let user = {
              name: data.Nombre,
              lastName: data.ApellidoPaterno,
              secondLastName: data.ApellidoMaterno,
              phoneNumber: data.Telefono,
              email: data.Correo,
              uid: ''
            }
            this.addNewData(ev, qtyAux, data.descripcion, 2, user)

            // qty
          },
        },
      ]
    });
  
    await alert.present();
  }
  
  

  async getData() {
    return new Promise((resolve) => {
      this._EventsService.getSupplies().then((response) => {
        resolve(response)
      })
    })
  }

  async updateSupplies(uid: string, amount: number) {
    return new Promise((resolve) => {
      this._EventsService.updateSupplies(uid, amount).then((response) => {
        resolve(response)
      })
    })
  }

  async addUsersSupplies(uid: string, user: any, ev: any,description: string, amount: number) {
    return new Promise((resolve) => {
      // uid: string,user: any, event: any, description: string
      this._EventsService.addUserSupplies(uid, user, ev, description,amount).then((response) => {
        resolve(response)
      })
    })
  }

  async usersModals(ev: any) {
    // AdminRegisterListPage
    const modal = await this._ModalController.create({
          component: AdminRegisterListPage,
          handle: true,
          showBackdrop: true,
          backdropDismiss: false,
          componentProps: { value: ev },
        });
        modal.onDidDismiss().then((result: any) => {
          if (result.data === 1) {
            //
          }
        });
        modal.present();
  }

  async getUser(uid: string) {
    
    // loginGetDataFire
    return new Promise((resolve) => {
      this._AuthService.loginGetDataFire(uid).then((response) => {
        console.log(response)
        resolve(response)
      })
    })
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
  async addNewData(ev: any, qty: number, description: string, flag: number, customUser: any) {
    const loading = await this._LoadingController.create({
      message: 'Validando',
      spinner: 'dots',
    });
    loading.present();

    try {
      const user =  customUser
      console.log('await')
      console.log(user);
      if (ev.actualAmount > ev.totalAmount) {
        this.presentToast('No hay mas existencias', 'warning');
        loading.dismiss();
        return;
      }
      // ev.uid
      console.log('veo')
      console.log(ev);
      let cont = ev.actualAmount - qty;
      console.log(ev.totalAmount)
      console.log(cont)
      const update1 =  await this.updateSupplies(ev.uid, cont);
      if (!update1) {
        this.presentToast('Ocurrio un error', 'danger');
        loading.dismiss();
        return
      }

      // uid: string, user: any, ev: any,description: string, amount: number
      const add = await this.addUsersSupplies(ev.uid, user, ev, description, qty);
      if (!add) {
        this.presentToast('Ocurrio un error', 'danger');
        loading.dismiss();
        return
      }
      
      this.presentToast('Registro exitoso', 'success');
      loading.dismiss();
      this.init();

    } catch (error) {
      this.presentToast('Ocurrio un error', 'danger');
      loading.dismiss();
    }
  }

  async scanQr(ev: any, qty: number, description: string, flag: number, customUser: any) {
    console.log(ev)
    console.log('cerro');
    const allowed =  await this.checkPermission();
    if (allowed) {  
      this.scanActive = true;
      let camera =  CameraDirection.BACK;
      const result: any = await BarcodeScanner.startScan({cameraDirection: camera}); 
      if (result.hasContent) {
        console.log('ali')
        console.log(result)
        console.log(result.hasContent)
        const loading = await this._LoadingController.create({
          message: 'Validando',
          spinner: 'dots',
        });
        loading.present();

        try {
            const user =  await this.getUser(result.content);
            console.log('await')
            console.log(user);
            if (!user) {
              console.log('no entra');
              this.presentToast('El usuario no existe', 'warning');
              loading.dismiss();
              return
            }

          if (ev.actualAmount > ev.totalAmount) {
            this.presentToast('No hay mas existencias', 'warning');
            loading.dismiss();
            return;
          }
          // ev.uid
          console.log('veo')
          console.log(ev);
          let cont = ev.actualAmount - qty;
          console.log(ev.totalAmount)
          console.log(cont)
          const update1 =  await this.updateSupplies(ev.uid, cont);
          if (!update1) {
            this.presentToast('Ocurrio un error', 'danger');
            loading.dismiss();
            return
          }

          // uid: string, user: any, ev: any,description: string, amount: number
          const add = await this.addUsersSupplies(ev.uid, user, ev, description, qty);
          if (!add) {
            this.presentToast('Ocurrio un error', 'danger');
            loading.dismiss();
            return
          }
          
          this.stopScanner();
          this.presentToast('Registro exitoso', 'success');
          loading.dismiss();
          this.init();

        } catch (error) {
          this.presentToast('Ocurrio un error', 'danger');
          loading.dismiss();
        }
        
      }
    }
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true})
      if (status.granted) {
        resolve(true);
      }else if (status.denied) {
        const alert = await this._AlertController.create({
          header: 'Permiso para la camara',
          message: 'Habilite el permiso para la camara en configuracion',
          buttons: [{
            text: 'Continuar',
            role: 'Cancelar'
          },{
            text: 'Abrir configuracion para habilitar permiso de la camara',
            handler: () => {
            
              BarcodeScanner.openAppSettings();
              resolve(false);
            }
          }]
        });
        await alert.present();
      }else {
        resolve(false)
      }
    })
  }

  async presentToast(msg: string, color: string) {
    const toast = await this._ToastController.create({
      message: msg,
      duration: 3500,
      position: 'top',
      color: color,
      cssClass: 'tabs-bottom',
    });
    await toast.present();
  }

}
