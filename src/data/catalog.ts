import type {
  CatalogEntry,
  ChantType,
  CorpusLanguage,
  Deity,
  Occasion,
  SourceRef,
  Tradition,
} from "./types";

/**
 * The catalogue.
 *
 * These are compositions we can attribute, classify and point at an archive
 * for, but whose full text we deliberately do not reproduce. Devotional text
 * typed from memory drifts, and a drifted Rudram or Sahasranama is worse than
 * no Rudram at all — so the reader for these entries sends you to the
 * institution that actually holds the text.
 *
 * Entries in data/chants.ts are the opposite case: text we hold in full.
 * Both halves carry identical attribution metadata.
 */

type Extra = Partial<
  Pick<CatalogEntry, "occasions" | "tags" | "composer" | "era" | "textSource" | "extent" | "altTitles">
>;

type Seed = [
  slug: string,
  en: string,
  hi: string,
  deity: Deity[],
  type: ChantType,
  tradition: Tradition[],
  language: CorpusLanguage,
  sources: SourceRef[],
  note: string,
  extra?: Extra,
];

const sd = (path?: string): SourceRef => ({
  sourceId: "sanskrit-documents",
  ref: path,
  url: path ? `https://sanskritdocuments.org/${path}` : "https://sanskritdocuments.org/",
});
const gp: SourceRef = { sourceId: "gita-press", ref: "Aarti Sangrah / Bhajan Sangrah" };
const ttdA: SourceRef = { sourceId: "ttd-annamacharya" };
const ttdP: SourceRef = { sourceId: "ttd-divya-prabandham" };
const ttdD: SourceRef = { sourceId: "ttd-dasa-sahitya" };
const ig: SourceRef = { sourceId: "ignca" };
const dls: SourceRef = { sourceId: "dlshq" };
const bap: SourceRef = { sourceId: "baps" };
const bel: SourceRef = { sourceId: "belur-math" };
const ved: SourceRef = { sourceId: "vedabase" };
const kcom: SourceRef = { sourceId: "krishna-com" };

