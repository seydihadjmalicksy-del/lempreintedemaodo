#!/usr/bin/env python3
"""
Script d'import MongoDB pour L'empreinte de Maodo
Usage: python import_to_mongodb.py

Assurez-vous d'avoir:
1. pip install pymongo dnspython
2. Décompressé le fichier tisoweb_export_XXXXXXXX.zip
3. Configuré MONGO_URL ci-dessous
"""

import os
import json
from pymongo import MongoClient

# ============================================
# CONFIGURATION - MODIFIEZ ICI
# ============================================
MONGO_URL = "mongodb+srv://<username>:<password>@cluster0.mxwazmy.mongodb.net/"
DB_NAME = "tariqa_tidiane"
EXPORT_DIR = "./mongodb"  # Dossier contenant les fichiers JSON exportés
# ============================================

def import_collection(db, collection_name, filepath):
    """Import une collection depuis un fichier JSON"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            documents = json.load(f)
        
        if not documents:
            print(f"  ⚠️  {collection_name}: vide (0 documents)")
            return 0
        
        # Supprimer les _id string pour permettre à MongoDB de générer de nouveaux ObjectId
        # ou convertir si nécessaire
        for doc in documents:
            if '_id' in doc:
                del doc['_id']
        
        # Insérer les documents
        collection = db[collection_name]
        result = collection.insert_many(documents)
        print(f"  ✅ {collection_name}: {len(result.inserted_ids)} documents importés")
        return len(result.inserted_ids)
    
    except Exception as e:
        print(f"  ❌ {collection_name}: Erreur - {e}")
        return 0

def main():
    print("=" * 60)
    print("Import MongoDB - L'empreinte de Maodo")
    print("=" * 60)
    
    # Connexion à MongoDB
    print(f"\nConnexion à {MONGO_URL[:50]}...")
    try:
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        # Test de connexion
        client.server_info()
        print(f"✅ Connecté à la base de données: {DB_NAME}")
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return
    
    # Liste des fichiers JSON à importer
    if not os.path.exists(EXPORT_DIR):
        print(f"❌ Dossier non trouvé: {EXPORT_DIR}")
        return
    
    json_files = [f for f in os.listdir(EXPORT_DIR) if f.endswith('.json')]
    print(f"\n{len(json_files)} collections à importer:\n")
    
    total_imported = 0
    
    # Collections à ignorer (sessions, etc.)
    skip_collections = ['admin_sessions']
    
    for filename in sorted(json_files):
        collection_name = filename.replace('.json', '')
        
        if collection_name in skip_collections:
            print(f"  ⏭️  {collection_name}: ignoré")
            continue
        
        filepath = os.path.join(EXPORT_DIR, filename)
        count = import_collection(db, collection_name, filepath)
        total_imported += count
    
    print("\n" + "=" * 60)
    print(f"Import terminé: {total_imported} documents importés")
    print("=" * 60)
    
    client.close()

if __name__ == "__main__":
    main()
