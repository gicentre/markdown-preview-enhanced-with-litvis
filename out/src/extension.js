"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const atom_1 = require("atom");
const fs = require("fs-extra");
const mume = require("mume-with-litvis");
const path = require("path");
const config_1 = require("./config");
const linting_1 = require("./linting");
const preview_content_provider_1 = require("./preview-content-provider");
let subscriptions = null;
let config = null;
/**
 * Key is editor.getPath()
 * Value is MarkdownPreviewEnhancedView object
 */
let previewsMap = {};
/**
 * Check if the `filePath` is a markdown file.
 * @param filePath
 */
function isMarkdownFile(filePath = "") {
    if (filePath.startsWith("mpe://")) {
        return false;
    } // this is preview
    const ext = path.extname(filePath);
    for (let i = 0; i < config.fileExtension.length; i++) {
        if (config.fileExtension[i] === ext) {
            return true;
        }
    }
    return false;
}
/**
 * This function will be called when `config` is changed.
 * @param config
 */
function onDidChangeConfig() {
    for (const sourceUri in previewsMap) {
        if (previewsMap.hasOwnProperty(sourceUri)) {
            const preview = previewsMap[sourceUri];
            preview.updateConfiguration();
            preview.loadPreview();
        }
    }
}
/**
 * As the function name pointed...
 */
function getSinglePreview() {
    return previewsMap[Object.keys(previewsMap)[0]];
}
/**
 * Return the preview object for editor(editorFilePath).
 * @param editor
 */
function getPreviewForEditor(editor) {
    if (config.singlePreview) {
        return getSinglePreview();
    }
    else if (typeof editor === "string") {
        return previewsMap[editor];
    }
    else if (editor instanceof preview_content_provider_1.MarkdownPreviewEnhancedView) {
        return editor;
    }
    else if (editor && editor.getPath) {
        return previewsMap[editor.getPath()];
    }
    else {
        return null;
    }
}
function clearCache() {
    fs.emptyDir(path.resolve(mume.utility.getConfigPath(), "literate-elm"));
}
/**
 * Toggle markdown preview
 */
function togglePreview() {
    const editor = atom.workspace.getActivePaneItem();
    const preview = getPreviewForEditor(editor);
    if (preview && preview["getEditor"] && preview["getEditor"]()) {
        // preview is already on, so remove it.
        const pane = atom.workspace.paneForItem(preview);
        pane.destroyItem(preview); // this will trigger preview.destroy()
        removePreviewFromMap(preview);
    }
    else {
        startPreview(editor);
    }
}
/**
 * Remove preview from `previewsMap`
 * @param preview
 */
function removePreviewFromMap(preview) {
    for (const key in previewsMap) {
        if (previewsMap[key] === preview) {
            delete previewsMap[key];
        }
    }
}
/**
 * Start preview for editor
 * @param editor
 */
