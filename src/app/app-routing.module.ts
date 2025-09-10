import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginGuard } from './guards/login/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'promotions',
    loadChildren: () => import('./modals/promotions/promotions.module').then( m => m.PromotionsPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./modals/messages/messages.module').then( m => m.MessagesPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./modals/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./modals/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'admin-page',
    loadChildren: () => import('./pages/admin-page/admin-page.module').then( m => m.AdminPagePageModule)
  },
  {
    path: 'admin-register-list',
    loadChildren: () => import('./modals/admin-register-list/admin-register-list.module').then( m => m.AdminRegisterListPageModule)
  },
  {
    path: 'add-user-insumo',
    loadChildren: () => import('./modals/add-user-insumo/add-user-insumo.module').then( m => m.AddUserInsumoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
