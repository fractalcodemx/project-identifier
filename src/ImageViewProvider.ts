import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './Logger';

export class ImageViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'project-identifier.view.explorer';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _context: vscode.ExtensionContext
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        // 1. Configuramos los permisos iniciales
        this._updateWebviewOptions();

        // 2. Renderizamos el HTML inicial
        this._updateHtml();
    }

    /**
     * Calcula y actualiza los permisos de directorios permitidos (localResourceRoots).
     * Esto es CRÍTICO para que las imágenes se vean.
     */
    private _updateWebviewOptions() {
        if (!this._view) return;

        const localResourceRoots = [this._extensionUri];

        // A. Permitir siempre acceder a las carpetas del Workspace abierto
        if (vscode.workspace.workspaceFolders) {
            localResourceRoots.push(...vscode.workspace.workspaceFolders.map(f => f.uri));
        }

        // B. Si hay una imagen seleccionada (guardada o nueva), permitir acceso a SU carpeta contenedora
        const currentImagePath = this._getCurrentImagePath();
        if (currentImagePath) {
            const imageDir = vscode.Uri.file(path.dirname(currentImagePath));
            localResourceRoots.push(imageDir);
        }

        Logger.log(`Actualizando permisos. Rutas permitidas: ${localResourceRoots.length}`);

        this._view.webview.options = {
            enableScripts: true,
            localResourceRoots: localResourceRoots
        };
    }

    public async selectNewImage() {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Select Project Logo',
            filters: {
                'Images': ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp']
            }
        };

        const fileUri = await vscode.window.showOpenDialog(options);

        if (fileUri && fileUri[0]) {
            const selectedPath = fileUri[0].fsPath;
            Logger.log(`Imagen seleccionada: ${selectedPath}`);

            // 1. Guardar persistencia
            await this._context.workspaceState.update('projectImage', selectedPath);

            // 2. IMPORTANTE: Actualizar los permisos para incluir la nueva carpeta
            this._updateWebviewOptions();

            // 3. Refrescar la vista HTML
            this._updateHtml();
        }
    }

    private _getCurrentImagePath(): string | undefined {
        return this._context.workspaceState.get<string>('projectImage');
    }

    private _updateHtml() {
        if (!this._view) { return; }

        const userImagePath = this._getCurrentImagePath();
        let imageSrc: vscode.Uri;

        if (userImagePath && fs.existsSync(userImagePath)) {
            // Convertimos la ruta local a una URI especial que VS Code entiende (vscode-resource:)
            imageSrc = this._view.webview.asWebviewUri(vscode.Uri.file(userImagePath));
            Logger.log(`Renderizando imagen de usuario: ${imageSrc.toString()}`);
        } else {
            const defaultPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'logo.svg');
            imageSrc = this._view.webview.asWebviewUri(defaultPath);
            Logger.log("Renderizando imagen por defecto.");
        }

        this._view.webview.html = this._getHtmlContent(imageSrc);
    }

    private _getHtmlContent(imageSrc: vscode.Uri): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Project Image</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body, html {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: transparent;
                        overflow: hidden;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                        padding: 10px;
                        /* Un poco de sombra para que destaque en temas oscuros/claros */
                        filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
                    }
                </style>
            </head>
            <body>
                <img src="${imageSrc}" alt="Project Logo" />
            </body>
            </html>
        `;
    }
}