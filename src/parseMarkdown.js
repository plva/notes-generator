import {readFileSync} from 'fs';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import {visit} from 'unist-util-visit';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

function removePositions(node) {
  if (node.position) {
    delete node.position;
  }
  if (node.children) {
    node.children = node.children.map(removePositions);
  }
  return node;
}

// Function to increase heading depth
function increaseHeadingDepth(node) {
  if (node.type === 'heading') {
    node.depth += 1;
  }
  if (node.children) {
    node.children = node.children.map(increaseHeadingDepth);
  }
  // console.log(`increasedHeadingDepthast: ${JSON.stringify(node)}`)
  return node;
}

export const parseMarkdownFile = async (filePath) => {

  // Read the Markdown file content
  const markdownContent = readFileSync(filePath, 'utf-8');
  
  // Create a processor using unified and add the remark-parse and remark plugins
  const ast =  unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .parse(markdownContent);
  // const astWithoutPositions = removePositions(ast);
  // console.log(`${JSON.stringify(astWithoutPositions)}`);
  // await processAST(astWithoutPositions);
  // return astWithoutPositions;

  await processAST(ast);
  return ast;
}

async function processAST(ast) {
  visit(ast, 'paragraph', (node, index, parent) => {
    if (node.type === 'paragraph' &&
        node.children.length === 2 &&
        node.children[0].type === 'text' &&
        node.children[0].value.trim() === 'include' &&
        node.children[1].type === 'inlineCode') {
      parseMarkdownFile(node.children[1].value).then(includedAST => {
        const increasedDepthAST = increaseHeadingDepth(includedAST);

       // Create a new heading node with the inlineCode value
        const newHeadingNode = {
          type: 'heading',
          depth: 1, // You can adjust the depth as needed
          children: [
            {
              type: 'text',
              value: node.children[1].value
            }
          ]
        };

        // Insert the new heading at the top of increasedDepthAST
        if (!increasedDepthAST.children) {
          increasedDepthAST.children = [];
        }
        increasedDepthAST.children.unshift(newHeadingNode);

        // Replace the node in the original AST
        if (increasedDepthAST.type === 'heading') {
          parent.children.splice(index, 1, increasedDepthAST);
        } else {
          parent.children.splice(index, 1, increasedDepthAST);
        }
      });
    }
  });
}
