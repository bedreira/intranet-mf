import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VersionService } from './services/version.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VersionInfo } from './services/version.service';
import { NxWelcomeComponent } from './nx-welcome.component';

import { RouterOutlet } from '@angular/router';


@Component({
  imports: [RouterModule, RouterOutlet, NxWelcomeComponent],
  selector: 'intranet-mf-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent implements OnInit {
  title = 'intranet';

  constructor(
    private versionService: VersionService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    console.log('AppComponent initialized');
    // Subscribe to version changes
    this.versionService.getCurrentVersion().subscribe(version => {
      if (version) {
        console.log('Current version:', version);
      }
    });

    // Check for updates on initial load
    console.log('Checking for updates on initial load');
    this.versionService.checkForUpdates();
  }

  @HostListener('window:focus', ['$event'])
  onWindowFocus(event: FocusEvent) {
    console.log('Window focus event triggered', event);
    this.versionService.checkForUpdates();
  }

  @HostListener('document:click', ['$event'])
  onWindowClick(event: MouseEvent) {
    console.log('Click event triggered', event);
    this.versionService.checkForUpdates();
  }

  @HostListener('document:scroll', ['$event'])
  onWindowScroll(event: Event) {
    console.log('Scroll event triggered', event);
    this.versionService.checkForUpdates();
  }

  showUpdateNotification(version: VersionInfo) {
    const snackBarRef = this.snackBar.open(
      `New version ${version.version} is available!`,
      'Refresh',
      {
        duration: 10000, // Show for 10 seconds
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['version-update-snackbar']
      }
    );

    snackBarRef.onAction().subscribe(() => {
      window.location.reload();
    });
  }
}