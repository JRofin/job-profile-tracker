const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '04-WORKFLOW-OVERVIEW.md');
const htmlPath = path.join(__dirname, '04-WORKFLOW-OVERVIEW.html');

const md = fs.readFileSync(mdPath, 'utf8');
const escaped = md
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const htmlCorrect =
  '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Job Profile Tracker — Workflow Overview</title>\n  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.6; color: #333; }\n    h1 { font-size: 1.75rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; }\n    h2 { font-size: 1.35rem; margin-top: 2rem; color: #1e40af; }\n    h3 { font-size: 1.15rem; margin-top: 1.5rem; }\n    pre { background: #f1f5f9; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; line-height: 1.4; }\n    code { font-family: ui-monospace, monospace; }\n    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }\n    th, td { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; }\n    th { background: #e2e8f0; }\n    hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }\n    .print-hint { background: #dbeafe; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 2rem; font-size: 0.9rem; }\n    @media print { .print-hint { display: none; } }\n  </style>\n</head>\n<body>\n  <div class="print-hint"><strong>Para guardar como PDF:<\/strong> Cmd+P (Mac) o Ctrl+P (Windows) → elegir "Guardar como PDF" como destino.<\/div>\n  <div id="content"><\/div>\n  <script type="text/template" id="md-source">' +
  escaped +
  '</script>\n  <script>\n    window.addEventListener(\'load\', function() {\n      var el = document.getElementById(\'md-source\');\n      var raw = el.textContent.replace(/&lt;/g, \'<\').replace(/&gt;/g, \'>\').replace(/&quot;/g, \'"\').replace(/&amp;/g, \'&\');\n      if (typeof marked !== \'undefined\') {\n        marked.setOptions({ gfm: true, breaks: true });\n        document.getElementById(\'content\').innerHTML = marked.parse(raw);\n      }\n    });\n  <\/script>\n</body>\n</html>\n';

fs.writeFileSync(htmlPath, htmlCorrect);
console.log('Creado:', htmlPath);
