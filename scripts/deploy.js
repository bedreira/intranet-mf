const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yargs = require('yargs');

// === CONFIGURATION ===
const IIS_SITE_NAME = 'IntranetMFDemo'; // Your IIS app pool name
const DEPLOY_ROOT = 'C:\\inetpub\\wwwroot\\IntranetMFDemo\\apps'; // Deploy to .../apps

const APPS = [
  { name: 'intranet', isHost: true },
  { name: 'examplePageRemoteOne', isHost: false },
  { name: 'examplePageRemoteTwo', isHost: false },
  { name: 'examplePageRemoteThree', isHost: false },
  { name: 'examplePageRemoteFour', isHost: false }
];

// web.config for host (SPA) - staticContent removed
const HOST_WEB_CONFIG = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
            <add input="{REQUEST_URI}" pattern=".(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>`;

// web.config for remotes (no rewrite)
const REMOTE_WEB_CONFIG = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".mjs" mimeType="application/javascript" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="*" />
        <add name="Access-Control-Allow-Methods" value="GET, POST, OPTIONS" />
        <add name="Access-Control-Allow-Headers" value="Content-Type" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`;

const argv = yargs
  .option('refreshpool', {
    alias: 'r',
    type: 'boolean',
    description: 'Restart the application pool',
    default: false,
  })
  .option('app', {
    alias: 'a',
    type: 'string',
    description: 'Deploy a specific app only (e.g. examplePageRemoteOne)',
    default: '',
  }).argv;

function exec(command) {
  console.log(`→ Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(`Source directory does not exist: ${source}`);
  }
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  for (const entry of fs.readdirSync(source)) {
    const srcPath = path.join(source, entry);
    const destPath = path.join(destination, entry);
    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writeWebConfig(appPath, isHost) {
  const configContent = isHost ? HOST_WEB_CONFIG : REMOTE_WEB_CONFIG;
  fs.writeFileSync(path.join(appPath, 'web.config'), configContent);
}

function updateVersion(appName) {
  // Path to the version.json for this app
  const versionFile = path.join(__dirname, '..', 'apps', appName, 'src', 'assets', 'version.json');
  try {
    let versionData = { version: '1.0.0', buildDate: '' };
    if (fs.existsSync(versionFile)) {
      versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
    }
    const [major, minor, patch] = versionData.version.split('.').map(Number);
    versionData.version = `${major}.${minor}.${patch + 1}`;
    versionData.buildDate = new Date().toISOString();
    fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));
    console.log(`Updated version for ${appName} to ${versionData.version}`);
    return versionData;
  } catch (err) {
    console.error(`Failed to update version for ${appName}:`, err.message);
    return null;
  }
}

function deployApp(appName, isHost) {
  // Update version before build
  const versionData = updateVersion(appName);

  const distPath = path.join('dist', 'apps', appName);
  const deployPath = path.join(DEPLOY_ROOT, appName);

  // Debug output
  console.log(`DEBUG: distPath=${distPath}, deployPath=${deployPath}`);

  console.log(`Deploying ${appName} to ${deployPath}`);

  // Build the app
  exec(`nx build ${appName} --configuration=production`);

  // Copy build output
  copyDirectory(distPath, deployPath);

  // Write the correct web.config
  writeWebConfig(deployPath, isHost);

  console.log(`Deployed ${appName} to ${deployPath} (version: ${versionData?.version || 'unknown'})`);
}

function runAppCmd(command) {
  try {
    const output = execSync(`%windir%\\system32\\inetsrv\\appcmd.exe ${command}`, {
      stdio: 'pipe',
      windowsHide: true
    }).toString();
    console.log(`AppCmd output: ${output}`);
    return output;
  } catch (error) {
    console.error(`AppCmd failed: ${command}\n${error.message}`);
    throw error;
  }
}

async function restartAppPool() {
  if (!argv.refreshpool) {
    console.log('ℹSkipping IIS app pool restart.');
    return;
  }
  try {
    console.log('Restarting IIS app pool...');
    runAppCmd(`stop apppool "${IIS_SITE_NAME}"`);
    await new Promise(res => setTimeout(res, 2000));
    runAppCmd(`start apppool "${IIS_SITE_NAME}"`);
    await new Promise(res => setTimeout(res, 3000));
    console.log('Application pool restarted.');
  } catch (error) {
    console.error('Error restarting IIS pool:', error.message);
    process.exit(1);
  }
}

async function main() {
  if (argv.app) {
    const app = APPS.find(a => a.name === argv.app);
    if (!app) {
      console.error(`App '${argv.app}' not found in config.`);
      console.log('Available apps:', APPS.map(a => a.name).join(', '));
      process.exit(1);
    }
    deployApp(app.name, app.isHost);
  } else {
    for (const app of APPS) {
      deployApp(app.name, app.isHost);
    }
  }
  await restartAppPool();
  console.log('Deployment complete!');
}

main(); 