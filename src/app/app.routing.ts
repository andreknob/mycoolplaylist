import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { ResultComponent } from './component/result/result.component';

const appRoutes: Routes = [
  {
    path: 'authenticated/:jwt',
    component: AuthenticatedComponent,
  },
  {
    path: 'result',
    component: ResultComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
