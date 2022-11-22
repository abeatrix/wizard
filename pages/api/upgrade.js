const { copyFileSync, writeFile } = require('fs');
const { execSync } = require('child_process');

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(400).json({ Error: 'Method not allowed.' });
  }
  const uri = new URL(req.url);
  const size = uri.searchParams.get('size') || 'XS';
  const version = uri.searchParams.get('version') || '';
  // Save size to root disk
  writeFile('/home/sourcegraph/.sourcegraph-size', size);
  // Save version to root disk
  writeFile('/home/sourcegraph/.sourcegraph-version', version);
  // Configure override file
  copyFileSync(
    `/home/sourcegraph/deploy/install/override.${size}.yaml`,
    '/home/sourcegraph/deploy/install/override.yaml'
  );
  console.log('Running upgrade script for size ', size);
  const response = execSync(
    'bash /home/sourcegraph/SetupWizard/scripts/upgrade.sh'
  ).toString();
  if (response.startsWith('Done')) {
    return res.status(200).json('Passed');
  } else {
    return res.status(400).json('Upgrade Failed: No upgrade for new instance');
  }
}
