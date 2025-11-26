import * as vscode from 'vscode';
import { ImageViewProvider } from './ImageViewProvider';
import { Logger } from './Logger';

export function activate(context: vscode.ExtensionContext) {

    Logger.initialize();
    Logger.log("Activando extensión 'Project Identifier'...");

    const imageViewProvider = new ImageViewProvider(context.extensionUri);
    Logger.log("Instancia de ImageViewProvider creada.");

    // Registro para el explorador de archivos
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'project-identifier.view.explorer',
            imageViewProvider
        )
    );
    Logger.log("Proveedor de vista registrado para 'explorer'.");

    // Registro para el control de versiones (Git)
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'project-identifier.view.scm',
            imageViewProvider
        )
    );
    Logger.log("Proveedor de vista registrado para 'scm'.");

    // Registro del comando del botón "Lápiz"
    context.subscriptions.push(
        vscode.commands.registerCommand('project-identifier.selectImage', () => {
            Logger.log("El usuario hizo click en el icono de editar.");
            vscode.window.showInformationMessage("Click en editar: Próximamente abriremos el selector de archivos.");
        })
    );

    Logger.log("¡Extensión completamente activa!");
}

export function deactivate() {
    Logger.log("Desactivando la extensión.");
}