const vscode = require('vscode');

/**
 * Format a specific line by adding exactly 6 spaces at the beginning
 * @param {string} line 
 * @returns {string}
 */
function formatLine(line) {
    if (line.trim() === '') {
        return line; // Don't format empty lines
    }
    
    // Remove existing leading spaces and add exactly 6
    return '      ' + line.trimLeft();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('STL extension is now active!');

    // Register the manual formatter for the entire document
    let formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('stl', {
        provideDocumentFormattingEdits(document) {
            const edits = [];
            const text = document.getText();
            const lines = text.split(/\r?\n/);
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim() === '') continue; // Skip empty lines
                
                const leadingSpaces = line.match(/^(\s*)/)[1].length;
                if (leadingSpaces !== 6) {
                    const formattedLine = formatLine(line);
                    const range = new vscode.Range(
                        new vscode.Position(i, 0),
                        new vscode.Position(i, line.length)
                    );
                    edits.push(new vscode.TextEdit(range, formattedLine));
                }
            }
            
            return edits;
        }
    });

    // Listen for text document changes
    let textChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
        const document = event.document;
        
        // Only process STL files
        if (document.languageId !== 'stl') {
            return;
        }
        
        // Check if any of the changes contain a newline (Enter key press)
        const containsNewLine = event.contentChanges.some(change => {
            return change.text.includes('\n') || change.text.includes('\r\n');
        });
        
        if (containsNewLine) {
            // Get the active editor
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document === document) {
                // Get the current cursor position
                const position = editor.selection.active;
                
                // Get the current line
                const line = document.lineAt(position.line);
                
                // Check if the line needs formatting
                const leadingSpaces = line.text.match(/^(\s*)/)[1].length;
                if (leadingSpaces !== 6 && line.text.trim() !== '') {
                    // Format the current line
                    const formattedText = formatLine(line.text);
                    
                    // Create an edit to replace the current line
                    const edit = new vscode.WorkspaceEdit();
                    edit.replace(
                        document.uri,
                        line.range,
                        formattedText
                    );
                    
                    // Apply the edit
                    vscode.workspace.applyEdit(edit);
                }
            }
        }
    });

    context.subscriptions.push(formattingProvider);
    context.subscriptions.push(textChangeListener);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
