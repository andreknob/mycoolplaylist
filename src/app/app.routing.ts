import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';

const appRoutes: Routes = [
  {
    path: 'authorized/:id',
    component: HomeComponent,
  },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
