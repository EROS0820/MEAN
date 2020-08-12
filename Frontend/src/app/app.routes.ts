import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: './client/client.module#ClientModule'
    },
    {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule'
    }
];
