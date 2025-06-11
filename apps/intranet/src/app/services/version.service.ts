import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface VersionInfo {
  version: string;
  buildDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private currentVersion = new BehaviorSubject<VersionInfo | null>(null);
  private lastCheckTime: string | null = null;

  constructor(private snackBar: MatSnackBar) {
    console.log('VersionService constructor called');
    this.loadVersion();
  }

  private async loadVersion(): Promise<void> {
    console.log('Loading initial version...');
    try {
      const response = await fetch('/assets/version.json', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const version = await response.json();
      console.log('Initial version loaded:', version);
      this.currentVersion.next(version);
      this.lastCheckTime = version.buildDate;
    } catch (error) {
      console.error('Error loading version:', error);
    }
  }

  async checkForUpdates(): Promise<void> {
    console.log('checkForUpdates called');
    console.log('Current lastCheckTime:', this.lastCheckTime);
    
    try {
      const response = await fetch(`/assets/version.json?t=${new Date().getTime()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newVersion = await response.json();
      console.log('New version check response:', newVersion);
      
      console.log('Version comparison:', {
        current: this.lastCheckTime,
        new: newVersion.buildDate
      });

      if (this.lastCheckTime && newVersion.buildDate > this.lastCheckTime) {
        console.log('New version detected!');
        this.showUpdateNotification(newVersion);
        this.lastCheckTime = newVersion.buildDate;
      } else {
        console.log('No new version available');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  private showUpdateNotification(version: VersionInfo): void {
    console.log('Showing update notification for version:', version.version);
    const snackBarRef = this.snackBar.open(
      `New version ${version.version} is available!`,
      'Refresh',
      {
        duration: 0,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['version-update-snackbar']
      }
    );

    snackBarRef.onAction().subscribe(() => {
      console.log('User clicked refresh');
      window.location.reload();
    });
  }

  getCurrentVersion(): Observable<VersionInfo | null> {
    return this.currentVersion.asObservable();
  }
} 