function startPreview(editor) {
    if (!editor || !editor["getPath"] || !isMarkdownFile(editor.getPath())) {
        return;
    }
    let preview = getPreviewForEditor(editor);
    if (!preview) {
        if (config.singlePreview) {
            preview = new preview_content_provider_1.MarkdownPreviewEnhancedView("mpe://single_preview", config);
            previewsMap["single_preview"] = preview;
        }
        else {
            preview = new preview_content_provider_1.MarkdownPreviewEnhancedView("mpe://" + editor.getPath(), config);
            previewsMap[editor.getPath()] = preview;
        }
        preview.onPreviewDidDestroy(removePreviewFromMap);
    }
    if (preview.getEditor() !== editor) {
        preview.bindEditor(editor);
    }
}
function activate(state) {
    if (!atom.inSpecMode()) {
        require("atom-package-deps").install("markdown-preview-enhanced-with-litvis");
    }
    subscriptions = new atom_1.CompositeDisposable();
    // Init config
    config = new config_1.MarkdownPreviewEnhancedConfig();
    config.onDidChange(subscriptions, onDidChangeConfig);
    mume.onDidChangeConfigFile(onDidChangeConfig);
    mume
        .init((config.configPath || "").trim()) // init mume package
        .then(() => {
        // Set opener
        subscriptions.add(atom.workspace.addOpener((uri) => {
            if (uri.startsWith("mpe://")) {
                if (config.singlePreview) {
                    return getSinglePreview();
                }
                else {
                    return previewsMap[uri.replace("mpe://", "")];
                }
            }
        }));
        // Register commands
        subscriptions.add(atom.commands.add("atom-workspace", {
            "markdown-preview-enhanced-with-litvis:clear-cache": clearCache,
            "markdown-preview-enhanced-with-litvis:toggle": togglePreview,
            "markdown-preview-enhanced-with-litvis:customize-css": customizeCSS,
            "markdown-preview-enhanced-with-litvis:create-toc": createTOC,
            "markdown-preview-enhanced-with-litvis:toggle-scroll-sync": toggleScrollSync,
            "markdown-preview-enhanced-with-litvis:toggle-live-update": toggleLiveUpdate,
            "markdown-preview-enhanced-with-litvis:toggle-break-on-single-newline": toggleBreakOnSingleNewLine,
            "markdown-preview-enhanced-with-litvis:insert-table": insertTable,
            "markdown-preview-enhanced-with-litvis:image-helper": startImageHelper,
            "markdown-preview-enhanced-with-litvis:open-mermaid-config": openMermaidConfig,
            "markdown-preview-enhanced-with-litvis:open-mathjax-config": openMathJaxConfig,
            "markdown-preview-enhanced-with-litvis:open-katex-config": openKaTeXConfig,
            "markdown-preview-enhanced-with-litvis:extend-parser": extendParser,
            "markdown-preview-enhanced-with-litvis:insert-new-slide": insertNewSlide,
            "markdown-preview-enhanced-with-litvis:insert-page-break": insertPageBreak,
            "markdown-preview-enhanced-with-litvis:toggle-zen-mode": toggleZenMode,
            "markdown-preview-enhanced-with-litvis:run-code-chunk": runCodeChunkCommand,
            "markdown-preview-enhanced-with-litvis:run-all-code-chunks": runAllCodeChunks,
            "markdown-preview-enhanced-with-litvis:show-uploaded-images": showUploadedImages,
        }));
        // When the preview is displayed
        // preview will display the content of editor (pane item) that is activated
        subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem((editor) => {
            if (editor &&
                editor["buffer"] &&
                editor["getPath"] &&
                isMarkdownFile(editor["getPath"]())) {
                const preview = getPreviewForEditor(editor);
                if (!preview) {
                    return;
                }
                if (config.singlePreview &&
                    preview.getEditor() !== editor &&
                    atom.workspace.paneForItem(preview) !==
                        atom.workspace.paneForItem(editor)) {
                    // This line fixed issue #692
                    preview.bindEditor(editor);
                }
                if (config.automaticallyShowPreviewOfMarkdownBeingEdited) {
                    const pane = atom.workspace.paneForItem(preview);
                    if (pane && pane !== atom.workspace.getActivePane()) {
                        pane.activateItem(preview);
                    }
                }
            }
        }));
        // automatically open preview when activate a markdown file
        // if 'openPreviewPaneAutomatically' option is enabled.
        subscriptions.add(atom.workspace.onDidOpen((event) => {
            if (config.openPreviewPaneAutomatically) {
                if (event.uri &&
                    event.item &&
                    isMarkdownFile(event.uri) &&
                    !event.uri.startsWith("mpe://")) {
                    const pane = event.pane;
                    const panes = atom.workspace.getPanes();
                    // if the markdown file is opened on the right pane, then move it to the left pane. Issue #25
                    if (pane !== panes[0]) {
                        pane.moveItemToPane(event.item, panes[0], 0); // move md to left pane.
                    }
                    panes[0]["setActiveItem"](event.item);
                    panes[0].activate();
                    const editor = event.item;
                    startPreview(editor);
                }
            }
            // check zen mode
            if (event.uri && event.item && isMarkdownFile(event.uri)) {
                const editor = event.item;
                const editorElement = editor["getElement"]();
                if (editor && editor["buffer"]) {
                    if (atom.config.get("markdown-preview-enhanced-with-litvis.enableZenMode")) {
                        editorElement.setAttribute("data-markdown-zen", "");
                    }
                    else {
                        editorElement.removeAttribute("data-markdown-zen");
                    }
                }
                // drop drop image events
                bindMarkdownEditorDropEvents(editor);
            }
        }));
        // zen mode observation
        subscriptions.add(atom.config.observe("markdown-preview-enhanced-with-litvis.enableZenMode", (enableZenMode) => {
            const paneItems = atom.workspace.getPaneItems();
            for (let i = 0; i < paneItems.length; i++) {
                const editor = paneItems[i];
                if (editor &&
                    editor["getPath"] &&
                    isMarkdownFile(editor["getPath"]())) {
                    if (editor["buffer"]) {
                        const editorElement = editor["getElement"]();
                        if (enableZenMode) {
                            editorElement.setAttribute("data-markdown-zen", "");
                        }
                        else {
                            editorElement.removeAttribute("data-markdown-zen");
                        }
                    }
                    // drop drop image events
                    bindMarkdownEditorDropEvents(editor);
                }
            }
            if (enableZenMode) {
                document
                    .getElementsByTagName("atom-workspace")[0]
                    .setAttribute("data-markdown-zen", "");
            }
            else {
                document
                    .getElementsByTagName("atom-workspace")[0]
                    .removeAttribute("data-markdown-zen");
            }
        }));
        // use single preview
        subscriptions.add(atom.config.onDidChange("markdown-preview-enhanced-with-litvis.singlePreview", (singlePreview) => {
            for (const sourceUri in previewsMap) {
                if (previewsMap.hasOwnProperty(sourceUri)) {
                    const preview = previewsMap[sourceUri];
                    const pane = atom.workspace.paneForItem(preview);
                    pane.destroyItem(preview); // this will trigger preview.destroy()
                }
            }
            previewsMap = {};
        }));
        // Check package version
        const packageVersion = require(path.resolve(__dirname, "../../package.json"))["version"];
    });
}
exports.activate = activate;
/**
 * Drop image file to markdown editor and upload the file directly.
 * @param editor
 */
