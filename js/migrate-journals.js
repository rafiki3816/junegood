// Migration script to load journals from JSON file to localStorage
(function() {
    // Get configuration
    const config = window.CONFIG || {};
    const DATA_PATH = config.DATA_JOURNALS_PATH || '/data/journals.json';

    // First, try to load from JSON file
    fetch(DATA_PATH)
        .then(response => response.json())
        .then(data => {
            const STORAGE_KEY = config.STORAGE_KEY_JOURNALS || 'junegood_journals';
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
            id: 'journal-smileshot-2024',
            title: 'Smile Shot 스마일샷',
            category: 'work',
            date: '2024-12-01',
            status: 'published',
            excerpt: '진정한 감정과 자연스러운 기쁨의 순간을 포착하는 혁신적인 사진 프로젝트.',
            image: '',
            tags: 'work, photography, project, smile',
            referenceUrl: '',
            content: `스마일샷은 단순한 사진 프로젝트가 아니다. 가장 순수한 형태로 포착된 진정한 인간의 감정을 기념하는 작업이다. 이 프로젝트는 간단한 관찰에서 시작되었다. 가장 아름다운 미소는 사람들이 사진 찍히는 것을 잊었을 때 자연스럽게 나타나는 미소라는 것을.

## The Concept

The idea for Smile Shot came during a casual gathering with friends. I noticed how different people looked in candid moments compared to posed photographs. When the camera came out, genuine expressions would disappear, replaced by practiced smiles that never quite reached the eyes. I wanted to capture those fleeting moments of real joy, surprise, and connection that make us human.

## The Technique

Developing the right approach took months of experimentation. Traditional portrait photography often creates a barrier between subject and photographer. To break this down, I developed several techniques:

- **The Conversation Method**: Engaging subjects in meaningful conversations while shooting, capturing their reactions and expressions as they speak about things they're passionate about.
- **The Surprise Element**: Setting up situations that naturally evoke genuine emotions – reuniting old friends, surprising people with good news, or capturing reactions to unexpected moments.
- **The Long Game**: Spending extended time with subjects until they forget about the camera entirely, allowing their guard to drop and authentic expressions to emerge.

## Technical Challenges

Capturing spontaneous moments required rethinking traditional photography setups. I had to balance being ready for the perfect moment while remaining unobtrusive. This meant:

- Using smaller, less intimidating equipment
- Mastering available light to avoid disruptive flash
- Developing an intuitive sense for when special moments were about to happen
- Learning to shoot from unconventional angles to remain less noticeable

## The Stories

Every smile has a story. Through this project, I've captured:

- A grandmother seeing her grandchild for the first time via video call
- Street musicians lost in the joy of their performance
- Children discovering snow for the first time
- A couple reconnecting after years apart
- Workers celebrating the completion of a challenging project

Each photograph is a window into a moment of genuine human emotion, a fraction of a second where joy breaks through the masks we wear daily.

## Cultural Perspectives

Working across different cultures taught me that while smiles are universal, their contexts vary greatly. In Korea, where emotional restraint is often valued, capturing genuine smiles required understanding cultural nuances and building deeper trust. In contrast, working in more expressive cultures presented different challenges – distinguishing between performative and authentic joy.

## The Impact

What started as a personal project has grown into something larger. People who see these photographs often comment on how they feel different from typical portraits. They recognize something authentic, something that reminds them of their own moments of joy. Several subjects have told me that seeing themselves genuinely happy in these photos helped them through difficult times.

## Technical Evolution

As the project evolved, so did my technical approach:

- **Equipment**: Transitioned from DSLRs to mirrorless cameras for discretion
- **Lenses**: Primarily 35mm and 50mm for natural perspective
- **Processing**: Minimal editing to preserve authenticity
- **Format**: Both digital and film, each bringing different qualities to the captured moments

## Exhibitions and Response

Smile Shot has been featured in several exhibitions, each presenting a different aspect of human joy:

- **"Unguarded Moments"**: Focused on spontaneous street photography
- **"Connections"**: Explored relationships and shared joy
- **"Cultural Smiles"**: Examined expressions of happiness across different societies
- **"The Joy of Work"**: Captured people finding satisfaction in their crafts

## Philosophical Reflections

This project has taught me that happiness is not a constant state but a series of moments. The camera became a tool not just for documentation but for discovery – finding joy in unexpected places, recognizing the beauty in fleeting expressions, understanding that the most powerful photographs are often the ones we don't plan.

## Future Directions

Smile Shot continues to evolve. Current explorations include:

- **Video Integration**: Capturing the moments leading to and following genuine smiles
- **Interactive Installations**: Creating spaces that naturally evoke joy while documenting reactions
- **Collaborative Projects**: Working with communities to document collective joy
- **Digital Archive**: Building an online collection of stories behind each smile

## The Philosophy

Ultimately, Smile Shot is about more than photography. It's about recognizing and celebrating the moments that make life worth living. In a world increasingly mediated by screens and filters, there's something revolutionary about capturing unfiltered human emotion. Each genuine smile is a small act of rebellion against the performative nature of modern life.

## Conclusion

Smile Shot has become my ongoing meditation on human happiness. It's taught me to be more observant, more patient, and more appreciative of the small moments that define our lives. Every photograph in this collection is a reminder that joy, however fleeting, is always worth capturing and sharing.

The project continues because there are infinite smiles yet to be discovered, each one unique, each one a story worth telling. In the end, Smile Shot is not just about taking pictures – it's about seeing and celebrating the light in human faces when happiness breaks through.`,
            updated: new Date().toISOString()
        }
    ];

    // Check if posts already exist
    const STORAGE_KEY = 'junegood_journals';
    let existingPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // Migrate the hardcoded journals
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