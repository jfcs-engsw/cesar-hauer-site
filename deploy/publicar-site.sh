#!/usr/bin/env bash
# Dispara, da máquina do Julio, o deploy do site na VPS FESB (deploy/vps-deploy.sh lá).
# Espelho do chd-plataforma-api/deploy/publicar-chd.sh: a chave fica só nesta máquina e o caminho dela é
# resolvido aqui dentro, nunca na linha de comando de quem chama (guarda de envios, ADR-0071).
# Uso: bash deploy/publicar-site.sh            -> roda o vps-deploy.sh na VPS
#      bash deploy/publicar-site.sh status     -> mostra Caddyfile, certificados e containers, sem alterar nada
#   VPS, CHAVE   destino SSH (padrão root@76.13.230.98) e chave (padrão ~/.ssh/sig_deploy)
set -euo pipefail

VPS="${VPS:-root@76.13.230.98}"
CHAVE="${CHAVE:-$HOME/.ssh/sig_deploy}"
[ -f "$CHAVE" ] || { echo "Chave SSH não encontrada: $CHAVE" >&2; exit 1; }
SSH=(ssh -i "$CHAVE" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o ServerAliveInterval=30 "$VPS")

case "${1:-deploy}" in
  status)
    "${SSH[@]}" 'echo "== Caddyfile"; cat ~/proxy-fesb/Caddyfile; echo; echo "== containers"; docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"; echo; echo "== certificados"; docker exec proxy-fesb sh -c "ls /data/caddy/certificates/*/ 2>/dev/null" || true; echo; echo "== log do proxy (ultimas 40 linhas)"; docker logs --tail 40 proxy-fesb 2>&1'
    ;;
  deploy)
    "${SSH[@]}" 'bash ~/cesar-hauer-site/deploy/vps-deploy.sh'
    ;;
  *)
    echo "Uso: $0 [deploy|status]" >&2; exit 1
    ;;
esac
