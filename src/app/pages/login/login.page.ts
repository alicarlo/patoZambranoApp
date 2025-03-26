import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RegisterPage } from '../../modals/register/register.page';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { VerifyModalPage } from 'src/app/modals/verify-modal/verify-modal.page';
import { ForgotPasswordPage } from '../../modals/forgot-password/forgot-password.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
	error_messages={
		'email':[
      {type: 'required', message: 'Correo requerido'},
			{type: 'email', message: 'Formato invalido'},
      {type: 'minlength', message: 'Minimo 3 caracteres'},
			{type: 'maxlength', message: 'Maximo 50 caracteres'},
    ],
    'password':[
      {type: 'required', message: 'Contraseña requerida'},
      {type: 'minlength', message: 'Minimo 4 caracteres'},
			{type: 'maxlength', message: 'Maximo 50 caracteres'}
    ],
  };
  constructor(
    private _ModalController: ModalController,
    private _Router: Router,
    private _ToastController: ToastController,
    private form: FormBuilder,	
    private _AuthService: AuthService,
    private _LoadingController: LoadingController
  ) { 
    this.loginForm = form.group({
			email: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(3),Validators.maxLength(50)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50)])],
		});
  }

  ngOnInit() {
  }



  async openRegisterModal() {
    const modal = await this._ModalController.create({
      component: RegisterPage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((result: any) => {
      if (result.data === 1) {
        //
      }
    });
    modal.present();
  }

  async goHome() {
    if(this.loginForm.valid) {
			const loading = await this._LoadingController.create({
				message: 'Cargando...',
			});
			await loading.present();
      let response: any =  await this._AuthService.loginFire(this.loginForm.value.email, this.loginForm.value.password);
      if (response.flag === 1) {
        this.presentToast(response.msg, 'danger');
        loading.dismiss();
        return;
      }

      if (response.flag === 2) {
        this.presentToast(response.msg, 'danger');
        loading.dismiss();
        this.verifyModalOpen();
        return;
      }
      let login: any = await this._AuthService.loginGetDataFire(response.uid);

      
      if (!login) {
        this.presentToast('Problemas al iniciar, intente de nuevo333', 'danger');
        loading.dismiss();
        return
      }

      const disabled = login.disabled || false;

      if(!disabled) {
        this._AuthService.setDataUser(login);
        this.loginForm.reset();
        this._Router.navigate(['/map', { onSameUrlNavigation: 'reload' }])
      }else{
        this.presentToast('Esta aplicación es exclusiva para usuarios activos.','danger')
      }
      
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

  async goToForgotPassword() {
    const modal = await this._ModalController.create({
      component: ForgotPasswordPage,
      handle: true,
      showBackdrop: true,
      backdropDismiss: false,
    });
    modal.present();
  }

}
