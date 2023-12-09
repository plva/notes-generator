import fs from 'fs';
import yaml from "js-yaml";
import {parseMarkdownFile} from './parseMarkdown.js';
// const parseMarkdownFile = require('./parseMarkdownFile');

import {unified} from 'unified';
import remarkStringify from 'remark-stringify';

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

// // Example YAML content for testing
// const yamlContent = `
// DetailedOverview:
//   - Personal.md:
//       Journal: "Reflections and personal experiences."
//       Contacts: "List of personal and professional contacts."
//       Personal Tasks: "Detailed list of personal tasks and errands."
//   - Other.md:
//       Something Else: "Reflections and something elseexperiences."
//       Two: "description of two"
//       Three: "Three description"
// `;
//
// // Setup readline interface
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
//
// rl.question('Enter the base directory path: ', function (basePath) {
//   parseAndGenerateStructure(yamlContent, basePath);
//   rl.close();
// });
function main() {
    const yamlContent = `
        DetailedOverview:
        - Personal.md:
            Journal: "Reflections and personal experiences."
            Contacts: "List of personal and professional contacts."
            Personal Tasks: "Detailed list of personal tasks and errands."
        - Other.md:
            Something Else: "Reflections and something elseexperiences."
            Two: "description of two"
            Three: "Three description"
        - Personal.md:
            Journal: "Reflections and personal experiences."
            Contacts: "List of personal and professional contacts."
            Personal Tasks: "Detailed list of personal tasks and errands."
        - Spiritual.md:
            StudyNotes: "Notes from religious studies or readings."
            Practices: "Details of religious practices or routines."
        - ProfessionalDevelopment.md:
            ProjectPlans: "Outlines of ongoing professional projects."
            Workflows: "Descriptions of current work processes and optimizations."
        - Community.md:
            EventsPlanning: "Details of upcoming community events."
            MemberEngagement: "Strategies for engaging with community members."
        - TeachingAndMentorship.md:
            CourseMaterials: "Overviews of educational materials."
            MentorshipActivities: "Plans and notes for mentorship sessions."
`;

    const basePath = process.argv[2];

    if (basePath) {
        parseAndGenerateStructure(yamlContent, basePath);
    } else {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter the base directory path: ', function (inputPath) {
            parseAndGenerateStructure(yamlContent, inputPath);
            rl.close();
        });
    }
}

// main();


// Specify the path to your Markdown file
// const filePath = './generated/DetailedOverview/Personal.md';
const filePath = './generated/DetailedOverview/main.md';

// Call the function to parse the Markdown and obtain the AST
// const ast = parseMarkdownFile(filePath)
//   .then((ast) => {
//     return ast;
//   }).catch((error) => {
//     console.error(error);
//   });
const ast = await parseMarkdownFile(filePath);
const j = JSON.stringify(ast, null, 2);

// Now you can work with the AST as needed
// console.log(j);

const markdownOutput = unified()
    .use(remarkStringify)
    .stringify(ast);
console.log(markdownOutput)
