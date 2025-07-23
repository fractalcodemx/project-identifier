import * as vscode from 'vscode';
import { ImageViewProvider } from './ImageViewProvider'; // <-- 1. Importamos nuestra clase

export function activate(context: vscode.ExtensionContext) {

	// Pasamos el URI de la extensión al constructor
	const imageViewProvider = new ImageViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'project-identifier.view.explorer',
			imageViewProvider
		)
	);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'project-identifier.view.scm',
			imageViewProvider
		)
	);

	console.log('¡La extensión "Project Identifier" está activa!');
}

// Esta función se llama cuando tu extensión se desactiva
export function deactivate() {}