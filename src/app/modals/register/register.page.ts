import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserForm } from 'src/app/modals/interfaces/interfaces';
import * as moment from 'moment';
import { VerifyModalPage } from '../verify-modal/verify-modal.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  dateFormat: string = '';
  signupForm: FormGroup | any;
  gender: any = [
		{ id: 1, name: 'Masculino'},
		{ id: 2, name: 'Femenino'},
    { id: 3, name: 'Otro'},
	]
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
    state: [
      { type: 'required', message: 'Estado requerida' }
    ],
    town: [
      { type: 'required', message: 'Municipio requerida' }
    ],
    postalCode: [
      { type: 'required', message: 'Código postal requerido' },
      { type: 'pattern', message: 'Debe contener 5 dígitos numéricos' }
    ],
    dob: [
      { type: 'required', message: 'Fecha de cumpleaños requerido' },
    ],
    gender: [
      { type: 'required', message: 'Genero requerido' },
    ],
    age: [
      { type: 'required', message: 'Edad requerido' },
    ],
    email: [
      { type: 'required', message: 'Correo electrónico requerido' },
      { type: 'email', message: 'Formato de correo inválido' }
    ],
    password: [
      { type: 'required', message: 'Contraseña requerida' },
      { type: 'minlength', message: 'Debe tener al menos 8 caracteres' }
    ]
  };
  
  constructor(
    private _ModalController: ModalController,
    private _LoadingController: LoadingController,
    private _ToastController: ToastController,
    private fb: FormBuilder,
    private _AuthService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  createForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      secondLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      phoneNumber: ['', []], // Solo 10 dígitos numéricos
      address: ['', []],
      colony: ['', [Validators.required]],
      state: ['', [Validators.required]],
      town: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]], // Solo 5 dígitos numéricos
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dob: ['', []],
      gender: ['', []],
      age: ['', []],
    });
  }

  async registerUser() {
    const loading = await this._LoadingController.create({
      message: 'Registrando...',
      spinner: 'dots',
    });
    loading.present();
    try {
      const responseAuth: any = await this._AuthService.signup(
        this.signupForm.value.email,
        this.signupForm.value.password,
      );

      const auth = {
        uid: responseAuth.user.uid,
        email: responseAuth.user.email,
        emailVerified: responseAuth.user.emailVerified,
      };
      await this._AuthService.sendVerificationMail();

      let keyConst = {
        user_keywords: [
          ...this.generateKeywords(this.signupForm.value.name),
          ...this.generateKeywords(this.signupForm.value.lastName),
          ...this.generateKeywords(this.signupForm.value.secondLastName),
          ...this.generateKeywords(this.signupForm.value.name + ' ' + this.signupForm.value.lastName),
          ...this.generateKeywords(this.signupForm.value.name + ' ' + this.signupForm.value.secondLastName),
          ...this.generateKeywords(this.signupForm.value.name + ' ' + this.signupForm.value.lastName + ' ' + this.signupForm.value.secondLastName),
        ],
      };
      const user = await this._AuthService.createUser(this.signupForm.value, responseAuth.user.uid, auth, keyConst);
      loading.dismiss();
      this.presentToast('Registro exitoso', 'success');
      this._ModalController.dismiss();
      this.verifyModalOpen();
    } catch (e: unknown) {
      console.log(e)
      loading.dismiss();
      let errorMessage: string;

      if (typeof e === 'string') {
        errorMessage = e;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      } else {
        errorMessage = 'Opss error.';
      }

      this.presentToast(errorMessage, 'danger');
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

  generateKeywords(field: string) {
    const keywords: any = [];
    let current = '';
    field
      .toLowerCase()
      .split('')
      .forEach((char) => {
        current += char;
        keywords.push(current);
      });
    return keywords;
  }

  public validDate(): void {
    this.dateFormat = moment(this.signupForm.value.dob).format('DD/MM/YYYY');
    const millis = Date.now() - Date.parse(this.signupForm.value.dob);
    this.signupForm.get('age')?.setValue(new Date(millis).getFullYear() - 1970);
  }

  async verifyModalOpen() {
		const modal = await this._ModalController.create({
      component: VerifyModalPage,
			showBackdrop: true,
			backdropDismiss: false,
    });
		modal.onDidDismiss().then((result: any)=>{
			if (result.data !== null) {

			}
		});
    modal.present()
	}
}
