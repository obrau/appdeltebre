import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { GlobalVars } from './app.environment';
import { Role } from '../models/roles';
import { HistoryPage } from '../pages/history/history';
import { User } from '../models/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;

  pages: Array<{title: string, component: any, icon: string}>;
  rootPage: any = LoginPage;
  profileObservable;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public authProvider: AuthProvider,
    private globalVars: GlobalVars,
  ) {
    this.initializeApp();
  }

  /**
   * Mètode per anar a la pàgina indicada per paràmetre.
   * El cas d'anar a la pàgina login s'ha de fer primer 
   * un logout.
   * 
   * @param page Pàgina a la que es desitja anar.
   */
  goToPage(page: any){
    if(page.name == 'LoginPage') {
      this.authProvider.signOut();
      this.globalVars.user = null;
    }
    
    else if (this.nav.indexOf(page) < 0) {
      this.nav.push(page);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getMainPage();
    });
  }

    /**
   * Mètode per configurar el menú lateral en funció
   * del rol de l'usuari actual.
   */
  private configRolePages() {
    if (this.globalVars.user.role == Role.normal) {
      this.pages = [
        { title: 'Historial',     component: HistoryPage,     icon: 'archive'},
        { title: 'Desconectar',   component: LoginPage,       icon: 'power'},
      ]
      console.log('normal user');

    } else if (this.globalVars.user.role == Role.admin) {
      this.pages = [
        { title: 'Historial',     component: HistoryPage,     icon: 'archive'},
        { title: 'Desconectar',   component: LoginPage,       icon: 'power'},
      ]
      console.log('admin user');
      
    } else {
      this.pages = []
      console.log('unauthorized user');
    }
  }

  private getMainPage() {
    this.authProvider.getProfile().subscribe((user: User) => { 
      this.globalVars.user = user;
      this.goToMainPage();
    });
  }

  private goToMainPage() {
    if(this.globalVars.user.role == Role.admin) this.rootPage = HomePage; // HomeAdminPage
    else if(this.globalVars.user.role == Role.normal) this.rootPage = HomePage;
    else this.rootPage = LoginPage;

    this.configRolePages();
    this.globalVars.initLoading.dismiss();
  }
}
