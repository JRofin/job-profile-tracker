#!/usr/bin/env python3
"""Genera 04-WORKFLOW-OVERVIEW.html desde el Markdown. No requiere Node."""
import html
from pathlib import Path

docs = Path(__file__).parent
md_path = docs / "04-WORKFLOW-OVERVIEW.md"
html_path = docs / "04-WORKFLOW-OVERVIEW.html"

md = md_path.read_text(encoding="utf-8")
escaped = html.escape(md)

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Profile Tracker — Workflow Overview</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.6; color: #333; }
    h1 { font-size: 1.75rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; }
    h2 { font-size: 1.35rem; margin-top: 2rem; color: #1e40af; }
    h3 { font-size: 1.15rem; margin-top: 1.5rem; }
    pre { background: #f1f5f9; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; line-height: 1.4; }
    code { font-family: ui-monospace, monospace; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #e2e8f0; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
    .print-hint { background: #dbeafe; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 2rem; font-size: 0.9rem; }
    @media print { .print-hint { display: none; } }
  </style>
</head>
<body>
  <div class="print-hint"><strong>Para guardar como PDF:</strong> Cmd+P (Mac) o Ctrl+P (Windows) → elegir "Guardar como PDF" como destino.</div>
  <div id="content"></div>
  <script type="text/template" id="md-source">""" + escaped + """</script>
  <script>
    window.addEventListener('load', function() {
      var el = document.getElementById('md-source');
      var raw = el.textContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      if (typeof marked !== 'undefined') {
        marked.setOptions({ gfm: true, breaks: true });
        document.getElementById('content').innerHTML = marked.parse(raw);
      }
    });
  </script>
</body>
</html>
"""

html_path.write_text(html_content, encoding="utf-8")
print("Creado:", html_path)
