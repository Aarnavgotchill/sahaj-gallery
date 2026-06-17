import { createClient } from "@sanity/client";
import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";

const client = createClient({
  projectId: "gnzt2t90",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const __dirname = import.meta.dirname;
const assetsDir = path.resolve(__dirname, "../src/assets");

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function uploadFile(filePath, type) {
  const fileName = path.basename(filePath);
  console.log(`  Uploading ${fileName}…`);
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload(type, buffer, { filename: fileName });
  return asset;
}

function findAsset(assets, fileName) {
  return Object.entries(assets).find(([k]) => path.basename(k) === fileName)?.[1] || null;
}

function withImage(obj, asset) {
  if (asset) {
    obj.image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  }
  return obj;
}

async function seed() {
  const token = process.env.SANITY_TOKEN;
  if (!token) throw new Error("Missing SANITY_TOKEN");

  // Clear old-format docs but keep assets
  console.log("Clearing old content documents…");
  const oldTypes = ["homepageArtwork", "service", "testimonial", "partnershipContent", "siteSettings", "homePage", "sahajPage", "workPage", "contactPage"];
  for (const type of oldTypes) {
    const ids = await client.fetch(`*[_type == "${type}"]._id`);
    for (const id of ids) {
      await client.delete(id);
    }
  }

  // Upload all images & videos
  console.log("\n── Uploading media ───");
  const extMap = { ".jpg": "image", ".jpeg": "image", ".webp": "image", ".png": "image", ".mp4": "file" };
  const allFiles = walkDir(assetsDir).filter(f => extMap[path.extname(f).toLowerCase()]);
  const assets = {};
  for (const f of allFiles) {
    try {
      const asset = await uploadFile(f, extMap[path.extname(f).toLowerCase()]);
      assets[path.basename(f)] = asset;
    } catch (err) {
      console.log(`  Skipping ${path.basename(f)}: ${err.message}`);
    }
  }
  console.log(`  Uploaded ${Object.keys(assets).length} files`);

  // ─── SITE SETTINGS (global contact info) ───
  console.log("\n── Creating Site Settings ───");
  await client.create({
    _type: "siteSettings",
    contactAddress:
      "Shop - 02, Palak Prime, Ambli Rd\nOpp. DoubleTree by Hilton Hotel\nNr. Antriksh Colony BRTS Bus Stand\nAmbli, Ahmedabad, Gujarat 380058",
    contactPhone: "+91 95107 88933",
    contactEmail: "info@sahajgallery.in",
    contactHours: "Opens at 10:30 AM · Closes at 7:30 PM",
  });

  // ─── HOME PAGE ───
  console.log("\n── Creating Home Page ───");
  const art1 = findAsset(assets, "art-1.jpg");
  const art2 = findAsset(assets, "art-2.jpg");
  const art3 = findAsset(assets, "art-3.jpg");
  const logoSymbol = findAsset(assets, "sahaj trasnparent logo.png");
  const ndhLogoImg = findAsset(assets, "NDH_logo_4K.png");
  const heroVid = findAsset(assets, "hero video.mp4");

  const homeDoc = {
    _type: "homePage",
    heroSubtitle: "A NDH HOUSE PARTNERSHIP",
    heroHeadline: "Where beauty exist without effort",
    heroItalicWord: "without effort",
    heroScrollText: "Scroll",
    philosophyTitle: "Why The Name Sahaj ?",
    philosophySubtitle: "So here's the story.",
    philosophyBody: [
      "Sahaj, in its simplest form, means natural. Effortless. The way things are meant to be… without force, without noise.",
      "And that's exactly how we see art.",
      'Not something that should feel complicated or intimidating. Not something you have to "understand" to appreciate. But something you feel instantly. Something that just fits… into your space, into your life.',
    ],
    logoTItle: "Why These Logo ?",
    logoBody: [
      'And then there\'s our logo… the Hansa.',
      "In Indian philosophy, the Hansa (swan) symbolizes purity, grace, and the rare ability to separate the essential from the trivial. It's often seen as a symbol of wisdom and higher taste.",
    ],
    logoGoldWord: "Hansa",
    ndhLabel: "A NDH HOUSE PARTNERSHIP",
    featuredKicker: "II — Selected Works",
    featuredTitle: "A measured silence,\nhung in light.",
    featuredCtaText: "View the catalogue →",
    featuredWorks: [
      { _key: "fw1", title: "Untitled, in Ochre", artist: "Léa Mancini", year: "MMXXIV", note: "Oil and pigment on linen", ...(art1 ? { image: { _type: "image", asset: { _type: "reference", _ref: art1._id } } } : {}) },
      { _key: "fw2", title: "Quiet Form", artist: "Ren Hayashi", year: "MMXXIII", note: "Limestone, single edition", ...(art2 ? { image: { _type: "image", asset: { _type: "reference", _ref: art2._id } } } : {}) },
      { _key: "fw3", title: "Letter to the Light", artist: "Aurelio Vasco", year: "MMXXIV", note: "Impasto on raw canvas", ...(art3 ? { image: { _type: "image", asset: { _type: "reference", _ref: art3._id } } } : {}) },
    ],
    galleryKicker: "Explore",
    galleryTitle: "Full Gallery",
    galleryButtonText: "View Full Gallery",
    contactKicker: "GET IN TOUCH",
    contactTitle: "We'd love to hear from you",
    contactTitleItalic: "from you",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Hours",
    directionButtonText: "Get Directions",
    mapUrl: "https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWNN2o4_m145MTOJ5URhNfzK&daddr=Shop+-+02,+Palak+Prime,+Ambli+Rd,+opp.+DoubleTree+by+Hilton+Hotel,+nr.+Antriksh+colony+BRTS+Bus+Stand,+Ambli,+Ahmedabad,+Gujarat+380058",
  };
  if (logoSymbol) homeDoc.logoSymbol = { _type: "image", asset: { _type: "reference", _ref: logoSymbol._id } };
  if (ndhLogoImg) homeDoc.ndhLogo = { _type: "image", asset: { _type: "reference", _ref: ndhLogoImg._id } };
  if (heroVid) homeDoc.heroVideo = { _type: "file", asset: { _type: "reference", _ref: heroVid._id } };
  await client.create(homeDoc);

  // ─── SAHAJ PAGE ───
  console.log("\n── Creating SAHAJ Page ───");
  const fenilVid = findAsset(assets, "fenil video.mp4");
  const dhrutiVid = findAsset(assets, "Dhruit Panchal V1.mp4");
  const handsVid = findAsset(assets, "The Hands of Sahaj.mp4");
  const studioLogo = findAsset(assets, "Studio_Shikshaptri_white_4K.png");
  const karigariLogoImg = findAsset(assets, "karigari-logo-png.webp");
  const spaceImg = findAsset(assets, "sahaj gallery placeholder.webp");
  const sahajLogo = findAsset(assets, "sahaj trasnparent logo.png");
  const ndhLogo2 = findAsset(assets, "NDH_logo_4K.png");

  const sahajDoc = {
    _type: "sahajPage",
    heroTitle: "SAHAJ Gallery is the artistic extension of NDH House",
    heroBody: [
      "Founded on the belief that meaningful spaces are enriched by stories, culture, and art. Emerging from an architectural practice, SAHAJ serves as a gallery and creative destination where architecture meets art and craftsmanship — showcasing thoughtfully curated artworks that complement and elevate contemporary interiors.",
      "At SAHAJ, every piece is conceived with a designer's perspective, bridging art, materiality, and spatial experience. Through handcrafted creations, wall art, decorative installations, and bespoke artistic expressions, SAHAJ transforms walls into narratives and spaces into experiences.",
    ],
    heroGetInTouchText: "Get in Touch",
    partnershipKicker: "The Collaboration",
    partnershipSubtitle: "STUDIO SHIKSHPATRI × KARIGARI STUDIO",
    partnershipBody: [
      "SAHAJ Gallery collaborates with artists, designers, and creative studios to bring distinctive art forms into architectural spaces.",
      "Studio Shikashapatrika – Calligraphy Series\nA collection that celebrates the beauty of script, language, and expression through contemporary calligraphic artworks, blending tradition with modern aesthetics.",
      "Karigari Studio – Mosaic Series\nAn exploration of craftsmanship and materiality through handcrafted mosaic artworks, creating intricate compositions that add texture, depth, and character to interiors.",
      "Through these collaborations, SAHAJ Gallery seeks to curate and explore innovative artistic mediums and materials, combining the expertise of skilled artists with thoughtful design sensibilities.",
    ],
    studioLabel: "STUDIO SHIKSHPATRI",
    karigariLabel: "KARIGARI STUDIO",
    partnershipFooterLabel: "Collobration with sahaj",
    fenilQuote: "\"Some voices carry authority not because of how loudly they speak, but because of everything they have come to understand.\"",
    fenilBody: [
      "CA. CS. Dr. Fenil Shah (@fenil_spark), a name that spans across domains, from finance to law, from governance to mentorship, brings with him a rare clarity of thought.",
      "His reflections on SAHAJ feel less like praise and more like recognition, a perspective that sees both value and vision. Not just seeing art, but understanding what it stands for.",
    ],
    fenilInstagramHandle: "@fenil_spark",
    fenilInstagramUrl: "https://www.instagram.com/fenil_spark/",
    fenilDisplayName: "CA. CS. Dr. Fenil Shah",
    dhrutiQuote: "\"An artist's opinion on another artist's work is always a confession.\"",
    dhrutiBody: [
      "Dhruti Panchal (@dhruti_artfromheart) is one such voice in Ahmedabad's art landscape. Her appreciation of SAHAJ is meaningful not simply because it is praise, but because it is recognition — one artist recognizing the sincerity, effort, and intention behind the work of fellow makers.",
      "For us, SAHAJ has always been more than a gallery. It is an evolving dialogue between art, craftsmanship, architecture, and the people who engage with them. It is a space where materials become stories, where hands shape ideas into tangible expressions, and where creativity finds a place to belong.",
      "Moments like these reaffirm our purpose. They remind us that meaningful work is seen, understood, and valued by those who share the same commitment to creating with authenticity and heart.",
    ],
    dhrutiInstagramHandle: "@dhruti_artfromheart",
    dhrutiInstagramUrl: "https://www.instagram.com/dhruti_artfromheart/",
    dhrutiDisplayName: "Dhruti Panchal",
    handsTitle: "Hands of SAHAJ",
    handsBody: [
      "An imprint of passion, crafted by the artists of SAHAJ.",
      "Every creation carries the touch of its maker — a reflection of skill, dedication, and artistic spirit. More than an object, each piece tells a story, shaped not only by hands but also by imagination, emotion, and heart.",
      "At SAHAJ, we celebrate the human connection behind every artwork, where craftsmanship transforms materials into meaningful expressions. Through the hands of our artists, ideas become creations that enrich spaces, evoke emotions, and inspire lasting connections.",
    ],
    handsArtists: ["Nehal Rathod", "Chintu Bhalani", "Hetakshi Chauhan", "Hansni Sharma", "Arya Jadav", "Pooja Bhavsar"],
    whatWeDoKicker: "What We Do",
    whatWeDoTitle: "Our Offering",
    services: [
      { _key: "s1", number: "01", title: "Commissioned Works", body: "Original pieces conceived in dialogue with you — shaped by space, intention, and the quiet language of your everyday rituals." },
      { _key: "s2", number: "02", title: "Architectural Integration", body: "We work alongside your architect to weave art into walls, light, and proportion — so that nothing feels placed, only inevitable." },
      { _key: "s3", number: "03", title: "White Glove Installation", body: "From our studio to your space.\nPerfectly placed.\nWhite-glove handling.\nPrecision installation.\nSeamless integration.\nBecause art deserves respect." },
    ],
    spaceAddressKicker: "Address",
    spaceHoursKicker: "Hours",
    spaceContactKicker: "Contact",
    spaceMapUrl: "https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWNN2o4_m145MTOJ5URhNfzK&daddr=Shop+-+02,+Palak+Prime,+Ambli+Rd,+opp.+DoubleTree+by+Hilton+Hotel,+nr.+Antriksh+colony+BRTS+Bus+Stand,+Ambli,+Ahmedabad,+Gujarat+380058",
    spaceDirectionsText: "Get Directions",
    instagramUrl: "https://www.instagram.com/sahajgallery/",
    instagramLabel: "Instagram",
    ctaKicker: "Let's Begin",
    ctaTitle: "We'd love to hear from you",
    ctaTitleItalic: "from you",
    ctaBody: "Whether you're looking to commission a piece, integrate art into your space, or simply explore — reach out. We'd be honoured to guide you.",
    ctaButtonText: "Contact Us",
    ctaSecondaryButtonText: "View Gallery",
    footerText: "A NDH House Partnership · Ahmedabad, Gujarat",
    footerDirectionsText: "Directions",
    footerCallText: "Call",
  };
  if (sahajLogo) sahajDoc.sahajLogo = { _type: "image", asset: { _type: "reference", _ref: sahajLogo._id } };
  if (ndhLogo2) sahajDoc.ndhLogo = { _type: "image", asset: { _type: "reference", _ref: ndhLogo2._id } };
  if (fenilVid) sahajDoc.fenilVideo = { _type: "file", asset: { _type: "reference", _ref: fenilVid._id } };
  if (dhrutiVid) sahajDoc.dhrutiVideo = { _type: "file", asset: { _type: "reference", _ref: dhrutiVid._id } };
  if (handsVid) sahajDoc.handsVideo = { _type: "file", asset: { _type: "reference", _ref: handsVid._id } };
  if (studioLogo) sahajDoc.studioLogo = { _type: "image", asset: { _type: "reference", _ref: studioLogo._id } };
  if (karigariLogoImg) sahajDoc.karigariLogo = { _type: "image", asset: { _type: "reference", _ref: karigariLogoImg._id } };
  if (spaceImg) sahajDoc.spaceImage = { _type: "image", asset: { _type: "reference", _ref: spaceImg._id } };
  await client.create(sahajDoc);

  // ─── WORK PAGE ───
  console.log("\n── Creating Work Page ───");
  await client.create({
    _type: "workPage",
    heroSubtitle: "A NDH HOUSE PARTNERSHIP",
    heroTitle: "Gallery",
    contactKicker: "LET'S GET IN TOUCH!",
    contactTitle: "We'd love\nto hear\nfrom you",
    contactTitleItalic: "from you",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Hours",
    directionButtonText: "Get Directions",
    mapUrl: "https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWNN2o4_m145MTOJ5URhNfzK&daddr=Shop+-+02,+Palak+Prime,+Ambli+Rd,+opp.+DoubleTree+by+Hilton+Hotel,+nr.+Antriksh+colony+BRTS+Bus+Stand,+Ambli,+Ahmedabad,+Gujarat+380058",
    submitButtonText: "Send Me Quotes!",
    linkedinUrl: "#",
    linkedinLabel: "LinkedIn",
    footerText: "Art Gallery · Ahmedabad, Gujarat",
  });

  // ─── CONTACT PAGE ───
  console.log("\n── Creating Contact Page ───");
  await client.create({
    _type: "contactPage",
    heroKicker: "Get in Touch",
    heroTitle: "Let's Create Meaningful\nArtistic Connections",
    heroTitleItalic: "Artistic Connections",
    heroBody: "Whether you're an art collector, artist, curator, or enthusiast, we'd love to hear from you.",
    formKicker: "Send Us a Message",
    formTitle: "We'd love to hear\nfrom you",
    formTitleItalic: "from you",
    personalInfoLabel: "Personal Information",
    nameFieldLabel: "Full Name",
    emailFieldLabel: "Email Address",
    phoneFieldLabel: "Phone Number (Optional)",
    inquiryDetailsLabel: "Inquiry Details",
    inquiryTypeLabel: "Inquiry Type",
    subjectLabel: "Subject",
    messageLabel: "Message",
    uploadLabel: "Upload Artwork / Reference Image / Document (Optional)",
    uploadButtonText: "Choose File",
    submitButtonText: "Send Inquiry",
    inquiryTypes: [
      "Artwork Purchase",
      "Artist Collaboration",
      "Exhibition Inquiry",
      "Private Event Booking",
      "Gallery Visit",
      "Partnership Opportunity",
      "General Inquiry",
    ],
    visitKicker: "Visit Us",
    addressLabel: "Address",
    hoursLabel: "Opening Hours",
    phoneLabel: "Phone",
    emailLabel: "Email",
    whyConnectKicker: "Why Connect With Sahaj?",
    features: [
      { _key: "f1", title: "Curated Art Experiences", desc: "Each interaction is shaped around your vision — whether acquiring a piece or commissioning something entirely new.", icon: "✦" },
      { _key: "f2", title: "Emerging & Established Artists", desc: "We represent voices from across the creative spectrum — from rising talents to masters with decades of practice.", icon: "✦" },
      { _key: "f3", title: "Private Exhibitions & Events", desc: "Intimate viewings, curated walkthroughs, and exclusive previews tailored for collectors and connoisseurs.", icon: "✦" },
    ],
    mapUrl: "https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWNN2o4_m145MTOJ5URhNfzK&daddr=Shop+-+02,+Palak+Prime,+Ambli+Rd,+opp.+DoubleTree+by+Hilton+Hotel,+nr.+Antriksh+colony+BRTS+Bus+Stand,+Ambli,+Ahmedabad,+Gujarat+380058",
    mapLabel: "Click to open in Google Maps",
    footerText: "Designed to inspire creativity",
  });

  console.log("\n✅ Seed complete! Visit https://sahaj-gallery.sanity.studio");
  console.log(`   Media uploaded: ${Object.keys(assets).length} files`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
