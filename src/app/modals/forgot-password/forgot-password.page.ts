import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  errorMessages: any | undefined;
  constructor(
    private _AuthService: AuthService,
    private _ModalController: ModalController,
    private fb: FormBuilder,
    private _ToastController: ToastController
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
   }

  ngOnInit() {
    this.initErrorMessages();
  }

  close() {
    return this._ModalController.dismiss(null);
  }

  public initErrorMessages() {
    this.errorMessages = {
      'email': [
        { type: 'email', message: 'Correo electrónico inválido' },
        { type: 'required', message: 'El correo es requerido' },
        { type: 'minlength', message: 'El correo debe tener al menos 8 caracteres' },
        { type: 'maxlength', message: 'El correo no puede tener más de 100 caracteres' },
      ]
    };
  }

  async sendResetPasswordEmail() {
    const email = this.forgotPasswordForm.value.email;
    try {
      await this._AuthService.sendPasswordResetEmail(email);
      this.presentToast('Correo enviado', 'success');
      this.close();
    } catch (error) {}
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
