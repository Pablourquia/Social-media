import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { FeedComponent } from './components/feed/feed.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'user-details',
        component: UserDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'feed',
        component: FeedComponent,
        canActivate: [AuthGuard]
    }
];
