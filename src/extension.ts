// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"brulAI" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('brulAI.start', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const panel = vscode.window.createWebviewPanel(
			'brulAI chat',
			'BrulAI Chat',
			vscode.ViewColumn.One,
			{ enableScripts: true }
		)

		// Get paths to resources
		const htmlPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'src/res/html/index.html'));
		const cssPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'src/res/css/styles.css'));
		const jsPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'src/res/js/script.js'));

		// Convert to webview URIs
		const styleUri = panel.webview.asWebviewUri(cssPathOnDisk);
		const scriptUri = panel.webview.asWebviewUri(jsPathOnDisk);

		// Read and update the HTML file
		let html = fs.readFileSync(htmlPathOnDisk.fsPath, 'utf8');
		html = html.replace('${styleUri}', styleUri.toString());
		html = html.replace('${scriptUri}', scriptUri.toString());

		vscode.window.showInformationMessage('Hello World from BrulAI!');

		panel.webview.html = html;

		panel.webview.onDidReceiveMessage(async (message: any) => {
			if (message.command === 'chat') {
				const userPrompt = message.text;
				let responseText = '';

				try {
					const response = await ollama.chat({
						model: 'deepseek-r1:7b',
						messages: [{ role: 'user', content: userPrompt }],
						stream: true
					})

					for await (const part of response) {
						responseText += part.message.content;
						panel.webview.postMessage({ command: 'chatResponse', text: responseText });
					}
				} catch (err) {
					panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${err instanceof Error ? err.message : String(err)}` });
				}

			}
		}
		);
	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
