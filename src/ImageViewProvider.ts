import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ImageViewProvider implements vscode.WebviewViewProvider {

    private _extensionUri: vscode.Uri;

    constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // En el futuro, aquí irá la lógica para la imagen seleccionada por el usuario.
        // Por ahora, nos centramos en mostrar el SVG por defecto.

        let imageHtml: string;

        // 1. Construir la ruta absoluta y segura al archivo SVG por defecto.
        const defaultImagePath = path.join(this._extensionUri.fsPath, 'media', 'logo.svg');

        // 2. Leer el contenido del archivo SVG de forma síncrona.
        try {
            const svgContent = fs.readFileSync(defaultImagePath, 'utf8');
            imageHtml = svgContent;
        } catch (err) {
            console.error('Error al leer el archivo SVG por defecto:', err);
            imageHtml = `<p>Error: No se pudo cargar la imagen por defecto. Verifique la ruta y los permisos.</p>`;
        }

        // 3. Devolver el HTML completo que se mostrará en la webview.
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Project Image</title>
                <style>
                    /* Reseteo básico para eliminar comportamientos inesperados */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body, html {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: transparent;
                    }
                    /* Estilizamos directamente el SVG incrustado */
                    svg {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                        padding: 5px; /* Pequeño margen interior para que no toque los bordes */
                    }
                </style>
            </head>
            <body>
                ${imageHtml}
            </body>
            </html>
        `;
    }
} // <-- Esta es la llave final de la clase 'ImageViewProvider'