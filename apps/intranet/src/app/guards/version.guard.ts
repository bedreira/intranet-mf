import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { VersionService } from '../services/version.service';

@Injectable({
  providedIn: 'root'
})
export class VersionGuard implements CanActivate {
  constructor(
    private versionService: VersionService,
    private router: Router
  ) {
    console.log('VersionGuard initialized');
  }

  canActivate(): boolean {
    console.log('VersionGuard: Checking for updates during navigation');
    // Force check for updates
    setTimeout(() => {
      this.versionService.checkForUpdates();
    }, 1000); // Add a small delay to ensure the app is fully loaded
    return true;
  }
} 