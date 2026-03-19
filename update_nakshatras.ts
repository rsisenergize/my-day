import * as fs from 'fs';
import * as path from 'path';

const translations = {
  elements: {
    "Fire": "நெருப்பு",
    "Earth": "நிலம்",
    "Water": "நீர்",
    "Air": "காற்று"
  },
  planets: {
    "Ketu": "கேது",
    "Venus": "சுக்கிரன்",
    "Sun": "சூரியன்",
    "Moon": "சந்திரன்",
    "Mars": "செவ்வாய்",
    "Rahu": "ராகு",
    "Jupiter": "குரு",
    "Saturn": "சனி",
    "Mercury": "புதன்"
  },
  symbols: {
    "Horse Head": "குதிரை தலை",
    "Yoni (Female Organ)": "யோனி",
    "Razor / Flame": "கத்தி / சுடர்",
    "Ox Cart / Chariot": "மாட்டு வண்டி / தேர்",
    "Deer Head": "மான் தலை",
    "Teardrop / Diamond": "கண்ணீர் துளி / வைரம்",
    "Bow and Quiver": "வில் மற்றும் அம்பு",
    "Cow's Udder / Lotus": "பசுவின் மடி / தாமரை",
    "Coiled Serpent": "சுருண்ட பாம்பு",
    "Royal Throne": "அரச சிம்மாசனம்",
    "Hammock / Fig Tree": "ஊஞ்சல் / அத்தி மரம்",
    "Bed / Hammock": "கட்டில் / ஊஞ்சல்",
    "Open Hand / Palm": "திறந்த கை / உள்ளங்கை",
    "Bright Jewel / Pearl": "பிரகாசமான நகை / முத்து",
    "Coral / Sword": "பவளம் / வாள்",
    "Triumphal Arch / Potter's Wheel": "வெற்றி வளைவு / குயவனின் சக்கரம்",
    "Lotus Flower": "தாமரை மலர்",
    "Earring / Talisman": "காதணி / தாயத்து",
    "Bunch of Roots": "வேர்களின் கொத்து",
    "Elephant Tusk / Fan": "யானை தந்தம் / விசிறி",
    "Elephant Tusk / Small Bed": "யானை தந்தம் / சிறிய கட்டில்",
    "Ear / Three Footprints": "காது / மூன்று காலடிகள்",
    "Drum / Flute": "முரசு / புல்லாங்குழல்",
    "Empty Circle / 100 Flowers": "வெற்று வட்டம் / 100 மலர்கள்",
    "Front of Funeral Cot / Sword": "கட்டிலின் முன் பகுதி / வாள்",
    "Back of Funeral Cot / Twin": "கட்டிலின் பின் பகுதி / இரட்டையர்",
    "Fish / Drum": "மீன் / முரசு"
  },
  traitsMap: {
    "Adventurous": "சாகசமான",
    "Quick-witted": "விரைவான புத்தி",
    "Healing nature": "குணமாக்கும் இயல்பு",
    "Impatient": "பொறுமையற்ற",
    "Energetic": "ஆற்றல் மிக்க",
    "Creative": "படைப்பாற்றல்",
    "Determined": "உறுதியான",
    "Strong-willed": "வலிமையான விருப்பம்",
    "Artistic": "கலைநயம்",
    "Protective": "பாதுகாப்பான",
    "Courageous": "தைரியமான",
    "Sharp intellect": "கூர்மையான அறிவு",
    "Leadership": "தலைமை",
    "Disciplined": "ஒழுக்கமான",
    "Charming": "கவர்ச்சியான",
    "Abundant": "ஏராளமான",
    "Romantic": "காதல்",
    "Graceful": "அழகான",
    "Curious": "ஆர்வமுள்ள",
    "Gentle": "மென்மையான",
    "Intellectual": "அறிவுப்பூர்வமான",
    "Restless": "அமைதியற்ற",
    "Perceptive": "உணரும் திறன்",
    "Intense": "தீவிரமான",
    "Transformative": "மாற்றும்",
    "Emotional": "உணர்ச்சிவசப்பட்ட",
    "Powerful": "சக்திவாய்ந்த",
    "Optimistic": "நம்பிக்கையான",
    "Generous": "தாராளமான",
    "Philosophical": "தத்துவார்த்தமான",
    "Resilient": "மீள் திறன்",
    "Nurturing": "வளர்க்கும்",
    "Dependable": "நம்பகமான",
    "Spiritual": "ஆன்மீகமான",
    "Dutiful": "கடமையுள்ள",
    "Patient": "பொறுமையான",
    "Intuitive": "உள்ளுணர்வு",
    "Strategic": "மூலோபாய",
    "Mystical": "மாயமான",
    "Penetrating": "ஊடுருவும்",
    "Complex": "சிக்கலான",
    "Regal": "அரச",
    "Authoritative": "அதிகாரம் கொண்ட",
    "Traditional": "பாரம்பரியமான",
    "Dignified": "கண்ணியமான",
    "Proud": "பெருமையான",
    "Joyful": "மகிழ்ச்சியான",
    "Luxurious": "ஆடம்பரமான",
    "Friendly": "நட்பான",
    "Compassionate": "கருணையான",
    "Service-minded": "சேவை மனப்பான்மை",
    "Reliable": "நம்பகமான",
    "Skillful": "திறமையான",
    "Clever": "புத்திசாலித்தனமான",
    "Resourceful": "வளமிக்க",
    "Witty": "நகைச்சுவையான",
    "Dexterous": "சாமர்த்தியமான",
    "Aesthetic": "அழகியல்",
    "Detail-oriented": "விவரம் சார்ந்த",
    "Fashionable": "நாகரிகமான",
    "Brilliant": "பிரகாசமான",
    "Independent": "சுதந்திரமான",
    "Diplomatic": "இராஜதந்திரமான",
    "Flexible": "நெகிழ்வான",
    "Business-minded": "வணிக மனப்பான்மை",
    "Adaptable": "தகவமைக்கக்கூடிய",
    "Ambitious": "லட்சியமான",
    "Goal-oriented": "இலக்கு சார்ந்த",
    "Competitive": "போட்டி",
    "Devoted": "பக்தி",
    "Organized": "ஒழுங்கமைக்கப்பட்ட",
    "Loyal": "விசுவாசமான",
    "Social": "சமூக",
    "Wise": "ஞானமுள்ள",
    "Responsible": "பொறுப்புள்ள",
    "Senior": "மூத்த",
    "Investigative": "விசாரணை",
    "Fearless": "பயமற்ற",
    "Invincible": "வெல்ல முடியாத",
    "Inspiring": "ஊக்கமளிக்கும்",
    "Charismatic": "வசீகரமான",
    "Enthusiastic": "உற்சாகமான",
    "Visionary": "தொலைநோக்கு",
    "Principled": "கொள்கையுள்ள",
    "Victorious": "வெற்றிகரமான",
    "Universal": "உலகளாவிய",
    "Learned": "கற்றறிந்த",
    "Communicative": "தொடர்பு கொள்ளும்",
    "Musical": "இசை",
    "Wealthy": "செல்வமிக்க",
    "Rhythmic": "தாளம்",
    "Harmonious": "இணக்கமான",
    "Healing": "குணப்படுத்தும்",
    "Scientific": "அறிவியல்",
    "Sacrificing": "தியாகம்",
    "Radical": "தீவிர",
    "Deep": "ஆழமான",
    "Restrained": "கட்டுப்படுத்தப்பட்ட",
    "Empathetic": "பச்சாதாபம்",
    "Dreamy": "கனவு",
    "Caring": "அக்கறையுள்ள"
  }
};

