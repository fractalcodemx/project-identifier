import * as vscode from 'vscode';

export class Logger {
    private static _outputChannel: vscode.OutputChannel;

    /**
     * Initializes the Output channel. Should be called once on activation.
     */
    public static initialize() {
        if (!this._outputChannel) {
            this._outputChannel = vscode.window.createOutputChannel("Project Identifier");
        }
    }

    /**
     * Writes a message to the Output channel with a timestamp.
     */
    public static log(message: string) {
        if (this._outputChannel) {
            const time = new Date().toLocaleTimeString();
            this._outputChannel.appendLine(`[${time}] ${message}`);
        }
    }

    /**
     * Shows the Output panel to the user.
     */
    public static show() {
        if (this._outputChannel) {
            this._outputChannel.show(true);
        }
    }
}