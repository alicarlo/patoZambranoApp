import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
}
