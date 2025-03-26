import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  constructor(
     private afs: AngularFirestore,
  ) { }

  async getPromotions() {
    return new Promise((resolve) => {
			this.afs.collection('promotions').ref.where('active', '==', true).get().then((doc) => {
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
