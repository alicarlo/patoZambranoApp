import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, sendEmailVerification, UserCredential, UserInfo } from 'firebase/auth';
import * as moment from 'moment';
import { UserForm } from 'src/app/modals/interfaces/interfaces';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
  ) { }

  public async setDataUser(dataUser : any): Promise<void>{
		// localStorage.setItem('userData', JSON.stringify(dataUser));
     await Storage.set({
      key: 'userDataPato',
      value: JSON.stringify(dataUser)
    });
	}

	public async  getDataUser() {
		/*const aux: any = localStorage.getItem('userData');
		return  JSON.parse(aux);
    */
    const { value } = await Storage.get({ key: 'userDataPato' });
    if (value) {
      const user = JSON.parse(value);
      return user;
    }
	}

  async clearData() {
		//localStorage.removeItem('userData');
    await Storage.remove({ key: 'userDataPato' });
    await Storage.clear();
    return;
		// return
	}

	async loggedInDataUser(): Promise<boolean> {
    try {
      const { value } = await Storage.get({ key: 'userDataPato' });
      return !!value && !!JSON.parse(value);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return false;
    }
  }

  async signout() {
    await this.clearData();
    return this.auth.signOut();
  }

  signup(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          resolve(userCredential);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  loginFire(email: string, password: string) {
		return new Promise((resolve) => {
			this.auth.signInWithEmailAndPassword(email, password).then((response: any) => {
				if (!response.user.emailVerified) {
					resolve({ flag: 2, msg: 'Verificacion de correo requerida' })
				}

				resolve({ flag: 3, msg: 'Inicio de sesion exitoso', uid:  response.user.uid})

			}).catch((error) => {
				const errorSend = { flag: 1, msg: '' }
				if(error.code === 'auth/too-many-requests') {
					errorSend.msg = 'Demasiados intentos, vuelva a intentar en 1 minuto';
				}else
				if(error.code === 'auth/user-not-found'){
					errorSend.msg = 'Credenciales invalidas';
				}else
				if(error.code === 'auth/wrong-password'){
					errorSend.msg = 'Credenciales invalidas';
				}else
				if(error.code === 'auth/invalid-email'){
					errorSend.msg = 'Credenciales invalidas';
				}else
				if(error.code ===  'auth/invalid-credential') {
					errorSend.msg = 'Credenciales invalidas';
				}
				resolve(errorSend);
			})
		})
	}

  loginGetDataFire(uid: string) {
		return new Promise((resolve) => {
			this.afs.collection('users').doc(uid).ref.get().then(function(doc) {
        if(doc.exists) {
					resolve(doc.data());
        }else{
          resolve(false)
        }
      }).catch(function(error) {
				resolve(false)
        console.log("Error getting document:", error);
      });
		})
	}

  sendVerificationMail() {
    return this.auth.currentUser.then((currentUser: any) => {
      return currentUser.sendEmailVerification();
    })
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }

  async createUser(user: UserForm , uid: string, auth: any,  keyConst: any, type: string, userCreate: any, flag: number) {
    let fire1 = this.afs;
    let fire2 = this.afs;
    console.log(user)
    return new Promise((resolve, reject) => {
      if (flag === 1) {
      fire1
        .collection('users').doc(uid)
        .set({
          idDoc: uid,
          uid: uid,
          name: user.name,
          lastName: user.lastName,
          secondLastName: user.secondLastName,
          user_keywords: keyConst.user_keywords,
          email: user.email,
          emailVerified: auth.emailVerified,
          date: moment().format(),
          dateFormat: moment().format('DDDD-MM-YY'),
          dateTimeStamp: new Date(moment().format()),
          photoUrl: '',
          status: '',
          role: 'user',
          type: type,
          userCreate: userCreate,
          dob: user.dob,
          gender: user.gender,
          age: user.age,
          phoneNumber: user.phoneNumber,
          address: user.address,
          colony: user.colony,
          state: user.state,
          town: user.town,
          postalCode: user.postalCode,
          token: '',
          customerId: "bnhTylS19PZVCQwtN3z8",
          customerName: "Pato Zambrano"
        })
        .then(function (dataAux) {
          resolve(true);
        })
        .catch(function (error) {
          reject(error);
        });
      }else{
        fire1
        .collection('users')
        .add({
          idDoc: '',
          uid: '',
          name: user.name,
          lastName: user.lastName,
          secondLastName: user.secondLastName,
          user_keywords: keyConst.user_keywords,
          email: '',
          emailVerified: '',
          date: moment().format(),
          dateFormat: moment().format('DDDD-MM-YY'),
          dateTimeStamp: new Date(moment().format()),
          photoUrl: '',
          status: '',
          role: 'user',
          type: type,
          userCreate: userCreate,
          dob: user.dob,
          gender: user.gender,
          age: user.age,
          phoneNumber: user.phoneNumber,
          address: user.address,
          colony: user.colony,
          state: user.state,
          town: user.town,
          postalCode: user.postalCode,
          token: '',
          customerId: "bnhTylS19PZVCQwtN3z8",
          customerName: "Pato Zambrano"
        })
        .then(function (dataAux) {
          fire2.collection('users').doc(dataAux.id).update({
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

      }
    });
  }

  async updateToken(token: string, idDoc: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection('users')
        .doc(idDoc)
        .update({
          token: token,
        })
        .then(() => {
          resolve(true);
        });
    });
  }



  async updateProfileUser(uid: string, userData: any) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection('users')
        .doc(uid)
        .update({
          name: userData.name,
          lastName: userData.lastName,
          secondLastName: userData.secondLastName,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          colony: userData.colony,
          state: userData.state,
          town: userData.town,
          postalCode: userData.postalCode,
          age: userData.age
        })
        .then(() => {
          resolve(true);
        });
    });
  }

  async updateDob(uid: string, age: any, dob: any) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection('users')
        .doc(uid)
        .update({
          dob: dob,
          age: age
        })
        .then(() => {
          resolve(true);
        });
    });
  }

  async getMessagesByUser(uid: string) {
    return new Promise((resolve) => {
      this.afs
        .collection('notify')
        .ref.where('uidUser', '==', uid)
        .get()
        .then(function (doc) {
          if (!doc.empty) {
            let dataSend: any = [];
            doc.forEach((element) => {
              dataSend.push(element.data() as any);
            });
            resolve(dataSend);
          } else {
            resolve(false);
          }
        })
        .catch(function (error) {
          resolve(false);
          console.error('Error getting document:', error);
        });
    });
  }

    async getAllUsers() {
    return new Promise((resolve) => {
      this.afs
        .collection('users')
        .ref.where('type', '!=', 'admin')
        .get()
        .then(function (doc) {
          if (!doc.empty) {
            let dataSend: any = [];
            doc.forEach((element) => {
              dataSend.push(element.data() as any);
            });
            resolve(dataSend);
          } else {
            resolve([]);
          }
        })
        .catch(function (error) {
          resolve(false);
          console.error('Error getting document:', error);
        });
    });
  }

  searchUsersByNameOrLastName(searchTerm: string): Observable<any[]> {
    const lowercaseSearchTerm = searchTerm.toLowerCase();

    return this.afs
      .collection('users', (ref) =>
        ref
          .where('type', '!=', 'admin')
          .where('user_keywords', 'array-contains', lowercaseSearchTerm),
      )
      .valueChanges({ idField: 'id' });
  }

}
