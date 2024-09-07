"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let disposable = vscode.commands.registerCommand("extension.togglePrivacyMode", () => {
        // 切换隐私模式
        PrivacyMode.toggle();
    });
    let switchModeDisposable = vscode.commands.registerCommand("extension.switchPrivacyMode", () => {
        PrivacyMode.switchMode();
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(switchModeDisposable);
}
class PrivacyMode {
    static enabled = false;
    static decoration;
    static disposable;
    static debounceTimer;
    static mode = "opacity";
    static toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.enable();
        }
        else {
            this.disable();
        }
    }
    static switchMode() {
        this.mode = this.mode === "opacity" ? "blur" : "opacity";
        if (this.enabled) {
            this.disable();
            this.enable();
        }
    }
    static enable() {
        // 创建装饰类型
        this.decoration = vscode.window.createTextEditorDecorationType({
            ...(this.mode === "opacity"
                ? { opacity: "0.1" }
                : { textDecoration: "none; filter: blur(5px);" }),
            isWholeLine: true,
        });
        // 应用装饰
        this.updateDecorations();
        // 监听光标移动事件，使用防抖
        this.disposable = vscode.window.onDidChangeTextEditorSelection(this.debouncedUpdateDecorations);
    }
    static disable() {
        if (this.decoration) {
            this.decoration.dispose();
        }
        if (this.disposable) {
            this.disposable.dispose();
        }
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
    static debouncedUpdateDecorations = () => {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.updateDecorations();
        }, 100); // 100毫秒的防抖延迟
    };
    static updateDecorations() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !PrivacyMode.enabled) {
            return;
        }
        const cursorLine = editor.selection.active.line;
        const visibleRange = editor.visibleRanges[0];
        const startLine = visibleRange.start.line;
        const endLine = visibleRange.end.line;
        const ranges = [];
        for (let i = startLine; i <= endLine; i++) {
            if (i !== cursorLine) {
                ranges.push(new vscode.Range(i, 0, i, Number.MAX_VALUE));
            }
        }
        editor.setDecorations(PrivacyMode.decoration, ranges);
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map