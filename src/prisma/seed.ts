import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Optional: Clean existing lessons to avoid duplicates during dev
  // await prisma.lesson.deleteMany() 
  
  // Data derived from your CSV
  const syllabusData = [
    // PART 1
    {
      part: "Part 1",
      title: "Success Keys (Asr)",
      hours: "2",
      surahNo: "103",
      surahReference: "Al-'Asr",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1LoiyktQmHA7y5zasX9RBfL-HBF7CB7MB&usp=drive_copy",
      description: "Essentials of Salvation (Lawaazim-e-Najaat)",
      urduTitle: "لوازمِ نجات (نجات کی راہ)"
    },
    {
      part: "Part 1",
      title: "True Piety Defined",
      hours: "2",
      surahNo: "2",
      surahReference: "Al-Baqarah",
      verses: "177",
      presentationLink: "https://drive.google.com/open?id=10Iiy-Nt6U3LSrbKRn7xBMKcC0Sk8GsVn&usp=drive_copy",
      description: "The Qur'anic Standard of Virtue & Piety",
      urduTitle: "نیکی کی حقیقت اورتقویٰ کا قرآنی معیار"
    },
    {
      part: "Part 1",
      title: "Wisdom in the Qur’an",
      hours: "2",
      surahNo: "31",
      surahReference: "Luqman",
      verses: "12-19",
      presentationLink: "https://drive.google.com/open?id=1OzST56IElREQ7Az-tEkGo-Vl_tg71abM&usp=drive_copy",
      description: "Foundations of Qur'anic Wisdom (Hikmah)",
      urduTitle: "حکمت ِقرآنی کی اساسات"
    },
    {
      part: "Part 1",
      title: "Steadfast & Win",
      hours: "2",
      surahNo: "41",
      surahReference: "Fussilat",
      verses: "30-36",
      presentationLink: "https://drive.google.com/open?id=1OzST56IElREQ7Az-tEkGo-Vl_tg71abM&usp=drive_copy",
      description: "The Great Share: Steadfastness & Reward",
      urduTitle: "حَظِّ عظیم"
    },
    // PART 2
    {
      part: "Part 2",
      title: "Fatiha: The Framework",
      hours: "2",
      surahNo: "1",
      surahReference: "Al-Fatiha",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1cKeqVYuC_iWMrVyGpsbFyDdGazIWeCzB&usp=drive_copy",
      description: "Al-Fatiha: The Complete Ideological Basis",
      urduTitle: "قرآن حکیم کے فلسفہ وحکمت کی اساس کامل"
    },
    {
      part: "Part 2",
      title: "Reason Meets Imaan",
      hours: "2",
      surahNo: "3",
      surahReference: "Ali 'Imran",
      verses: "190-195",
      presentationLink: "Surah Aal-e-Imran Last Ruku.pdf",
      description: "Reason, Nature, and the Call to Imaan",
      urduTitle: "عقل، فطرت اور ایمان"
    },
    {
      part: "Part 2",
      title: "Elements of Imaan's Noor",
      hours: "2",
      surahNo: "24",
      surahReference: "An-Nur",
      verses: "35-40",
      presentationLink: "https://drive.google.com/open?id=1cwjUCfeqHKOC3wB1IFunR8o-ORKzYnpG&usp=drive_copy",
      description: "Elements of Imaan's Light",
      urduTitle: "نورِ ایمانی کے اجزائے ترکیبی"
    },
    {
      part: "Part 2",
      title: "Guidance & Purity Code",
      hours: "2",
      surahNo: "91 / 92 / 90",
      surahReference: "Ash-Shams / Al-Lail / Al-Balad",
      verses: "1-10 / Complete / Complete",
      presentationLink: "https://drive.google.com/open?id=1KEq1oBV2HWswQs46Psr-rOi3QCeIEEKN&usp=drive_copy",
      description: "Pre-Conditions for Guidance & Tazkiyah",
      urduTitle: null
    },
    {
      part: "Part 2",
      title: "Imaan: The Benefits",
      hours: "2",
      surahNo: "64",
      surahReference: "At-Taghabun",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1HM0KTgYBGKIzBwipvuqv_FV-_3Kzk6j8&usp=drive_copy",
      description: "Implications and Outcomes of True Imaan",
      urduTitle: "ایمان اور اس کے ثمرات و مضمرات"
    },
    {
      part: "Part 2",
      title: "Akhirah: The Evidence",
      hours: "2",
      surahNo: "75",
      surahReference: "Al-Qiyamah",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1bFHLqUuKlg1a-UqLwsTrnISFlaXdLL9c&usp=drive_copy",
      description: "The Qur'anic Case for the Hereafter",
      urduTitle: "اثباتِ آخرت کے لیےقرآن کا استدلال"
    },
    // PART 3
    {
      part: "Part 3",
      title: "Believer's Character",
      hours: "2",
      surahNo: "23 / 70",
      surahReference: "Al-Mu'minun / Al-Ma'arij",
      verses: "1-11 / 19-35",
      presentationLink: "https://drive.google.com/open?id=1Aparvjv4XEbKPrUo4h2fVlw4ERWGmOtm&usp=drive_copy",
      description: "Foundations of Character Building",
      urduTitle: "تعمیر ِسیرت کی اساسات اور قرآن کا انسانِ مطلوب"
    },
    {
      part: "Part 3",
      title: "Traits of the Beloved",
      hours: "2",
      surahNo: "25",
      surahReference: "Al-Furqan",
      verses: "61-77",
      presentationLink: "https://drive.google.com/open?id=1DF4XKHuK89q1-bHrsGMmfQmdAwbhRkgj&usp=drive_copy",
      description: "Defining Traits of the Believer (Ibad-ur-Rahman)",
      urduTitle: "بندۂ مؤمن کی شخصیت کے خدوخال"
    },
    {
      part: "Part 3",
      title: "Sacred Family Principles",
      hours: "2",
      surahNo: "66",
      surahReference: "At-Tahrim",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1_6d8sCOPt-Ok-SOrXbzEC9NMYJNFqCV5&usp=drive_copy",
      description: "Fundamental Principles of Family Life",
      urduTitle: "عائلی زندگی کے بنیادی اصول"
    },
    {
      part: "Part 3",
      title: "Islamic Social Code",
      hours: "2",
      surahNo: "17",
      surahReference: "Al-Isra",
      verses: "23-40",
      presentationLink: "https://drive.google.com/open?id=12eNJdHwDlId1HtcciclYzmxjLAJaTWLN&usp=drive_copy",
      description: "The Social & Ethical System of Islam",
      urduTitle: "سماجی اور معاشرتی اقدار"
    },
    {
      part: "Part 3",
      title: "Political & Social Life",
      hours: "2",
      surahNo: "49",
      surahReference: "Al-Hujurat",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1xuMchVnaozPKpv3GAShrZJnpiZpx9N75&usp=drive_copy",
      description: "Political & Organizational Protocol",
      urduTitle: "مسلمانوں کی سیاسی و مِلّی زندگی کے رہنما اُصول"
    },
    // PART 4
    {
      part: "Part 4",
      title: "Our Testimony (Shahadah)",
      hours: "2",
      surahNo: "22",
      surahReference: "Al-Hajj",
      verses: "73-78",
      presentationLink: "https://drive.google.com/open?id=1fFzxq4Kmv7PNjHPn6DTC8gpi-Ww7aYPB&usp=drive_copy",
      description: "Shahadah 'Ala An-Nas",
      urduTitle: "شہادت علی الناس"
    },
    {
      part: "Part 4",
      title: "Understand Jihad and Qitaal",
      hours: "2",
      surahNo: "9 / 49",
      surahReference: "At-Tawbah/ Al-Hujurat",
      verses: "24 / 15",
      presentationLink: "https://drive.google.com/open?id=1tke7GIvOZmD7lh6vpcJ6K3t3jPZL3yPt&usp=drive_copy",
      description: "Jihad & Qital: Significance",
      urduTitle: "جہاد فی سبیل اللہ کی اہمیت و فضیلت"
    },
    {
      part: "Part 4",
      title: "Domination of Allah’s Deen",
      hours: "2",
      surahNo: "61",
      surahReference: "As-Saff",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1LGEaydtU_1PveYm9J20Iohim9nXAFRYD&usp=drive_copy",
      description: "Domination of Deen (Izhar-e-Deen)",
      urduTitle: "اظہارِ دینِ حق"
    },
    {
      part: "Part 4",
      title: "Prophetic Revolution Model",
      hours: "2",
      surahNo: "62",
      surahReference: "Al-Jumu'ah",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=12QLlQGTjv6D32tH1q45xqYBH1UgWGmcm&usp=drive_copy",
      description: "Prophetic Revolution Model",
      urduTitle: "انقلابِ نبویﷺ کا اساسی منہاج"
    },
    {
      part: "Part 4",
      title: "Hypocrisy Exposed",
      hours: "2",
      surahNo: "63",
      surahReference: "Al-Munafiqun",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=1OV-jWGNDzASV5r0EuJC8Q6ZDpsHRLj93&usp=drive_copy",
      description: "Hypocrisy: Penalty for Avoiding Jihad",
      urduTitle: "اعراض عن الجہاد کی سزا: نفاق"
    },
    // PART 5
    {
      part: "Part 5",
      title: "Persistence Lecture # 1",
      hours: "2",
      surahNo: "29 / 2 / 3 / 9",
      surahReference: "Al-Ankaboot / Al-Baqarah / Ali 'Imran / At-Tawbah",
      verses: "Ruku 1 / 214 / 142 / 16",
      presentationLink: "https://drive.google.com/open?id=1hu-3G52lZuTu4oaRGxjH8WsDpjMle0x2&usp=drive_copy",
      description: "Trial & Testing (Ibtila)",
      urduTitle: "اہلِ ایمان کیلئے ابتلاء و امتحان سے گزرنا ضروری ہے"
    },
    {
      part: "Part 5",
      title: "Persistence Lecture # 2",
      hours: "2",
      surahNo: "29 / 18 / 2",
      surahReference: "Al-Ankaboot / Al-Kahf / Al-Baqarah",
      verses: "Last 3 Ruku / 27-29 / 153-157",
      presentationLink: "https://drive.google.com/open?id=191LKI5QKDTgSXQ3y93UGmiKbAFMSI_7Y&usp=drive_copy",
      description: "Guidance During Trials",
      urduTitle: "ابتلاء و آزمائش کے دور میں اہلِ ایمان کیلئے ہدایات"
    },
    {
      part: "Part 5",
      title: "Persistence Lecture # 3",
      hours: "2",
      surahNo: "8",
      surahReference: "Al-Anfal",
      verses: "1-10 & 72-75",
      presentationLink: "https://drive.google.com/open?id=13ibDHlqc-aC2pgEwJ4Q1MwSGIscnJrsl&usp=drive_copy",
      description: "Start of Qital: Battle of Badr",
      urduTitle: "دور قتال فی سبیل اللہ کا آغاز: غزوہ بدر"
    },
    {
      part: "Part 5",
      title: "Persistence Lecture # 4",
      hours: "2",
      surahNo: "3",
      surahReference: "Ali 'Imran",
      verses: "121-129 & 139-148",
      presentationLink: "https://drive.google.com/open?id=1qji6woZjGrZSNFFqfPM6-02M2wOUAuXp&usp=drive_copy",
      description: "Battle of Uhud",
      urduTitle: "کفر و اسلام کا دوسرا بڑا معرکہ: غزوہ اُحد"
    },
    {
      part: "Part 5",
      title: "Persistence Lecture # 5",
      hours: "2",
      surahNo: "32",
      surahReference: "Al-Ahzab",
      verses: "Ruku 2 & 3",
      presentationLink: "https://drive.google.com/open?id=1Wg1D622P4whZjMl3Ksn68hNSW8m-xiYn&usp=drive_copy",
      description: "Climax of Trial: Battle of Ahzab",
      urduTitle: "ابتلاء و امتحان کا نقطہ عروج: غزوہ احزاب"
    },
    {
      part: "Part 5",
      title: "Persistence Lecture # 6",
      hours: "2",
      surahNo: "48",
      surahReference: "Al-Fath",
      verses: "Last Ruku",
      presentationLink: "https://drive.google.com/open?id=1LBvZtILh2f8XnjnVMGAAtIWhqUR6VmMZ&usp=drive_copy",
      description: "Hudaibiyah: Dawn of Victory",
      urduTitle: "فتح و نصرت کا نقطہ آغاز: صلح حدیبیہ"
    },
    {
      part: "Part 5",
      title: "Persistence Lecture # 7",
      hours: "2",
      surahNo: "9",
      surahReference: "At-Tawbah",
      verses: "38-52",
      presentationLink: "https://drive.google.com/open?id=1rxORLsmZ_I64CMld5ebKmrzOQKdAcV-9&usp=drive_copy",
      description: "Battle of Tabuk: International Phase",
      urduTitle: "دعوتِ محمدی ﷺ کے بین الاقوامی دور کا آغاز: غزوہ تبوک"
    },
    // FINAL PART
    {
      part: "Final Part",
      title: "Surah Hadid Charter",
      hours: "4",
      surahNo: "57",
      surahReference: "Al-Hadid",
      verses: "Complete",
      presentationLink: "https://drive.google.com/open?id=18Msjy6sdgA-tUFQSPqRj_h6PhAtZELwt&usp=drive_copy",
      description: "Umm Al-Musabbihat: Surah Al-Hadid",
      urduTitle: "اُمُّ المسبِّحات: سورۃ الحدید"
    }
  ]

  console.log(`Prepared ${syllabusData.length} lessons. inserting...`)

  for (const lesson of syllabusData) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        urduTitle: lesson.urduTitle,
        description: lesson.description,
        hours: lesson.hours,
        surahNo: lesson.surahNo,
        surahReference: lesson.surahReference,
        verses: lesson.verses,
        part: lesson.part,
        presentationLink: lesson.presentationLink
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })