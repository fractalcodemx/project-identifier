import * as vscode from 'vscode';
import { ImageViewProvider } from './ImageViewProvider';
import { Logger } from './Logger';

export function activate(context: vscode.ExtensionContext) {

    Logger.initialize();
    Logger.log("Activando extensión 'Project Identifier'...");

    // Pasamos 'context' al constructor para manejar la persistencia
    const imageViewProvider = new ImageViewProvider(context.extensionUri, context);
    Logger.log("Instancia de ImageViewProvider creada.");

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

    context.subscriptions.push(
        vscode.commands.registerCommand('project-identifier.selectImage', () => {
            // Delegamos la lógica al Provider (Principio de Responsabilidad Única)
            imageViewProvider.selectNewImage();
        })
    );

    Logger.log("¡Extensión completamente activa!");
}

export function deactivate() {
    Logger.log("Desactivando la extensión.");
}