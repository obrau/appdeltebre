import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { tableNames, globalDefines } from '../../app/app.constants';
import { FIREBASE_CONFIG } from '../../app/app.firebase.config';
import { User } from '../../models/user';
import { UserCreds } from '../../models/user-creds';
import { FirebaseProvider } from '../firebase/firebase';
import { Role } from '../../models/roles';

@Injectable()
export class AuthProvider {

  constructor(
    public afAuth: AngularFireAuth,
    public firebaseService: FirebaseProvider,
    public platform: Platform
  ) {}

  /**
   * get auth state
   */
  get currentUser(): any {
    return this.getAuth().first();
  }

  /**
   * get auth
   */
  getAuth(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  /**
   * Recuperar les dades públiques de l'usuari.
   * 
   * @param uid UID de l'usuari.
   */
  getProfile(uid?: string): Observable<User> {
    if (uid)
      return this.firebaseService.object(tableNames.User + '/' + uid);
    
    return this.getAuth().switchMap((user: firebase.User) => {
      
      if(user) console.log(user.uid);

      // Usuari no autoritzat
      var observable = Observable.create(observer => {
        observer.next({ role: Role.unauthorized } as User);
        observer.complete();
      }) as Observable<User>

      return (user != null) ? this.firebaseService.object(tableNames.User + '/' + user.uid) : observable;
    })
  }

  restorePassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
  }

  /**
   * Fer login a la base de dades amb email i contrasenya.
   * 
   * @param credential Credencials de l'usuari.
   */
  signIn(credential: UserCreds): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.validateEmail(credential.email)) {
        if(this.validateFieldLength(credential.password)) {
          this.afAuth.auth.signInWithEmailAndPassword(credential.email, credential.password).then(() => {
            resolve(true);
          }).catch(err => {
            reject(`El usuario o la contraseña son incorrectos.`);
          })
        }
        else reject(`La contraseña debe tener almenos 6 carácteres.`);
      }
      else reject(`Formato de email incorrecto.`);
    })
  }

  /**
   * Fer logout de la base de dades.
   */
  signOut(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  /**
   * Registrar-se a la base de dades amb email i contrasenya.
   * 
   * @param credential Credencials de l'usuari.
   */
  signUp(credential: UserCreds): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.validateEmail(credential.email)) {
        if(this.validateFieldLength(credential.password)) {
          var secondaryApp = firebase.initializeApp(FIREBASE_CONFIG, "Secondary");
          
          secondaryApp.auth().createUserWithEmailAndPassword(credential.email, credential.password).then(user => {
            secondaryApp.delete();
            resolve(user.uid);
          }).catch(err => {
            reject(`No se ha podido crear el usuario.`);
          })
        }
        else reject(`La contraseña debe tener almenos 6 carácteres.`);
      }
      else reject(`Formato de email incorrecto.`);
    })
  }

  /**
   * Comprovar si un string té format d'adreça email.
   * 
   * @param field String a comprovar.
   */
  private validateEmail(field: string): boolean {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(field);
  }

  /**
   * Comprovar la llargada d'un string.
   * 
   * @param field String a comprovar.
   */
  private validateFieldLength(field: string): boolean {
    return field.length >= globalDefines.minPasswordLength;
  }
}