const SEEDS: Seed[] = [
  // ─── Vedic / foundational ───────────────────────────────────────────────
  ["sri-rudram-namakam", "Sri Rudram — Namakam", "श्री रुद्रम् नमकम्", ["shiva"], "suktam", ["vedic", "shaiva"], "sanskrit", [sd("sanskrit/veda/")], "The central Vedic hymn to Rudra, chanted in Shiva temples and during abhishekam.", { textSource: "Krishna Yajurveda, Taittiriya Samhita 4.5", era: "Vedic", occasions: ["maha-shivratri", "pradosh"] }],
  ["chamakam", "Chamakam", "चमकम्", ["shiva"], "suktam", ["vedic", "shaiva"], "sanskrit", [sd("sanskrit/veda/")], "The companion to the Namakam, asking for what sustains life.", { textSource: "Krishna Yajurveda, Taittiriya Samhita 4.7", era: "Vedic" }],
  ["purusha-suktam", "Purusha Suktam", "पुरुष सूक्तम्", ["vishnu", "general"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "The hymn of the cosmic Person, used in almost every formal puja.", { textSource: "Rigveda 10.90", era: "Vedic", occasions: ["general-puja"] }],
  ["sri-suktam", "Sri Suktam", "श्री सूक्तम्", ["lakshmi"], "suktam", ["vedic", "shakta"], "sanskrit", [sd("sanskrit/veda/")], "The Vedic invocation of Sri Lakshmi, recited through Diwali and Varalakshmi Vrata.", { textSource: "Rigveda khila", era: "Vedic", occasions: ["diwali", "varalakshmi"] }],
  ["narayana-suktam", "Narayana Suktam", "नारायण सूक्तम्", ["vishnu"], "suktam", ["vedic", "vaishnava"], "sanskrit", [sd("sanskrit/veda/")], "Declares Narayana as the ground of all that exists.", { textSource: "Taittiriya Aranyaka", era: "Vedic" }],
  ["durga-suktam", "Durga Suktam", "दुर्गा सूक्तम्", ["durga"], "suktam", ["vedic", "shakta"], "sanskrit", [sd("sanskrit/veda/")], "Vedic hymn to Durga as the fire that carries one across difficulty.", { occasions: ["navratri"], era: "Vedic" }],
  ["devi-suktam", "Devi Suktam", "देवी सूक्तम्", ["devi"], "suktam", ["vedic", "shakta"], "sanskrit", [sd("sanskrit/veda/")], "The Goddess speaks in her own voice as the power behind the gods.", { textSource: "Rigveda 10.125", era: "Vedic", occasions: ["navratri"] }],
  ["medha-suktam", "Medha Suktam", "मेधा सूक्तम्", ["saraswati"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "A Vedic prayer for intellect and retention, used at the start of study.", { occasions: ["vasant-panchami"], era: "Vedic" }],
  ["mantra-pushpam", "Mantra Pushpam", "मन्त्र पुष्पम्", ["general"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "The 'flower of mantras' offered at the close of temple worship.", { textSource: "Taittiriya Aranyaka", era: "Vedic", occasions: ["general-puja"] }],
  ["manyu-suktam", "Manyu Suktam", "मन्यु सूक्तम्", ["general"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "Addressed to Manyu, righteous fervour, for courage under attack.", { era: "Vedic" }],
  ["bhu-suktam", "Bhu Suktam", "भू सूक्तम्", ["devi"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "Hymn to the earth goddess, chanted in land and housewarming rites.", { era: "Vedic" }],
  ["nila-suktam", "Nila Suktam", "नील सूक्तम्", ["devi"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "Recited with Sri and Bhu Suktam in Vaishnava temple liturgy.", { era: "Vedic" }],
  ["ganapati-suktam", "Ganapati Suktam", "गणपति सूक्तम्", ["ganesha"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "Vedic invocation of Ganapati as lord of the assembly.", { era: "Vedic", occasions: ["ganesh-chaturthi"] }],
  ["nasadiya-suktam", "Nasadiya Suktam", "नासदीय सूक्तम्", ["general"], "suktam", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "The creation hymn that ends by asking whether anyone knows at all.", { textSource: "Rigveda 10.129", era: "Vedic" }],
  ["ratri-suktam", "Ratri Suktam", "रात्रि सूक्तम्", ["devi"], "suktam", ["vedic", "shakta"], "sanskrit", [sd("sanskrit/veda/")], "Hymn to Night as a protective goddess; part of Durga Saptashati recitation.", { textSource: "Rigveda 10.127", era: "Vedic", occasions: ["navratri"] }],
  ["aditya-hridayam", "Aditya Hridayam", "आदित्य हृदयम्", ["surya"], "stotra", ["vedic", "vaishnava"], "sanskrit", [sd("doc_deities_misc/")], "Taught to Rama before battle; recited at sunrise for strength.", { textSource: "Valmiki Ramayana, Yuddha Kanda 105", occasions: ["daily-morning"] }],

  // ─── Shanti / opening ───────────────────────────────────────────────────
  ["om-purnamadah", "Om Purnamadah Purnamidam", "ॐ पूर्णमदः पूर्णमिदम्", ["general"], "mantra", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "Wholeness taken from wholeness leaves wholeness.", { textSource: "Isha Upanishad", era: "Vedic" }],
  ["asato-ma", "Asato Ma Sad Gamaya", "असतो मा सद्गमय", ["general"], "mantra", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "From the unreal to the real, from darkness to light, from death to deathlessness.", { textSource: "Brihadaranyaka Upanishad 1.3.28", era: "Vedic" }],
  ["sarve-bhavantu-sukhinah", "Sarve Bhavantu Sukhinah", "सर्वे भवन्तु सुखिनः", ["general"], "mantra", ["vedic"], "sanskrit", [sd("sanskrit/veda/"), dls], "May all beings be happy and free of illness — the common closing prayer.", { era: "Vedic" }],
  ["om-bhadram-karnebhih", "Om Bhadram Karnebhih", "ॐ भद्रं कर्णेभिः", ["general"], "mantra", ["vedic"], "sanskrit", [sd("sanskrit/veda/")], "A Vedic santi patha asking that we hear and see what is auspicious.", { era: "Vedic" }],

  // ─── Ganesha ────────────────────────────────────────────────────────────
  ["ganapati-atharvashirsha", "Ganapati Atharvashirsha", "गणपत्यथर्वशीर्ष", ["ganesha"], "suktam", ["vedic"], "sanskrit", [sd("doc_ganesha/atharva.html")], "The Upanishadic text identifying Ganapati with Brahman itself.", { textSource: "Atharva Veda tradition", occasions: ["ganesh-chaturthi", "sankashti"] }],
  ["ganesha-pancharatnam", "Ganesha Pancharatnam", "गणेश पञ्चरत्नम्", ["ganesha"], "stotra", ["smarta"], "sanskrit", [sd("doc_ganesha/")], "Five 'jewels' to Ganesha, in a fast rolling metre.", { composer: "Adi Shankaracharya", era: "8th c." }],
  ["sankata-nashana-ganesha-stotram", "Sankata Nashana Ganesha Stotram", "संकटनाशन गणेश स्तोत्रम्", ["ganesha"], "stotra", ["smarta"], "sanskrit", [sd("doc_ganesha/")], "Twelve names of Ganesha recited to clear an obstruction.", { textSource: "Narada Purana", occasions: ["sankashti"] }],
  ["ganesha-sahasranama", "Ganesha Sahasranama", "गणेश सहस्रनाम", ["ganesha"], "sahasranama", ["smarta"], "sanskrit", [sd("doc_ganesha/")], "The thousand names of Ganesha.", { textSource: "Ganesha Purana", extent: "1,000 names" }],
  ["ganesha-kavacham", "Ganesha Kavacham", "गणेश कवचम्", ["ganesha"], "kavacham", ["smarta"], "sanskrit", [sd("doc_ganesha/")], "Protective 'armour' assigning Ganesha to each part of the body.", {}],
  ["ganesha-chalisa", "Ganesha Chalisa", "गणेश चालीसा", ["ganesha"], "chalisa", ["pan-hindu"], "hindi", [sd("sanskrit/chalisa/"), gp], "The forty-verse Hindi hymn to Ganesha.", { extent: "40 verses", occasions: ["ganesh-chaturthi", "sankashti"] }],
  ["ganesha-bhujangam", "Ganesha Bhujanga Stotram", "गणेश भुजङ्गम्", ["ganesha"], "stotra", ["smarta"], "sanskrit", [sd("doc_ganesha/")], "In the serpentine bhujanga metre.", { composer: "Adi Shankaracharya" }],

  // ─── Shiva ──────────────────────────────────────────────────────────────
  ["shiva-mahimna-stotram", "Shiva Mahimna Stotram", "शिव महिम्नः स्तोत्रम्", ["shiva"], "stotra", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "The gandharva Pushpadanta's apology and praise of Shiva's immeasurable greatness.", { composer: "Pushpadanta", occasions: ["maha-shivratri"] }],
  ["shiva-tandava-stotram", "Shiva Tandava Stotram", "शिव ताण्डव स्तोत्रम्", ["shiva"], "stotra", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "Ravana's thundering hymn, composed in a metre that imitates the dance.", { composer: "Ravana", occasions: ["maha-shivratri"] }],
  ["rudrashtakam", "Rudrashtakam", "रुद्राष्टकम्", ["shiva"], "ashtakam", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "Eight verses beginning 'Namamisham ishana', from the Ramcharitmanas.", { composer: "Tulsidas", era: "16th c.", textSource: "Ramcharitmanas, Uttara Kanda" }],
  ["lingashtakam", "Lingashtakam", "लिङ्गाष्टकम्", ["shiva"], "ashtakam", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "Eight verses to the Shiva linga, sung during abhishekam.", { occasions: ["maha-shivratri", "pradosh"] }],
  ["bilvashtakam", "Bilvashtakam", "बिल्वाष्टकम्", ["shiva"], "ashtakam", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "Sung while offering bilva leaves.", { occasions: ["maha-shivratri"] }],
  ["shiva-panchakshara-stotram", "Shiva Panchakshara Stotram", "शिव पञ्चाक्षर स्तोत्रम्", ["shiva"], "stotra", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "One verse for each syllable of Na-ma-shi-va-ya.", { composer: "Adi Shankaracharya" }],
  ["dakshinamurti-stotram", "Dakshinamurti Stotram", "दक्षिणामूर्ति स्तोत्रम्", ["shiva", "guru"], "stotra", ["smarta"], "sanskrit", [sd("doc_shiva/")], "Shiva as the silent teacher facing south; a compact Advaita text.", { composer: "Adi Shankaracharya" }],
  ["kalabhairava-ashtakam", "Kalabhairava Ashtakam", "कालभैरवाष्टकम्", ["shiva"], "ashtakam", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "To Bhairava of Kashi, guardian of the city and of time.", { composer: "Adi Shankaracharya" }],
  ["shiva-manasa-puja", "Shiva Manasa Puja", "शिव मानस पूजा", ["shiva"], "stotra", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "A puja performed entirely in the mind, offering imagined flowers and lamps.", { composer: "Adi Shankaracharya" }],
  ["shiva-sahasranama", "Shiva Sahasranama", "शिव सहस्रनाम", ["shiva"], "sahasranama", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "The thousand names of Shiva.", { textSource: "Mahabharata, Anushasana Parva", extent: "1,000 names" }],
  ["shiva-aparadha-kshamapana", "Shiva Aparadha Kshamapana Stotram", "शिवापराधक्षमापण स्तोत्रम्", ["shiva"], "stotra", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "An apology for every failure of worship.", { composer: "Adi Shankaracharya" }],
  ["ardhanarishvara-stotram", "Ardhanarishvara Stotram", "अर्धनारीश्वर स्तोत्रम्", ["shiva", "parvati"], "stotra", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "Alternating half-lines to Shiva and Parvati in one body.", { composer: "Adi Shankaracharya" }],
  ["chandrashekhara-ashtakam", "Chandrashekhara Ashtakam", "चन्द्रशेखराष्टकम्", ["shiva"], "ashtakam", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "Eight verses to the one who wears the moon.", {}],
  ["shiva-kavacham", "Shiva Kavacham", "शिव कवचम्", ["shiva"], "kavacham", ["shaiva"], "sanskrit", [sd("doc_shiva/")], "Protective armour hymn to Shiva.", {}],
  ["shiva-chalisa", "Shiva Chalisa", "शिव चालीसा", ["shiva"], "chalisa", ["pan-hindu"], "hindi", [sd("sanskrit/chalisa/"), gp], "Forty verses to Shiva in Hindi.", { extent: "40 verses", occasions: ["maha-shivratri", "pradosh"] }],

  // ─── Vishnu / Narayana ──────────────────────────────────────────────────
  ["vishnu-sahasranama", "Vishnu Sahasranama", "विष्णु सहस्रनाम", ["vishnu"], "sahasranama", ["vaishnava"], "sanskrit", [sd("doc_vishhnu/")], "Bhishma's thousand names of Vishnu, recited weekly in countless homes.", { textSource: "Mahabharata, Anushasana Parva ch. 149", extent: "1,000 names", occasions: ["ekadashi", "daily-morning"] }],
  ["narayana-kavacham", "Narayana Kavacham", "नारायण कवचम्", ["vishnu"], "kavacham", ["vaishnava"], "sanskrit", [sd("doc_vishhnu/")], "The armour Indra is given in the Bhagavata.", { textSource: "Bhagavata Purana 6.8" }],
  ["achyutashtakam", "Achyutashtakam", "अच्युताष्टकम्", ["vishnu", "krishna"], "ashtakam", ["vaishnava"], "sanskrit", [sd("doc_vishhnu/")], "Eight verses on the names of the unfallen one.", { composer: "Adi Shankaracharya" }],
  ["madhurashtakam", "Madhurashtakam", "मधुराष्टकम्", ["krishna"], "ashtakam", ["vaishnava"], "sanskrit", [sd("doc_krishna/")], "Everything about him is sweet — 'madhuram' closes every line.", { composer: "Vallabhacharya", era: "15th–16th c." }],
  ["mukunda-mala", "Mukunda Mala Stotra", "मुकुन्दमाला", ["vishnu"], "stotra", ["sri-vaishnava"], "sanskrit", [sd("doc_vishhnu/"), ved], "The garland of verses attributed to the Alvar-king Kulasekhara.", { composer: "Kulashekhara Alvar", era: "9th c." }],
  ["govinda-damodara-stotram", "Govinda Damodara Stotram", "गोविन्द दामोदर स्तोत्रम्", ["krishna"], "stotra", ["vaishnava"], "sanskrit", [sd("doc_krishna/"), ved], "Every verse ends by calling Govinda, Damodara, Madhava.", { composer: "Bilvamangala Thakura" }],
  ["hari-stotram", "Hari Stotram", "हरि स्तोत्रम्", ["vishnu"], "stotra", ["vaishnava"], "sanskrit", [sd("doc_vishhnu/")], "'Jagajjalapalam' — a rapid, much-sung praise of Hari.", {}],
  ["jagannatha-ashtakam", "Jagannatha Ashtakam", "जगन्नाथाष्टकम्", ["jagannath"], "ashtakam", ["vaishnava", "gaudiya"], "sanskrit", [sd("doc_vishhnu/"), ved], "'May Jagannatha be the object of my vision' — sung at Rath Yatra.", { occasions: ["rath-yatra"] }],
  ["dashavatara-stotram", "Dashavatara Stotra", "दशावतार स्तोत्रम्", ["vishnu"], "stotra", ["vaishnava", "gaudiya"], "sanskrit", [sd("doc_vishhnu/"), ved], "The ten avatars, from the Gita Govinda.", { composer: "Jayadeva", era: "12th c.", textSource: "Gita Govinda" }],
  ["vishnu-shatpadi", "Vishnu Shatpadi Stotram", "विष्णु षट्पदी", ["vishnu"], "stotra", ["vaishnava"], "sanskrit", [sd("doc_vishhnu/")], "Six verses of self-surrender.", { composer: "Adi Shankaracharya" }],
  ["narasimha-kavacham", "Narasimha Kavacham", "नृसिंह कवचम्", ["narasimha"], "kavacham", ["vaishnava"], "sanskrit", [sd("doc_vishhnu/")], "Prahlada's armour hymn to the man-lion.", { occasions: ["narasimha-jayanti"] }],
  ["venkateshwara-suprabhatam", "Venkateshwara Suprabhatam", "वेङ्कटेश सुप्रभातम्", ["venkateshwara"], "suprabhatam", ["sri-vaishnava"], "sanskrit", [ttdA, sd("doc_vishhnu/")], "The dawn hymn that wakes Balaji at Tirumala every morning.", { composer: "Prativadi Bhayankara Annan", era: "15th c.", occasions: ["daily-morning"] }],
  ["bhaja-govindam", "Bhaja Govindam", "भज गोविन्दम्", ["krishna", "general"], "stotra", ["smarta"], "sanskrit", [sd("doc_z_misc_shankaracharya/"), dls], "'Worship Govinda, fool — grammar will not save you at the end.'", { composer: "Adi Shankaracharya", altTitles: ["Moha Mudgara"] }],

  // ─── Krishna & Gaudiya ──────────────────────────────────────────────────
  ["damodarashtakam", "Damodarashtakam", "दामोदराष्टकम्", ["krishna"], "ashtakam", ["gaudiya"], "sanskrit", [ved, kcom], "Sung nightly through the month of Kartika.", { textSource: "Padma Purana", occasions: ["kartik-purnima"] }],
  ["govindashtakam", "Govindashtakam", "गोविन्दाष्टकम्", ["krishna"], "ashtakam", ["vaishnava"], "sanskrit", [sd("doc_krishna/")], "Eight verses to Govinda.", { composer: "Adi Shankaracharya" }],
  ["gopala-sahasranama", "Gopala Sahasranama", "गोपाल सहस्रनाम", ["krishna"], "sahasranama", ["gaudiya"], "sanskrit", [sd("doc_krishna/"), ved], "The thousand names of the cowherd.", { extent: "1,000 names" }],
  ["krishna-ashtakam", "Krishna Ashtakam", "कृष्णाष्टकम्", ["krishna"], "ashtakam", ["vaishnava"], "sanskrit", [sd("doc_krishna/")], "Eight verses on Krishna's form and play.", { occasions: ["janmashtami"] }],
  ["bala-mukundashtakam", "Bala Mukundashtakam", "बालमुकुन्दाष्टकम्", ["krishna"], "ashtakam", ["vaishnava"], "sanskrit", [sd("doc_krishna/")], "The infant Krishna asleep on a banyan leaf.", { occasions: ["janmashtami"] }],
  ["jaya-radha-madhava", "Jaya Radha Madhava", "जय राधा माधव", ["radha-krishna"], "kirtan", ["gaudiya"], "bengali", [ved, kcom], "Sung before class and lecture across the Gaudiya world.", { composer: "Bhaktivinoda Thakura", era: "19th c." }],
  ["gaura-arati", "Gaura Arati (Kiba Jaya Jaya)", "गौर आरति", ["chaitanya"], "aarti", ["gaudiya"], "bengali", [ved, kcom], "The evening arati song for Chaitanya Mahaprabhu.", { composer: "Bhaktivinoda Thakura", occasions: ["daily-evening"] }],
  ["sri-guru-vandana", "Sri Guru Vandana", "श्री गुरु वन्दना", ["guru"], "kirtan", ["gaudiya"], "bengali", [ved], "'Sri guru charana padma' — the morning guru-puja song.", { composer: "Narottama Dasa Thakura", era: "16th c.", occasions: ["daily-morning", "guru-purnima"] }],
  ["tulasi-arati", "Tulasi Arati (Namo Namah)", "तुलसी आरति", ["tulasi", "krishna"], "aarti", ["gaudiya"], "bengali", [ved, kcom], "Sung while circling the Tulasi plant at dawn.", { composer: "Narottama Dasa Thakura", occasions: ["daily-morning"] }],
  ["parama-karuna", "Parama Karuna", "परम करुण", ["chaitanya"], "kirtan", ["gaudiya"], "bengali", [ved], "On the mercy of Nitai and Gaura.", { composer: "Locana Dasa Thakura", era: "16th c." }],

  // ─── Rama & Hanuman ─────────────────────────────────────────────────────
  ["rama-raksha-stotram", "Rama Raksha Stotram", "राम रक्षा स्तोत्रम्", ["rama"], "kavacham", ["vaishnava"], "sanskrit", [sd("doc_raama/rraksha.html")], "The protective hymn placing Rama over every limb.", { composer: "Budhakaushika", occasions: ["ram-navami"] }],
  ["nama-ramayanam", "Nama Ramayanam", "नाम रामायणम्", ["rama"], "stotra", ["vaishnava"], "sanskrit", [sd("doc_raama/")], "The whole Ramayana told through Rama's names.", { occasions: ["ram-navami"] }],
  ["rama-sahasranama", "Rama Sahasranama", "राम सहस्रनाम", ["rama"], "sahasranama", ["vaishnava"], "sanskrit", [sd("doc_raama/")], "The thousand names of Rama.", { extent: "1,000 names" }],
  ["rama-bhujanga-stotram", "Rama Bhujanga Stotram", "राम भुजङ्ग स्तोत्रम्", ["rama"], "stotra", ["vaishnava"], "sanskrit", [sd("doc_raama/")], "In the rolling bhujanga metre.", { composer: "Adi Shankaracharya" }],
  ["shri-ram-jai-ram", "Sri Ram Jai Ram Jai Jai Ram", "श्री राम जय राम जय जय राम", ["rama"], "mantra", ["pan-hindu"], "sanskrit", [gp, dls], "The thirteen-syllable Rama taraka mantra, sung as a continuous dhun.", {}],
  ["bajrang-baan", "Bajrang Baan", "बजरंग बाण", ["hanuman"], "stotra", ["pan-hindu"], "awadhi", [sd("doc_hanumaan/"), gp], "The 'arrow' recited on Tuesdays for urgent protection.", { composer: "Tulsidas", era: "16th c." }],
  ["hanuman-bahuk", "Hanuman Bahuk", "हनुमान बाहुक", ["hanuman"], "stotra", ["pan-hindu"], "awadhi", [sd("doc_hanumaan/"), gp], "Tulsidas's plea to Hanuman during a long illness of the arm.", { composer: "Tulsidas", era: "16th c." }],
  ["hanuman-ashtak", "Sankat Mochan Hanuman Ashtak", "संकटमोचन हनुमानाष्टक", ["hanuman"], "ashtakam", ["pan-hindu"], "awadhi", [sd("doc_hanumaan/"), gp], "Eight verses, each ending 'kou nahin Hanuman se'.", { composer: "Tulsidas" }],
  ["anjaneya-dandakam", "Anjaneya Dandakam", "आञ्जनेय दण्डकम्", ["hanuman"], "stotra", ["pan-hindu"], "telugu", [sd("doc_hanumaan/")], "The Telugu dandaka recited in a single breath-driven sweep.", {}],
  ["hanuman-kavacham", "Hanuman Kavacham", "हनुमान कवचम्", ["hanuman"], "kavacham", ["pan-hindu"], "sanskrit", [sd("doc_hanumaan/")], "Armour hymn for protection and courage.", {}],
  ["hanumat-pancharatnam", "Hanumat Pancharatnam", "हनुमत् पञ्चरत्नम्", ["hanuman"], "stotra", ["smarta"], "sanskrit", [sd("doc_hanumaan/")], "Five jewels to Hanuman.", { composer: "Adi Shankaracharya" }],

  // ─── Devi / Shakti ──────────────────────────────────────────────────────
  ["durga-saptashati", "Durga Saptashati (Devi Mahatmyam)", "दुर्गा सप्तशती", ["durga", "devi"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "Seven hundred verses on the Goddess's victories; the core Navaratri text.", { textSource: "Markandeya Purana", extent: "700 verses", occasions: ["navratri", "durga-ashtami"] }],
  ["devi-kavacham", "Devi Kavacham", "देवी कवचम्", ["durga"], "kavacham", ["shakta"], "sanskrit", [sd("doc_devii/")], "Recited before the Saptashati as protective armour.", { occasions: ["navratri"] }],
  ["argala-stotram", "Argala Stotram", "अर्गला स्तोत्रम्", ["durga"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "The 'bolt' opened before Saptashati recitation.", { occasions: ["navratri"] }],
  ["kilaka-stotram", "Kilaka Stotram", "कीलक स्तोत्रम्", ["durga"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "The 'nail' removed to unlock the Saptashati.", { occasions: ["navratri"] }],
  ["mahishasura-mardini-stotram", "Mahishasura Mardini Stotram", "महिषासुरमर्दिनि स्तोत्रम्", ["durga"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "'Ayi giri nandini' — a galloping hymn to the slayer of Mahisha.", { occasions: ["navratri", "durga-ashtami"] }],
  ["devi-aparadha-kshamapana", "Devi Aparadha Kshamapana Stotram", "देव्यपराधक्षमापण स्तोत्रम्", ["devi"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "'A bad son may be born, but there is never a bad mother.'", { composer: "Adi Shankaracharya" }],
  ["durga-chalisa", "Durga Chalisa", "दुर्गा चालीसा", ["durga"], "chalisa", ["pan-hindu"], "hindi", [sd("sanskrit/chalisa/"), gp], "Forty verses to Durga.", { extent: "40 verses", occasions: ["navratri"] }],
  ["durga-saptashloki", "Durga Saptashloki", "दुर्गा सप्तश्लोकी", ["durga"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "Seven verses standing in for the full Saptashati.", { occasions: ["navratri"] }],
  ["lalita-sahasranama", "Lalita Sahasranama", "ललिता सहस्रनाम", ["lalita"], "sahasranama", ["shakta"], "sanskrit", [sd("doc_devii/")], "The thousand names of Lalita Tripurasundari, central to Sri Vidya.", { textSource: "Brahmanda Purana", extent: "1,000 names" }],
  ["lalita-trishati", "Lalita Trishati", "ललिता त्रिशती", ["lalita"], "sahasranama", ["shakta"], "sanskrit", [sd("doc_devii/")], "Three hundred names built on the Panchadasi mantra.", { extent: "300 names" }],
  ["saundarya-lahari", "Saundarya Lahari", "सौन्दर्य लहरी", ["lalita", "parvati"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "The 'wave of beauty' — a hundred verses of Sri Vidya and poetry at once.", { composer: "Adi Shankaracharya", extent: "100 verses" }],
  ["kanakadhara-stotram", "Kanakadhara Stotram", "कनकधारा स्तोत्रम्", ["lakshmi"], "stotra", ["smarta"], "sanskrit", [sd("doc_devii/")], "The hymn that is said to have rained gold on a poor woman's house.", { composer: "Adi Shankaracharya", occasions: ["diwali", "varalakshmi"] }],
  ["mahalakshmi-ashtakam", "Mahalakshmi Ashtakam", "महालक्ष्म्यष्टकम्", ["lakshmi"], "ashtakam", ["vaishnava"], "sanskrit", [sd("doc_devii/")], "Indra's eight verses to Mahalakshmi.", { textSource: "Padma Purana", occasions: ["diwali", "varalakshmi"] }],
  ["ashta-lakshmi-stotram", "Ashta Lakshmi Stotram", "अष्टलक्ष्मी स्तोत्रम्", ["lakshmi"], "stotra", ["vaishnava"], "sanskrit", [sd("doc_devii/")], "The eight forms of Lakshmi, one verse each.", { occasions: ["diwali"] }],
  ["lakshmi-chalisa", "Lakshmi Chalisa", "लक्ष्मी चालीसा", ["lakshmi"], "chalisa", ["pan-hindu"], "hindi", [sd("sanskrit/chalisa/"), gp], "Forty verses to Lakshmi.", { extent: "40 verses", occasions: ["diwali"] }],
  ["saraswati-chalisa", "Saraswati Chalisa", "सरस्वती चालीसा", ["saraswati"], "chalisa", ["pan-hindu"], "hindi", [sd("sanskrit/chalisa/"), gp], "Forty verses to Saraswati.", { extent: "40 verses", occasions: ["vasant-panchami"] }],
  ["sharada-bhujangam", "Sharada Bhujanga Stotram", "शारदा भुजङ्गम्", ["saraswati"], "stotra", ["smarta"], "sanskrit", [sd("doc_devii/")], "To Sharada of Sringeri.", { composer: "Adi Shankaracharya" }],
  ["kalika-ashtakam", "Kalika Ashtakam", "कालिकाष्टकम्", ["kali"], "ashtakam", ["shakta"], "sanskrit", [sd("doc_devii/"), bel], "Eight verses to Kali.", { composer: "Adi Shankaracharya", occasions: ["kali-puja"] }],
  ["kali-kavacham", "Kali Kavacham", "काली कवचम्", ["kali"], "kavacham", ["shakta"], "sanskrit", [sd("doc_devii/")], "Protective armour of the fierce mother.", { occasions: ["kali-puja"] }],
  ["shyama-sangeet-ramprasad", "Shyama Sangeet of Ramprasad", "श्यामा संगीत", ["kali"], "shyama-sangeet", ["shakta"], "bengali", [bel], "The Bengali songs to Kali that Ramakrishna sang constantly.", { composer: "Ramprasad Sen", era: "18th c.", occasions: ["kali-puja"] }],
  ["annapurna-stotram", "Annapurna Stotram", "अन्नपूर्णा स्तोत्रम्", ["parvati"], "stotra", ["shakta"], "sanskrit", [sd("doc_devii/")], "To the goddess who feeds Kashi; ends by asking alms of the mother.", { composer: "Adi Shankaracharya" }],

  // ─── Surya, Skanda, Ayyappa, Datta, Navagraha, Guru ─────────────────────
  ["surya-ashtakam", "Surya Ashtakam", "सूर्याष्टकम्", ["surya"], "ashtakam", ["smarta"], "sanskrit", [sd("doc_deities_misc/")], "Eight verses at sunrise.", { occasions: ["daily-morning", "makar-sankranti"] }],
  ["surya-kavacham", "Surya Kavacham", "सूर्य कवचम्", ["surya"], "kavacham", ["smarta"], "sanskrit", [sd("doc_deities_misc/")], "Armour hymn to the sun.", {}],
  ["subrahmanya-bhujangam", "Subrahmanya Bhujangam", "सुब्रह्मण्य भुजङ्गम्", ["skanda"], "stotra", ["shaiva"], "sanskrit", [sd("doc_subrahmanya/")], "Composed at Tiruchendur in the bhujanga metre.", { composer: "Adi Shankaracharya", occasions: ["skanda-shashti"] }],
  ["skanda-shashti-kavacham", "Skanda Shashti Kavacham", "स्कन्द षष्ठी कवचम्", ["skanda"], "kavacham", ["shaiva"], "tamil", [sd("doc_subrahmanya/")], "The Tamil armour hymn recited through the six days of Shashti.", { composer: "Devaraya Swamigal", occasions: ["skanda-shashti"] }],
  ["harivarasanam", "Harivarasanam", "हरिवरासनम्", ["ayyappa"], "stotra", ["vaishnava", "shaiva"], "sanskrit", [sd("doc_deities_misc/")], "The lullaby sung as the Sabarimala sanctum closes each night.", { occasions: ["daily-night"] }],
  ["ayyappa-ashtottara", "Ayyappa Ashtottara Shatanamavali", "अय्यप्प अष्टोत्तर शतनामावली", ["ayyappa"], "sahasranama", ["pan-hindu"], "sanskrit", [sd("doc_deities_misc/")], "The 108 names of Ayyappa.", { extent: "108 names" }],
  ["datta-stotram", "Dattatreya Stotram", "दत्तात्रेय स्तोत्रम्", ["dattatreya"], "stotra", ["smarta"], "sanskrit", [sd("doc_deities_misc/")], "'Jagadutpatti karträ' — the short Narada hymn to Datta.", { composer: "Narada", occasions: ["dattatreya-jayanti"] }],
  ["datta-atharvashirsha", "Datta Atharvashirsha", "दत्तात्रेय अथर्वशीर्ष", ["dattatreya"], "suktam", ["smarta"], "sanskrit", [sd("doc_deities_misc/")], "The Upanishadic text of the Datta tradition.", { occasions: ["dattatreya-jayanti"] }],
  ["navagraha-stotram", "Navagraha Stotram", "नवग्रह स्तोत्रम्", ["navagraha"], "stotra", ["smarta"], "sanskrit", [sd("doc_deities_misc/")], "One verse for each of the nine planetary deities.", { composer: "Vyasa" }],
  ["shani-chalisa", "Shani Chalisa", "शनि चालीसा", ["shani"], "chalisa", ["pan-hindu"], "hindi", [sd("sanskrit/chalisa/"), gp], "Forty verses to Shani, recited on Saturdays.", { extent: "40 verses" }],
  ["guru-paduka-stotram", "Guru Paduka Stotram", "गुरु पादुका स्तोत्रम्", ["guru"], "stotra", ["smarta"], "sanskrit", [sd("doc_z_misc_shankaracharya/")], "To the sandals of the teacher.", { composer: "Adi Shankaracharya", occasions: ["guru-purnima"] }],
  ["guru-gita", "Guru Gita", "गुरु गीता", ["guru"], "stotra", ["shaiva"], "sanskrit", [sd("doc_z_misc_major_works/"), dls], "Shiva's teaching to Parvati on the guru; recited at dawn in many ashrams.", { textSource: "Skanda Purana", occasions: ["guru-purnima", "daily-morning"] }],
  ["gurur-brahma", "Gurur Brahma Gurur Vishnu", "गुरुर्ब्रह्मा गुरुर्विष्णु", ["guru"], "mantra", ["pan-hindu"], "sanskrit", [sd("doc_z_misc_major_works/"), dls], "The single most-recited verse on the teacher.", { occasions: ["guru-purnima"] }],

  // ─── Regional song traditions ───────────────────────────────────────────
  ["annamacharya-sankeertanas", "Annamacharya Sankeertanas", "अन्नमाचार्य संकीर्तन", ["venkateshwara"], "keertana", ["sri-vaishnava"], "telugu", [ttdA], "The Telugu sankeertana corpus to Venkateswara, preserved on copper plates at Tirumala.", { composer: "Tallapaka Annamacharya", era: "15th c.", extent: "14,892 online; c. 32,000 composed" }],
  ["nalayira-divya-prabandham", "Nalayira Divya Prabandham", "नालायिर दिव्य प्रबन्धम्", ["vishnu", "venkateshwara"], "pasuram", ["sri-vaishnava"], "tamil", [ttdP], "The four thousand Tamil verses of the twelve Alvars, sung in temple liturgy.", { composer: "The twelve Alvars", era: "6th–9th c.", extent: "4,000 pasurams" }],
  ["tiruppavai", "Tiruppavai", "तिरुप्पावै", ["krishna", "vishnu"], "pasuram", ["sri-vaishnava"], "tamil", [ttdP], "Thirty verses sung each dawn through Margazhi.", { composer: "Andal", era: "8th c.", extent: "30 verses", occasions: ["daily-morning"] }],
  ["purandaradasa-devaranamas", "Purandaradasa Devaranamas", "पुरन्दरदास देवरनाम", ["vitthala", "krishna"], "devaranama", ["haridasa"], "kannada", [ttdD], "The Kannada songs of the father of Carnatic music.", { composer: "Purandaradasa", era: "15th–16th c." }],
  ["kanakadasa-kirtanas", "Kanakadasa Kirtanas", "कनकदास कीर्तन", ["krishna", "vitthala"], "devaranama", ["haridasa"], "kannada", [ttdD], "Kannada Haridasa songs, including the Udupi Krishna tradition.", { composer: "Kanakadasa", era: "16th c." }],
  ["tukaram-abhang", "Abhangs of Tukaram", "तुकाराम अभंग", ["vitthala"], "abhang", ["sant"], "marathi", [ig, gp], "The Varkari abhangs sung on the pilgrimage to Pandharpur.", { composer: "Sant Tukaram", era: "17th c." }],
  ["dnyaneshwar-abhang", "Abhangs of Dnyaneshwar", "ज्ञानेश्वर अभंग", ["vitthala"], "abhang", ["sant"], "marathi", [ig], "Including the Pasayadan, the closing prayer of the Dnyaneshwari.", { composer: "Sant Dnyaneshwar", era: "13th c." }],
  ["namdev-abhang", "Abhangs of Namdev", "नामदेव अभंग", ["vitthala"], "abhang", ["sant"], "marathi", [ig], "Marathi abhangs; some also entered the Guru Granth Sahib.", { composer: "Sant Namdev", era: "13th–14th c." }],
  ["mirabai-padavali", "Mirabai ki Padavali", "मीराबाई पदावली", ["krishna"], "pada", ["sant"], "braj", [ig, gp], "Mira's padas to Giridhar Nagar — the collected Padavali, Rag Govind and Rag Sorath ke Pad.", { composer: "Mirabai", era: "16th c." }],
  ["surdas-sursagar", "Sursagar of Surdas", "सूरसागर", ["krishna"], "pada", ["sant"], "braj", [ig, gp], "The Braj padas of the blind poet of Krishna's childhood.", { composer: "Surdas", era: "16th c." }],
  ["kabir-bhajans", "Bhajans of Kabir", "कबीर भजन", ["general"], "bhajan", ["sant"], "hindi", [ig, gp], "The nirguna songs of the weaver-saint.", { composer: "Kabir", era: "15th c." }],
  ["narsinh-mehta-prabhatiya", "Prabhatiyas of Narsinh Mehta", "नरसिंह मेहता प्रभातिया", ["krishna"], "prabhatiya", ["sant"], "gujarati", [gp], "Gujarati dawn songs, including 'Vaishnav jan to'.", { composer: "Narsinh Mehta", era: "15th c.", occasions: ["daily-morning"] }],
  ["swaminarayan-kirtans", "Swaminarayan Kirtans", "स्वामिनारायण कीर्तन", ["swaminarayan"], "kirtan", ["swaminarayan"], "gujarati", [bap], "Gujarati and Hindi kirtans of the Swaminarayan paramhansas.", { composer: "Muktanand, Brahmanand, Premanand and other paramhansas", era: "19th c." }],
  ["baps-arti-jay-sadguru", "Jay Sadguru Swami (BAPS Arti)", "जय सद्गुरु स्वामी", ["swaminarayan"], "aarti", ["swaminarayan"], "gujarati", [bap], "The arti sung in Swaminarayan mandirs.", { composer: "Muktanand Swami", occasions: ["daily-evening"] }],
  ["borgeet", "Borgeet", "बरगीत", ["krishna"], "bhajan", ["vaishnava"], "assamese", [ig], "The Assamese devotional songs of the Ekasarana tradition.", { composer: "Srimanta Sankardev and Madhavdev", era: "15th–16th c." }],
  ["jagannath-bhajans", "Odia Jagannath Bhajans", "जगन्नाथ भजन", ["jagannath"], "bhajan", ["vaishnava"], "odia", [ig], "The Odia devotional repertoire of Puri.", { occasions: ["rath-yatra"] }],
  ["gita-govinda", "Gita Govinda", "गीत गोविन्दम्", ["radha-krishna"], "stotra", ["vaishnava"], "sanskrit", [sd("doc_krishna/"), ved], "Jayadeva's twelve-canto lyric of Radha and Krishna, sung in Puri to this day.", { composer: "Jayadeva", era: "12th c." }],
  ["sivananda-devotional-songs", "Sivananda Ashram Devotional Songs", "शिवानन्द भजनावली", ["general"], "bhajan", ["pan-hindu"], "sanskrit", [dls], "A broad traditional bhajan and kirtan collection with transliteration and translation throughout.", { composer: "Compiled by Swami Sivananda", extent: "304 pages" }],
  ["aratrika-hymns", "Aratrika Hymns (Khandana Bhava Bandhana)", "आरात्रिक भजन", ["general", "guru"], "aarti", ["pan-hindu"], "bengali", [bel], "The vespers hymns of the Ramakrishna Order, sung at evening arati.", { composer: "Swami Vivekananda", occasions: ["daily-evening"] }],

  // ─── Puja vidhi / observances ───────────────────────────────────────────
  ["satyanarayana-vrata-katha", "Satyanarayana Vrata & Katha", "सत्यनारायण व्रत कथा", ["vishnu"], "vrata", ["vaishnava"], "sanskrit", [sd("sanskrit/puja/"), gp], "The full-moon vrata, its five-chapter story and closing aarti.", { textSource: "Skanda Purana, Reva Khanda", occasions: ["satyanarayana", "purnima"] }],
  ["varalakshmi-vrata", "Varalakshmi Vrata Puja", "वरलक्ष्मी व्रत", ["lakshmi"], "vrata", ["smarta"], "sanskrit", [sd("sanskrit/puja/")], "The Friday vrata of Shravana observed for the household's wellbeing.", { occasions: ["varalakshmi"] }],
  ["navaratri-puja-vidhi", "Navaratri & Kanya Puja Vidhi", "नवरात्रि पूजा विधि", ["durga"], "vrata", ["shakta"], "sanskrit", [sd("sanskrit/puja/")], "The nine-night ritual order, including Kanya and Suvasini puja.", { occasions: ["navratri", "durga-ashtami"] }],
  ["pradosha-puja-vidhi", "Pradosha Puja Vidhi", "प्रदोष पूजा विधि", ["shiva"], "vrata", ["shaiva"], "sanskrit", [sd("sanskrit/puja/")], "The twilight worship of the thirteenth tithi.", { occasions: ["pradosh"] }],
  ["shivaratri-puja-vidhi", "Shivaratri Puja Vidhi", "शिवरात्रि पूजा विधि", ["shiva"], "vrata", ["shaiva"], "sanskrit", [sd("sanskrit/puja/")], "The four watches of the night, each with its own abhishekam.", { occasions: ["maha-shivratri", "masik-shivratri"] }],
  ["ganesha-puja-vidhi", "Siddhi Vinayaka & Sankashti Puja", "सिद्धिविनायक पूजा विधि", ["ganesha"], "vrata", ["smarta"], "sanskrit", [sd("sanskrit/puja/")], "Household Ganesha worship, including the Sankashti Chaturthi order.", { occasions: ["ganesh-chaturthi", "sankashti"] }],
  ["laghu-panchayatana-puja", "Laghu Panchayatana Puja", "लघु पञ्चायतन पूजा", ["general"], "vrata", ["smarta"], "sanskrit", [sd("sanskrit/puja/")], "The Smarta worship of five deities together: Ganesha, Shiva, Vishnu, Devi and Surya.", { occasions: ["general-puja"] }],
  ["tulasi-puja-vidhi", "Tulasi Puja Vidhi", "तुलसी पूजा विधि", ["tulasi"], "vrata", ["vaishnava"], "sanskrit", [sd("sanskrit/puja/")], "Daily Tulasi worship and the Tulsi Vivah rite.", { occasions: ["tulsi-vivah", "daily-morning"] }],
  ["gayatri-puja-vidhi", "Gayatri Puja & Sandhyavandanam", "गायत्री पूजा विधि", ["surya", "saraswati"], "vrata", ["vedic"], "sanskrit", [sd("sanskrit/puja/")], "The thrice-daily sandhya rite built around the Gayatri.", { occasions: ["daily-morning", "daily-evening"] }],
  ["ganga-puja-aarti", "Ganga Puja & Aarti", "गंगा आरती", ["ganga"], "aarti", ["pan-hindu"], "sanskrit", [sd("sanskrit/arati/"), gp], "The riverbank aarti of Haridwar and Varanasi.", { occasions: ["daily-evening", "kartik-purnima"] }],
  ["karpura-gauram", "Karpura Gauram", "कर्पूरगौरम्", ["shiva"], "mantra", ["pan-hindu"], "sanskrit", [sd("sanskrit/arati/")], "The camphor verse sung as the final flame is offered.", { occasions: ["daily-evening", "general-puja"] }],
];

export const CATALOG: CatalogEntry[] = SEEDS.map(
  ([slug, en, hi, deity, type, tradition, language, sources, note, extra = {}]) => ({
    slug,
    title: { en, hi },
    deity,
    type,
    tradition,
    language,
    sources,
    note,
    occasions: extra.occasions ?? ["general-puja"],
    tags: extra.tags ?? [],
    composer: extra.composer,
    era: extra.era,
    textSource: extra.textSource,
    extent: extra.extent,
    altTitles: extra.altTitles,
  }),
);

export const CATALOG_BY_SLUG = new Map(CATALOG.map((e) => [e.slug, e] as const));

/** Occasions helper: everything the tradition attaches to a given day. */
export function catalogForOccasion(occasion: Occasion): CatalogEntry[] {
  return CATALOG.filter((e) => e.occasions.includes(occasion));
}
