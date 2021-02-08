import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { DeleteComponent } from './delete/delete.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [  
  { path: '',
    redirectTo: 'delete',
    pathMatch: 'full'
  },
  { 
    path: 'delete', component: DeleteComponent ,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