const filePath = path.join(__dirname, 'data/nakshatras.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Update Interface
content = content.replace(
  /symbol: string; planet: string; element: string;/,
  'symbol: string; symbolTm: string; planet: string; planetTm: string; element: string; elementTm: string;'
);
content = content.replace(
  /compatibleStars: number\[\]; traits: string\[\];/,
  'compatibleStars: number[]; traits: string[]; traitsTm: string[];'
);

function replaceFields(match, p1, symbols, planets, elements, traitsMap) {
  try {
    const objStr = match;
    let newStr = objStr;
    
    // Extract planet
    const planetMatch = objStr.match(/planet:"([^"]+)"/);
    if(planetMatch) {
        newStr = newStr.replace(planetMatch[0], `${planetMatch[0]},planetTm:"${planets[planetMatch[1]] || planetMatch[1]}"`);
    }

    // Extract symbol
    const symbolMatch = objStr.match(/symbol:"([^"]+)"/);
    if(symbolMatch) {
        newStr = newStr.replace(symbolMatch[0], `${symbolMatch[0]},symbolTm:"${symbols[symbolMatch[1]] || symbolMatch[1]}"`);
    }

    // Extract element
    const elementMatch = objStr.match(/element:"([^"]+)"/);
    if(elementMatch) {
        newStr = newStr.replace(elementMatch[0], `${elementMatch[0]},elementTm:"${elements[elementMatch[1]] || elementMatch[1]}"`);
    }

    // Extract traits
    const traitsMatch = objStr.match(/traits:\[(.*?)\]/);
    if(traitsMatch) {
        const arr = JSON.parse(`[${traitsMatch[1]}]`);
        const translatedArr = arr.map(t => traitsMap[t] || t);
        newStr = newStr.replace(traitsMatch[0], `${traitsMatch[0]},traitsTm:${JSON.stringify(translatedArr)}`);
    }

    return newStr;
  } catch (e) {
    return match;
  }
}

content = content.replace(/\{id:\d+,.*?traits:\[.*?\]\}/g, (match) => {
    return replaceFields(match, null, translations.symbols, translations.planets, translations.elements, translations.traitsMap);
});

fs.writeFileSync(filePath, content);
console.log('Successfully updated data/nakshatras.ts');
