#!/bin/bash
# Carga nvm y arranca el servidor de desarrollo (npm no está en PATH sin nvm)
cd "$(dirname "$0")"
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 2>/dev/null || nvm use 18
  [ ! -d node_modules ] && npm install
  npm run dev
else
  echo "nvm no encontrado. Instálalo o ejecuta manualmente:"
  echo "  export NVM_DIR=\"\$HOME/.nvm\" && . \"\$NVM_DIR/nvm.sh\""
  echo "  nvm use 18"
  echo "  npm run dev"
  exit 1
fi