function bindMarkdownEditorDropEvents(editor) {
    if (editor && editor.getElement) {
        const editorElement = editor.getElement();
        function dropImageFile(event) {
            const files = event.dataTransfer.files;
            for (let i = 0; i < files.length; i++) {
                const imageFilePath = files[i].path;
                if (files[i].type.startsWith("image")) {
                    // Drop image
                    const imageDropAction = atom.config.get("markdown-preview-enhanced-with-litvis.imageDropAction");
                    if (imageDropAction === "upload") {
                        // upload image
                        event.stopPropagation();
                        event.preventDefault();
                        preview_content_provider_1.MarkdownPreviewEnhancedView.uploadImageFile(editor, imageFilePath, config.imageUploader);
                    }
                    else if (imageDropAction.startsWith("insert")) {
                        // insert relative path
                        event.stopPropagation();
                        event.preventDefault();
                        const editorPath = editor.getPath();
                        const description = path
                            .basename(imageFilePath)
                            .replace(path.extname(imageFilePath), "");
                        editor.insertText(`![${description}](${path.relative(path.dirname(editorPath), imageFilePath)})`);
                    }
                    else if (imageDropAction.startsWith("copy")) {
                        // copy to image folder
                        event.stopPropagation();
                        event.preventDefault();
                        preview_content_provider_1.MarkdownPreviewEnhancedView.pasteImageFile(editor, atom.config.get("markdown-preview-enhanced-with-litvis.imageFolderPath"), imageFilePath);
                    }
                }
            }
            return false;
        }
        editorElement.ondrop = dropImageFile;
        editorElement.ondragover = (event) => {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
    }
}
/**
 * Open ~/.mume/style.less
 */
function customizeCSS() {
    const globalStyleLessFile = path.resolve(mume.getExtensionConfigPath(), "./style.less");
    atom.workspace.open(globalStyleLessFile);
}
function createTOC() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor && editor.getBuffer()) {
        editor.insertText('\n<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->\n');
    }
}
function toggleScrollSync() {
    const flag = atom.config.get("markdown-preview-enhanced-with-litvis.scrollSync");
    atom.config.set("markdown-preview-enhanced-with-litvis.scrollSync", !flag);
    if (!flag) {
        atom.notifications.addInfo("Scroll Sync enabled");
    }
    else {
        atom.notifications.addInfo("Scroll Sync disabled");
    }
}
function toggleLiveUpdate() {
    const flag = atom.config.get("markdown-preview-enhanced-with-litvis.liveUpdate");
    atom.config.set("markdown-preview-enhanced-with-litvis.liveUpdate", !flag);
    if (!flag) {
        atom.notifications.addInfo("Live Update enabled");
    }
    else {
        atom.notifications.addInfo("Live Update disabled");
    }
}
function toggleBreakOnSingleNewLine() {
    const flag = atom.config.get("markdown-preview-enhanced-with-litvis.breakOnSingleNewLine");
    atom.config.set("markdown-preview-enhanced-with-litvis.breakOnSingleNewLine", !flag);
    if (!flag) {
        atom.notifications.addInfo("Enabled breaking on single newline");
    }
    else {
        atom.notifications.addInfo("Disabled breaking on single newline");
    }
}
function insertTable() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor && editor.getBuffer()) {
        editor.insertText(`|   |   |
|---|---|
|   |   |
`);
    }
}
function startImageHelper() {
    const editor = atom.workspace.getActiveTextEditor();
    const preview = getPreviewForEditor(editor);
    if (!preview) {
        atom.notifications.addError("Please open preview first.");
    }
    else {
        preview.startImageHelper();
    }
}
function openMermaidConfig() {
    const mermaidConfigFilePath = path.resolve(mume.getExtensionConfigPath(), "./mermaid_config.js");
    atom.workspace.open(mermaidConfigFilePath);
}
function openMathJaxConfig() {
    const mathjaxConfigFilePath = path.resolve(mume.getExtensionConfigPath(), "./mathjax_config.js");
    atom.workspace.open(mathjaxConfigFilePath);
}
function openKaTeXConfig() {
    const katexConfigFilePath = path.resolve(mume.getExtensionConfigPath(), "./katex_config.js");
    atom.workspace.open(katexConfigFilePath);
}
function extendParser() {
    const parserConfigPath = path.resolve(mume.getExtensionConfigPath(), "./parser.js");
    atom.workspace.open(parserConfigPath);
}
function insertNewSlide() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor && editor.getBuffer()) {
        editor.insertText("<!-- slide -->\n");
    }
}
function insertPageBreak() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor && editor.getBuffer()) {
        editor.insertText("<!-- pagebreak -->\n");
    }
}
function toggleZenMode() {
    const enableZenMode = atom.config.get("markdown-preview-enhanced-with-litvis.enableZenMode");
    atom.config.set("markdown-preview-enhanced-with-litvis.enableZenMode", !enableZenMode);
    if (!enableZenMode) {
        atom.notifications.addInfo("zen mode enabled");
    }
    else {
        atom.notifications.addInfo("zen mode disabled");
    }
}
function runCodeChunkCommand() {
    const editor = atom.workspace.getActiveTextEditor();
    const preview = getPreviewForEditor(editor);
    if (!preview) {
        atom.notifications.addError("Please open preview first.");
    }
    else {
        preview.sendRunCodeChunkCommand();
    }
}
function runAllCodeChunks() {
    const editor = atom.workspace.getActiveTextEditor();
    const preview = getPreviewForEditor(editor);
    if (!preview) {
        atom.notifications.addError("Please open preview first.");
    }
    else {
        preview.runAllCodeChunks();
    }
}
function showUploadedImages() {
    const imageHistoryFilePath = path.resolve(mume.getExtensionConfigPath(), "./image_history.md");
    atom.workspace.open(imageHistoryFilePath);
}
/**
 * Code chunk `modify_source` is triggered.
 * @param codeChunkData
 * @param result
 * @param filePath
 */
