import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { finalize, Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import * as moment from 'moment';
import { EvidenceService } from 'src/app/services/evidence/evidence.service';


@Component({
  selector: 'app-create-evidence',
  templateUrl: './create-evidence.page.html',
  styleUrls: ['./create-evidence.page.scss'],
  standalone: false
})
export class CreateEvidencePage implements OnInit {
  isRecording = false;
  filePath: string = '';
  duration = 0;
  timer: ReturnType<typeof setInterval> | undefined;
  audioUrl: string = '';
  boxAudio: boolean = false;
  //
  imageUrl: string = '';
	comentario: string = '';
	user: any;
	userBucketPath: string = '';
	percentage: Observable<number> | any;
	task: AngularFireUploadTask | any
	uploadPercent: Observable<number> | any;
	downloadURL: Observable<string> | any;

  userBucketPath2: string = '';
	percentage2: Observable<number> | any;
	task2: AngularFireUploadTask | any
	uploadPercent2: Observable<number> | any;
	downloadURL2: Observable<string> | any;

  title: string = '';
  description: string = '';
  state: string = '';
  town: string = '';
  colony: string = '';
  coords: any = { latitude: 0, longitude: 0};
  location: any = { lat: 0, lng: 0 };
  constructor(
    private _ModalController: ModalController,
    private _ToastController: ToastController,
    private _AuthService: AuthService,
    private _BucketStorage: AngularFireStorage,
    private _LoadingController: LoadingController,
    private _EvidenceService: EvidenceService,
    private _NavParams: NavParams,
  ) {
    const data = this._NavParams.get('value');
    this.location = data.location;
    console.log(this.location)
   }

  async ngOnInit() {
    this.user = await this._AuthService.getDataUser();
  }

  closeMenu() {
    return this._ModalController.dismiss();
  }

  async pickImage() {
    this.boxAudio = false;
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.Base64,
			source: CameraSource.Camera,
		});
    this.imageUrl ='data:image/png;base64,' + image.base64String;
  }

  removeImage() {
    this.imageUrl = '';
  }

  removeAudio() {
    this.audioUrl = '';
    this.duration = 0;
  }

  activateBoxAudio() {
    this.boxAudio = true;
  }

  toggleRecording(): void {
    this.isRecording = !this.isRecording;
    this.isRecording ? this.startRecording() : this.stopRecording();
  }

  startTimer(): void {
    this.duration = 0;
    this.timer = setInterval(() => {
      this.duration += 1;
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  async startRecording() {
    const permissionStatus = await VoiceRecorder.requestAudioRecordingPermission();
    try {
      const result = await VoiceRecorder.startRecording();
      this.isRecording = true;

      this.presentToast('Grabacion iniciada', 'success');
      this.startTimer();
    } catch (err) {
      console.error('Error al iniciar la grabación', err);
    }
  }


  async stopRecording() {
    try {
      const result: any = await VoiceRecorder.stopRecording();
      this.isRecording = false;
      this.filePath = result.filePath;
      this.boxAudio = false
      this.audioUrl = `data:audio/aac;base64,${result.value.recordDataBase64}`;      
      this.presentToast('Grabacion finalizada', 'success');
      this.stopTimer();
    } catch (err) {
      console.error('Error al detener la grabación', err);
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

  async send() {

    if (this.title === '') {
      this.presentToast('Debes ingresar un titulo', 'warning');
      return;
    }

    if (this.description === '') {
      this.presentToast('Debes ingresar una descripcion', 'warning');
      return;
    }

    if (this.state === '') {
      this.presentToast('Debes ingresar un estado', 'warning');
      return;
    }

    if (this.town === '') {
      this.presentToast('Debes ingresar un municipio', 'warning');
      return;
    }

    if (this.colony === '') {
      this.presentToast('Debes ingresar una colonia', 'warning');
      return;
    }
    const loading = await this._LoadingController.create({
			message: 'Subiendo registro...',
		});
		await loading.present();

    const dateTimeId = moment().format('DD-MM-YYYY-hh:mm:ss');
    let responseAudio: any = '';
    let responseImage: any = '';
    console.log('veoooo')
    console.log(this.audioUrl)
    if (this.audioUrl !== '') {
      console.log('veo333333')
      responseAudio = await this.uploadAudio(dateTimeId);
      if (responseAudio === '') {
        loading.dismiss();
        return
      }
    }


    console.log('veoooo')
    console.log(this.imageUrl)
    if (this.imageUrl !== '') {
      console.log('veo44444')
      responseImage = await  this.uploadImage(dateTimeId);
      console.log(responseImage)
      if (responseImage === '') {
        loading.dismiss();
        return
      }
    }

    await this.getGps();

    try { 
      const idDocEvidence: any = await this._EvidenceService.createEvidence(
        this.user,
        responseImage,
        responseAudio,
        this.title,
        this.description,
        this.state,
        this.town,
        this.colony,
        this.coords.latitude,
        this.coords.longitude,
        this.location.lat,
        this.location.lng
      );


      await this._EvidenceService.createEvidenceByUser(
        idDocEvidence,
        this.user,
        responseImage,
        responseAudio,
        this.title,
        this.description,
        this.state,
        this.town,
        this.colony,
        this.coords.latitude,
        this.coords.longitude,
        this.location.lat,
        this.location.lng
      );

      loading.dismiss();
      this.presentToast('Evidencia creada', 'success');
      this.duration = 0;
      this.title = '';
      this.description = '';
      this.state = '';
      this.town = '';
      this.colony = '';
      this.imageUrl = '';
      this.audioUrl = '';
    } catch (error) {
      console.log(error)
      loading.dismiss();
     this.presentToast('Error al subir la evidencia', 'danger'); 
    }
  }

  async getGps() {
    try {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      const coordinates = await Geolocation.getCurrentPosition(options)
      this.coords.latitude = coordinates.coords.latitude;
      this.coords.longitude = coordinates.coords.longitude;
      return;
    } catch (error) {
      // this.coords = { latitude: 0, longitude: 0};
      // this.presentToast('No se puede obtener su ubicacion','danger');
      // this.gpsOffModal();
      return;
    }
  }

  async uploadAudio(dateTimeId: any) {
		return new Promise((resolve, rejects) => {
		if (this.audioUrl === '') {
			resolve('');
		}
		this.userBucketPath2 = `userEvidence/audioIds/${this.user.uid}-${dateTimeId}.mp3`;
		const fileRef = this._BucketStorage.ref(this.userBucketPath2);
    this.task2 = this._BucketStorage.ref(this.userBucketPath2).putString(this.audioUrl, 'data_url');

      // observe percentage changes
      this.uploadPercent2 = this.task2.percentageChanges();

			this.task2.snapshotChanges().pipe(
        finalize(() => {

          this.downloadURL2 = fileRef.getDownloadURL();
          this.downloadURL2.subscribe(async (url: any) => {
						resolve(url);
          },(e: any) => {
						resolve('')
						this.presentToast(`Problemas al subir el audio - ${e}`, 'danger')
					})
        })
      ).subscribe(() => {

			},(error: any) => {
				resolve('')
				this.presentToast('Problemas al subir el audio', 'danger')
			})
		})
	}


  async uploadImage(dateTimeId: any) {
		return new Promise((resolve, rejects) => {
		if (this.imageUrl === '') {
			resolve('');
		}
		this.userBucketPath = `userEvidence/imageIds/${this.user.uid}-${dateTimeId}.jpeg`;
		const fileRef = this._BucketStorage.ref(this.userBucketPath);
    this.task = this._BucketStorage.ref(this.userBucketPath).putString(this.imageUrl, 'data_url');

      // observe percentage changes
      this.uploadPercent = this.task.percentageChanges();

			const url = this.task.snapshotChanges().pipe(
        finalize(() => {

          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(async (url: any) => {
            console.log(url)
						resolve(url);
          },(e: any) => {
						resolve('')
						this.presentToast(`Problemas al subir la imagen - ${e}`, 'danger')
					})
        })
      ).subscribe(() => {
        
			},(error: any) => {
				resolve('')
				this.presentToast('Problemas al subir la imagen', 'danger')
			})
		})
	}
}
