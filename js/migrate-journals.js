// Migration script to load journals from JSON file to localStorage
(function() {
    // First, try to load from JSON file
    fetch('/data/journals.json')
        .then(response => response.json())
        .then(data => {
            const STORAGE_KEY = 'junegood_journals';
            let existingPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

            // Add journals from JSON if they don't exist
            data.journals.forEach(journal => {
                const exists = existingPosts.find(p => p.id === journal.id);
                if (!exists) {
                    existingPosts.push(journal);
                    console.log(`Loaded from JSON: ${journal.title}`);
                }
            });

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingPosts));
            console.log(`Total journals in localStorage: ${existingPosts.length}`);
        })
        .catch(error => {
            console.log('Could not load journals.json, falling back to hardcoded data');
            loadHardcodedJournals();
        });

    // Fallback function with hardcoded data
    function loadHardcodedJournals() {
    // Define the full content for each journal
    const journalsToMigrate = [
        {
            id: 'journal-barcelona-2016',
            title: 'Barcelona: A City of Art and Architecture',
            category: 'travel',
            date: '2016-12-15',
            status: 'published',
            excerpt: 'Exploring the masterpieces of Gaudí and the vibrant streets of Barcelona. From the Sagrada Família to Park Güell, every corner tells a story of creativity and passion.',
            image: 'images/travels/barcelona.jpg',
            tags: 'travel, barcelona, architecture, gaudí, spain',
            referenceUrl: '',
            content: `Barcelona captured my heart from the moment I stepped onto Las Ramblas. This city, where Gaudí's imagination meets Mediterranean charm, offers a perfect blend of artistic heritage and modern vibrancy.

## The Gaudí Experience

My journey began at the iconic Sagrada Família. Standing before this architectural marvel, still under construction after more than a century, I felt the weight of human ambition and creativity. The play of light through the stained glass windows created a kaleidoscope of colors that danced across the stone columns, each one unique in its design, mimicking the forms found in nature.

Park Güell was another revelation. Perched on a hill overlooking the city, this whimsical park felt like stepping into a fairy tale. The famous mosaic salamander, the serpentine bench covered in broken tile work, and the gingerbread-like houses at the entrance all spoke to Gaudí's genius in transforming ordinary materials into extraordinary art.

## The Gothic Quarter

Wandering through the narrow medieval streets of Barri Gòtic, I discovered hidden squares where locals gathered for coffee and conversation. The Cathedral of Barcelona, with its Gothic facade and peaceful cloister filled with white geese, provided a stark contrast to Gaudí's modernist works. This juxtaposition of old and new is what makes Barcelona so fascinating.

In the evening, the quarter transformed. Tapas bars spilled onto the cobblestone streets, the sound of Spanish guitar echoed from hidden corners, and the aroma of paella filled the air. I found myself at a small restaurant where the owner, upon learning it was my first visit, insisted on serving me a selection of his favorite dishes – patatas bravas, jamón ibérico, and pan con tomate.

## Beach and Beyond

Barcelona's beaches offered a different perspective of the city. Barceloneta Beach, with its golden sand and clear Mediterranean waters, was perfect for afternoon relaxation. Watching the sunset from the beach, with the city skyline in the background, I understood why so many artists and writers have found inspiration here.

A day trip to Montserrat, the mountain monastery an hour outside the city, provided spiritual respite. The dramatic rock formations and the Black Madonna statue inside the monastery added a mystical element to my Barcelona experience.

## Culinary Adventures

The food scene in Barcelona deserves its own mention. From the bustling Boqueria Market, where I sampled fresh fruits, local cheeses, and the best jamón I've ever tasted, to Michelin-starred restaurants pushing the boundaries of Catalan cuisine, every meal was an adventure.

One memorable evening, I joined a cooking class where we learned to make traditional paella. The instructor, a passionate chef named Carlos, taught us that the secret to perfect paella isn't just in the ingredients, but in the patience – letting the rice develop its characteristic socarrat, the crispy bottom layer that's the hallmark of authentic paella.

## Reflections

Barcelona taught me that a city can be both a museum and a living, breathing organism. It's a place where history isn't confined to textbooks but lives in every stone, every plaza, and every tradition. The Catalan spirit – proud, creative, and independent – permeates everything from the architecture to the cuisine to the way people celebrate life.

As I left Barcelona, I carried with me not just photographs and souvenirs, but a renewed appreciation for how art and life can intertwine. Gaudí once said, "Nothing is art if it does not come from nature." In Barcelona, I learned that nothing is life if it does not embrace art.`,
            updated: new Date().toISOString()
        },
        {
            id: 'journal-sf-2019',
            title: 'San Francisco: Innovation and Inspiration',
            category: 'travel',
            date: '2019-07-20',
            status: 'published',
            excerpt: 'Five months in the Bay Area, experiencing the heart of tech innovation while discovering the natural beauty of California\'s coast.',
            image: 'images/travels/sanFrancisco.jpg',
            tags: 'travel, san francisco, technology, innovation, california',
            referenceUrl: '',
            content: `Five months in San Francisco wasn't just a visit – it was an immersion into the heart of innovation, where technology meets counterculture, and where the Pacific fog rolls in like clockwork to blanket a city of dreamers and doers.

## First Impressions

Landing at SFO in February, I was immediately struck by the city's unique geography. Built on hills that seem to defy logic, San Francisco presents itself as a vertical maze of neighborhoods, each with its own distinct personality. My first ride on the BART into the city proper was a preview of the diversity I would come to love – tech workers with their company hoodies sitting next to artists, students, and long-time residents who've watched the city transform.

I settled in the Mission District, a neighborhood that perfectly encapsulates San Francisco's contradictions. Historic Latino murals adorn buildings that house trendy coffee shops and tech startups. The smell of fresh tortillas from traditional taquerías mingles with the aroma of artisanal coffee being roasted. It was here that I began to understand San Francisco isn't just one city – it's dozens of cities coexisting in creative tension.

## The Tech Ecosystem

Working in South of Market (SOMA) gave me a front-row seat to the tech revolution. The energy was palpable – every coffee shop buzzed with pitches and product discussions. I attended meetups where twenty-somethings discussed AI and blockchain with the casual confidence of seasoned experts. The phrase "changing the world" was thrown around so often it became background noise, yet there was something genuine about the ambition.

But Silicon Valley's influence extends beyond the office towers. I witnessed both the promise and peril of rapid innovation. Self-driving cars navigated the streets alongside homeless encampments, creating a jarring juxtaposition that forced me to question what progress really means. The city's housing crisis, driven partly by tech wealth, was impossible to ignore. Conversations with locals revealed a complex mix of pride in the city's innovative spirit and frustration with its growing inequality.

## Natural Escapes

One of San Francisco's greatest gifts is its proximity to nature. Weekend trips to Muir Woods introduced me to the cathedral-like silence of old-growth redwood forests. Standing among trees that have witnessed centuries, the frantic pace of startup life seemed suddenly insignificant. The Pacific Coast Highway offered another escape – driving down to Half Moon Bay or up to Point Reyes, I discovered California's rugged coastline, where elephant seals lounged on beaches and waves crashed against dramatic cliffs.

Golden Gate Park became my regular refuge. Larger than New York's Central Park, it offered endless exploration – from the Japanese Tea Garden to the California Academy of Sciences. Sunday afternoons at the park revealed San Francisco at its most relaxed: drum circles, picnics, roller skaters, and families from every corner of the world sharing the same green space.

## Cultural Kaleidoscope

San Francisco's neighborhoods are like different countries. Chinatown, the oldest in North America, transported me to another continent with its herbal medicine shops, dim sum parlors, and the sound of Cantonese filling the air. The Castro, with its rainbow crosswalks and historic significance to the LGBTQ+ movement, radiated pride and acceptance. North Beach, the city's Little Italy and former Beat Generation headquarters, still echoed with the poetry of Ferlinghetti and Ginsberg.

Food became my gateway to understanding the city's diversity. Ethiopian food in the Tenderloin, Vietnamese phở in Little Saigon, Mexican food in the Mission – each meal was a journey. But it was the California cuisine movement, with its emphasis on local, sustainable ingredients, that truly captured the Bay Area spirit. Farmers' markets at Ferry Building and Alemany showcased the bounty of Northern California, and restaurants transformed these ingredients into culinary art.

## The Fog and Other Characters

Karl the Fog – yes, San Francisco's fog has a name and its own social media presence – became a character in my daily life. Watching it roll over Twin Peaks or creep through the Golden Gate Bridge never got old. The fog shaped the city's rhythm: sunny mornings in the Mission could mean foggy afternoons in the Sunset. Locals dressed in layers, always prepared for microclimates that could change within a few blocks.

The city's characters weren't limited to weather phenomena. I met fascinating people everywhere – the former Googler who quit to open a bookstore, the street artist who'd been documenting the Mission's changes for decades, the venture capitalist who spent weekends teaching kids to code in Oakland. Each person I met seemed to have a story of reinvention, of coming to San Francisco to become someone new.

## Innovation Beyond Tech

While tech dominates headlines, I discovered innovation in unexpected places. Urban farming initiatives transformed vacant lots into productive gardens. Artists used AR to create interactive murals. Social entrepreneurs tackled homelessness with creative housing solutions. The Exploratorium redefined what a science museum could be. Even the city's approach to public transportation, while imperfect, showed a willingness to experiment with solutions.

The maker movement thrived in spaces like Noisebridge, where anyone could learn to weld, solder, or 3D print. These spaces embodied the democratic spirit of innovation – the idea that anyone with curiosity and determination could create something meaningful.

## Lessons from the Bay

Five months in San Francisco taught me that innovation isn't just about technology – it's about mindset. The city's "why not?" attitude was infectious. Failure wasn't stigmatized but seen as a necessary step toward success. Impossible was just another problem to solve. This optimism, while sometimes naive, created an environment where extraordinary things seemed ordinary.

But I also learned about the costs of rapid change. Gentrification displaced long-time residents. The wealth gap created parallel cities that rarely intersected. The pressure to succeed, to be extraordinary, could be crushing. San Francisco forced me to grapple with questions about progress, community, and what we owe each other in times of change.

## Departure and Reflection

As my time in San Francisco ended, I stood on the Embarcadero watching the Bay Bridge light up at sunset. The city had changed me. I'd arrived seeking to understand innovation and left with something more – an appreciation for complexity, for the messy process of creating the future while honoring the past.

San Francisco isn't perfect. It's a city of contradictions, struggling with its own success. But it's also a city that dares to imagine different futures, where dreamers and builders converge, where failure is a teacher, and where the next big idea might come from anyone, anywhere. In a world that often feels stuck, San Francisco's restless energy, its refusal to accept the status quo, feels necessary.

The fog rolled in one last time as my plane took off, obscuring the city below. But I carried its spirit with me – the understanding that innovation isn't just about building new things, but about constantly questioning, constantly evolving, and never losing the courage to ask, "What if?"`,
            updated: new Date().toISOString()
        },
        {
            id: 'journal-storytelling-2024',
            title: 'The Journey of Storytelling',
            category: 'life',
            date: '2024-11-10',
            status: 'published',
            excerpt: 'From film directing to founding RAFIKI, my journey has been about telling stories that matter.',
            image: 'images/aboutme01.png',
            tags: 'life, storytelling, film, entrepreneurship, rafiki',
            referenceUrl: '',
            content: `Every story begins with a single frame, a moment captured in time. My journey from film school to founding RAFIKI has been about discovering that the most powerful stories aren't always told through a camera lens – sometimes they're built, coded, and shared through the digital experiences we create.

## The Early Days: Film School Dreams

I still remember the weight of the camera in my hands during my first day at film school. It wasn't just equipment; it was possibility. Every assignment was an opportunity to explore human emotion, to capture truth in 24 frames per second. We spent countless nights in editing rooms, debating the perfect cut, the right music, the exact moment to hold a shot just a second longer.

Film taught me that storytelling is about economy – saying the most with the least. A glance could convey more than dialogue. Silence could be louder than sound. These lessons would prove invaluable, though I didn't know it then, in every creative endeavor that followed.

## The Pivot: When Stories Meet Code

The transition from film to digital wasn't planned. It started with a simple website for a documentary project. I needed to share the story beyond festivals, to reach audiences directly. Learning HTML felt like learning a new language – not just technically, but creatively. Code, I discovered, was another medium for storytelling.

Where film was linear, digital was interactive. Where movies were watched, websites were experienced. The user became part of the narrative, choosing their path, creating their own journey. This revelation changed everything. I wasn't abandoning storytelling; I was expanding its canvas.

## Building RAFIKI: Stories That Scale

RAFIKI was born from a simple observation: every business has a story, but not everyone knows how to tell it. The name itself – meaning "friend" in Swahili – reflected our philosophy. We weren't just service providers; we were collaborators in narrative construction.

Our first client was a small coffee roaster. They thought they needed a website; what they really needed was to share their passion for Ethiopian coffee farming communities. We built them a digital experience that took visitors on a journey from bean to cup, making them part of a larger story about sustainability and global connection.

That project taught me that digital storytelling isn't about fancy animations or bleeding-edge technology. It's about understanding the emotional core of a message and finding the clearest path to convey it. Sometimes that's a simple photograph. Sometimes it's an interactive timeline. Sometimes it's just the right words in the right typeface.

## The Creative Process: Film Principles in Digital Spaces

Every project at RAFIKI begins like a film – with a story. We storyboard websites like scenes. We think about user journeys like character arcs. The three-act structure that governs screenwriting helps us organize information architecture. The homepage is the opening shot – it needs to establish tone, promise value, and compel the viewer to continue.

Film editing taught me about rhythm and pacing, concepts directly applicable to web design. How long should a user spend on each section? When do we need a visual break? Where do we place the emotional peaks? These questions guide our creative process.

## Lessons in Leadership

Running RAFIKI has been its own education. Leading a creative team requires balancing artistic vision with business reality. I've learned that the best ideas often come from unexpected places – the junior designer who sees a fresh perspective, the developer who suggests a narrative solution to a technical problem.

Failure has been a patient teacher. Projects that didn't resonate taught us to listen better. Clients who challenged our ideas pushed us to articulate our vision more clearly. Every setback refined our process, our philosophy, our story.

## The Digital Renaissance

We're living in extraordinary times for storytellers. The barriers between disciplines are dissolving. A filmmaker can build an app. A programmer can create art. A designer can direct narratives. This convergence excites me because it means stories can take any form necessary to reach their audience.

Virtual reality promises to make viewers participants. Artificial intelligence offers personalized narratives. Blockchain might revolutionize how stories are owned and shared. But beneath all this technology, the fundamental human need remains unchanged: we want to connect, to understand, to be understood.

## Personal Reflections

Looking back, every career pivot, every project, every success and failure has been part of a larger narrative I'm still writing. The film director in me sees life in scenes and sequences. The entrepreneur sees opportunities and challenges. The storyteller sees it all as material.

Travel has enriched this perspective immeasurably. Each city visited, each culture experienced adds depth to the stories I can tell. Barcelona taught me about the power of unconventional beauty. San Francisco showed me how innovation and tradition can coexist. Seoul, my home, grounds me in the importance of roots while reaching for the global.

## The Future of Storytelling

I believe we're entering a new age of storytelling where the boundaries between creator and audience, between medium and message, continue to blur. The stories that will resonate are those that acknowledge this shift – that invite participation, that adapt to their audience, that exist across multiple platforms and formats.

At RAFIKI, we're exploring these frontiers. We're experimenting with stories that change based on time of day, location, or user behavior. We're creating narratives that live simultaneously in physical and digital spaces. We're asking: what if a story could learn and evolve?

## The Core Truth

Through all these explorations, one truth remains constant: the best stories are honest. They acknowledge complexity without becoming complicated. They find universal themes in specific experiences. They make the audience feel seen, heard, understood.

This is what drives me every day – the possibility that through pixels and code, through design and interaction, we can create moments of genuine human connection. That a website can move someone. That an app can tell a story worth remembering. That digital experiences can be as emotionally resonant as any film.

## Continuing the Journey

The journey from film to digital entrepreneurship hasn't been linear, and that's what makes it interesting. Each day brings new challenges, new stories to tell, new ways to tell them. The camera I once held has transformed into keyboards and screens, but the mission remains the same: to capture truth, to share beauty, to connect humans through narrative.

As I write this, I'm planning RAFIKI's next chapter. We're moving beyond client work to create our own stories – products that embody our philosophy of meaningful digital experiences. It feels like coming full circle, from wanting to make films that matter to building digital experiences that make a difference.

The journey of storytelling never really ends. It just finds new mediums, new audiences, new truths to explore. And that's the beauty of it – there's always another story waiting to be told, another way to tell it, another heart to reach.`,
            updated: new Date().toISOString()
        }
    ];

    // Check if posts already exist
    const STORAGE_KEY = 'junegood_journals';
    let existingPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // Check for the fourth journal (Smile Shot) if it exists
    const smileShotExists = existingPosts.find(p => p.title && p.title.includes('Smile'));

    // Migrate the three hardcoded journals
    journalsToMigrate.forEach(journal => {
        const exists = existingPosts.find(p => p.id === journal.id);
        if (!exists) {
            existingPosts.push(journal);
            console.log(`Migrated: ${journal.title}`);
        } else {
            console.log(`Already exists: ${journal.title}`);
        }
    });

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingPosts));

    console.log('Migration complete!');
    console.log(`Total journals in localStorage: ${existingPosts.length}`);

    return existingPosts;
    }
})();