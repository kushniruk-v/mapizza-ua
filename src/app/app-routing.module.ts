import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { AdditionalComponentsComponent } from './admin/additional-components/additional-components.component';
import { UserprofileComponent } from './pages/userprofile/userprofile.component';
export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'userprofile', component:UserprofileComponent},
  { path: 'about-us', component: AboutUsComponent },
  { path: 'auth', component: AuthorizationComponent },
 
  {
    path: 'kontakty',
    loadChildren: () =>
      import('./pages/kontakty/kontakty.module').then((m) => m.KontaktyModule),
  },
  {
    path: 'career',
    loadChildren: () =>
      import('./pages/career/career.module').then((m) => m.CareerModule),
  },
  {
    path: 'favorite',
    loadChildren: () =>
      import('./pages/favorite/favorite.module').then((m) => m.FavoriteModule),
  },

  {
    path: 'dostavka',
    loadChildren: () =>
      import('./pages/dostavka/dostavka.module').then((m) => m.DostavkaModule),
  },
  {
    path: 'actions',
    loadChildren: () =>
      import('./pages/actions/actions.module').then((m) => m.ActionModule),
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./pages/news/news.module').then((m) => m.NewsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/tovary/tovary.module').then((m) => m.TovaryModule),
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'additional-components',
        component: AdditionalComponentsComponent,
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
