const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const readline = require('readline');

function createMarkdownFile(filePath, content) {
  fs.writeFileSync(filePath, content);
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateMarkdownContent(sectionData) {
  let content = '';
  for (const [section, text] of Object.entries(sectionData)) {
    content += `# ${section}\n${text}\n\n`;
  }
  return content;
}

function parseAndGenerateStructure(yamlContent, basePath) {
  const structure = yaml.load(yamlContent);

  function createStructure(currentStructure, currentPath) {
    if (Array.isArray(currentStructure)) {
      currentStructure.forEach(item => createStructure(item, currentPath));
    } else {
      for (const [key, value] of Object.entries(currentStructure)) {
        if (key.endsWith('.md')) {
          const filePath = path.join(currentPath, key);
          const markdownContent = generateMarkdownContent(value);
          createMarkdownFile(filePath, markdownContent);
        } else {
          const dirPath = path.join(currentPath, key);
          createDirectory(dirPath);
          createStructure(value, dirPath);
        }
      }
    }
  }

  createStructure(structure, basePath);
}

// Example YAML content for testing
const yamlContent = `
DetailedOverview:
  - Personal.md:
      Journal: "Reflections and personal experiences."
      Contacts: "List of personal and professional contacts."
      Personal Tasks: "Detailed list of personal tasks and errands."
`;

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the base directory path: ', function (basePath) {
  parseAndGenerateStructure(yamlContent, basePath);
  rl.close();
});
