// Sagir Builder - Code Paste System v2.0 - WITH MONACO
class SagirCodeParser {
    constructor() { this.components = []; }
    parse(code) {
        const lines = code.split('\n');
        const blocksXml = [];
        let blockId = 1;
        lines.forEach(line => {
            line = line.trim();
            if (!line || line.startsWith('//')) return;
            let match = line.match(/(\w+)\.(\w+)\s*=\s*"(.*)"/);
            if (match) {
                const [_, comp, prop, value] = match;
                blocksXml.push(`<block type="component_set_get" id="${blockId++}"><mutation component_type="${comp}" instance_name="${comp}" property_name="${prop}" set_or_get="set"></mutation><value name="VALUE"><block type="text"><field name="TEXT">${value}</field></block></value></block>`);
                return;
            }
            match = line.match(/(\w+)\.OnClick\s*=>\s*(\w+)\.(\w+)\("(.*)"\)/);
            if (match) {
                const [_, btn, notifier, method, msg] = match;
                blocksXml.push(`<block type="component_event" id="${blockId++}"><mutation component_type="Button" instance_name="${btn}" event_name="Click"></mutation><statement name="DO"><block type="component_method"><mutation component_type="Notifier" instance_name="${notifier}" method_name="ShowAlert"></mutation><value name="ARG0"><block type="text"><field name="TEXT">${msg}</field></block></value></block></statement></block>`);
            }
        });
        return `<xml xmlns="https://developers.google.com/blockly/xml">${blocksXml.join('')}</xml>`;
    }
}
class CodePastePanel {
    constructor(editor) { this.editor = editor; this.parser = new SagirCodeParser(); this.monacoEditor = null; }
    render(container) {
        container.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; background:#1e1e1e; color:white;">
            <div style="padding:10px; background:#2d2d2d; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#4EC9B0; font-weight:bold;">⚡ SagirScript - VS Code Editor</span>
                <div>
                    <button id="pasteExampleBtn" style="background:#007ACC; color:white; border:none; padding:6px 12px; margin-right:5px; border-radius:4px;">Example</button>
                    <button id="convertToBlocksBtn" style="background:#89D185; color:black; border:none; padding:6px 12px; margin-right:5px; font-weight:bold; border-radius:4px;">To Blocks</button>
                    <button id="buildBtn" style="background:#FFA500; color:black; border:none; padding:6px 15px; font-weight:bold; border-radius:4px;">Run & Build</button>
                </div>
            </div>
            <div id="monaco-container" style="flex:1; min-height:400px; position:relative;">
                <textarea id="fallbackCode" style="width:100%; height:100%; background:#1e1e1e; color:#d4d4d4; border:none; padding:10px; font-family:monospace; font-size:14px;">// Welcome to Sagir Builder - VS Code Style!
// Write or paste code here
Button1.Text = "Click Me"
Button1.OnClick => Notifier1.ShowAlert("Hello from Code!")
Label1.Text = "Made with Sagir Builder"
</textarea>
            </div>
            <div id="codeStatus" style="padding:6px 10px; background:#007ACC; font-size:12px;">Ready - Monaco Loading...</div>
        </div>`;
        this.initEditor();
        container.querySelector('#convertToBlocksBtn').onclick = () => this.convertToBlocks();
        container.querySelector('#buildBtn').onclick = () => this.buildApp();
        container.querySelector('#pasteExampleBtn').onclick = () => this.pasteExample();
    }
    initEditor() {
        const checkMonaco = () => {
            if (window.monaco && window.monaco.editor) {
                const container = document.getElementById('monaco-container');
                const oldCode = document.getElementById('fallbackCode').value;
                container.innerHTML = '';
                this.monacoEditor = monaco.editor.create(container, {
                    value: oldCode,
                    language: 'javascript',
                    theme: 'vs-dark',
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true
                });
                document.getElementById('codeStatus').innerText = 'Monaco Editor Ready - VS Code Mode!';
            } else {
                setTimeout(checkMonaco, 500);
            }
        };
        checkMonaco();
    }
    getCode() {
        if (this.monacoEditor) return this.monacoEditor.getValue();
        const fb = document.getElementById('fallbackCode');
        return fb ? fb.value : '';
    }
    setCode(code) {
        if (this.monacoEditor) this.monacoEditor.setValue(code);
        else { const fb = document.getElementById('fallbackCode'); if (fb) fb.value = code; }
    }
    convertToBlocks() {
        const code = this.getCode();
        const xml = this.parser.parse(code);
        document.getElementById('codeStatus').innerText = 'Converting to Blocks...';
        try {
            if (window.Blockly && Blockly.getMainWorkspace()) {
                const workspace = Blockly.getMainWorkspace();
                workspace.clear();
                const dom = Blockly.utils.xml.textToDom(xml);
                Blockly.Xml.domToWorkspace(dom, workspace);
                document.getElementById('codeStatus').innerText = '✅ Converted to Blocks!';
            }
        } catch (e) { document.getElementById('codeStatus').innerText = 'Error: ' + e.message; }
    }
    buildApp() { this.convertToBlocks(); document.getElementById('codeStatus').innerText = 'Building APK...'; }
    pasteExample() {
        const example = `Screen1.Title = "Login App"
Label1.Text = "Welcome to Sagir Builder - Monaco!"
TextBox1.Hint = "Enter Username"
Button1.Text = "Login"
Button1.OnClick => Notifier1.ShowAlert("Login Success!")
`;
        this.setCode(example);
    }
}
window.SagirCodeParser = SagirCodeParser;
window.CodePastePanel = CodePastePanel;
