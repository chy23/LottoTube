const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Use a unique delimiter to safely split commits, including bodies with newlines
  const format = '---COMMIT---%n%H%n%ad%n%s%n%b';
  const logOutput = execSync(`git log --pretty=format:"${format}" --date=iso`).toString();
  
  const rawCommits = logOutput.split('---COMMIT---').map(c => c.trim()).filter(c => c.length > 0);
  
  // Reverse to start from the oldest commit for semantic versioning
  rawCommits.reverse();

  let changelog = [];
  let major = 1;
  let minor = 0;
  let patch = 0;

  const outDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let existingData = {};
  try {
    const existingFile = fs.readFileSync(path.join(outDir, 'changelog.json'), 'utf-8');
    const existing = JSON.parse(existingFile);
    existing.forEach(item => {
      existingData[item.id] = item;
    });
  } catch (e) {}

  rawCommits.forEach((commitBlock) => {
    const lines = commitBlock.split('\n');
    const hash = lines[0];
    const dateStr = lines[1];
    const subject = lines[2] || '';
    const body = lines.slice(3).join('\n').trim();
    
    // Skip merge commits or trivial commits if necessary
    if (subject.startsWith('Merge branch')) return;
    
    const subjectLower = subject.toLowerCase();
    const isFeature = subjectLower.includes('feat:') || subjectLower.includes('feature:');
    const isFix = subjectLower.includes('fix:') || subjectLower.includes('bug');
    const isEnhance = subjectLower.includes('enhance:') || subjectLower.includes('refactor:');
    
    // Version logic
    if (isFeature) {
      minor++;
      patch = 0;
    } else if (isFix || isEnhance) {
      patch++;
    } else {
      patch++; // default bump
    }
    
    const version = `v${major}.${minor}.${patch}`;
    const date = dateStr.split(' ')[0]; // yyyy-mm-dd
    
    // Parse title and tags
    let title = subject;
    let typeTag = '';
    
    if (subject.includes(':')) {
      const splitIdx = subject.indexOf(':');
      typeTag = subject.substring(0, splitIdx).trim();
      title = subject.substring(splitIdx + 1).trim();
    }
    
    const existingItem = existingData[hash];
    
    changelog.unshift({
      id: hash,
      version,
      date,
      typeTag: existingItem?.typeTag || typeTag,
      title: existingItem?.title || title,
      details: existingItem?.details || body || title,
      isFix: existingItem !== undefined ? existingItem.isFix : isFix
    });
  });

  fs.writeFileSync(path.join(outDir, 'changelog.json'), JSON.stringify(changelog, null, 2));
  console.log(`Changelog generated successfully with ${changelog.length} records.`);

} catch (error) {
  console.error('Failed to generate changelog:', error.message);
  process.exit(1);
}
