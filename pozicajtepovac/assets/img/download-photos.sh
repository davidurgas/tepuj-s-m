#!/usr/bin/env bash
# ------------------------------------------------------------------
# Stiahne AI placeholder fotky do tohto priečinka (assets/img/).
# Spusti na svojom počítači:  bash download-photos.sh
#
# Statická index.html načítava fotky priamo z CDN (funguje hneď).
# WordPress šablóna (page-pozicajtepovac.php) očakáva LOKÁLNE súbory
# photo-*.webp v tomto priečinku – preto ich pred nasadením stiahni
# týmto skriptom (alebo ich rovno nahraď vlastnými reálnymi fotkami).
# ------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"
BASE="https://d8j0ntlcm91z4.cloudfront.net/user_3AhuqzP4VjgsdpfdOEJfJ1mDnzs/hf_20260920_194312"

declare -A IMG=(
  [photo-machine.webp]="${BASE}_d0f14d04-53bc-4ab7-a9be-176581fab24e_min.webp"
  [photo-sofa.webp]="${BASE}_5a32401b-1e1a-4f1f-875e-c5793ded05df_min.webp"
  [photo-stripe.webp]="${BASE}_822836af-ac50-48c8-91d6-7edbc8cf3a18_min.webp"
  [photo-car.webp]="${BASE}_4c5fd454-5538-476d-abf6-0da30d4fdea2_min.webp"
  [photo-delivery.webp]="${BASE}_acd87b7b-bd9b-40a2-8a75-56e735ee0643_min.webp"
)

for name in "${!IMG[@]}"; do
  echo "→ ${name}"
  curl -fSL -o "${name}" "${IMG[$name]}"
done
echo "Hotovo. Fotky sú v $(pwd)"
