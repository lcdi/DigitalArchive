// Enhanced artifact data structure for ethnography archive
export const artifacts = [
  {
    id: 1,
    title: "Abenaki Sweetgrass Gathering Basket",
    image: "/src/assets/artifacts/artifact.jpg",
    
    // Basic Info
    tags: ["vermont-field-research", "craftwork", "daily life", "cultural tradition", "Abenaki", "basket weaving"],
    uploader: "John Doe",
    uploadDate: "2024-01-15",
    fileType: "image/jpeg",
    fileSize: "2.4 MB",
    dimensions: "1920x1080",
    
    // Ethnography Core Fields
    context: "This traditional sweetgrass basket was documented during fieldwork at the Burlington Farmers Market, where the artisan sells their work every Saturday during the summer season. The basket represents the continued practice of traditional Abenaki basket weaving techniques passed down through generations.",
    
    // Where - Location Information
    location: {
      place: "Burlington Farmers Market",
      city: "Burlington",
      state: "Vermont",
      country: "USA",
      coordinates: "44.4759° N, 73.2121° W"
    },
    
    // When - Time Period
    timePeriod: {
      created: "Spring 2023",
      documented: "January 15, 2024",
      era: "Contemporary"
    },
    
    // Who - Subject Information
    subject: {
      name: "Maria S.", // Pseudonym for privacy
      isPseudonym: true,
      role: "Artisan / Basket Weaver",
      community: "Abenaki"
    },
    
    // Descriptions
    description: "A traditional sweetgrass basket used for gathering and storing produce. The basket demonstrates intricate weaving patterns characteristic of Northeastern Native American craftsmanship.",
    
    physicalDescription: {
      materials: "Sweetgrass, ash wood splints, natural dyes",
      dimensions: "12 inches diameter, 8 inches height",
      condition: "Excellent - actively used",
      weight: "Approximately 1.5 lbs"
    },
    
    // Function & Meaning
    function: "Originally designed for harvesting and transporting vegetables and herbs. Currently used at farmers markets for displaying and selling produce, maintaining its traditional purpose while adapting to contemporary commercial contexts.",
    
    meaning: "Represents cultural continuity and resilience. The basket embodies traditional ecological knowledge and sustainable practices. For the maker, it serves as a connection to ancestors and a way to share cultural heritage with the broader community.",
    
    // Transcript (interview excerpt)
    transcript: `Interviewer: "Can you tell me about this basket?"

Maria: "This is a gathering basket, the kind my grandmother taught me to make when I was young. We use sweetgrass - it smells beautiful when it's fresh. The pattern here [gestures] is called the 'potato stamp' design, it's traditional to our people.

I make these to use, not just to sell. When I'm at the market with vegetables in this basket, I'm doing what my ancestors did, just in a different place. It connects me to them."

Interviewer: "How long does it take to make one?"

Maria: "This size, maybe 40-50 hours of work. You have to gather the materials at the right time of year, prepare them, then the weaving itself. It's meditative work."`,
    
    // Additional Media (for future implementation)
    additionalMedia: [
      { type: "video", title: "Weaving Demonstration", duration: "5:23" },
      { type: "audio", title: "Interview Recording", duration: "15:42" }
    ],
    
    // Analysis / Student Work
    analysis: {
      hasStudentWork: true,
      course: "ANTH 301 - Cultural Anthropology",
      student: "Alex Thompson",
      summary: "Analysis explores the intersection of traditional craft practices and modern economic systems, examining how cultural objects negotiate between authenticity and commodification."
    },
    
    // Privacy & Consent
    privacy: {
      level: "Restricted - Identity Protected",
      publicAccess: true,
      identityProtected: true,
      notes: "Subject requested pseudonym use. Face not shown in photographs."
    },
    
    consent: {
      formSigned: true,
      dateSigned: "2024-01-10",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: true,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2023-445",
      irbDate: "2023-12-01"
    }
  },
  {
    id: 2,
    title: "Notre Dame Cathedral - Pre-Fire Documentation",
    image: "/src/assets/artifacts/notredame.png",
    
    // Basic Info
    tags: ["global-ethnography", "historical", "architecture", "religious site"],
    uploader: "Jane Smith",
    uploadDate: "2023-11-08",
    fileType: "image/png",
    fileSize: "3.8 MB",
    dimensions: "2400x1600",
    
    // Ethnography Core Fields
    context: "Photograph taken during architectural documentation project in Paris, March 2019, one month before the devastating fire. Part of a larger study on Gothic architectural preservation and religious tourism.",
    
    // Where - Location Information
    location: {
      place: "Notre-Dame de Paris Cathedral",
      city: "Paris",
      state: "Île-de-France",
      country: "France",
      coordinates: "48.8530° N, 2.3499° E"
    },
    
    // When - Time Period
    timePeriod: {
      created: "1163-1345 CE (original construction)",
      documented: "March 2019",
      era: "Medieval Gothic / Contemporary Documentation"
    },
    
    // Who - Subject Information
    subject: {
      name: "Public Monument",
      isPseudonym: false,
      role: "Historic Cathedral",
      community: "Catholic Church / Parisian Cultural Heritage"
    },
    
    // Descriptions
    description: "Historic photograph of Notre Dame Cathedral's western façade, capturing the iconic Gothic architecture before the April 2019 fire. The image documents the rose window, flying buttresses, and twin towers in their pre-restoration state.",
    
    physicalDescription: {
      materials: "Limestone, oak timber frame (destroyed 2019), stained glass",
      dimensions: "128m length, 48m width, 69m tower height",
      condition: "Pre-fire: Good with ongoing preservation. Post-fire: Severely damaged, under restoration",
      weight: "N/A - Immovable structure"
    },
    
    // Function & Meaning
    function: "Served as Catholic cathedral and archbishop's seat for over 850 years. Functions as place of worship, pilgrimage site, tourist destination, and symbol of French Gothic architecture. Hosted significant historical events including Napoleon's coronation (1804).",
    
    meaning: "Embodies French national identity, Catholic spiritual heritage, and European medieval craftsmanship. Represents human artistic achievement and the relationship between sacred and secular spaces. The 2019 fire transformed its meaning to include themes of loss, resilience, and collective memory.",
    
    // Transcript (fieldnotes excerpt)
    transcript: `Field Notes - March 15, 2019
Location: Parvis Notre-Dame, exterior documentation

10:45 AM - Arriving at cathedral. Tourist crowds already significant despite early hour. Noted approximately 200-300 visitors in immediate vicinity.

The western façade remains breathtaking despite centuries of environmental exposure and previous restoration efforts. The Gallery of Kings statues (19th century reconstructions) show some weathering but overall preservation is remarkable.

Interviewed several visitors:
- German couple: "It's like touching history. Every stone has a story."
- Local Parisian (declined name): "I pass by almost daily. It's Paris. It's us. Can't imagine the city without it."

11:30 AM - Inside observation: The interplay of light through the rose windows creates the intended mystical atmosphere. Medieval builders understood human psychology and spiritual experience.

Note: The oak timber framework in the roof (la forêt - "the forest") dates to the 13th century. Each beam from a different oak tree. Irreplaceable if damaged.`,
    
    // Additional Media
    additionalMedia: [
      { type: "image", title: "Interior Rose Window Detail", count: 15 },
      { type: "image", title: "Flying Buttress Series", count: 8 },
      { type: "video", title: "Architectural Walkthrough", duration: "12:34" }
    ],
    
    // Analysis / Student Work
    analysis: {
      hasStudentWork: true,
      course: "ARCH 405 - Gothic Architecture & Preservation",
      student: "Sophie Martin",
      summary: "Comparative analysis of Notre Dame's construction techniques versus other French Gothic cathedrals (Chartres, Reims, Amiens). Examines how architectural innovation served both structural and theological purposes. Post-fire addendum discusses restoration ethics and authenticity debates."
    },
    
    // Privacy & Consent
    privacy: {
      level: "Public Domain",
      publicAccess: true,
      identityProtected: false,
      notes: "Public monument. No privacy restrictions. Some interior images may include incidental tourist presence."
    },
    
    consent: {
      formSigned: true,
      dateSigned: "2019-03-01",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: true,
        commercialUse: true
      },
      irbApproved: true,
      irbNumber: "IRB-2019-002",
      irbDate: "2019-02-15"
    }
  },
  {
    id: 3,
    title: "Mi'kmaq Elder Oral History Interview",
    image: "/src/assets/artifacts/artifact.jpg",
    type: "Interview",
    collectionId: null,

    // Basic Info
    tags: ["vermont-field-research", "oral history", "indigenous", "language", "Mi'kmaq", "interview"],
    uploader: "Dr. Martinez",
    uploadDate: "2024-03-20",
    fileType: "video/mp4",
    fileSize: "6.2 MB",
    dimensions: "1280x720",
    filePath: "/src/assets/artifacts/mikmaq_interview.mp4",

    context: "Video interview recorded at the Fleming Museum of Art, University of Vermont, Burlington, during the museum's Indigenous Voices symposium. The elder, visiting from Eskasoni First Nation in Nova Scotia, shares stories about seasonal migration patterns and the role of oral tradition in transmitting ecological knowledge across generations.",

    location: {
      place: "Fleming Museum of Art, University of Vermont",
      city: "Burlington",
      state: "Vermont",
      country: "USA",
      coordinates: "44.4775° N, 73.1946° W"
    },

    timePeriod: {
      created: "March 2024",
      documented: "March 20, 2024",
      era: "Contemporary"
    },

    subject: {
      name: "Elder Thomas W.",
      isPseudonym: true,
      role: "Community Elder / Knowledge Keeper",
      community: "Mi'kmaq"
    },

    description: "78-minute video interview with a Mi'kmaq elder discussing seasonal fishing practices, the Mi'kmaq language, and the transmission of traditional ecological knowledge. Recorded in both English and Mi'kmaq with subtitles.",

    physicalDescription: {
      materials: "Digital video recording",
      dimensions: "78 minutes, 1280×720 HD",
      condition: "Excellent - digital master copy",
      weight: "N/A - Digital"
    },

    function: "Documents endangered oral traditions and ecological knowledge for community preservation and academic research. Serves as a primary source for Mi'kmaq language revitalization efforts.",

    meaning: "Represents the living transmission of knowledge that cannot be captured in written records alone. The elder's use of Mi'kmaq language throughout the interview carries layers of meaning lost in translation.",

    transcript: `[00:00:00] Dr. Martinez: "Thank you for sitting down with us today. Can you start by telling us about your earliest memories of the water?"

Elder Thomas W.: "The water, yes. My grandfather took me to the Bras d'Or Lake when I was maybe five years old. In Mi'kmaq we call it Pitu'pok - the old way of saying it. The eels were different then. More of them."

[00:12:34] Elder Thomas W.: "The young people now, they don't know the signs. When the loons call a certain way - [demonstrates call] - that means the mackerel are running. My grandfather taught me that. His grandfather taught him. Now who do I teach?"

[00:45:10] Elder Thomas W.: "Language holds the knowledge. You cannot translate 'Msit No'kmaq' - 'all my relations' - because in English it means family. In Mi'kmaq it means every living thing. The trees are your relations. The fish are your relations. When you forget the word, you forget the relationship."`,

    additionalMedia: [
      { type: "audio", title: "Mi'kmaq Language Excerpts", duration: "22:15" },
      { type: "image", title: "Field Documentation Photos", count: 34 }
    ],

    analysis: {
      hasStudentWork: true,
      course: "ANTH 450 - Indigenous Knowledge Systems",
      student: "Rachel Chen",
      summary: "Analysis examines how oral transmission structures differ from written pedagogy, focusing on the embodied and relational nature of ecological knowledge in Mi'kmaq tradition."
    },

    privacy: {
      level: "Restricted - Identity Protected",
      publicAccess: false,
      identityProtected: true,
      notes: "Elder consented to classroom and research use only. Full name withheld at subject's request. Face visible in video - distribution restricted to authenticated users."
    },

    consent: {
      formSigned: true,
      dateSigned: "2024-03-18",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: false,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2024-112",
      irbDate: "2024-02-28"
    }
  },
  {
    id: 4,
    title: "Appalachian Shape-Note Singing Session",
    image: "/src/assets/artifacts/notredame.png",
    type: "Interview",
    collectionId: null,

    // Basic Info
    tags: ["vermont-field-research", "music", "oral tradition", "religious", "community"],
    uploader: "Jane Smith",
    uploadDate: "2023-09-14",
    fileType: "audio/mpeg",
    fileSize: "4.5 MB",
    dimensions: "N/A",
    filePath: "/src/assets/artifacts/shapenote_session.mp3",

    context: "Field recording captured at a Sacred Harp singing session hosted by the Green Mountain Shape-Note Singers at a historic Congregational church in Burlington's Old North End. Shape-note singing is a centuries-old choral tradition using a four-shape notation system. Burlington's group draws participants from across Vermont and the Upper Connecticut River Valley.",

    location: {
      place: "First Congregational Church",
      city: "Burlington",
      state: "Vermont",
      country: "USA",
      coordinates: "44.4780° N, 73.2151° W"
    },

    timePeriod: {
      created: "September 2023",
      documented: "September 14, 2023",
      era: "Contemporary / Living Tradition (origins c. 1844)"
    },

    subject: {
      name: "New Hope Singing Group",
      isPseudonym: false,
      role: "Community Singers",
      community: "Sacred Harp / Shape-Note Singing Tradition"
    },

    description: "62-minute stereo field recording of a Sacred Harp singing session, capturing the distinctive hollow-square seating arrangement and four-part harmony. Includes 'Idumea,' 'Wondrous Love,' and 'Northfield' among others. No instruments - voice only.",

    physicalDescription: {
      materials: "Digital audio recording, 320kbps MP3",
      dimensions: "62 minutes stereo",
      condition: "Excellent - recorded with Zoom H6",
      weight: "N/A - Digital"
    },

    function: "Social and religious gathering for community bonding and worship. The singing serves simultaneously as musical performance, communal prayer, and memorial practice - the tradition explicitly sings for the dead.",

    meaning: "Shape-note singing preserves a pre-denominational American Protestant musical tradition. Participants describe it as 'the most democratic music' because no performance training is needed - the shapes teach the notes. The hollow square formation means everyone sings to each other, not to an audience.",

    transcript: `Field Notes - September 14, 2023

Arrived 9:00 AM. Already 40+ singers present, setting up chairs in the hollow square formation. Ages range from children (a girl of about 8, singing confidently) to a man the leader introduced as 'Brother Harold, 91 years old, been singing since FDR.'

The sound is startling - not like any choir I've heard. Raw, nasal, intentionally 'unbeautiful.' The leader explained: 'We're not performing. We're praying with our voices.'

[Recording begins 9:47 AM - "Windham" No. 148]

Between songs, leaders are chosen by rotation. Each leader picks a song and beats time with their arm - no instruments, no conductor in the formal sense. The rhythm is deeply physical.

After lunch (communal meal, potluck): the memorial lesson. Names of singers who died in the past year are read aloud. Songs are sung in their memory. Several people are visibly moved.

'The song goes before us,' one singer told me. 'When we sing the old songs, the people who sang them are in the room.'`,

    additionalMedia: [
      { type: "video", title: "Hollow Square Formation Documentation", duration: "8:45" },
      { type: "image", title: "Singing Convention Photos", count: 52 }
    ],

    analysis: {
      hasStudentWork: false,
      course: null,
      student: null,
      summary: null
    },

    privacy: {
      level: "Public Domain",
      publicAccess: true,
      identityProtected: false,
      notes: "Recording made with full knowledge and blessing of the singing group. Sacred Harp tradition actively encourages documentation and sharing."
    },

    consent: {
      formSigned: true,
      dateSigned: "2023-09-14",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: true,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2023-389",
      irbDate: "2023-08-01"
    }
  },
  {
    id: 5,
    title: "Navajo Loom - Two Grey Hills Weaving",
    image: "/src/assets/artifacts/artifact.jpg",
    type: "Photo",
    collectionId: null,

    // Basic Info
    tags: ["vermont-field-research", "craftwork", "Navajo", "textile", "material culture", "indigenous"],
    uploader: "Dr. Martinez",
    uploadDate: "2024-02-03",
    fileType: "image/jpeg",
    fileSize: "5.1 MB",
    dimensions: "3840x2160",

    context: "Documented at the Shelburne Craft School during a visiting artist residency sponsored by the Vermont Arts Council. The weaver, a third-generation practitioner of the Two Grey Hills style, traveled from New Mexico to lead a two-week workshop on traditional Navajo weaving techniques.",

    location: {
      place: "Shelburne Craft School",
      city: "Shelburne",
      state: "Vermont",
      country: "USA",
      coordinates: "44.3987° N, 73.2304° W"
    },

    timePeriod: {
      created: "2023 (woven over 18 months)",
      documented: "February 3, 2024",
      era: "Contemporary"
    },

    subject: {
      name: "Loretta B.",
      isPseudonym: true,
      role: "Master Weaver",
      community: "Navajo Nation"
    },

    description: "4K photograph of a completed Two Grey Hills-style tapestry on the upright loom. The piece measures 3×5 feet and uses only natural undyed wool in the characteristic palette of black, white, tan, and brown. Estimated 800+ hours of labor.",

    physicalDescription: {
      materials: "Churro wool (hand-spun, natural dyes), traditional upright loom",
      dimensions: "36 inches width × 60 inches length",
      condition: "Excellent - newly completed",
      weight: "Approximately 4.2 lbs"
    },

    function: "Intended for sale through a Gallup trading post. Two Grey Hills textiles are among the most valuable in the Navajo weaving tradition, often collected as fine art.",

    meaning: "Each Two Grey Hills piece is a unique geometric composition that reflects the weaver's personal voice within a strict regional aesthetic. For the weaver, the act of creation is inseparable from cultural identity and clan relationships.",

    transcript: `Interviewer: "How do you decide on the pattern?"

Loretta B.: "It comes from here [touches temple] and here [touches chest]. I see the whole thing before I start. Two Grey Hills has rules - you have to know them before you can break them. My grandmother showed me the rules. My mother showed me how to break them the right way.

The border - see this? [points] - mine has a spirit line. Some people call it a weaver's path. It's a small break in the border so my spirit doesn't get trapped in the weaving. The old weavers always did this."

Interviewer: "What will happen to this piece?"

Loretta B.: "It will go to a collector probably. Maybe a museum someday. That's okay. The weaving carries something of me wherever it goes. But I wish more of my people could afford to keep them."`,

    additionalMedia: [
      { type: "video", title: "Warping the Loom Process", duration: "24:10" },
      { type: "audio", title: "Extended Interview", duration: "41:33" },
      { type: "image", title: "Detail Macro Photography", count: 28 }
    ],

    analysis: {
      hasStudentWork: true,
      course: "ANTH 320 - Material Culture Studies",
      student: "James Whitehorse",
      summary: "Examines the economics of Navajo weaving within the Southwest arts market, focusing on how pricing structures and collector demand shape artistic decisions and cultural authenticity negotiations."
    },

    privacy: {
      level: "Restricted - Identity Protected",
      publicAccess: true,
      identityProtected: true,
      notes: "Subject's full name and exact location withheld. Photographs of the weaving are shareable; photographs of the weaver require permission."
    },

    consent: {
      formSigned: true,
      dateSigned: "2024-01-28",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: true,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2024-034",
      irbDate: "2024-01-15"
    }
  },
  {
    id: 6,
    title: "Día de los Muertos Altar Documentation",
    image: "/src/assets/artifacts/notredame.png",
    type: "Photo",
    collectionId: null,

    // Basic Info
    tags: ["global-ethnography", "ritual", "Mexican", "death ritual", "community", "urban", "daily life"],
    uploader: "Research Team",
    uploadDate: "2023-11-03",
    fileType: "image/jpeg",
    fileSize: "4.7 MB",
    dimensions: "3000x2000",

    context: "Photographed at a community ofrenda (altar) installation in the Mission District, San Francisco, as part of a public Día de los Muertos celebration organized by the Galería de la Raza. The altar represents a collaborative community effort honoring both personal and collective loss.",

    location: {
      place: "Galería de la Raza",
      city: "San Francisco",
      state: "California",
      country: "USA",
      coordinates: "37.7599° N, 122.4148° W"
    },

    timePeriod: {
      created: "November 1-2, 2023",
      documented: "November 3, 2023",
      era: "Contemporary (tradition pre-Columbian origins)"
    },

    subject: {
      name: "Mission District Community",
      isPseudonym: false,
      role: "Community Participants",
      community: "Mexican-American / Latinx"
    },

    description: "Wide-angle photograph of a multi-tiered community ofrenda featuring marigolds (cempasúchil), photographs of the deceased, food offerings, sugar skulls, and personal objects. The altar honors community members who died during the year, with a special section for victims of gun violence.",

    physicalDescription: {
      materials: "Marigolds, photographs, candles, food, sugar skulls, papel picado, personal objects",
      dimensions: "Approximately 12 feet wide, 8 feet tall",
      condition: "Ephemeral - dismantled after the celebration",
      weight: "N/A - Temporary installation"
    },

    function: "Ritual space for honoring and communicating with deceased relatives and community members during the two-day observance. Also serves as a public educational space about Mexican cultural practices and community loss.",

    meaning: "The ofrenda collapses the boundary between the living and the dead. The marigold petals create a path for the spirits to follow home. Food is placed for the spirits to enjoy - not symbolically, but literally. The public altar transforms private grief into collective mourning and celebration.",

    transcript: `Field Notes - November 2, 2023, 8:45 PM

The street is thick with people. Painted faces everywhere - calavera makeup ranging from elaborate to hurried, children and elders side by side.

The altar commands the center of the gallery space. I count at least 200 photographs of the deceased. One section labeled 'Nuestros Vecinos Caídos' (Our Fallen Neighbors) holds photos of 14 young men - gun violence victims, all under 30.

Spoke with installation organizer (agreed to be anonymous):
'We started this altar in 1972. It was political then - a way to say that Chicano lives matter, that our dead deserve remembrance. It's still political. Look at this wall [gestures to gun violence section]. These are our children.'

An older woman places a photograph and a plate of tamales on the altar, crosses herself, and whispers something I cannot hear. The intimacy of the gesture in such a public space is startling.

The marigold smell is overwhelming - sweet, almost medicinal. I understand why they call it the flower of the dead.`,

    additionalMedia: [
      { type: "video", title: "Altar Construction Time-lapse", duration: "3:22" },
      { type: "audio", title: "Ambient Sound Recording - Street Celebration", duration: "18:00" },
      { type: "image", title: "Detail Photography Series", count: 67 }
    ],

    analysis: {
      hasStudentWork: true,
      course: "ANTH 280 - Death, Ritual, and Society",
      student: "Carmen Delgado",
      summary: "Analyzes how Día de los Muertos practice has been translated from private household ritual to public community event in urban diaspora contexts, examining both commodification risks and authentic community meaning-making."
    },

    privacy: {
      level: "Public Domain",
      publicAccess: true,
      identityProtected: false,
      notes: "Public event in a public space. Organizers provided explicit documentation permission. Individual photographs on the altar may contain recognizable faces of the deceased."
    },

    consent: {
      formSigned: true,
      dateSigned: "2023-10-15",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: true,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2023-401",
      irbDate: "2023-09-20"
    }
  },
  {
    id: 7,
    title: "Korean Haenyeo Diving Song (Jeju Island)",
    image: "/src/assets/artifacts/artifact.jpg",
    type: "Interview",
    collectionId: null,

    // Basic Info
    tags: ["global-ethnography", "oral tradition", "music", "labor", "Korean", "maritime", "women"],
    uploader: "Archive Admin",
    uploadDate: "2024-04-11",
    fileType: "audio/wav",
    fileSize: "11.8 MB",
    dimensions: "N/A",
    filePath: "/src/assets/artifacts/haenyeo_diving_song.wav",

    context: "Uncompressed WAV recording of a haenyeo (female sea diver) work song captured during fieldwork on Jeju Island, South Korea. The haenyeo are a UNESCO Intangible Cultural Heritage community of women divers who have practiced breath-hold diving for centuries.",

    location: {
      place: "Hamdeok Beach Diving Site",
      city: "Jeju City",
      state: "Jeju Province",
      country: "South Korea",
      coordinates: "33.5445° N, 126.6720° E"
    },

    timePeriod: {
      created: "April 2024",
      documented: "April 11, 2024",
      era: "Contemporary (tradition over 1,500 years old)"
    },

    subject: {
      name: "Grandmother Kang Y.",
      isPseudonym: true,
      role: "Senior Haenyeo / Diving Elder",
      community: "Haenyeo of Jeju Island"
    },

    description: "38-minute high-fidelity WAV recording of a haenyeo work song sung by an 84-year-old senior diver. The recording captures both the song itself and ambient ocean sounds. Includes the distinctive 'sumbisori' - the whistling exhale sound haenyeo make surfacing from dives.",

    physicalDescription: {
      materials: "Digital audio, 24-bit/96kHz WAV",
      dimensions: "38 minutes, stereo",
      condition: "Excellent - studio-quality field recording",
      weight: "N/A - Digital"
    },

    function: "Work songs historically coordinated group diving activities and maintained rhythm during long hours at sea. Today they serve primarily as cultural memory and performance tradition, as the haenyeo community ages and numbers decline.",

    meaning: "The songs encode knowledge about tides, seasons, and sea conditions. The sumbisori - the whistling breath - is both physiological technique and the sound of a woman maintaining her life at the interface of sea and sky. Grandmother Kang described singing as 'keeping my heart above the water even when I am below it.'",

    transcript: `[Recording begins at the shoreline, 6:15 AM]

[Sound of waves, equipment being sorted]

Grandmother Kang Y. begins singing without announcement. The melody is modal, repetitive, built around the rhythm of breath. Other haenyeo nearby fall into the rhythm.

[Translation of key verse, provided by interpreter]:
"The sea takes and the sea gives back.
My mother dove here. Her mother dove here.
I will dive until the sea says stop.
Who will dive after me?"

[After recording, through interpreter]:
Researcher: "How old is this song?"

Grandmother Kang Y.: "Old. Older than my grandmother's grandmother. The words change a little - we add names, we change places. But the melody is the same. The breathing is the same. The sea is the same."

[38:12 - recording ends as divers enter the water]`,

    additionalMedia: [
      { type: "video", title: "Diving Session Documentation", duration: "45:00" },
      { type: "image", title: "Haenyeo Equipment and Gear", count: 23 }
    ],

    analysis: {
      hasStudentWork: false,
      course: null,
      student: null,
      summary: null
    },

    privacy: {
      level: "Restricted - Identity Protected",
      publicAccess: true,
      identityProtected: true,
      notes: "Subject requested that her village not be identified beyond Jeju Island. Voice recognizable - distribution requires institutional authentication."
    },

    consent: {
      formSigned: true,
      dateSigned: "2024-04-09",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: false,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2024-198",
      irbDate: "2024-03-15"
    }
  },
  {
    id: 8,
    title: "Andean Textile Market - Pisac, Peru",
    image: "/src/assets/artifacts/notredame.png",
    type: "Interview",
    collectionId: null,

    // Basic Info
    tags: ["global-ethnography", "market", "craftwork", "Quechua", "textile", "trade", "urban"],
    uploader: "John Doe",
    uploadDate: "2023-07-22",
    fileType: "video/mp4",
    fileSize: "3.7 MB",
    dimensions: "1280x720",
    filePath: "/src/assets/artifacts/pisac_market.mp4",

    context: "4K video ethnography of Sunday market at Pisac, Sacred Valley, Peru. Focuses on Quechua weavers and traders navigating the intersection of traditional textile production and tourist commerce. Part of a longitudinal study on craft commodification in Andean markets.",

    location: {
      place: "Pisac Sunday Market",
      city: "Pisac",
      state: "Cusco Region",
      country: "Peru",
      coordinates: "13.4175° S, 71.8464° W"
    },

    timePeriod: {
      created: "July 2023",
      documented: "July 22, 2023",
      era: "Contemporary"
    },

    subject: {
      name: "Multiple Vendors (see notes)",
      isPseudonym: false,
      role: "Market Vendors / Weavers",
      community: "Quechua / Pisac Community"
    },

    description: "94-minute 4K video documenting a full morning at the Pisac Sunday market. Captures vendor setup, pricing negotiations in Quechua and Spanish, tourist interactions, and a weavers' cooperative meeting. Includes footage of backstrap loom demonstration.",

    physicalDescription: {
      materials: "Digital video, H.264 4K/60fps",
      dimensions: "94 minutes, 3840×2160",
      condition: "Excellent - shot on Sony FX3",
      weight: "N/A - Digital"
    },

    function: "The market serves as the primary economic venue for surrounding Quechua communities. It operates simultaneously as subsistence market (local goods), tourist attraction, and social gathering space for communities who see each other weekly.",

    meaning: "The Pisac market embodies the complex negotiations of Andean identity in a post-colonial economy. Vendors code-switch between Quechua (for each other), Spanish (for Peruvian visitors), and English (for tourists), performing different aspects of identity in each register.",

    transcript: `[00:00:00 - Market square at 7 AM, vendors setting up]

[00:23:15 - Extended sequence at weaving cooperative booth]

Vendor Rosa Q. (through interpreter, Spanish): "The tourists want 'authentic.' But what is authentic? My grandmother wore these colors for herself. I wear them for the tourists now. Is that less authentic? I eat from this work. My children go to school from this work."

[00:41:30 - Price negotiation, tourist offers half the asking price]

Rosa Q. [switches to Quechua, speaking to neighboring vendor]: "Manan atinichu" - "I cannot accept this." [Returns to English with tourist]: "This took me three weeks to make. The yarn alone costs more than this."

[01:02:45 - Cooperative meeting, conducted entirely in Quechua]

[Translation notes provided by Dr. Santos Quispe, local interpreter: Discussion covers fair pricing agreements, tourist season projections, and a proposal to offer weaving workshops as additional revenue stream]`,

    additionalMedia: [
      { type: "audio", title: "Quechua Vendor Conversations", duration: "35:20" },
      { type: "image", title: "Market Setup and Goods", count: 145 }
    ],

    analysis: {
      hasStudentWork: true,
      course: "ANTH 410 - Globalization and Local Cultures",
      student: "Miguel Torres",
      summary: "Examines how Quechua artisans perform and negotiate ethnic identity within tourist markets, drawing on Goffman's dramaturgical theory to analyze code-switching and strategic authenticity."
    },

    privacy: {
      level: "Classroom Use Only",
      publicAccess: false,
      identityProtected: false,
      notes: "Filming conducted with vendor cooperative approval. Individual vendor consent forms on file. Public release requires additional individual permissions not yet secured."
    },

    consent: {
      formSigned: true,
      dateSigned: "2023-07-20",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: false,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2023-287",
      irbDate: "2023-06-10"
    }
  },
  {
    id: 9,
    title: "Fieldwork Interview - Hmong New Year Preparations",
    image: "/src/assets/artifacts/artifact.jpg",
    type: "Interview",
    collectionId: null,

    // Basic Info
    tags: ["vermont-field-research", "Hmong", "diaspora", "ritual", "community", "festival", "interview"],
    uploader: "Jane Smith",
    uploadDate: "2024-01-08",
    fileType: "audio/mpeg",
    fileSize: "0.44 MB",
    dimensions: "N/A",
    filePath: "/src/assets/artifacts/hmong_new_year_interview.mp3",

    context: "Audio interview conducted at the Winooski Community Center with a first-generation Hmong woman discussing the adaptation of Hmong New Year celebrations in Vermont's Champlain Valley. Winooski has one of New England's most diverse per-capita populations, with a significant Hmong community that has built strong cultural institutions since the late 1970s.",

    location: {
      place: "Winooski Community Center",
      city: "Winooski",
      state: "Vermont",
      country: "USA",
      coordinates: "44.4917° N, 73.1871° W"
    },

    timePeriod: {
      created: "January 2024",
      documented: "January 8, 2024",
      era: "Contemporary"
    },

    subject: {
      name: "Paj N.",
      isPseudonym: true,
      role: "Community Organizer / Cultural Practitioner",
      community: "Hmong-American, St. Paul"
    },

    description: "45-minute audio interview exploring how Hmong New Year (Noj Peb Caug) is practiced in Minnesota, including the challenges of maintaining traditions in a cold-climate city far from Laos, and how the celebrations have evolved to incorporate second-generation American-born Hmong youth.",

    physicalDescription: {
      materials: "Digital audio, 192kbps MP3",
      dimensions: "45 minutes, mono",
      condition: "Good - slight background noise from HVAC",
      weight: "N/A - Digital"
    },

    function: "Documents the process of cultural adaptation and intergenerational transmission among diaspora communities. The interview captures lived experience of maintaining ethnic identity across transnational displacement.",

    meaning: "Hmong New Year in Minnesota represents a community-wide act of cultural survival. The celebration occurs three months after the Laotian New Year because Hmong refugees arrived during Minnesota winters and had to adapt. This 'wrong' timing has itself become tradition.",

    transcript: `Interviewer: "Tell me what the New Year celebration means to you here in Minnesota."

Paj N.: "Back home - in Laos, in Thailand in the camps - New Year was outside. Always outside. You need the sky. Here it's in the Civic Center [laughs]. With the fluorescent lights. My mother hated it at first. She said it wasn't real.

But then she watched my daughter do the ball toss [traditional courtship ritual] with a boy from her school, a Hmong boy, and she cried. She said, 'It's still real. It just looks different now.'

The young ones, they don't speak Hmong well. We're losing that. But they wear the paj ntaub [flower cloth] and they know what it means. That's something."

Interviewer: "What worries you about the future of the celebration?"

Paj N.: "The elders are dying. My mother knows how to make the qeej [bamboo mouth organ]. She knows the songs for the souls. When she's gone, who knows them? We're recording her. That's why I support what you're doing here [gestures to recorder]. This has to be kept somewhere."`,

    additionalMedia: [
      { type: "image", title: "New Year Celebration Photos", count: 89 },
      { type: "video", title: "Paj Ntaub Textile Demonstration", duration: "11:20" }
    ],

    analysis: {
      hasStudentWork: true,
      course: "ANTH 350 - Diaspora and Identity",
      student: "Yia Xiong",
      summary: "Analyzes the role of annual celebrations in maintaining ethnic identity among second-generation Hmong Americans, examining how material culture (clothing, food, music) serves as a vector for cultural memory when language transmission falters."
    },

    privacy: {
      level: "Restricted - Identity Protected",
      publicAccess: false,
      identityProtected: true,
      notes: "Subject is a community figure but requested pseudonym due to discussions touching on refugee experiences and family trauma. Audio voice is recognizable - restricted distribution."
    },

    consent: {
      formSigned: true,
      dateSigned: "2024-01-06",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: false,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2024-008",
      irbDate: "2023-12-15"
    }
  },
  {
    id: 10,
    title: "Ethnographic Field Report - Ghost Town Homesteads",
    image: "/src/assets/artifacts/notredame.png",
    type: "Document",
    collectionId: null,

    // Basic Info
    tags: ["global-ethnography", "historical", "landscape", "rural", "American West", "architecture", "daily life"],
    uploader: "Archive Admin",
    uploadDate: "2023-05-30",
    fileType: "application/pdf",
    fileSize: "8.9 MB",
    dimensions: "N/A",
    filePath: "/src/assets/artifacts/ghost_town_report.pdf",

    context: "Comprehensive ethnographic field report documenting the material remains of a late 19th-century homestead community in the San Luis Valley, Colorado. The community was abandoned in the 1930s Dust Bowl era. Report includes site maps, architectural documentation, and oral histories from descendants.",

    location: {
      place: "San Luis Valley Homestead Site",
      city: "Monte Vista",
      state: "Colorado",
      country: "USA",
      coordinates: "37.5775° N, 106.1480° W"
    },

    timePeriod: {
      created: "1880s-1934 (original community)",
      documented: "May 2023",
      era: "Late 19th / Early 20th Century American"
    },

    subject: {
      name: "Historical Site / Descendant Community",
      isPseudonym: false,
      role: "Archaeological / Ethnographic Site",
      community: "Former Homesteaders / Current Descendants"
    },

    description: "47-page PDF field report including site maps, architectural drawings, photographic documentation, and four descendant oral histories. Documents eight surviving structures including a sod house, wooden barn, and stone root cellar. Includes soil analysis indicating original crop rotation patterns.",

    physicalDescription: {
      materials: "PDF document with embedded photographs and maps",
      dimensions: "47 pages, 8.5×11 format",
      condition: "Excellent - digital document",
      weight: "N/A - Digital"
    },

    function: "The original homestead functioned as a subsistence farming operation for a Norwegian immigrant family and their extended community. The site now functions as an educational and ancestral heritage resource for descendants across the United States.",

    meaning: "The ghost town represents the intersection of American settler ambition and ecological catastrophe. The abandoned buildings are simultaneously evidence of aspiration and failure. For descendants, the site is sacred ground connecting them to family origins.",

    transcript: `From the Oral History of Descendant Ruth H., age 76 (recorded 2023):

"My grandmother left in 1934. She took a photograph of the house and walked away. She never went back. She told my mother, 'The land won. The land always wins.'

I've been back four times now. The house is mostly gone - just the stone foundation and the root cellar. But I can see where the kitchen was from the old photograph. That's where she made lefse every Christmas. That's where she boiled the water for the wash.

[Pause] I bring my grandchildren here now. They look at the stones and they can't imagine people living here. I say, 'That was your family. Those stones are your family.' I need them to know where they come from. Even if where they come from is a place that failed."`,

    additionalMedia: [
      { type: "image", title: "Site Photography Survey", count: 203 },
      { type: "audio", title: "Descendant Oral Histories", duration: "2:34:00" },
      { type: "video", title: "Aerial Drone Survey", duration: "16:45" }
    ],

    analysis: {
      hasStudentWork: true,
      course: "ANTH 395 - Historical Archaeology",
      student: "Erik Johansson",
      summary: "Report contributes to the archaeology of failure - examining what material culture remains after community abandonment and what it reveals about the limits of agricultural expansion into marginal environments during the Homestead era."
    },

    privacy: {
      level: "Research Only",
      publicAccess: false,
      identityProtected: false,
      notes: "Exact site coordinates withheld from public record to prevent artifact looting. Descendant oral histories shared with explicit permission. Full site location available to credentialed researchers."
    },

    consent: {
      formSigned: true,
      dateSigned: "2023-04-10",
      permissions: {
        archiveUse: true,
        classroomUse: true,
        publicDisplay: false,
        commercialUse: false
      },
      irbApproved: true,
      irbNumber: "IRB-2023-156",
      irbDate: "2023-03-15"
    }
  }
];

// Enhanced filter options with ethnography categories
export const filterOptions = {
  tags: [
    "vermont-field-research",
    "global-ethnography",
    "craftwork",
    "daily life",
    "cultural tradition",
    "historical",
    "architecture",
    "religious site",
    "nature",
    "urban",
    "ritual",
    "oral history",
    "indigenous",
    "language",
    "interview",
    "music",
    "oral tradition",
    "labor",
    "maritime",
    "women",
    "market",
    "trade",
    "diaspora",
    "festival",
    "landscape",
    "rural",
    "textile"
  ],
  fileTypes: [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "video/mp4",
    "audio/mpeg",
    "audio/wav"
  ],
  uploaders: [
    "John Doe",
    "Jane Smith",
    "Archive Admin",
    "Dr. Martinez",
    "Research Team"
  ],
  locations: [
    "Vermont",
    "France",
    "New England",
    "International",
    "South Korea",
    "Peru",
    "California",
    "Colorado"
  ],
  privacyLevels: [
    "Public Domain",
    "Restricted - Identity Protected",
    "Classroom Use Only",
    "Research Only"
  ]
};
