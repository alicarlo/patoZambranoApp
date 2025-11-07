import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user: any
   signupForm: FormGroup | any;
   error_messages = {
    name: [
      { type: 'required', message: 'Nombre requerido' },
      { type: 'minlength', message: 'Mínimo 3 caracteres' },
      { type: 'maxlength', message: 'Máximo 50 caracteres' }
    ],
    lastName: [
      { type: 'required', message: 'Apellido paterno requerido' },
      { type: 'minlength', message: 'Mínimo 3 caracteres' },
      { type: 'maxlength', message: 'Máximo 50 caracteres' }
    ],
    secondLastName: [
      { type: 'required', message: 'Apellido materno requerido' },
      { type: 'minlength', message: 'Mínimo 3 caracteres' },
      { type: 'maxlength', message: 'Máximo 50 caracteres' }
    ],
    phoneNumber: [
      { type: 'required', message: 'Número de teléfono requerido' },
      { type: 'pattern', message: 'Debe contener 10 dígitos numéricos' }
    ],
    address: [
      { type: 'required', message: 'Dirección requerida' }
    ],
    colony: [
      { type: 'required', message: 'Colonia requerida' }
    ],
    /*
    state: [
      { type: 'required', message: 'Estado requerida' }
    ],
    */
    town: [
      { type: 'required', message: 'Municipio requerida' }
    ],
    postalCode: [
      { type: 'required', message: 'Código postal requerido' },
      { type: 'pattern', message: 'Debe contener 5 dígitos numéricos' }
    ],
    age: [
      { type: 'required', message: 'Edad requerido' },
    ],
    section: [
      { type: 'required', message: 'Sección requerido' },
       { type: 'pattern', message: 'Debe contener 5 dígitos maximo' }
    ]
  };
  constructor(
    private _ModalController: ModalController,
    private _AuthService: AuthService,
    private _ToastController: ToastController,
    private _LoadingController: LoadingController,
    private fb: FormBuilder,
  ) { 
    
  }

  async ngOnInit() {
    this.createForm();
    this.user = await this._AuthService.getDataUser();
    await this.getUser();
  }

  createForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      secondLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Solo 10 dígitos numéricos
      address: ['', [Validators.required]],
      colony: ['', [Validators.required]],
      // state: ['', [Validators.required]],
      town: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]], // Solo 5 dígitos numéricos
      section: ['', [Validators.required,Validators.maxLength(5)]],
      age: ['', Validators.compose([Validators.required])],
    });
  }

  async getUser() {
    const loading = await this._LoadingController.create({
      message: 'Cargando...',
    });
    try {
     
      await loading.present();
      const userData: any = await this._AuthService.loginGetDataFire(this.user.uid);

      this.signupForm.setValue({
        name: userData.name,
        lastName: userData.lastName,
        secondLastName: userData.secondLastName,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        colony: userData.colony,
        // state: userData.state === undefined ? '' : userData.state,
        town: userData.town === undefined ? '' : userData.town,
        postalCode: userData.postalCode,
        age: userData.age,
        section: userData.section === undefined ? '' : userData.section
      });
      
      loading.dismiss();
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      loading.dismiss();  
    }
  }


  closeMenu() {
    return this._ModalController.dismiss();
  }

  async updateUser() {
    const loading = await this._LoadingController.create({
      message: 'Cargando...',
    });
    try {
     
      await loading.present();
      await this._AuthService.updateProfileUser(this.user.uid, this.signupForm.value);
      const userData: any = await this._AuthService.loginGetDataFire(this.user.uid);
      await this._AuthService.setDataUser(userData);
      this.presentToast('Datos actualizados con exito', 'success');
      loading.dismiss();
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      loading.dismiss();  
    }
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
