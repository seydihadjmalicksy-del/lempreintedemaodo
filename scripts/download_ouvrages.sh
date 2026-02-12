#!/bin/bash
# Script to download ouvrages PDFs if not present
# This ensures PDFs are available after deployment

OUVRAGES_DIR="/app/frontend/public/ouvrages"
LOG_FILE="/tmp/download_ouvrages.log"

# Create directory if not exists
mkdir -p "$OUVRAGES_DIR"

# Check if we need to download
PDF_COUNT=$(ls "$OUVRAGES_DIR"/*.pdf 2>/dev/null | wc -l)

if [ "$PDF_COUNT" -ge 50 ]; then
    echo "$(date): PDFs already present ($PDF_COUNT files)" >> "$LOG_FILE"
    exit 0
fi

echo "$(date): Starting PDF download..." >> "$LOG_FILE"

cd "$OUVRAGES_DIR"

# Download all PDFs in background
download_pdfs() {
    # El Hadj Malick SY
    curl -sL -o "abada-bourouq.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/abada-bourouq-ety.pdf" &
    curl -sL -o "adaboul-masdjid.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/adaboul-masdjid.pdf" &
    curl -sL -o "ala-ya-rassoulilahi.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/ala-ya-rassoulilahi-koulli-wadjmilati.pdf" &
    curl -sL -o "doua-wazifa.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/d8afd8b9d8a7d8a1-d8a7d984d988d8b8d98ad981d8a9-doua-wazifa.pdf" &
    curl -sL -o "fakihatoul-tulab-francais.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/10/fakihatoul-tulab-francais.pdf" &
    curl -sL -o "fakihatu-toulab-arabe.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/10/fakihatu-toulab-arabe.pdf" &
    curl -sL -o "fanadjina.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/fanadjina.pdf" &
    curl -sL -o "hidayatoul-wildane.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/hidacc82yatoul-wildacc82ne.pdf" &
    wait
    
    curl -sL -o "houroufou-salatoul-fatiha-maodo.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/houroufou-salatoul-fatiha-el-hadj-malick-sy.pdf" &
    curl -sL -o "ifhamoul-mounkiril-djani.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/d8a5d995d981d8add8a7d985-d8a7d984d985d986d983d8b1-d8a7d984d8acd8a7d986d98a.pdf" &
    curl -sL -o "khilasou-zahab.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/khilass-d8aed984d8a7d8b5-d8a7d984d8b0d987d8a8.pdf" &
    curl -sL -o "nouniya-arabe-francais.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/03/nouniya-ety-1.pdf" &
    curl -sL -o "qatmul-quran.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/qatmul-quran-del-hadj-malick-sy.pdf" &
    curl -sL -o "roufat.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/d8b1d981d8a7d8aa-d8b4d98ad8ae-d8a7d984d8add8a7d8ac-d985d8a7d984d983-d8b3d987.pdf" &
    curl -sL -o "taysir-wasilat-almana.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/taysir....pdf" &
    curl -sL -o "yallahou-ya-hayou-ya-qayou.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/yallahou-ya-hayou-ya-qayou.pdf" &
    wait
    
    curl -sL -o "ya-akramal-kourama.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/03/ya-akramal-kourama-ya-kashifa-da-i-ety.pdf" &
    curl -sL -o "ya-kashifa-dai-arabe-francais.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/10/ya-akramal-kourama-ya-kashifa-da-i.pdf" &
    curl -sL -o "zadjroul-khouloub.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/d8b2d98ed8acd992d8b1d98f-d8a7d984d992d982d98fd984d98fd988d8a8d992-zadjroul-khouloub....pdf" &
    curl -sL -o "fatabat-yadakoum.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/10/fatabat-yadakoum.pdf" &
    curl -sL -o "bourde.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/10/bourde1-2.pdf" &
    wait
    
    # Serigne Babacar SY
    curl -sL -o "alhamdoulilahi-haza-cheykhou.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/alhamdoulilahi-haza-cheykhou.pdf" &
    curl -sL -o "djazallahou-qoutbane.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/djazallahou-qoutbane.pdf" &
    curl -sL -o "hourouf-salatoul-fatiha-babacar.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/hourouf-salatoul-fatiha-serigne-babacar.pdf" &
    curl -sL -o "hourouf-salatoul-fatiha-serigne-babacar.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2021/01/hourouf-salatoul-fatiha-serigne-babacar.pdf" &
    curl -sL -o "heulmine-sabiline.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/heulmine-sabiline-1.pdf" &
    curl -sL -o "ma-dahrou-djada-bimaliki.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/ma-dahrou-djada-bimaliki.pdf" &
    curl -sL -o "mouridoul-qarmi.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/mouridoul-qarmi.pdf" &
    curl -sL -o "qasad-naman.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/qasad-naman.pdf" &
    wait
    
    curl -sL -o "sara-tayfouman-francais.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/sara-tayfouman-transcit.pdf" &
    curl -sL -o "sara-tayfou-mane-ya-akhi.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/sara-tayfou-mane-ya-akhi.pdf" &
    curl -sL -o "ya-fassou.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/ya-fassou....pdf" &
    curl -sL -o "ya-kamilan.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/03/ya-kamilan-ety.pdf" &
    curl -sL -o "ya-mane-ata-bi-khilasine.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/ya-mane-ata-bi-khilasine.pdf" &
    curl -sL -o "ya-qoutbou-ya.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/ya-qoutbou-ya.pdf" &
    curl -sL -o "wa-cheykhou-ahmadou-tidjanne.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/wa-cheykhou-ahmadou-tidjanne.pdf" &
    wait
    
    # Serigne Mansour Sy Malick
    curl -sL -o "ara-fil-qalbi.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/ara-fil-qalbi.pdf" &
    curl -sL -o "araftou-li-salma.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/araftou-li-salma.pdf" &
    curl -sL -o "fa-wa-adjaban.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/fa-wa-adjaban.pdf" &
    curl -sL -o "fardoun-alal-ibni.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/03/fardoune-alal-ibni....pdf" &
    curl -sL -o "ya-dhabiyatan-bi-zi-salam.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2024/10/ya-dhabiyatan-bi-zi-salam.pdf" &
    wait
    
    # Serigne Abdou Aziz SY
    curl -sL -o "allahou-akbarou.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/allahou-akbarou-la-karimuu-siwaaou.pdf" &
    curl -sL -o "wa-hassile-dawa-mane.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/wa-hassile-dawa-mane....pdf" &
    curl -sL -o "wolofal-mame-dabakh.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/wolofal-mame-dabakh.pdf" &
    curl -sL -o "ya-azouli.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/d98ad8a7d8b9d8b0d988d984d98a-d984d984d8b4d98ad8ae-d8b9d8a8d8af-d8a7d984d8b9d8b2d98ad8b2-d8b3d98a.pdf" &
    curl -sL -o "ya-mane-ala-koula-shay-in.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/ya-mane-ala-koula-shay-in.pdf" &
    wait
    
    # Autres textes
    curl -sL -o "achmawiyah-arabe.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/achmawiyah-arabe.pdf" &
    curl -sL -o "ashmawiyyah-francais.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/ashmawiyyah-franccca7ais-.pdf" &
    curl -sL -o "ahzab-wa-awrad.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/d8a3d8add8b2d8a7d8a8-d988d8a3d988d8b1d8a7d8af.pdf" &
    curl -sL -o "hizb-sayfi.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/d8a7d984d8add8b2d8a8-d8a7d984d8b3d98ad981d98a.pdf" &
    curl -sL -o "hizb-bahr.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/d8add8b2d8a8-d8a7d984d8a8d8add8b1.pdf" &
    curl -sL -o "hamziya-imam-bousseyri.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/04/hamziya.pdf" &
    curl -sL -o "rissala.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2020/05/rissacc82la.pdf" &
    wait
    
    # Thèses
    curl -sL -o "these-rawane-mbaye-vol-1.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2021/08/these-du-pr-rawane-mbaye-vol-1-tome-1-3.pdf" &
    curl -sL -o "these-rawane-mbaye-vol-2.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2021/08/these-du-pr-rawane-mbaye-vol-2-1.pdf" &
    curl -sL -o "these-rawane-mbaye-vol-3.pdf" "https://eutoutidjanneyi.wordpress.com/wp-content/uploads/2021/08/these-du-pr-rawane-mbaye-vol-3-1.pdf" &
    wait
}

download_pdfs

FINAL_COUNT=$(ls "$OUVRAGES_DIR"/*.pdf 2>/dev/null | wc -l)
echo "$(date): Download complete. $FINAL_COUNT PDFs available." >> "$LOG_FILE"