function onModifySource(codeChunkData, result, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        function insertResult(i, editor, lines) {
            const lineCount = editor.getLineCount();
            let start = 0;
            // find <!- code_chunk_output -->
            for (let j = i + 1; j < i + 6 && j < lineCount; j++) {
                if (lines[j].startsWith("<!-- code_chunk_output -->")) {
                    start = j;
                    break;
                }
            }
            if (start) {
                // found
                // TODO: modify exited output
                let end = start + 1;
                while (end < lineCount) {
                    if (lines[end].startsWith("<!-- /code_chunk_output -->")) {
                        break;
                    }
                    end += 1;
                }
                // if output not changed, then no need to modify editor buffer
                let r = "";
                for (let i2 = start + 2; i2 < end - 1; i2++) {
                    r += lines[i2] + "\n";
                }
                if (r === result + "\n") {
                    return "";
                } // no need to modify output
                editor.getBuffer().setTextInRange([
                    [start + 2, 0],
                    [end - 1, 0],
                ], result + "\n");
                /*
                editor.edit((edit)=> {
                  edit.replace(new vscode.Range(
                    new vscode.Position(start + 2, 0),
                    new vscode.Position(end-1, 0)
                  ), result+'\n')
                })
                */
                return "";
            }
            else {
                editor
                    .getBuffer()
                    .insert([i + 1, 0], `<!-- code_chunk_output -->\n\n${result}\n\n<!-- /code_chunk_output -->\n`);
                return "";
            }
        }
        const visibleTextEditors = atom.workspace.getTextEditors();
        for (let i = 0; i < visibleTextEditors.length; i++) {
            const editor = visibleTextEditors[i];
            if (editor.getPath() === filePath) {
                let codeChunkOffset = 0;
                const targetCodeChunkOffset = codeChunkData.normalizedInfo.attributes["code_chunk_offset"];
                const lineCount = editor.getLineCount();
                const lines = editor.getBuffer().getLines();
                for (let i2 = 0; i2 < lineCount; i2++) {
                    const line = lines[i2]; // editor.getBuffer().lines[i] will cause error.
                    if (line.match(/^```(.+)\"?cmd\"?\s*[=\s]/)) {
                        if (codeChunkOffset === targetCodeChunkOffset) {
                            i2 = i2 + 1;
                            while (i2 < lineCount) {
                                if (lines[i2].match(/^\`\`\`\s*/)) {
                                    break;
                                }
                                i2 += 1;
                            }
                            return insertResult(i2, editor, lines);
                        }
                        else {
                            codeChunkOffset++;
                        }
                    }
                    else if (line.match(/\@import\s+(.+)\"?cmd\"?\s*[=\s]/)) {
                        if (codeChunkOffset === targetCodeChunkOffset) {
                            // console.log('find code chunk' )
                            return insertResult(i2, editor, lines);
                        }
                        else {
                            codeChunkOffset++;
                        }
                    }
                }
                break;
            }
        }
        return "";
    });
}
mume.MarkdownEngine.onModifySource(onModifySource);
mume.MarkdownEngine.onUpdateLintingReport(linting_1.updateLintingReport);
function deactivate() {
    subscriptions.dispose();
}
exports.deactivate = deactivate;
var config_schema_1 = require("./config-schema");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_schema_1.configSchema; } });
var linting_2 = require("./linting");
Object.defineProperty(exports, "consumeIndie", { enumerable: true, get: function () { return linting_2.consumeIndie; } });
//# sourceMappingURL=extension.js.map