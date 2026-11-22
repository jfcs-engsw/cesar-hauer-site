#!/usr/bin/env bash
# Publica o site na VPS FESB (a mesma do sig-app), atrás de um Caddy com HTTPS automático.
# Idempotente: rodar de novo atualiza o site. Uso, na VPS:
#   bash ~/cesar-hauer-site/deploy/vps-deploy.sh
#
# Endereços: HOST é o provisório (sslip.io), sempre atendido. DOMINIO é o definitivo (cesarhauer.com.br), no
# nome do Cesar; o bloco dele só entra no Caddyfile quando o DNS do domínio e do www já apontam para esta
# VPS, porque o Caddy pede o certificado assim que lê o bloco e, sem DNS, a emissão falharia e entraria em
# espera. Antes disso, o script avisa e segue. Depois que o Cesar apontar o DNS, basta rodar de novo.
# O /api/* do domínio vai para a chd-plataforma-api (porta 8082), como no endereço provisório.
set -euo pipefail

HOST="${HOST:-cesarhauer.76-13-230-98.sslip.io}"
DOMINIO="${DOMINIO:-cesarhauer.com.br}"
IP_VPS="${IP_VPS:-76.13.230.98}"
API_PORTA="${API_PORTA:-127.0.0.1:8082}"
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

# Domínio definitivo: cada bloco entra só quando o próprio nome já resolve para esta VPS.
resolve() { getent ahostsv4 "$1" 2>/dev/null | awk '{print $1}' | sort -u | tr '\n' ' '; }
aponta() { [[ " $(resolve "$1")" == *" $IP_VPS "* ]]; }
CADDY="$PROXY/Caddyfile"
copia="$CADDY.antes-dominio-$(date -u +%Y%m%dT%H%M%SZ)"
cp -p "$CADDY" "$copia"
mudou=0
if grep -q "^$DOMINIO {" "$CADDY"; then
  echo "Domínio $DOMINIO já está no Caddyfile."
elif aponta "$DOMINIO"; then
  cat >> "$CADDY" <<EOF
$DOMINIO {
	encode zstd gzip
	reverse_proxy /api/* $API_PORTA
	reverse_proxy 127.0.0.1:8081
}
EOF
  mudou=1
  echo "Domínio $DOMINIO acrescentado ao Caddyfile (DNS aponta para $IP_VPS). O certificado é emitido em seguida."
else
  echo "Domínio $DOMINIO ainda não aponta para esta VPS ($IP_VPS): A = $(resolve "$DOMINIO")(nenhum = sem registro)."
  echo "O site segue em https://$HOST. Depois do apontamento do DNS (docs/deploy/dominio-cesarhauer-com-br.md), rode este script de novo."
fi
if grep -q "^www.$DOMINIO {" "$CADDY"; then
  echo "www.$DOMINIO já está no Caddyfile."
elif aponta "www.$DOMINIO"; then
  cat >> "$CADDY" <<EOF
www.$DOMINIO {
	redir https://$DOMINIO{uri} permanent
}
EOF
  mudou=1
  echo "www.$DOMINIO acrescentado ao Caddyfile (redireciona para $DOMINIO)."
else
  echo "www.$DOMINIO ainda não aponta para esta VPS; o redirecionamento entra quando apontar."
fi
[ "$mudou" = 1 ] || rm -f "$copia"

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
if ! docker exec proxy-fesb caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
  if [ "$mudou" = 1 ]; then
    cat "$copia" >"$CADDY" # mesmo inode: o arquivo é montado no container
    echo "ABORTADO: Caddyfile novo inválido; restaurado o anterior ($copia)."
  else
    echo "ABORTADO: Caddyfile inválido (nada foi alterado por este script)."
  fi
  docker exec proxy-fesb caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile || true
  exit 2
fi
docker exec proxy-fesb caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
[ "$mudou" = 1 ] && echo "Caddyfile atualizado; cópia do anterior em $copia"

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
if grep -q "^$DOMINIO {" "$PROXY/Caddyfile"; then
  curl -s -o /dev/null -w "https://$DOMINIO: HTTP %{http_code}\n" --max-time 30 "https://$DOMINIO/" || echo "https://$DOMINIO ainda indisponível (primeiro certificado leva até um minuto; rode de novo para conferir)"
  curl -s -o /dev/null -w "https://www.$DOMINIO: HTTP %{http_code} (esperado 308)\n" --max-time 30 "https://www.$DOMINIO/" || true
fi
docker ps --format '{{.Names}}\t{{.Status}}' | grep -E 'cesar-hauer-site|proxy-fesb'
