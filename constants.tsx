export interface Lesson {
  id: number;
  topicName: string; // Replaces generic title
  detailedDescription: string; // New field - longer summary
  surahReference: string; // New field - specific Surahs discussed
  tags: string[]; // New field - array of keywords
  hours: string;
  surahNo: string;
  surahName: string;
  verses: string;
  description: string;
  urduTitle: string;
  part: string;
  presentationLink: string; // Keep existing functionality (renamed from pdfLink)
}

export interface Note {
  content: string;
  isUrdu: boolean;
  lastModified: string;
}

// --- HELPER FUNCTIONS FOR GOOGLE DRIVE ---
export const getDriveFileId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:file\/d\/|id=)([-a-zA-Z0-9_]+)/);
  return match ? match[1] : null;
};

export const getEmbedUrl = (url: string): string => {
  const id = getDriveFileId(url);
  if (id) {
    return `https://drive.google.com/file/d/${id}/preview`;
  }
  return `https://docs.google.com/viewer?url=${encodeURIComponent(
    url
  )}&embedded=true`;
};

export const getDownloadUrl = (url: string): string => {
  const id = getDriveFileId(url);
  if (id) {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return url;
};

// --- UPDATED DATA STRUCTURE ---
export const SYLLABUS_DATA: Lesson[] = [
  {
    id: 1,
    topicName: "Success Keys (Asr)",
    detailedDescription:
      "A comprehensive exploration of the essential requirements for salvation and success in both worlds, focusing on the profound wisdom of Surah Al-Asr and its timeless message for personal transformation.",
    surahReference: "Surah Al-Asr (103)",
    tags: ["Success", "Salvation", "Foundation", "Wisdom", "Time"],
    hours: "2",
    surahNo: "103",
    surahName: "Al-'Asr",
    verses: "Complete",
    description: "Essentials of Salvation (Lawaazim-e-Najaat)",
    urduTitle: "لوازم نجات (نجات کی راہ)",
    part: "Foundations",
    presentationLink:
      "https://drive.google.com/open?id=1LoiyktQmHA7y5zasX9RBfL-HBF7CB7MB&usp=drive_copy",
  },
  {
    id: 2,
    topicName: "True Piety Defined",
    detailedDescription:
      "Understanding the Qur'anic definition of true piety and virtue, examining the comprehensive standards set in Surah Al-Baqarah that go beyond mere rituals to encompass complete spiritual transformation.",
    surahReference: "Surah Al-Baqarah (2:177)",
    tags: ["Piety", "Virtue", "Character", "Definition", "Spirituality"],
    hours: "2",
    surahNo: "2",
    surahName: "Al-Baqarah",
    verses: "177",
    description: "The Qur'anic Standard of Virtue & Piety",
    urduTitle: "نیکی کی حقیقت اور تقوی کا قرآنی معیار",
    part: "Foundations",
    presentationLink:
      "https://drive.google.com/open?id=10Iiy-Nt6U3LSrbKRn7xBMKcC0Sk8GsVn&usp=drive_copy",
  },
  {
    id: 3,
    topicName: "Wisdom in the Qur'an",
    detailedDescription:
      "Delving into the foundations of Qur'anic wisdom through the teachings of Luqman, understanding practical application in daily life and how to integrate divine guidance into modern challenges.",
    surahReference: "Surah Luqman (31:12-19)",
    tags: ["Wisdom", "Luqman", "Practical", "Guidance", "Parenting"],
    hours: "2",
    surahNo: "31",
    surahName: "Luqman",
    verses: "12-19",
    description: "Foundations of Qur'anic Wisdom (Hikmah)",
    urduTitle: "حکمت قرآنی کی اساسات",
    part: "Foundations",
    presentationLink:
      "https://drive.google.com/open?id=1OzST56IElREQ7Az-tEkGo-Vl_tg71abM&usp=drive_copy",
  },
  {
    id: 4,
    topicName: "Steadfastness & Victory",
    detailedDescription:
      "Exploring the concept of steadfastness in faith and its immense rewards as outlined in Surah Fussilat, understanding how perseverance leads to spiritual victory and divine support.",
    surahReference: "Surah Fussilat (41:30-36)",
    tags: ["Steadfastness", "Victory", "Reward", "Patience", "Perseverance"],
    hours: "2",
    surahNo: "41",
    surahName: "Fussilat",
    verses: "30-36",
    description: "The Great Share: Steadfastness & Reward",
    urduTitle: "حظ عظيم",
    part: "Foundations",
    presentationLink:
      "https://drive.google.com/open?id=1OzST56IElREQ7Az-tEkGo-Vl_tg71abM&usp=drive_copy",
  },
  {
    id: 5,
    topicName: "Fatiha: The Complete Framework",
    detailedDescription:
      "A deep dive into Surah Al-Fatiha as the comprehensive ideological basis of the Qur'an, covering its profound meanings, spiritual implications, and practical applications in daily worship and life.",
    surahReference: "Surah Al-Fatiha (1)",
    tags: ["Framework", "Foundation", "Prayer", "Structure", "Essentials"],
    hours: "8",
    surahNo: "1",
    surahName: "Al-Fatiha",
    verses: "Complete",
    description: "Al-Fatiha: The Complete Ideological Basis",
    urduTitle: "قرآن حکیم کے فلسفہ و حکمت کی اساس کامل",
    part: "Foundations",
    presentationLink:
      "https://drive.google.com/open?id=1cKeqVYuC_iWMrVyGpsbFyDdGazIWeCzB&usp=drive_copy",
  },
  {
    id: 6,
    topicName: "Reason Meets Faith",
    detailedDescription:
      "Understanding the relationship between rational thought, natural disposition, and divine faith through Qur'anic perspective, demonstrating how Islam harmonizes intellect with revelation.",
    surahReference: "Surah Ali 'Imran (3:190-195)",
    tags: ["Reason", "Faith", "Logic", "Nature", "Intellect"],
    hours: "2",
    surahNo: "3",
    surahName: "Ali 'Imran",
    verses: "190-195",
    description: "Reason, Nature, and the Call to Imaan",
    urduTitle: "عقل، فطرت اور ایمان",
    part: "Iman & Aqeedah",
    presentationLink: "",
  },
  {
    id: 7,
    topicName: "Elements of Faith's Light",
    detailedDescription:
      "Analyzing the components that constitute the light of faith as described in the Qur'anic parable of light, understanding how to cultivate and maintain spiritual illumination.",
    surahReference: "Surah An-Nur (24:35-40)",
    tags: ["Light", "Faith", "Spirituality", "Parable", "Illumination"],
    hours: "2",
    surahNo: "24",
    surahName: "An-Nur",
    verses: "35-40",
    description: "Elements of Imaan's Light",
    urduTitle: "نور ایمانی کے اجزائے ترکیبی",
    part: "Iman & Aqeedah",
    presentationLink:
      "https://drive.google.com/open?id=1cwjUCfeqHKOC3wB1IFunR8o-ORKzYnpG&usp=drive_copy",
  },
  {
    id: 8,
    topicName: "Guidance & Purity Code",
    detailedDescription:
      "Examining the pre-conditions for divine guidance and spiritual purification through multiple Qur'anic chapters, understanding the path to inner transformation and divine acceptance.",
    surahReference: "Surah Ash-Shams, Al-Lail, Al-Balad",
    tags: [
      "Guidance",
      "Purity",
      "Purification",
      "Conditions",
      "Transformation",
    ],
    hours: "2",
    surahNo: "91/92/90",
    surahName: "Ash-Shams / Al-Lail / Al-Balad",
    verses: "Various",
    description: "Pre-Conditions for Guidance & Tazkiyah",
    urduTitle: "تزکیہ نفس",
    part: "Iman & Aqeedah",
    presentationLink:
      "https://drive.google.com/open?id=1KEq1oBV2HWswQs46Psr-rOi3QCeIEEKN&usp=drive_copy",
  },
  {
    id: 9,
    topicName: "Benefits of True Faith",
    detailedDescription:
      "Exploring the practical implications and spiritual outcomes of genuine faith as outlined in Surah At-Taghabun, understanding how true belief transforms individual and collective life.",
    surahReference: "Surah At-Taghabun (64)",
    tags: ["Faith", "Benefits", "Outcomes", "Spiritual", "Transformation"],
    hours: "2",
    surahNo: "64",
    surahName: "At-Taghabun",
    verses: "Complete",
    description: "Implications and Outcomes of True Imaan",
    urduTitle: "ایمان اور اس کے ثمرات و مضمرات",
    part: "Iman & Aqeedah",
    presentationLink:
      "https://drive.google.com/open?id=1HM0KTgYBGKIzBwipvuqv_FV-_3Kzk6j8&usp=drive_copy",
  },
  {
    id: 10,
    topicName: "Evidence for Afterlife",
    detailedDescription:
      "Understanding the Qur'anic logical arguments and evidence for the reality of the Hereafter, strengthening conviction through rational proofs and spiritual insights.",
    surahReference: "Surah Al-Qiyamah (75)",
    tags: ["Afterlife", "Evidence", "Resurrection", "Hereafter", "Eschatology"],
    hours: "2",
    surahNo: "75",
    surahName: "Al-Qiyamah",
    verses: "Complete",
    description: "The Qur'anic Case for the Hereafter",
    urduTitle: "اثبات آخرت کے لیے قرآن کا استدلال",
    part: "Iman & Aqeedah",
    presentationLink:
      "https://drive.google.com/open?id=1bFHLqUuKlg1a-UqLwsTrnISFlaXdLL9c&usp=drive_copy",
  },
  {
    id: 11,
    topicName: "Believer's Character Foundation",
    detailedDescription:
      "Building the foundational qualities of a true believer's character as outlined in the Qur'an, understanding the spiritual and moral prerequisites for divine acceptance.",
    surahReference: "Surah Al-Mu'minun (23:1-11) & Al-Ma'arij (70:19-35)",
    tags: ["Character", "Foundation", "Morality", "Spirituality", "Virtues"],
    hours: "2",
    surahNo: "23/70",
    surahName: "Al-Mu'minun / Al-Ma'arij",
    verses: "1-11 / 19-35",
    description: "Foundations of Character Building",
    urduTitle: "تعمیر سیرت کی اساسات",
    part: "Character Building",
    presentationLink:
      "https://drive.google.com/open?id=1Aparvjv4XEbKPrUo4h2fVlw4ERWGmOtm&usp=drive_copy",
  },
  {
    id: 12,
    topicName: "Traits of God's Beloved Servants",
    detailedDescription:
      "Exploring the defining characteristics of Ibad-ur-Rahman (Servants of the Most Merciful) and how to cultivate these noble qualities in contemporary life.",
    surahReference: "Surah Al-Furqan (25:61-77)",
    tags: ["Servants", "Characteristics", "Mercy", "Virtues", "Excellence"],
    hours: "2",
    surahNo: "25",
    surahName: "Al-Furqan",
    verses: "61-77",
    description: "Defining Traits of the Believer (Ibad-ur-Rahman)",
    urduTitle: "بندہ مومن کی شخصیت کے خدوخال",
    part: "Character Building",
    presentationLink:
      "https://drive.google.com/open?id=1DF4XKHuK89q1-bHrsGMmfQmdAwbhRkgj&usp=drive_copy",
  },
  {
    id: 13,
    topicName: "Sacred Family Principles",
    detailedDescription:
      "Understanding the fundamental Islamic principles governing family life, relationships, and household management based on divine guidance and prophetic example.",
    surahReference: "Surah At-Tahrim (66)",
    tags: ["Family", "Relationships", "Principles", "Household", "Marriage"],
    hours: "2",
    surahNo: "66",
    surahName: "At-Tahrim",
    verses: "Complete",
    description: "Fundamental Principles of Family Life",
    urduTitle: "عائلی زندگی کے بنیادی اصول",
    part: "Social Life",
    presentationLink:
      "https://drive.google.com/open?id=1_6d8sCOPt-Ok-SOrXbzEC9NMYJNFqCV5&usp=drive_copy",
  },
  {
    id: 14,
    topicName: "Islamic Social Ethics Code",
    detailedDescription:
      "Comprehensive study of the social and ethical system of Islam, covering rights, responsibilities, and proper conduct in various social contexts.",
    surahReference: "Surah Al-Isra (17:23-40)",
    tags: ["Social", "Ethics", "Conduct", "Rights", "Responsibilities"],
    hours: "2",
    surahNo: "17",
    surahName: "Al-Isra",
    verses: "23-40",
    description: "The Social & Ethical System of Islam",
    urduTitle: "سماجی اور معاشرتی اقدار",
    part: "Social Life",
    presentationLink:
      "https://drive.google.com/open?id=12eNJdHwDlId1HtcciclYzmxjLAJaTWLN&usp=drive_copy",
  },
  {
    id: 15,
    topicName: "Political & Organizational Protocol",
    detailedDescription:
      "Understanding Islamic guidelines for political life, community organization, and collective decision-making based on mutual consultation and justice.",
    surahReference: "Surah Al-Hujurat (49)",
    tags: [
      "Political",
      "Organization",
      "Protocol",
      "Community",
      "Consultation",
    ],
    hours: "2",
    surahNo: "49",
    surahName: "Al-Hujurat",
    verses: "Complete",
    description: "Political & Organizational Protocol",
    urduTitle: "مسلمانوں کی سیاسی و ملی زندگی",
    part: "Social Life",
    presentationLink:
      "https://drive.google.com/open?id=1xuMchVnaozPKpv3GAShrZJnpiZpx9N75&usp=drive_copy",
  },
  {
    id: 16,
    topicName: "Our Testimony to Humanity",
    detailedDescription:
      "Understanding the concept of Shahadah 'Ala An-Nas - being witnesses to humanity, and the responsibilities that come with this divine trust.",
    surahReference: "Surah Al-Hajj (22:73-78)",
    tags: ["Testimony", "Witness", "Humanity", "Responsibility", "Trust"],
    hours: "2",
    surahNo: "22",
    surahName: "Al-Hajj",
    verses: "73-78",
    description: "Shahadah 'Ala An-Nas",
    urduTitle: "شہادت علی الناس",
    part: "Mission & Jihad",
    presentationLink:
      "https://drive.google.com/open?id=1fFzxq4Kmv7PNjHPn6DTC8gpi-Ww7aYPB&usp=drive_copy",
  },
  {
    id: 17,
    topicName: "Jihad & Struggle: Divine Significance",
    detailedDescription:
      "Comprehensive understanding of Jihad's significance in Islam, its various forms, and the spiritual dimensions of striving in Allah's path.",
    surahReference: "Surah At-Tawbah (9:24)",
    tags: ["Jihad", "Struggle", "Significance", "Spiritual", "Striving"],
    hours: "2",
    surahNo: "9",
    surahName: "At-Tawbah",
    verses: "24",
    description: "Jihad Significance & Warning",
    urduTitle: "جہاد فی سبیل اللہ کی اہمیت و فضیلت",
    part: "Mission & Jihad",
    presentationLink:
      "https://drive.google.com/open?id=1tke7GIvOZmD7lh6vpcJ6K3t3jPZL3yPt&usp=drive_copy",
  },
  {
    id: 18,
    topicName: "Establishing Divine System",
    detailedDescription:
      "Understanding the concept of Izhar-e-Deen and the Prophetic model for establishing Allah's system on earth through peaceful means and divine methodology.",
    surahReference: "Surah As-Saff (61) & Al-Jumu'ah (62)",
    tags: [
      "Establishment",
      "Divine System",
      "Prophetic Model",
      "Revolution",
      "Methodology",
    ],
    hours: "2",
    surahNo: "61/62",
    surahName: "As-Saff / Al-Jumu'ah",
    verses: "Complete",
    description: "Izhar-e-Deen & Prophetic Revolution Model",
    urduTitle: "اظہار دین حق",
    part: "Mission & Jihad",
    presentationLink:
      "https://drive.google.com/open?id=1LGEaydtU_1PveYm9J20Iohim9nXAFRYD&usp=drive_copy",
  },
  {
    id: 19,
    topicName: "Hypocrisy: Causes & Consequences",
    detailedDescription:
      "Analyzing the phenomenon of hypocrisy in Islamic context, its root causes, spiritual consequences, and how to safeguard oneself from this spiritual disease.",
    surahReference: "Surah Al-Munafiqun (63)",
    tags: [
      "Hypocrisy",
      "Consequences",
      "Spiritual Disease",
      "Safeguard",
      "Warning",
    ],
    hours: "2",
    surahNo: "63",
    surahName: "Al-Munafiqun",
    verses: "Complete",
    description: "Hypocrisy: Penalty for Avoiding Jihad",
    urduTitle: "اعراض عن الجہاد کی سزا نفاق",
    part: "Mission & Jihad",
    presentationLink:
      "https://drive.google.com/open?id=12QLlQGTjv6D32tH1q45xqYBH1UgWGmcm&usp=drive_copy",
  },
  {
    id: 20,
    topicName: "Divine Tests & Trials",
    detailedDescription:
      "Understanding the purpose and wisdom behind trials in believers' lives, learning how to navigate challenges with faith and perseverance.",
    surahReference: "Surah Al-Ankaboot and related verses",
    tags: ["Trials", "Testing", "Patience", "Perseverance", "Wisdom"],
    hours: "2",
    surahNo: "29",
    surahName: "Al-Ankaboot / Others",
    verses: "Various",
    description: "Trial & Testing (Ibtila)",
    urduTitle: "اہل ایمان کیلئے ابتلاء و امتحان",
    part: "Seerah & Persistence",
    presentationLink:
      "https://drive.google.com/open?id=1OV-jWGNDzASV5r0EuJC8Q6ZDpsHRLj93&usp=drive_copy",
  },
  {
    id: 21,
    topicName: "Divine Support During Trials",
    detailedDescription:
      "Learning how to seek and recognize divine support during difficult times through Qur'anic examples and Prophetic guidance.",
    surahReference: "Surah Al-Kahf and related verses",
    tags: ["Divine Support", "Guidance", "Trials", "Help", "Protection"],
    hours: "2",
    surahNo: "18",
    surahName: "Al-Kahf / Others",
    verses: "Various",
    description: "Guidance During Trials",
    urduTitle: "ابتلاء و آزمائش میں ہدایات",
    part: "Seerah & Persistence",
    presentationLink:
      "https://drive.google.com/open?id=1hu-3G52lZuTu4oaRGxjH8WsDpjMle0x2&usp=drive_copy",
  },
  {
    id: 22,
    topicName: "Battle of Badr: Divine Intervention",
    detailedDescription:
      "Comprehensive analysis of the Battle of Badr, its historical context, strategic lessons, and the manifestation of divine help in critical moments.",
    surahReference: "Surah Al-Anfal (8:1-10, 72-75)",
    tags: ["Badr", "Divine Help", "Strategy", "History", "Victory"],
    hours: "2",
    surahNo: "8",
    surahName: "Al-Anfal",
    verses: "1-10 & 72-75",
    description: "Start of Qital: Battle of Badr",
    urduTitle: "غزوہ بدر",
    part: "Seerah & Persistence",
    presentationLink:
      "https://drive.google.com/open?id=191LKI5QKDTgSXQ3y93UGmiKbAFMSI_7Y&usp=drive_copy",
  },
  {
    id: 23,
    topicName: "Battle of Uhud: Lessons in Obedience",
    detailedDescription:
      "Critical examination of the Battle of Uhud, understanding the lessons in obedience, discipline, and recovery from setbacks.",
    surahReference: "Surah Ali 'Imran (3:121-148)",
    tags: ["Uhud", "Obedience", "Discipline", "Lessons", "Recovery"],
    hours: "2",
    surahNo: "3",
    surahName: "Ali 'Imran",
    verses: "121-148",
    description: "Battle of Uhud Analysis",
    urduTitle: "غزوہ احد",
    part: "Seerah & Persistence",
    presentationLink:
      "https://drive.google.com/open?id=13ibDHlqc-aC2pgEwJ4Q1MwSGIscnJrsl&usp=drive_copy",
  },
  {
    id: 24,
    topicName: "Battle of Ahzab: Ultimate Test",
    detailedDescription:
      "Studying the Battle of Ahzab as the climax of trials faced by early Muslims, and the divine relief that follows intense testing.",
    surahReference: "Surah Al-Ahzab (33: Ruku 2 & 3)",
    tags: ["Ahzab", "Trials", "Divine Relief", "Perseverance", "Unity"],
    hours: "2",
    surahNo: "33",
    surahName: "Al-Ahzab",
    verses: "Ruku 2 & 3",
    description: "Climax of Trial: Battle of Ahzab",
    urduTitle: "غزوہ احزاب",
    part: "Seerah & Persistence",
    presentationLink:
      "https://drive.google.com/open?id=1qji6woZjGrZSNFFqfPM6-02M2wOUAuXp&usp=drive_copy",
  },
  {
    id: 25,
    topicName: "Hudaibiyah: Strategic Victory",
    detailedDescription:
      "Analyzing the Treaty of Hudaibiyah as a strategic masterpiece and turning point in Islamic history, demonstrating wisdom in diplomacy.",
    surahReference: "Surah Al-Fath (48: Last Ruku)",
    tags: ["Hudaibiyah", "Strategy", "Victory", "Diplomacy", "Turning Point"],
    hours: "2",
    surahNo: "48",
    surahName: "Al-Fath",
    verses: "Last Ruku",
    description: "Hudaibiyah: Dawn of Victory",
    urduTitle: "صلح حدیبیہ",
    part: "Seerah & Persistence",
    presentationLink:
      "https://drive.google.com/open?id=1Wg1D622P4whZjMl3Ksn68hNSW8m-xiYn&usp=drive_copy",
  },
  {
    id: 26,
    topicName: "Battle of Tabuk: Global Phase",
    detailedDescription:
      "Understanding the Battle of Tabuk as the beginning of Islam's international phase and the test of commitment for the Muslim community.",
    surahReference: "Surah At-Tawbah (9:38-52)",
    tags: ["Tabuk", "International", "Commitment", "Test", "Preparation"],
    hours: "2",
    surahNo: "9",
    surahName: "At-Tawbah",
    verses: "38-52",
    description: "Battle of Tabuk: International Phase",
    urduTitle: "غزوہ تبوک",
    part: "Seerah & Persistence",
    presentationLink:
      "https://drive.google.com/open?id=1LBvZtILh2f8XnjnVMGAAtIWhqUR6VmMZ&usp=drive_copy",
  },
  {
    id: 27,
    topicName: "Surah Hadid: Final Charter",
    detailedDescription:
      "Comprehensive study of Surah Al-Hadid as the concluding charter, summarizing the entire Islamic worldview and practical guidance.",
    surahReference: "Surah Al-Hadid (57)",
    tags: ["Charter", "Conclusion", "Worldview", "Guidance", "Summary"],
    hours: "4",
    surahNo: "57",
    surahName: "Al-Hadid",
    verses: "Complete",
    description: "Umm Al-Musabbihat: Final Charter",
    urduTitle: "ام المسبحات سورة الحديد",
    part: "Conclusion",
    presentationLink:
      "https://drive.google.com/open?id=1rxORLsmZ_I64CMld5ebKmrzOQKdAcV-9&usp=drive_copy",
  },
  {
    id: 28,
    topicName: "Complete Course Overview",
    detailedDescription:
      "Comprehensive review and integration of the entire syllabus, connecting all themes and lessons into a unified understanding of Qur'anic transformation.",
    surahReference: "Multiple References",
    tags: ["Overview", "Integration", "Review", "Synthesis", "Transformation"],
    hours: "4",
    surahNo: "-",
    surahName: "-",
    verses: "-",
    description: "Complete Course Overview",
    urduTitle: "منتخب نصاب کا اجمالی جائزہ",
    part: "Conclusion",
    presentationLink:
      "https://drive.google.com/open?id=18Msjy6sdgA-tUFQSPqRj_h6PhAtZELwt&usp=drive_copy",
  },
];

export const CATEGORIES = [
  "All",
  ...Array.from(new Set(SYLLABUS_DATA.map((d) => d.part))),
];

// --- MODERN ISLAMIC PROFESSIONAL THEME (Green & White) ---

interface CategoryTheme {
  gradient: string;
  shadow: string;
  text: string;
  icon: string;
  badge: string;
  accent: string;
}

export const getCategoryTheme = (part: string): CategoryTheme => {
  const themes: Record<string, CategoryTheme> = {
    Foundations: {
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      text: "text-emerald-700",
      icon: "text-emerald-500",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "bg-emerald-500",
    },
    "Iman & Aqeedah": {
      gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
      shadow: "shadow-green-500/20",
      text: "text-green-700",
      icon: "text-green-500",
      badge: "bg-green-50 text-green-700 border-green-200",
      accent: "bg-green-500",
    },
    "Character Building": {
      gradient: "bg-gradient-to-r from-teal-500 to-cyan-600",
      shadow: "shadow-teal-500/20",
      text: "text-teal-700",
      icon: "text-teal-500",
      badge: "bg-teal-50 text-teal-700 border-teal-200",
      accent: "bg-teal-500",
    },
    "Social Life": {
      gradient: "bg-gradient-to-r from-emerald-400 to-green-500",
      shadow: "shadow-emerald-500/20",
      text: "text-emerald-700",
      icon: "text-emerald-400",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "bg-emerald-400",
    },
    "Mission & Jihad": {
      gradient: "bg-gradient-to-r from-green-600 to-emerald-700",
      shadow: "shadow-green-600/20",
      text: "text-green-800",
      icon: "text-green-600",
      badge: "bg-green-50 text-green-800 border-green-200",
      accent: "bg-green-600",
    },
    "Seerah & Persistence": {
      gradient: "bg-gradient-to-r from-teal-600 to-emerald-700",
      shadow: "shadow-teal-600/20",
      text: "text-teal-800",
      icon: "text-teal-600",
      badge: "bg-teal-50 text-teal-800 border-teal-200",
      accent: "bg-teal-600",
    },
    Conclusion: {
      gradient: "bg-gradient-to-r from-emerald-600 to-teal-700",
      shadow: "shadow-emerald-600/20",
      text: "text-emerald-800",
      icon: "text-emerald-600",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accent: "bg-emerald-600",
    },
  };
  return themes[part] || themes["Conclusion"];
};