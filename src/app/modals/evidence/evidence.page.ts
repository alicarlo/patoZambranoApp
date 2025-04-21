import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EvidenceService } from 'src/app/services/evidence/evidence.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.page.html',
  styleUrls: ['./evidence.page.scss'],
  standalone: false
})
export class EvidencePage implements OnInit {
  user: any = null;
  evidence: any = [];
  loading: number = 0;
  edit: boolean = false;

  title: string = '';
  description: string = '';
  currentIndex: number | null = null;
  constructor(
    private _ModalController: ModalController,
    private _EvidenceService: EvidenceService,
    private _ToastController: ToastController,
    private _AuthService: AuthService,
    private launchNavigator: LaunchNavigator, 
    private _LoadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.user = await this._AuthService.getDataUser();
    this.getEvidence();
  }


  async getEvidence() {
    const evidence: any = await this._EvidenceService.getEvidence(this.user.uid);
    if (evidence === false) {
      this.loading = 1;
    }else{
      this.evidence = evidence;
      this.loading = 2;
    }
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  editEvidence(evidence: any, flag: boolean, index: number) {
    if (flag === true) {
      this.edit = true;
      this.title = this.evidence[index].title
      this.description = this.evidence[index].description;
      this.currentIndex = index;
    }else{
      this.edit = false;
      this.title = '';
      this.description = '';
      this.currentIndex = null;
    }
  
  }

  async updateEvidence(evidence: any, flag: boolean, index: number) {
    if (this.title === '' || this.description === '') {
      this.presentToast('Todos los campos son obligatorios', 'warning');
    }
    const loading = await this._LoadingController.create({
			message: 'Actualizando registro...',
		});
		await loading.present();
    try {

      await this._EvidenceService.updateEvidence(evidence.idDocEvidenceSample, this.title, this.description);
      await this._EvidenceService.updateEvidenceByUser(this.user.uid, evidence.idDoc, this.title, this.description);
      loading.dismiss();
      this.edit = false;
      this.title = '';
      this.description = '';
      this.currentIndex = null;
      this.loading = 0;
      this.getEvidence();
   
    } catch (error: any) {
      this.presentToast(error, 'danger');
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

  openMap(data: any) {
    const lat = parseFloat(data.latEvidence); // Latitud del marcador
    const lng = parseFloat(data.lngEvidence); // Longitud del marcador

    const options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.APPLE_MAPS,
    };

    this.launchNavigator.navigate([data.latEvidence, data.lngEvidence], options)
      .then(() => console.log('Google Maps abierto'))
      .catch(error => console.error('Error abriendo Google Maps:', error));
  }
}
