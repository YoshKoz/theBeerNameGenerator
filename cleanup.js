const fs = require('fs');
const path = require('path');

/**
 * List of files and folders to delete
 */
const itemsToDelete = [
    'node_modules',    // Node.js dependencies folder
    'dist',            // Build artifacts
    'build',           // Additional build folder
    'coverage',        // Test coverage reports
    '*.log',           // Log files
    '.DS_Store',       // macOS directory metadata
    'Thumbs.db',       // Windows thumbnail cache
    'old_version.js',  // Example of outdated files
    'OLDNEWBEERGENERATOR', // Old version of the project
    'lists',           // Duplicate data files
    'BeerPotionGenerator.iml', // Old project file
];

/**
 * Deletes a file or folder from the project directory
 * @param {string} filePath
 */
function deleteItem(filePath) {
    // Check if path exists
    if (fs.existsSync(filePath)) {
        // If it is a directory, recursively delete its contents
        if (fs.lstatSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
            console.log(`Deleted folder: ${filePath}`);
        } else {
            // Delete file
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
    }
}

/**
 * Recursively find and remove files matching patterns like '*.log'
 */
function deleteFilesByPattern(pattern, directory) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    fs.readdirSync(directory).forEach((item) => {
        const itemPath = path.join(directory, item);
        if (regex.test(item) && fs.lstatSync(itemPath).isFile()) {
            deleteItem(itemPath);
        } else if (fs.lstatSync(itemPath).isDirectory()) {
            deleteFilesByPattern(pattern, itemPath); // Recursively delete matching files
        }
    });
}

/**
 * Initiates cleanup
 */
function cleanUp(directory) {
    console.log(`Starting cleanup in ${directory}...`);

    itemsToDelete.forEach((item) => {
        if (item.includes('*')) {
            deleteFilesByPattern(item, directory);
        } else {
            deleteItem(path.join(directory, item));
        }
    });

    console.log('Cleanup completed!');
}

// Start cleanup in the current directory
cleanUp(__dirname);
