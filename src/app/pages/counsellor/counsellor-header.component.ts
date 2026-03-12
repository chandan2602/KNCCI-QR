import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-counsellor-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header>
      <div class="topbar d-flex align-items-center">
        <nav class="navbar navbar-expand-lg ps-0 w-100">
          <!-- Logo -->
          <div class="header-logo-area">
            <a [routerLink]="['/counsellor-page']">
              <img src="../../assets/kncci-img/header-kncci-logo.png" class="img-fluid" alt="logo" style="max-width: 180px;">
            </a>
          </div>

          <!-- Mobile Toggle -->
          <div class="mobile-toggle-menu d-lg-none ms-auto"><i class='bx bx-menu'></i></div>

          <!-- Navigation Menu -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav main-menu ms-auto align-items-center">
              <!-- Counsellor Dashboard -->
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/counsellor-page']" routerLinkActive="active">
                  <i class='bx bx-home-circle me-2'></i>
                  Counsellor Dashboard
                </a>
              </li>

              <!-- Application Management -->
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/counselor-dashboard']" routerLinkActive="active">
                  <i class='bx bx-file-blank me-2'></i>
                  Application Management
                </a>
              </li>

              <!-- Notifications -->
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle position-relative" href="#" role="button" data-bs-toggle="dropdown">
                  <i class='bx bx-bell'></i>
                  <span class="notification-badge">0</span>
                </a>
                <div class="dropdown-menu dropdown-menu-end notification-dropdown">
                  <div class="msg-header">
                    <p class="msg-header-title">Notifications</p>
                  </div>
                  <div class="text-center p-3">
                    <p class="text-muted">No new notifications</p>
                  </div>
                </div>
              </li>

              <!-- Profile Dropdown -->
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                  <img src="https://i.pinimg.com/736x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg" class="user-avatar" alt="user avatar">
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li class="dropdown-header">
                    <div class="user-info-dropdown">
                      <p class="user-name-dropdown mb-0">{{userName}}</p>
                      <p class="user-role-dropdown mb-0">Counsellor</p>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="javascript:;">
                    <i class="bx bx-user"></i> Profile
                  </a></li>
                  <li><a class="dropdown-item" [routerLink]="['/counsellor-page']">
                    <i class='bx bx-home-circle'></i> Dashboard
                  </a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="javascript:;" (click)="changePassword()">
                    <i class='bx bx-lock'></i> Change Password
                  </a></li>
                  <li><a class="dropdown-item" href="javascript:;" (click)="logout()">
                    <i class='bx bx-log-out-circle'></i> Logout
                  </a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./counsellor-header.component.css']
})
export class CounsellorHeaderComponent implements OnInit {
  userName: string = 'Counsellor';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // Get counsellor name from session storage or service
    this.userName = sessionStorage.getItem('Username') || 'Counsellor';
  }

  logout(): void {
    console.log('Logging out counsellor...');
    this.loginService.counselorLogout();
  }

  changePassword(): void {
    console.log('Change password functionality');
    // Implement change password functionality
  }
}