#!/usr/bin/env bash
# Publica o site na VPS FESB (a mesma do sig-app), atrás de um Caddy com HTTPS automático.
# Idempotente: rodar de novo atualiza o site. Uso, na VPS:
#   bash ~/cesar-hauer-site/deploy/vps-deploy.sh
set -euo pipefail

HOST="${HOST:-cesarhauer.76-13-230-98.sslip.io}"
DIR="$HOME/cesar-hauer-site"
PROXY="$HOME/proxy-fesb"

echo "== 1. Site"
git -C "$DIR" pull --ff-only
(cd "$DIR" && docker compose up -d --build)

echo "== 2. Proxy (Caddy)"
if ! docker ps --format '{{.Names}}' | grep -qx proxy-fesb; then
  busy=$(ss -tlnp | grep -E ':(80|443)[[:space:]]' || true)
  if [ -n "$busy" ]; then
    echo "ABORTADO: as portas 80/443 já estão em uso por outro serviço. Nada foi alterado no proxy."
    echo "$busy"
    exit 2
  fi
fi

mkdir -p "$PROXY"
touch "$PROXY/Caddyfile"
# Acrescenta o bloco só se o host ainda não estiver no Caddyfile (preserva outros sites).
if ! grep -q "^$HOST {" "$PROXY/Caddyfile"; then
  cat >> "$PROXY/Caddyfile" <<EOF
$HOST {
	encode zstd gzip
	reverse_proxy 127.0.0.1:8081
}
EOF
fi

cat > "$PROXY/docker-compose.yml" <<'EOF'
services:
  caddy:
    image: caddy:2-alpine
    container_name: proxy-fesb
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./data:/data
      - ./config:/config
EOF

(cd "$PROXY" && docker compose up -d)
sleep 3
docker exec proxy-fesb caddy reload --config /etc/caddy/Caddyfile

echo "== 3. Firewall"
if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
  echo "ufw ativo: 80 e 443 liberadas"
else
  echo "ufw inativo: nada a fazer"
fi

echo "== 4. Conferência"
curl -s -o /dev/null -w "site local (8081): HTTP %{http_code}\n" http://127.0.0.1:8081/
sleep 10
curl -s -o /dev/null -w "https://$HOST: HTTP %{http_code}\n" "https://$HOST/" || echo "HTTPS ainda indisponível (certificado pode levar alguns segundos)"
docker ps --format '{{.Names}}\t{{.Status}}' | grep -E 'cesar-hauer-site|proxy-fesb'
