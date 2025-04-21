import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  async getEvents() {
    return new Promise((resolve) => {
			this.afs.collection('events').ref.where('active', '==', true).get().then((doc) => {
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

  async addEventUserLocationClick(user: any, event: any) {
    let fire1 = this.afs;
    let fire2 = this.afs;
    return new Promise((resolve, reject) => {
      fire1
        .collection('eventsClick')
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

          customerId: event.customerId,
          eventName: event.name,
          eventUid: event.uid,
          eventDate: event.date,
          eventFullData: event
        })
        .then(function (dataAux) {
          fire2.collection('eventsClick').doc(dataAux.id).update({
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


  async eventRegistrationInEvent(id: string, user: any, event: any) {
    let fire1 = this.afs;
    let fire2 = this.afs;
    return new Promise((resolve, reject) => {
      fire1
        .collection('events').doc(id).collection('eventRegistration')
        .add({
          idDoc: '',
          eventId: id,
          uidUser: user.uid,
          name: user.name,
          lastName: user.lastName,
          secondLastName: user.secondLastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          date: moment().format(),
          dateRegister: moment().format(),
          dateFormat: moment().format('DDDD-MM-YY'),
          dateTimeStamp: new Date(moment().format()),

          customerId: event.customerId,
          eventName: event.name,
          eventUid: event.uid,
          eventDate: event.date,
          eventFullData: event
        })
        .then(function (dataAux: any) {
          fire2.collection('events').doc(id).collection('eventRegistration').doc(dataAux.id).update({
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

  async eventRegistrationInEventGlobal(id: string, user: any, event: any, idSub: any) {
    let fire1 = this.afs;
    let fire2 = this.afs;
    return new Promise((resolve, reject) => {
      fire1
        .collection('eventRegistration').doc(idSub)
        .set({
          idDoc: idSub,
          eventId: id,
          uidUser: user.uid,
          name: user.name,
          lastName: user.lastName,
          secondLastName: user.secondLastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          date: moment().format(),
          dateRegister: moment().format(),
          dateFormat: moment().format('DDDD-MM-YY'),
          dateTimeStamp: new Date(moment().format()),

          customerId: event.customerId,
          eventName: event.name,
          eventUid: event.uid,
          eventDate: event.date,
          eventFullData: event
        })
          .then(function (dataAux: any) {
            resolve(true);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
