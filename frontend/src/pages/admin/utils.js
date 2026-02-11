/**
 * Admin Panel - Shared utilities and hooks
 */
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return { Authorization: `Bearer ${token}` };
};

// Translations for admin panel
export const translations = {
  fr: {
    title: "Administration",
    welcome: "Bienvenue dans le panneau d'administration",
    logout: "Déconnexion",
    refresh: "Actualiser",
    addNew: "Ajouter",
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    confirmDelete: "Confirmer la suppression ?",
    yes: "Oui, supprimer",
    no: "Annuler",
    noContent: "Aucun contenu trouvé. Initialisez les données.",
    quotes: "Citations",
    events: "Événements",
    heritiers: "Héritiers",
    content: "Contenu",
    archives: "Archives",
    familyTree: "Arbre",
    ouvrages: "Ouvrages",
    editContent: "Modifier le contenu",
    seedContent: "Initialiser"
  },
  en: {
    title: "Administration",
    welcome: "Welcome to the administration panel",
    logout: "Logout",
    refresh: "Refresh",
    addNew: "Add",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Confirm deletion?",
    yes: "Yes, delete",
    no: "Cancel",
    noContent: "No content found. Initialize the data.",
    quotes: "Quotes",
    events: "Events",
    heritiers: "Khalifes",
    content: "Content",
    archives: "Archives",
    familyTree: "Family Tree",
    ouvrages: "Works",
    editContent: "Edit content",
    seedContent: "Initialize"
  },
  ar: {
    title: "الإدارة",
    welcome: "مرحباً بك في لوحة الإدارة",
    logout: "تسجيل الخروج",
    refresh: "تحديث",
    addNew: "إضافة",
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    confirmDelete: "تأكيد الحذف؟",
    yes: "نعم، احذف",
    no: "إلغاء",
    noContent: "لم يتم العثور على محتوى. قم بتهيئة البيانات.",
    quotes: "اقتباسات",
    events: "أحداث",
    heritiers: "خلفاء",
    content: "محتوى",
    archives: "أرشيف",
    familyTree: "شجرة العائلة",
    ouvrages: "مؤلفات",
    editContent: "تعديل المحتوى",
    seedContent: "تهيئة"
  },
  wo: {
    title: "Administration",
    welcome: "Dalal ak jamm ci panel administration bi",
    logout: "Génne",
    refresh: "Yeesal",
    addNew: "Yokk",
    save: "Dugal",
    cancel: "Neenal",
    edit: "Soppi",
    delete: "Far",
    confirmDelete: "Dëggu far bi?",
    yes: "Waaw, far ko",
    no: "Neenal",
    noContent: "Amul dara. Tëkkil données yi.",
    quotes: "Kàddu yi",
    events: "Xew-xew yi",
    heritiers: "Xaliifa yi",
    content: "Contenu",
    archives: "Archives",
    familyTree: "Mbokk",
    ouvrages: "Téere yi",
    editContent: "Soppi contenu",
    seedContent: "Tëkki"
  }
};

export default {
  API,
  getAuthHeaders,
  translations
};
