import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { globalDefines } from '../../app/app.constants';
import { User } from '../../models/user';
import { UserCreds } from '../../models/user-creds';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  credentials = {} as UserCreds;

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public authProvider: AuthProvider,
  ) {
  }

  /**
   * Mètode per fer login al sistema. Si l'usuari
   * existeix i s'autentica correctament pot accedir.
   * 
   * @param user Usuari a ser identificat
   */
  login(user: User) {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.authProvider.signIn(this.credentials).then(() => {
      loading.dismiss();
    }).catch(err => {
      loading.dismiss();
      this.showMessage(err);
    })
  }

  /**
   * Mètode per anar a la pàgina de registrar usuari.
   * 
   */
  restorePassword() {
    this.alertCtrl.create({
      title: 'Restablecer contraseña',
      message: 'Se enviará un mensaje para que pueda restablecer la contraseña.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Enviar',
          handler: data => {
            this.authProvider.restorePassword(data.email).then(() => {
              this.showMessage('Mensaje de restauración de contraseña enviado.')
            }).catch(() => {
              this.showMessage('Error al enviar mensaje de restauración.')
            })
          }
        }
      ]
    }).present();
  }

  private showMessage(message: string) {
    this.toastCtrl.create({message: message, duration: globalDefines.defaultToastDuration}).present();
  }
}