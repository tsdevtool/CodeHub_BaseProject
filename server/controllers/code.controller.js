import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

// Define language mappings for file extensions
const LANGUAGE_EXTENSIONS = {
  javascript: 'js',
  python: 'py',
  java: 'java',
};

// Define execution commands for each language
const EXECUTION_COMMANDS = {
  javascript: (filePath) => `node ${filePath}`,
  python: (filePath) => `python3 ${filePath}`,
  java: (filePath) => {
    const dirPath = path.dirname(filePath);
    const className = path.basename(filePath, '.java');
    return `cd ${dirPath} && javac ${className}.java && java ${className}`;
  },
};

// Set a timeout limit for execution (in milliseconds)
const EXECUTION_TIMEOUT = 10000; // 10 seconds

export const executeCode = (req, res) => {
  const { language, sourceCode } = req.body;
  
  // Validate input
  if (!language || !sourceCode) {
    return res.status(400).json({ error: 'Language and source code are required' });
  }
  
  if (!LANGUAGE_EXTENSIONS[language]) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }
  
  // Create a temporary file with a unique name
  const tempDir = os.tmpdir();
  const fileId = uuidv4();
  const extension = LANGUAGE_EXTENSIONS[language];
  const fileName = `code-${fileId}.${extension}`;
  const filePath = path.join(tempDir, fileName);
  
  // Write the source code to the temporary file
  fs.writeFile(filePath, sourceCode, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to write temporary file' });
    }
    
    // Get the execution command for the language
    const execCommand = EXECUTION_COMMANDS[language](filePath);
    
    // Execute the code
    exec(execCommand, { timeout: EXECUTION_TIMEOUT }, (error, stdout, stderr) => {
      // Delete the temporary file regardless of execution result
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete temporary file:', unlinkErr);
        
        // Handle execution results
        if (error) {
          // Command execution failed or timed out
          return res.status(200).json({
            output: stderr || error.message || 'Execution failed',
            error: true
          });
        }
        
        // Success - return output
        return res.status(200).json({ 
          output: stdout,
          error: false
        });
      });
    });
  });
};
