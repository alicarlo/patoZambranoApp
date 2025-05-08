import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { QrCodeComponent } from 'ng-qrcode';

/*** Angular Fire ****/
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

/*** Environments ***/
import { environment } from '../environments/environment.prod';

//Modals
import { RegisterPageModule } from './modals/register/register.module';
import { ProfilePageModule } from './modals/profile/profile.module';
import { TermsPageModule } from './modals/terms/terms.module';
import { EvidencePageModule } from './modals/evidence/evidence.module';
import { MenuPageModule } from './modals/menu/menu.module';
import { EventsPageModule } from './modals/events/events.module';
import { CreateEvidencePageModule } from './modals/create-evidence/create-evidence.module';
import { VerifyModalPageModule } from './modals/verify-modal/verify-modal.module';
import { PromotionsPageModule } from './modals/promotions/promotions.module';
import { MessagesPageModule } from './modals/messages/messages.module'; 
import { ForgotPasswordPageModule } from './modals/forgot-password/forgot-password.module';
import { QrUserPageModule } from './modals/qr-user/qr-user.module';
import { MessageDobPageModule } from './modals/message-dob/message-dob.module';
import { AdminRegisterListPageModule } from './modals/admin-register-list/admin-register-list.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios',
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    AngularFirestoreModule,
    AppRoutingModule,
    RegisterPageModule,
    ProfilePageModule,
    TermsPageModule,
    EvidencePageModule,
    MenuPageModule,
    EventsPageModule,
    CreateEvidencePageModule,
    VerifyModalPageModule,
    PromotionsPageModule,
    MessagesPageModule,
    ForgotPasswordPageModule,
    QrUserPageModule,
    MessageDobPageModule,
    QrCodeComponent,
    AdminRegisterListPageModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, LaunchNavigator],
  bootstrap: [AppComponent],
})
export class AppModule {}