import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  async createEvidence(user: any, imageUrl: string, audioUrl: string, title: string, description: string, state: string, town: string,colony: string,  lat: any, lng: any, latEvidence: any, lngEvidence: any) {
      let fire1 = this.afs;
      let fire2 = this.afs;

      return new Promise((resolve, reject) => {
        fire1
          .collection('evidence')
          .add({
            idDoc: '',
            uid: user.uid,
            name: user.name,
            lastName: user.lastName,
            secondLastName: user.secondLastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            date: moment().format(),
            dateFormat: moment().format('DDDD-MM-YY'),
            dateTimeStamp: new Date(moment().format()),
            audioUrl,
            imageUrl,
            title,
            description,
            state,
            town,
            colony,
            latUser: lat,
            lngUser: lng,
            latEvidence,
            lngEvidence,
            status: 'PENDING',
            customerId: "bnhTylS19PZVCQwtN3z8",
            customerName: "Pato Zambrano",
          })
          .then(function (dataAux) {
            fire2.collection('evidence').doc(dataAux.id).update({
              idDoc: dataAux.id
            }).then(function(data) {
             resolve(dataAux.id);
            }).catch(function(error) {
              console.log(error)
             resolve(false)
            });
          })
          .catch(function (error) {
            reject(error);
          });
      });
    }

    async createEvidenceByUser(idDocEvidenceSample: string,user: any, imageUrl: string, audioUrl: string, title: string, description: string, state: string, town: string, colony: string, lat: any, lng: any, latEvidence: any, lngEvidence: any) {
      let fire1 = this.afs;
      let fire2 = this.afs;

      return new Promise((resolve, reject) => {
        fire1
          .collection('users').doc(user.uid).collection('evidence')
          .add({
            idDoc: '',
            uid: user.uid,
            name: user.name,
            lastName: user.lastName,
            secondLastName: user.secondLastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            date: moment().format(),
            dateFormat: moment().format('DDDD-MM-YY'),
            dateTimeStamp: new Date(moment().format()),
            audioUrl,
            imageUrl,
            title,
            description,
            state,
            town,
            colony,
            latUser: lat,
            lngUser: lng,
            latEvidence,
            lngEvidence,
            status: 'PENDING',
            customerId: "bnhTylS19PZVCQwtN3z8",
            customerName: "Pato Zambrano",
            idDocEvidenceSample: idDocEvidenceSample,
          })
          .then(function (dataAux) {
            fire2.collection('users').doc(user.uid).collection('evidence').doc(dataAux.id).update({
              idDoc: dataAux.id
            }).then(function(data) {
             resolve(true);
            }).catch(function(error) {
              console.log(error)
             resolve(false)
            });
          })
          .catch(function (error) {
            reject(error);
          });
      });
    }

    async getEvidence(uid: string) {
      return new Promise((resolve) => {
        this.afs.collection('users').doc(uid).collection('evidence').ref.get().then((doc) => {
          if(doc.empty){
            resolve(false);
          }else{
            let filterData: any = []
            doc.forEach(element => {
              filterData.push(element.data());
            });
            resolve(filterData)
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    }

    async updateEvidenceByUser(uid: string, idDoc: string, title: string, description: string) {
      return new Promise((resolve, reject) => {
        this.afs
          .collection('users')
          .doc(uid).collection('evidence').doc(idDoc)
          .update({
            title,
            description
          })
          .then(() => {
            resolve(true);
          });
      });
    }

    async updateEvidence(idDoc: string, title: string, description: string) {
      return new Promise((resolve, reject) => {
        this.afs
          .collection('evidence').doc(idDoc)
          .update({
            title,
            description
          })
          .then(() => {
            resolve(true);
          });
      });
    }

}
