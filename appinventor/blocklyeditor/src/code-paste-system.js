// Sagir Builder - Code Paste System v1.0 - CLEAN
class SagirCodeParser {
    constructor() {
        this.components = [];
    }
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
                blocksXml.push(this.createSetPropertyBlock(blockId++, comp, prop, value));
                return;
            }
            match = line.match(/(\w+)\.OnClick\s*=>\s*(\w+)\.(\w+)\("(.*)"\)/);
            if (match) {
                const [_, btn, notifier, method, msg] = match;
                blocksXml.push(this.createClickBlock(blockId++, btn, notifier, msg));
                return;
            }
        });
        return this.wrapInXml(blocksXml.join('\n'));
    }
    createSetPropertyBlock(id, component, property, value) {
        return `<block type="component_set_get" id="${id}">
          <mutation component_type="${component}" instance_name="${component}" property_name="${property}" set_or_get="set"></mutation>
          <value name="VALUE">
            <block type="text"><field name="TEXT">${value}</field></block>
          </value>
        </block>`;
    }
    createClickBlock(id, button, notifier, message) {
        return `<block type="component_event" id="${id}">
          <mutation component_type="Button" instance_name="${button}" event_name="Click"></mutation>
          <statement name="DO">
            <block type="component_method">
              <mutation component_type="Notifier" instance_name="${notifier}" method_name="ShowAlert"></mutation>
              <value name="ARG0"><block type="text"><field name="TEXT">${message}</field></block></value>
            </block>
          </statement>
        </block>`;
    }
    wrapInXml(blocks) {
        return `<xml xmlns="https://developers.google.com/blockly/xml">${blocks}</xml>`;
    }
}
class CodePastePanel {
    constructor(editor) {
        this.editor = editor;
        this.parser = new SagirCodeParser();
    }
    render(container) {
        container.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; background:#1e1e1e; color:white;">
            <div style="padding:10px; background:#2d2d2d; display:flex; justify-content:space-between;">
                <span style="color:#4EC9B0;">SagirScript - Write or Paste Code</span>
                <div>
                    <button id="pasteExampleBtn" style="background:#007ACC; color:white; border:none; padding:6px 12px; margin-right:5px;">Example</button>
                    <button id="convertToBlocksBtn" style="background:#89D185; color:black; border:none; padding:6px 12px; margin-right:5px; font-weight:bold;">To Blocks</button>
                    <button id="buildBtn" style="background:#FFA500; color:black; border:none; padding:6px 15px; font-weight:bold;">Run & Build</button>
                </div>
            </div>
            <div id="monaco-editor" style="flex:1; min-height:400px;"><textarea id="fallbackCode" style="width:100%; height:100%; background:#1e1e1e; color:#d4d4d4; border:none; padding:10px; font-family:monospace;">// Write or paste code here - No blocks needed
Button1.Text = "Click Me"
Button1.OnClick => Notifier1.ShowAlert("Hello from Code!")
Label1.Text = "Made with Sagir Builder"
</textarea></div>
            <div id="codeStatus" style="padding:5px 10px; background:#007ACC; font-size:12px;">Ready - Paste your code here</div>
        </div>`;
        container.querySelector('#convertToBlocksBtn').onclick = () => this.convertToBlocks();
        container.querySelector('#buildBtn').onclick = () => this.buildApp();
        container.querySelector('#pasteExampleBtn').onclick = () => this.pasteExample();
    }
    getCode() {
        const fb = document.getElementById('fallbackCode');
        return fb ? fb.value : '';
    }
    setCode(code) {
        const fb = document.getElementById('fallbackCode');
        if (fb) fb.value = code;
    }
    convertToBlocks() {
        const code = this.getCode();
        const xml = this.parser.parse(code);
        document.getElementById('codeStatus').innerText = 'Converting...';
        try {
            if (window.Blockly && Blockly.getMainWorkspace()) {
                const workspace = Blockly.getMainWorkspace();
                workspace.clear();
                const dom = Blockly.utils.xml.textToDom(xml);
                Blockly.Xml.domToWorkspace(dom, workspace);
                document.getElementById('codeStatus').innerText = 'Converted to Blocks!';
            } else {
                console.log(xml);
                document.getElementById('codeStatus').innerText = 'XML Generated';
            }
        } catch (e) {
            document.getElementById('codeStatus').innerText = 'Error: ' + e.message;
        }
    }
    buildApp() {
        this.convertToBlocks();
        document.getElementById('codeStatus').innerText = 'Building APK...';
    }
    pasteExample() {
        const example = `Screen1.Title = "Login App"
Label1.Text = "Welcome to Sagir Builder"
TextBox1.Hint = "Enter Username"
Button1.Text = "Login"
Button1.OnClick => Notifier1.ShowAlert("Login Success!")
`;
        this.setCode(example);
    }
}
window.SagirCodeParser = SagirCodeParser;
window.CodePastePanel = CodePastePanel;
console.log('Sagir Builder Loaded!');
