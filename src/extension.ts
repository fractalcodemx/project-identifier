import * as vscode from 'vscode';
import { ImageViewProvider } from './ImageViewProvider';
import { Logger } from './Logger';

export function activate(context: vscode.ExtensionContext) {

    Logger.initialize();
    Logger.log("Activating 'Project Identifier' extension...");

    // Pass 'context' to the constructor to handle persistence
    const imageViewProvider = new ImageViewProvider(context.extensionUri, context);
    Logger.log("ImageViewProvider instance created.");

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
            // Delegate logic to Provider (Single Responsibility Principle)
            imageViewProvider.selectNewImage();
        })
    );

    Logger.log("Extension fully active!");
}

export function deactivate() {
    Logger.log("Deactivating extension.");
}