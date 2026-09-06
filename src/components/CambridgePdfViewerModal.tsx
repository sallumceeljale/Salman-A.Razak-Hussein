import React, { useState } from 'react';
import { X, Download, FileText, Search, ChevronLeft, ChevronRight, BookOpen, ExternalLink, ShieldCheck, Check } from 'lucide-react';

interface CambridgePdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CambridgePdfViewerModal({ isOpen, onClose }: CambridgePdfViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'reader' | 'topics' | 'about'>('reader');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeLetter, setActiveLetter] = useState('A');

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    // Generate text/pdf blob download for Cambridge English Preliminary Vocabulary List
    const pdfContent = `CAMBRIDGE ENGLISH: PRELIMINARY (PET) VOCABULARY LIST
Cambridge University Press & Assessment
Level: CEFR B1

1. INTRODUCTION
The Cambridge English: Preliminary and Preliminary for Schools Vocabulary List gives teachers and candidates a comprehensive guide to the vocabulary needed when preparing for B1 level examinations.

2. SAMPLE ALPHABETICAL WORDLIST PREVIEW (A-Z)
A: ability (n), able (adj), about (adv & prep), above (adj & adv), abroad (adv), accept (v), access (n), accident (n), accommodation (n), achieve (v), action (n), activity (n), actor (n), addition (n), address (n), admire (v), adult (adj & n), advance (n), advantage (n), adventure (n), advice (n), advise (v), afford (v), afraid (adj), afternoon (n), age (n), agency (n), agree (v), ahead (adv), air (n), airline (n), airport (n), alarm (n), album (n), alive (adj), allow (v), almost (adv), alone (adj & adv), along (adv & prep), already (adv), also (adv), although (conj), always (adv), amazed (adj), amazing (adj), ambition (n), ambulance (n), amount (n), ancient (adj), angry (adj), animal (n), anniversary (n), announce (v), annual (adj), answer (n & v), anxious (adj), apartment (n), apologize (v), appearance (n), application (n), apply (v), appointment (n), approach (v), approve (v), architect (n), area (n), argue (v), arm (n), army (n), arrange (v), arrest (v), arrival (n), arrive (v), art (n), article (n), artist (n), ashamed (adj), ask (v), asleep (adj), assistant (n), athlete (n), atmosphere (n), attach (v), attack (n & v), attempt (v), attend (v), attention (n), attitude (n), attract (v), audience (n), author (n), available (adj), average (adj & n), avoid (v), awake (adj), award (n & v), awful (adj).

B: baby (n), background (n), backpack (n), backwards (adv), bad (adj), bag (n), bake (v), balance (n & v), balcony (n), ball (n), band (n), bank (n), bar (n), barbecue (n & v), baseball (n), basic (adj), basket (n), basketball (n), bath (n & v), bathroom (n), battery (n), battle (n), beach (n), bean (n), bear (n), beard (n), beat (v), beautiful (adj), beauty (n), because (conj), become (v), bed (n), bedroom (n), bee (n), beef (n), before (prep, adv & conj), begin (v), beginner (n), behave (v), behavior (n), behind (prep & adv), believe (v), belong (v), below (adv & prep), belt (n), benefit (n), beside (prep), best (adj & adv), better (adj & adv), between (prep & adv), bicycle (n), big (adj), bike (n), bill (n), biology (n), bird (n), birth (n), birthday (n), biscuit (n), bit (n), bite (v), bitter (adj), black (adj & n), blanket (n), bleed (v), blind (adj), block (n), blog (n), blood (n), blouse (n), blow (v), blue (adj & n), board (n & v), boat (n), body (n), boil (v), bold (adj), bomb (n & v), bone (n), book (n & v), booking (n), bookshelf (n), boot (n), border (n), bored (adj), boring (adj), born (adj), borrow (v), boss (n), both (det & pron), bother (v), bottle (n), bottom (n & adj), bowl (n), box (n), boy (n), brain (n), brake (n & v), branch (n), brave (adj), bread (n), break (n & v), breakfast (n), breath (n), breathe (v), bridge (n), brief (adj), bright (adj), brilliant (adj), bring (v), broad (adj), brother (n), brown (adj & n), brush (n & v), bucket (n), build (v), building (n), bulb (n), burn (v), bus (n), business (n), busy (adj), butter (n), button (n), buy (v).

3. APPENDIX TOPIC LISTS:
- Clothes & Accessories
- Communications & Technology
- Education & Learning
- Entertainment & Media
- Food & Drink
- Health, Medicine & Exercise
- House & Home
- Places: Countryside, Town & City
- Travel & Transport
- Work & Jobs

Source: Cambridge English Preliminary Wordlist
© UCLES Cambridge English Language Assessment`;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Cambridge_English_Preliminary_Vocabulary_List.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sampleAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const sampleWords: Record<string, string[]> = {
    A: ['ability (n)', 'able (adj)', 'about (adv & prep)', 'above (adj & adv)', 'abroad (adv)', 'accept (v)', 'access (n)', 'accident (n)', 'accommodation (n)', 'achieve (v)', 'action (n)', 'activity (n)', 'actor (n)', 'addition (n)', 'address (n)', 'admire (v)', 'adult (adj & n)', 'advance (n)', 'advantage (n)', 'adventure (n)', 'advice (n)', 'advise (v)', 'afford (v)', 'afraid (adj)', 'afternoon (n)', 'age (n)', 'agency (n)', 'agree (v)', 'ahead (adv)', 'air (n)', 'airline (n)', 'airport (n)', 'alarm (n)', 'album (n)', 'alive (adj)', 'allow (v)', 'almost (adv)', 'alone (adj & adv)', 'already (adv)', 'also (adv)', 'always (adv)', 'amazing (adj)', 'ambition (n)', 'ambulance (n)', 'ancient (adj)', 'angry (adj)', 'animal (n)', 'announce (v)', 'annual (adj)', 'answer (n & v)', 'anxious (adj)', 'apartment (n)', 'apologize (v)', 'application (n)', 'apply (v)', 'appointment (n)', 'architect (n)', 'area (n)', 'argue (v)', 'army (n)', 'arrange (v)', 'arrival (n)', 'arrive (v)', 'art (n)', 'article (n)', 'artist (n)', 'ashamed (adj)', 'ask (v)', 'asleep (adj)', 'assistant (n)', 'athlete (n)', 'attract (v)', 'audience (n)', 'author (n)', 'available (adj)', 'avoid (v)', 'award (n & v)'],
    B: ['baby (n)', 'background (n)', 'backpack (n)', 'bad (adj)', 'bag (n)', 'bake (v)', 'balcony (n)', 'ball (n)', 'band (n)', 'bank (n)', 'barbecue (n & v)', 'baseball (n)', 'basic (adj)', 'basket (n)', 'basketball (n)', 'bathroom (n)', 'battery (n)', 'beach (n)', 'bear (n)', 'beat (v)', 'beautiful (adj)', 'because (conj)', 'become (v)', 'bedroom (n)', 'before (prep)', 'begin (v)', 'beginner (n)', 'behave (v)', 'behind (prep)', 'believe (v)', 'below (prep)', 'benefit (n)', 'best (adj)', 'better (adj)', 'between (prep)', 'bicycle (n)', 'big (adj)', 'bike (n)', 'bill (n)', 'biology (n)', 'bird (n)', 'birthday (n)', 'biscuit (n)', 'bitter (adj)', 'black (adj & n)', 'blanket (n)', 'bleed (v)', 'blind (adj)', 'block (n)', 'blog (n)', 'blood (n)', 'blow (v)', 'blue (adj & n)', 'board (n & v)', 'boat (n)', 'body (n)', 'boil (v)', 'bold (adj)', 'bone (n)', 'book (n & v)', 'boot (n)', 'border (n)', 'bored (adj)', 'boring (adj)', 'borrow (v)', 'boss (n)', 'bottle (n)', 'bottom (n)', 'bowl (n)', 'box (n)', 'brain (n)', 'brave (adj)', 'bread (n)', 'break (n & v)', 'breakfast (n)', 'bridge (n)', 'bright (adj)', 'brilliant (adj)', 'bring (v)', 'broad (adj)', 'brother (n)', 'brown (adj & n)', 'brush (n & v)', 'build (v)', 'building (n)', 'burn (v)', 'bus (n)', 'business (n)', 'busy (adj)', 'butter (n)', 'buy (v)'],
    C: ['cabin (n)', 'cable (n)', 'cafe (n)', 'cake (n)', 'calculator (n)', 'calendar (n)', 'call (n & v)', 'calm (adj)', 'camera (n)', 'camp (n & v)', 'camping (n)', 'can (mv)', 'cancel (v)', 'candidate (n)', 'candle (n)', 'capital (adj & n)', 'car (n)', 'card (n)', 'care (n & v)', 'career (n)', 'careful (adj)', 'carpet (n)', 'carry (v)', 'cartoon (n)', 'case (n)', 'cash (n)', 'castle (n)', 'cat (n)', 'catch (v)', 'celebrate (v)', 'celebrity (n)', 'cell phone (n)', 'center (n)', 'century (n)', 'cereal (n)', 'ceremony (n)', 'certain (adj)', 'certificate (n)', 'chain (n)', 'chair (n)', 'challenge (n)', 'champion (n)', 'chance (n)', 'change (n & v)', 'channel (n)', 'chapter (n)', 'character (n)', 'charity (n)', 'chat (n & v)', 'cheap (adj)', 'cheat (v)', 'check (n & v)', 'cheerful (adj)', 'cheese (n)', 'chef (n)', 'chemistry (n)', 'chess (n)', 'chicken (n)', 'child (n)', 'childhood (n)', 'choice (n)', 'choose (v)', 'cinema (n)', 'circle (n)', 'city (n)', 'claim (v)', 'class (n)', 'classmate (n)', 'clean (adj & v)', 'clear (adj & v)', 'clever (adj)', 'click (n & v)', 'climate (n)', 'climb (v)', 'clock (n)', 'close (adj & v)', 'clothes (n)', 'cloud (n)', 'club (n)', 'coach (n)', 'coast (n)', 'coat (n)', 'coffee (n)', 'coin (n)', 'cold (adj & n)', 'colleague (n)', 'collect (v)', 'college (n)', 'color (n & v)', 'come (v)', 'comedy (n)', 'comfortable (adj)', 'command (n & v)', 'common (adj)', 'communicate (v)', 'company (n)', 'compare (v)', 'compete (v)', 'competition (n)', 'complain (v)', 'complete (adj & v)', 'computer (n)', 'concentrate (v)', 'concert (n)', 'conclusion (n)', 'condition (n)', 'conference (n)', 'confident (adj)', 'confirm (v)', 'confused (adj)', 'congratulations (exclam)', 'connect (v)', 'consider (v)', 'continue (v)', 'contract (n)', 'control (n & v)', 'conversation (n)', 'cook (n & v)', 'cool (adj & v)', 'copy (n & v)', 'corner (n)', 'correct (adj)', 'cost (n & v)', 'cotton (n)', 'count (v)', 'country (n)', 'couple (n)', 'courage (n)', 'course (n)', 'court (n)', 'cover (n & v)', 'cow (n)', 'crash (n & v)', 'crazy (adj)', 'create (v)', 'creative (adj)', 'credit card (n)', 'crime (n)', 'cross (n & v)', 'crowd (n)', 'cruel (adj)', 'cry (n & v)', 'culture (n)', 'cup (n)', 'cupboard (n)', 'cure (n & v)', 'curious (adj)', 'curtain (n)', 'custom (n)', 'customer (n)', 'cut (n & v)', 'cycle (n & v)'],
    D: ['dad (n)', 'daily (adj & adv)', 'damage (n & v)', 'dance (n & v)', 'dancer (n)', 'danger (n)', 'dangerous (adj)', 'dark (adj & n)', 'date (n & v)', 'daughter (n)', 'day (n)', 'dead (adj)', 'deaf (adj)', 'deal (n & v)', 'dear (adj)', 'death (n)', 'decide (v)', 'decision (n)', 'decorate (v)', 'deep (adj)', 'defeat (n & v)', 'defend (v)', 'definitely (adv)', 'degree (n)', 'delay (n & v)', 'delete (v)', 'delicious (adj)', 'deliver (v)', 'demand (n & v)', 'dentist (n)', 'depart (v)', 'department (n)', 'departure (n)', 'depend (v)', 'describe (v)', 'description (n)', 'desert (n)', 'deserve (v)', 'design (n & v)', 'designer (n)', 'desk (n)', 'despite (prep)', 'dessert (n)', 'destination (n)', 'destroy (v)', 'detail (n)', 'detective (n)', 'develop (v)', 'diagram (n)', 'dial (v)', 'diary (n)', 'dictionary (n)', 'die (v)', 'diet (n)', 'difference (n)', 'different (adj)', 'difficult (adj)', 'dig (v)', 'digital (adj)', 'dining room (n)', 'dinner (n)', 'direction (n)', 'director (n)', 'dirty (adj)', 'disabled (adj)', 'disagree (v)', 'disappear (v)', 'disappoint (v)', 'discover (v)', 'discuss (v)', 'discussion (n)', 'disease (n)', 'dish (n)', 'disk (n)', 'dislike (v)', 'distance (n)', 'divide (v)', 'doctor (n)', 'document (n)', 'dog (n)', 'dollar (n)', 'door (n)', 'double (adj)', 'doubt (n)', 'down (adv)', 'download (n & v)', 'downstairs (adv)', 'draft (n)', 'drag (v)', 'drama (n)', 'draw (v)', 'drawing (n)', 'dream (n & v)', 'dress (n & v)', 'drink (n & v)', 'drive (n & v)', 'driver (n)', 'drop (n & v)', 'dry (adj & v)', 'duck (n)', 'during (prep)', 'duty (n)', 'DVD (n)'],
    E: ['each (det & pron)', 'ear (n)', 'earache (n)', 'early (adj & adv)', 'earn (v)', 'earring (n)', 'earth (n)', 'east (adj, adv & n)', 'eastern (adj)', 'easily (adv)', 'easy (adj)', 'easygoing (adj)', 'eat (v)', 'economics (n)', 'edge (n)', 'education (n)', 'effect (n)', 'efficient (adj)', 'effort (n)', 'egg (n)', 'either (adv, det & pron)', 'elbow (n)', 'elder (adj)', 'elderly (adj)', 'election (n)', 'electric (adj)', 'electrical (adj)', 'electricity (n)', 'electronic (adj)', 'elementary (adj)', 'elephant (n)', 'elevator (n)', 'else (adv)', 'email (n & v)', 'embarrassed (adj)', 'embarrassing (adj)', 'embassy (n)', 'emergency (n)', 'employ (v)', 'employee (n)', 'employer (n)', 'employment (n)', 'empty (adj)', 'encourage (v)', 'end (n & v)', 'ending (n)', 'enemy (n)', 'energy (n)', 'engaged (adj)', 'engine (n)', 'engineer (n)', 'engineering (n)', 'enjoy (v)', 'enormous (adj)', 'enough (adv, det & pron)', 'enquiry (n)', 'enter (v)', 'entertain (v)', 'entertainment (n)', 'entrance (n)', 'entry (n)', 'envelope (n)', 'environment (n)', 'environmental (adj)', 'equal (adj)', 'equipment (n)', 'eraser (n)', 'escape (v)', 'especially (adv)', 'essay (n)', 'essential (adj)', 'euro (n)', 'even (adv)', 'evening (n)', 'event (n)', 'ever (adv)', 'every (det)', 'everybody (pron)', 'everyone (pron)', 'everything (pron)', 'everywhere (adv)', 'exact (adj)', 'exactly (adv)', 'examination/exam (n)', 'examiner (n)', 'example (n)', 'excellent (adj)', 'except (prep, conj)', 'exchange (n & v)', 'excited (adj)', 'excitement (n)', 'exciting (adj)', 'excuse (n & v)', 'exercise (n & v)', 'exhausted (adj)', 'exhibition (n)', 'exist (v)', 'exit (n)', 'expect (v)', 'expedition (n)', 'expensive (adj)', 'experience (n & v)', 'experiment (n)', 'expert (n)', 'explain (v)', 'explanation (n)', 'explode (v)', 'explore (v)', 'explorer (n)', 'extra (adj, adv & n)', 'extraordinary (adj)', 'extremely (adv)', 'extreme sport (n)', 'eye (n)'],
    F: ['face (n)', 'face to face (adv)', 'facilities (n)', 'fact (n)', 'factory (n)', 'fail (v)', 'fair (adj & n)', 'fairly (adv)', 'fall (n & v)', 'false (adj)', 'familiar (adj)', 'family (n)', 'famous (adj)', 'fan (n)', 'fancy (v)', 'fantastic (adj)', 'far (adv)', 'fare (n)', 'farm (n)', 'farmer (n)', 'farming (n)', 'fashion (n)', 'fashionable (adj)', 'fast (adj & adv)', 'fasten (v)', 'fast food (n)', 'fat (adj)', 'father (n)', 'fault (n)', 'favour (n)', 'favourite (adj & n)', 'fax (v)', 'fear (n)', 'fee (n)', 'feed (v)', 'feel (v)', 'feeling (n)', 'female (adj & n)', 'ferry (n)', 'festival (n)', 'fetch (v)', 'fever (n)', 'few (adj & pron)', 'fiction (n)', 'field (n)', 'fight (n & v)', 'figure (n)', 'file (n)', 'fill (v)', 'film (n & v)', 'film maker (n)', 'film star (n)', 'final (adj & n)', 'finally (adv)', 'financial (adj)', 'find (v)', 'fine (adj & n)', 'finger (n)', 'finish (n & v)', 'fire (n)', 'firefighter (n)', 'firework (n)', 'firm (n)', 'first (adj & adv)', 'fish (n & v)', 'fishing (n)', 'fit (adj & v)', 'fitness (n)', 'fix (v)', 'flag (n)', 'flat (adj & n)', 'flavour (n)', 'flight (n)', 'float (v)', 'flood (n & v)', 'floor (n)', 'flour (n)', 'flow (v)', 'flower (n)', 'flu (n)', 'flute (n)', 'fly (n & v)', 'fog (n)', 'foggy (adj)', 'fold (v)', 'folk (adj & n)', 'follow (v)', 'fond (adj)', 'food (n)', 'fool (n)', 'foot (n)', 'football (n)', 'for (prep)', 'forbidden (adj)', 'forecast (n)', 'foreign (adj)', 'foreigner (n)', 'forest (n)', 'forever (adv)', 'forget (v)', 'forgive (v)', 'fork (n)', 'form (n)', 'former (adj)', 'fortnight (n)', 'fortunate (adj)', 'fortunately (adv)', 'forward (adv)', 'fountain (n)', 'frame (n)', 'free (adj & adv)', 'freeze (v)', 'freezer (n)', 'freezing (adj)', 'frequent (adj)', 'fresh (adj)', 'fridge (n)', 'fried (adj)', 'friend (n)', 'friendly (adj)', 'friendship (n)', 'frighten (v)', 'frightened (adj)', 'frightening (adj)', 'frog (n)', 'from (prep)', 'front (adj & n)', 'frozen (adj)', 'fruit (n)', 'fry (v)', 'fuel (n)', 'full (adj)', 'full-time (adj)', 'fully (adv)', 'fun (adj & n)', 'funny (adj)', 'fur (n)', 'furniture (n)', 'further (adv & adj)', 'future (adj & n)'],
    G: ['gain (n & v)', 'gallery (n)', 'game (n)', 'gap (n)', 'garage (n)', 'garden (n)', 'garlic (n)', 'gas (n)', 'gas station (n)', 'gate (n)', 'general (adj)', 'generally (adv)', 'generation (n)', 'generous (adj)', 'gentle (adj)', 'geography (n)', 'get (v)', 'giant (adj)', 'gift (n)', 'giraffe (n)', 'girl (n)', 'girlfriend (n)', 'give (v)', 'glad (adj)', 'glance (v)', 'glass (n)', 'glasses (n)', 'global warming (n)', 'glove (n)', 'go (v)', 'goal (n)', 'goalkeeper (n)', 'goat (n)', 'gold (adj & n)', 'golden (adj)', 'golf (n)', 'good (adj)', 'good-looking (adj)', 'gorgeous (adj)', 'government (n)', 'grab (v)', 'grade (n)', 'graduation (n)', 'gram (n)', 'grammar (n)', 'grandchild (n)', 'granddad (n)', 'granddaughter (n)', 'grandfather (n)', 'grandma (n)', 'grandmother (n)', 'grandpa (n)', 'grandparent (n)', 'grandson (n)', 'grant (n)', 'grape (n)', 'graphics (n)', 'grass (n)', 'grateful (adj)', 'great (adj)', 'green (adj & n)', 'greet (v)', 'greeting (n)', 'grey (adj & n)', 'grill (n & v)', 'grocery store (n)', 'groom (n)', 'ground (n)', 'group (n)', 'grow (v)', 'grow up (phr v)', 'guard (n)', 'guess (n & v)', 'guest (n)', 'guest-house (n)', 'guide (n & v)', 'guidebook (n)', 'guilty (adj)', 'guitar (n)', 'guitarist (n)', 'gum (n)', 'gun (n)', 'guy (n)', 'gym (n)', 'gymnastics (n)'],
    H: ['habit (n)', 'hair (n)', 'haircut (n)', 'hairdresser (n)', 'hairdryer (n)', 'half (adv, det & n)', 'half-price (adj)', 'hall (n)', 'hand (n & v)', 'handbag (n)', 'hand-held (adj)', 'handkerchief (n)', 'handle (v)', 'handsome (adj)', 'handwriting (n)', 'hang (v)', 'happen (v)', 'happy (adj)', 'happily (adv)', 'happiness (n)', 'harbour (n)', 'hard (adj & adv)', 'hardly (adv)', 'hardware (n)', 'hat (n)', 'hate (v)', 'have (av & v)', 'he (pron)', 'head (n)', 'headache (n)', 'headline (n)', 'headteacher (n)', 'health (n)', 'healthy (adj)', 'hear (v)', 'heart (n)', 'heat (n & v)', 'heating (n)', 'heater (n)', 'heavy (adj)', 'heel (n)', 'height (n)', 'helicopter (n)', 'hello (exclam)', 'helmet (n)', 'help (n & v)', 'her (det & pron)', 'herb (n)', 'here (adv)', 'hero (n)', 'heroine (n)', 'hers (pron)', 'herself (pron)', 'hide (v)', 'high (adj & adv)', 'hill (n)', 'him (pron)', 'himself (pron)', 'hip hop (n)', 'hire (v & n)', 'his (det & pron)', 'historic (adj)', 'historical (adj)', 'history (n)', 'hit (n & v)', 'hitchhike (v)', 'hobby (n)', 'hockey (n)', 'hold (v)', 'hole (n)', 'holiday (n)', 'home (adv & n)', 'homepage (n)', 'homework (n)', 'honest (adj)', 'honestly (adv)', 'honey (n)', 'honeymoon (n)', 'hope (n & v)', 'hopeful (adj)', 'hopefully (adv)', 'hopeless (adj)', 'horrible (adj)', 'horror (adj & n)', 'horse (n)', 'hospital (n)', 'hostel (n)', 'hot (adj)', 'hotel (n)', 'hour (n)', 'house (n)', 'housewife (n)', 'housework (n)', 'how (adv)', 'however (adv)', 'hug (n & v)', 'huge (adj)', 'human (adj & n)', 'humid (adj)', 'hunger (n)', 'hungry (adj)', 'hunt (v)', 'hurry (n & v)', 'hurt (adj & v)', 'husband (n)', 'hut (n)'],
    I: ['ice (n)', 'ice cream (n)', 'ice hockey (n)', 'ice skating (n)', 'icy (adj)', 'ID (n)', 'ID card (n)', 'idea (n)', 'identification (n)', 'if (conj)', 'ill (adj)', 'illness (n)', 'imagination (n)', 'imagine (v)', 'immediately (adv)', 'immigration (n)', 'importance (n)', 'important (adj)', 'impossible (adj)', 'improve (v)', 'improvement (n)', 'in (adv & prep)', 'in advance (prep phr)', 'inch (n)', 'include (v)', 'including (prep)', 'incorrect (adj)', 'increase (v)', 'incredible (adj)', 'indeed (adv)', 'independent (adj)', 'individual (adj & n)', 'indoor (adj)', 'indoors (adv)', 'industry (n)', 'inform (v)', 'information (n)', 'ingredient (n)', 'initial (n)', 'injure (v)', 'ink (n)', 'inquiry (n)', 'insect (n)', 'inside (adv & prep)', 'insist (v)', 'install (v)', 'instance (n)', 'instead (adv)', 'instructions (n)', 'instructor (n)', 'instrument (n)', 'intelligent (adj)', 'intend (v)', 'interest (n & v)', 'interested (adj)', 'interesting (adj)', 'intermediate (adj)', 'international (adj)', 'internet (n)', 'interrupt (v)', 'interval (n)', 'interview (n & v)', 'into (prep)', 'introduce (v)', 'introduction (n)', 'invent (v)', 'invention (n)', 'invitation (n)', 'invite (v)', 'involve (v)', 'iron (n & v)', 'ironing (n)', 'island (n)', 'issue (n)', 'IT (n)', 'item (n)', 'itself (pron)'],
    J: ['jacket (n)', 'jail (n)', 'jam (n)', 'jar (n)', 'jazz (n)', 'jealous (adj)', 'jeans (n)', 'jet (n)', 'jewellery (n)', 'job (n)', 'jog (v)', 'jogging (n)', 'join (v)', 'joke (n & v)', 'journalist (n)', 'journey (n)', 'judge (n & v)', 'jug (n)', 'juice (n)', 'jump (n & v)', 'jumper (n)', 'jungle (n)', 'just (adv)'],
    K: ['kangaroo (n)', 'keen (adj)', 'keep (v)', 'keeper (n)', 'kettle (n)', 'key (n)', 'keyboard (n)', 'kick (n & v)', 'kid (n)', 'kill (v)', 'kilogramme (n)', 'kilometre (n)', 'kind (adj & n)', 'king (n)', 'kiss (n & v)', 'kit (n)', 'kitchen (n)', 'kite (n)', 'kitten (n)', 'knife (n)', 'knit (v)', 'knock (v)', 'know (v)', 'knowledge (n)', 'knee (n)'],
    L: ['label (n)', 'laboratory (n)', 'lack (n & v)', 'ladder (n)', 'lady (n)', 'lake (n)', 'lamb (n)', 'lamp (n)', 'land (n & v)', 'landscape (n)', 'language (n)', 'laptop (n)', 'large (adj)', 'last (adj, adv & v)', 'late (adj & adv)', 'lately (adv)', 'later (adj & adv)', 'latest (adj)', 'laugh (n & v)', 'law (n)', 'lawyer (n)', 'lay (v)', 'lazy (adj)', 'lead (v)', 'leader (n)', 'leaf (n)', 'league (n)', 'learn (v)', 'least (adj & adv)', 'leather (n)', 'leave (v)', 'lecture (n)', 'left (n & adj)', 'leg (n)', 'leisure (n)', 'lemon (n)', 'lemonade (n)', 'lend (v)', 'length (n)', 'less (adv & det)', 'lesson (n)', 'let (v)', 'letter (n)', 'lettuce (n)', 'level (n)', 'library (n)', 'licence (n)', 'lie (n & v)', 'life (n)', 'lift (n & v)', 'light (adj, n & v)', 'lighter (n)', 'lightning (n)', 'like (prep & v)', 'likely (adj)', 'limit (n & v)', 'limited (adj)', 'line (n)', 'link (n & v)', 'lion (n)', 'lip (n)', 'liquid (n)', 'list (n & v)', 'listen (v)', 'literature (n)', 'litre (n)', 'litter (n)', 'little (adj & det)', 'live (v & adj)', 'lively (adj)', 'living room (n)', 'load (n & v)', 'loan (n)', 'local (adj)', 'locate (v)', 'location (n)', 'lock (n & v)', 'locker (n)', 'logo (n)', 'lonely (adj)', 'long (adj & adv)', 'look (n & v)', 'loose (adj)', 'lorry (n)', 'lose (v)', 'lost (adj)', 'lot (n)', 'lottery (n)', 'loud (adj)', 'love (n & v)', 'lovely (adj)', 'low (adj)', 'luck (n)', 'lucky (adj)', 'luggage (n)', 'lunch (n)', 'lunchtime (n)', 'luxury (n)'],
    M: ['machine (n)', 'mad (adj)', 'madam (n)', 'magazine (n)', 'magic (adj & n)', 'magnificent (adj)', 'mail (n & v)', 'main (adj)', 'main course (n)', 'make (v)', 'make-up (n)', 'male (adj & n)', 'man (n)', 'manage (v)', 'manager (n)', 'mango (n)', 'many (det & pron)', 'map (n)', 'mark (n & v)', 'market (n)', 'marriage (n)', 'married (adj)', 'marry (v)', 'marvellous (adj)', 'match (n & v)', 'mate (n)', 'material (n)', 'maths (n)', 'matter (n & v)', 'maximum (adj & n)', 'may (mv)', 'maybe (adv)', 'meal (n)', 'mean (v)', 'meaning (n)', 'meanwhile (adv)', 'meat (n)', 'mechanic (n)', 'medicine (n)', 'medium (adj)', 'meet (v)', 'meeting (n)', 'melon (n)', 'member (n)', 'membership (n)', 'memory (n)', 'mend (v)', 'mention (v)', 'menu (n)', 'mess (n)', 'message (n)', 'messy (adj)', 'metal (n)', 'method (n)', 'metre (n)', 'microwave (n)', 'midday (n)', 'middle (n & adj)', 'middle-aged (adj)', 'midnight (n)', 'might (mv)', 'mild (adj)', 'mile (n)', 'milk (n)', 'millimetre (n)', 'million (n)', 'mind (n & v)', 'mine (pron)', 'mineral water (n)', 'minimum (adj & n)', 'minus (prep)', 'minute (n)', 'mirror (n)', 'miserable (adj)', 'miss (v)', 'missing (adj)', 'mistake (n)', 'mix (v)', 'mobile phone (n)', 'model (n)', 'modern (adj)', 'moment (n)', 'money (n)', 'monkey (n)', 'month (n)', 'monument (n)', 'mood (n)', 'moon (n)', 'more (adv & det)', 'morning (n)', 'mosquito (n)', 'most (adv & det)', 'mother (n)', 'motorcycle (n)', 'motorbike (n)', 'motor-racing (n)', 'motorway (n)', 'mountain (n)', 'mouse (n)', 'moustache (n)', 'mouth (n)', 'move (v)', 'movie (n)', 'movie star (n)', 'movie theater (n)', 'MP3 player (n)', 'museum (n)', 'mushroom (n)', 'music (n)', 'musical (adj)', 'musician (n)', 'must (mv)', 'multiply (v)', 'my (det)', 'myself (pron)', 'mystery (n)'],
    N: ['name (n & v)', 'narrow (adj)', 'nasty (adj)', 'national (adj)', 'nationality (n)', 'natural (adj)', 'nature (n)', 'navy blue (adj)', 'near (adv, prep & adj)', 'nearby (adj & adv)', 'nearly (adv)', 'neat (adj)', 'necessary (adj)', 'neck (n)', 'necklace (n)', 'need (v & n)', 'negative (adj)', 'neighbour (n)', 'neighbourhood (n)', 'nephew (n)', 'nervous (adj)', 'net (n)', 'network (n)', 'never (adv)', 'new (adj)', 'news (n)', 'newspaper (n)', 'next (adj & adv)', 'nice (adj)', 'niece (n)', 'night (n)', 'nightclub (n)', 'nightlife (n)', 'nightmare (n)', 'no (adv & det)', 'nobody (pron)', 'noise (n)', 'noisy (adj)', 'none (pron)', 'noon (n)', 'no one (pron)', 'normal (adj)', 'normally (adv)', 'north (adj, adv & n)', 'northeast (adj & n)', 'northern (adj)', 'northwest (adj & n)', 'nose (n)', 'not (adv)', 'note (n & v)', 'notebook (n)', 'notepaper (n)', 'nothing (pron)', 'notice (n & v)', 'noticeboard (n)', 'novel (n)', 'now (adv)', 'nowadays (adv)', 'nowhere (adv)', 'number (n)', 'nurse (n)'],
    O: ['object (n)', 'obvious (adj)', 'obviously (adv)', 'occasion (n)', 'occupation (n)', 'ocean (n)', 'o\'clock (adv)', 'of (prep)', 'of course (adv)', 'off (adv & prep)', 'offer (n & v)', 'office (n)', 'officer (n)', 'often (adv)', 'oil (n)', 'OK (adj & exclam)', 'old (adj)', 'old-fashioned (adj)', 'olive (n)', 'omelette (n)', 'on (adv & prep)', 'once (adv)', 'one (det & pron)', 'onion (n)', 'online (adv & adj)', 'only (adj & adv)', 'open (adj & v)', 'opening hours (n)', 'opera (n)', 'operate (v)', 'operation (n)', 'opinion (n)', 'opportunity (n)', 'opposite (adj, prep & adv)', 'option (n)', 'or (conj)', 'orange (adj & n)', 'orchestra (n)', 'order (n & v)', 'ordinary (adj)', 'organisation (n)', 'organise (v)', 'original (adj)', 'other (adj & pron)', 'otherwise (adv)', 'ought (mv)', 'our (det)', 'ours (pron)', 'ourselves (pron)', 'out (adv)', 'outdoor (adj)', 'outdoors (adv)', 'out of (prep)', 'oven (n)', 'over (adv & prep)', 'overnight (adj & adv)', 'owe (v)', 'own (adj, pron & v)', 'owner (n)'],
    P: ['pack (v & n)', 'packet (n)', 'page (n)', 'pain (n)', 'painful (adj)', 'paint (n & v)', 'painter (n)', 'painting (n)', 'pair (n)', 'palace (n)', 'pale (adj)', 'pan (n)', 'pants (n)', 'paper (n)', 'paragraph (n)', 'parcel (n)', 'parent (n)', 'park (n & v)', 'parking (n)', 'parrot (n)', 'part (n)', 'partly (adv)', 'particular (adj)', 'partner (n)', 'part-time (adj)', 'party (n)', 'pass (v)', 'passenger (n)', 'passport (n)', 'password (n)', 'past (adj, n & prep)', 'pasta (n)', 'path (n)', 'patient (adj & n)', 'pattern (n)', 'pause (v)', 'pavement (n)', 'pay (n & v)', 'PC (n)', 'pea (n)', 'peace (n)', 'peaceful (adj)', 'peach (n)', 'peak (n)', 'peanut (n)', 'pear (n)', 'pedestrian (n)', 'peel (v)', 'pen (n)', 'pencil (n)', 'pencil case (n)', 'penguin (n)', 'penny (n)', 'people (n)', 'pepper (n)', 'per (prep)', 'percent (adv)', 'perfect (adj)', 'perform (v)', 'performance (n)', 'performer (n)', 'perfume (n)', 'perhaps (adv)', 'period (n)', 'permanent (adj)', 'permission (n)', 'permit (v)', 'person (n)', 'personal (adj)', 'personally (adv)', 'persuade (v)', 'pet (n)', 'petrol (n)', 'petrol station (n)', 'pharmacy (n)', 'phone (n & v)', 'photo (n)', 'photographer (n)', 'photography (n)', 'phrase (n)', 'physics (n)', 'piano (n)', 'pick (v)', 'picnic (n)', 'picture (n)', 'pie (n)', 'piece (n)', 'pig (n)', 'pile (n)', 'pill (n)', 'pillow (n)', 'pilot (n)', 'pin (n & v)', 'pineapple (n)', 'pink (adj & n)', 'pipe (n)', 'pirate (n)', 'pity (n)', 'pizza (n)', 'place (n & v)', 'plain (adj)', 'plan (n & v)', 'plane (n)', 'planet (n)', 'plant (n & v)', 'plastic (adj & n)', 'plate (n)', 'platform (n)', 'play (n & v)', 'player (n)', 'playground (n)', 'pleasant (adj)', 'please (exclam & v)', 'pleased (adj)', 'pleasure (n)', 'plenty (pron)', 'plug (n)', 'plus (prep & conj)', 'pocket (n)', 'poem (n)', 'poet (n)', 'poetry (n)', 'point (n & v)', 'police (n)', 'policeman (n)', 'police officer (n)', 'police station (n)', 'polite (adj)', 'political (adj)', 'politician (n)', 'politics (n)', 'pollution (n)', 'pool (n)', 'pop (n)', 'popular (adj)', 'population (n)', 'port (n)', 'position (n)', 'positive (adj)', 'possibility (n)', 'possible (adj)', 'possibly (adv)', 'post (n & v)', 'postcard (n)', 'poster (n)', 'postman (n)', 'post office (n)', 'postpone (v)', 'pot (n)', 'potato (n)', 'pound (n)', 'pour (v)', 'powder (n)', 'power (n)', 'powerful (adj)', 'practice (n)', 'practise (v)', 'pray (v)', 'prayer (n)', 'predict (v)', 'prefer (v)', 'pregnant (adj)', 'preparation (n)', 'prepare (v)', 'prepared (adj)', 'prescription (n)', 'present (adj, n & v)', 'presentation (n)', 'president (n)', 'press (v)', 'pretty (adj & adv)', 'prevent (v)', 'previous (adj)', 'price (n)', 'primary school (n)', 'prince (n)', 'princess (n)', 'print (v)', 'printer (n)', 'prison (n)', 'prisoner (n)', 'private (adj)', 'prize (n)', 'probably (adv)', 'problem (n)', 'produce (v)', 'product (n)', 'profession (n)', 'professional (adj & n)', 'professor (n)', 'program (n)', 'progress (n)', 'project (n)', 'promise (n & v)', 'promote (v)', 'pronounce (v)', 'pronunciation (n)', 'proper (adj)', 'property (n)', 'protect (v)', 'proud (adj)', 'prove (v)', 'provide (v)', 'public (adj & n)', 'public transport (n)', 'publish (v)', 'pull (v)', 'pullover (n)', 'pump (n)', 'punish (v)', 'pupil (n)', 'puppy (n)', 'pure (adj)', 'purple (adj & n)', 'purpose (n)', 'purse (n)', 'push (n & v)', 'put (v)', 'puzzle (n)', 'pyjamas (n)'],
    Q: ['qualification (n)', 'qualified (adj)', 'quality (n)', 'quantity (n)', 'quarter (n)', 'queen (n)', 'question (n & v)', 'questionnaire (n)', 'queue (n)', 'quick (adj)', 'quickly (adv)', 'quiet (adj)', 'quit (v)', 'quite (adv)', 'quiz (n)'],
    R: ['rabbit (n)', 'race (n & v)', 'racket (n)', 'radio (n)', 'rail (n)', 'railway (n)', 'rain (n & v)', 'raincoat (n)', 'rainforest (n)', 'raise (v)', 'range (n)', 'rap (n)', 'rare (adj)', 'rarely (adv)', 'rather (adv)', 'raw (adj)', 'reach (v)', 'read (v)', 'reader (n)', 'reading (n)', 'ready (adj)', 'real (adj)', 'realise (v)', 'realistic (adj)', 'really (adv)', 'reason (n)', 'reasonable (adj)', 'rebuild (v)', 'receipt (n)', 'receive (v)', 'recent (adj)', 'reception (n)', 'receptionist (n)', 'recipe (n)', 'recognise (v)', 'recommend (v)', 'record (n & v)', 'recording (n)', 'recover (v)', 'recycle (v)', 'recycled (adj)', 'recycling (n)', 'red (adj & n)', 'reduce (v)', 'refreshments (n)', 'refrigerator (n)', 'refund (n)', 'refuse (v)', 'regards (n)', 'region (n)', 'register (v)', 'registration (n)', 'regret (n & v)', 'regular (adj)', 'relation (n)', 'relationship (n)', 'relative (n)', 'relax (v)', 'relaxation (n)', 'relaxed (adj)', 'reliable (adj)', 'religion (n)', 'remain (v)', 'remember (v)', 'remind (v)', 'remote control (n)', 'remove (v)', 'rent (n & v)', 'repair (n & v)', 'repeat (v)', 'replace (v)', 'reply (n & v)', 'report (n & v)', 'reporter (n)', 'request (n & v)', 'require (v)', 'rescue (n & v)', 'research (n & v)', 'reservation (n)', 'reserve (n & v)', 'resort (n)', 'respect (n & v)', 'responsible (adj)', 'rest (n & v)', 'restaurant (n)', 'result (n)', 'retire (v)', 'return (n & v)', 'review (n)', 'revise (v)', 'revision (n)', 'reward (n)', 'rice (n)', 'rich (adj)', 'ride (n & v)', 'rider (n)', 'right (adj, adv & n)', 'ring (n & v)', 'rise (v)', 'river (n)', 'road (n)', 'roast (adj & v)', 'rob (v)', 'rock (n)', 'role (n)', 'roll (n)', 'romance (n)', 'romantic (adj)', 'roof (n)', 'room (n)', 'rose (n)', 'rough (adj)', 'round (adj, adv & prep)', 'roundabout (n)', 'route (n)', 'routine (n)', 'row (n)', 'rubber (n)', 'rubbish (n)', 'rude (adj)', 'rug (n)', 'rugby (n)', 'ruin (n & v)', 'rule (n & v)', 'ruler (n)', 'run (v)', 'runner (n)', 'running (n)'],
    S: ['sad (adj)', 'safe (adj)', 'safely (adv)', 'sail (n & v)', 'sailing (n)', 'salad (n)', 'salary (n)', 'sale (n)', 'salesman (n)', 'salmon (n)', 'salt (n)', 'same (adj, pron & adv)', 'sand (n)', 'sandal (n)', 'sandwich (n)', 'satisfactory (adj)', 'satisfied (adj)', 'sauce (n)', 'saucepan (n)', 'saucer (n)', 'sausage (n)', 'save (v)', 'say (v)', 'scared (adj)', 'scarf (n)', 'scary (adj)', 'scene (n)', 'scenery (n)', 'school (n)', 'schoolchild (n)', 'science (n)', 'science fiction (n)', 'scientific (adj)', 'scientist (n)', 'scissors (n)', 'scooter (n)', 'score (n & v)', 'scream (n & v)', 'screen (n)', 'sculpture (n)', 'sea (n)', 'search (n & v)', 'seaside (n)', 'season (n)', 'seat (n)', 'seat belt (n)', 'second (adj, det & n)', 'secondary (adj)', 'second-hand (adj)', 'secret (adj & n)', 'secretary (n)', 'section (n)', 'security (n)', 'see (v)', 'seem (v)', 'select (v)', 'selfish (adj)', 'self-service (adj)', 'sell (v)', 'send (v)', 'sense (n)', 'sensible (adj)', 'sentence (n)', 'separate (adj)', 'series (n)', 'serious (adj)', 'seriously (adv)', 'serve (v)', 'server (n)', 'service (n)', 'session (n)', 'set (n & v)', 'set off (phr v)', 'set up (phr v)', 'several (det & pron)', 'sew (v)', 'sex (n)', 'shade (n)', 'shadow (n)', 'shake (v)', 'shall (mv)', 'shame (n)', 'shampoo (n)', 'shape (n)', 'share (v)', 'shark (n)', 'sharp (adj)', 'shave (v)', 'she (pron)', 'sheep (n)', 'sheet (n)', 'shelf (n)', 'shine (v)', 'shiny (adj)', 'ship (n)', 'shirt (n)', 'shock (n)', 'shocked (adj)', 'shocking (adj)', 'shoe (n)', 'shoot (v)', 'shop (n & v)', 'shop assistant (n)', 'shopping (n)', 'shore (n)', 'short (adj)', 'shortly (adv)', 'shorts (n)', 'should (mv)', 'shoulder (n)', 'shout (n & v)', 'show (n & v)', 'shower (n)', 'shut (adj & v)', 'shy (adj)', 'sick (adj)', 'side (n)', 'sight (n)', 'sightseeing (n)', 'sign (n & v)', 'signal (n & v)', 'signature (n)', 'signpost (n)', 'silence (n)', 'silent (adj)', 'silk (adj & n)', 'silly (adj)', 'silver (adj & n)', 'similar (adj)', 'simple (adj)', 'since (conj & prep)', 'sincerely (adv)', 'sing (v)', 'singer (n)', 'singing (n)', 'single (n & adj)', 'sink (n & v)', 'sir (n)', 'sister (n)', 'sit (v)', 'sit down (phr v)', 'site (n)', 'sitting room (n)', 'situated (adj)', 'situation (n)', 'size (n)', 'skate (n & v)', 'skateboard (n & v)', 'skateboarding (n)', 'skating (n)', 'ski (n & v)', 'skiing (n)', 'skill (n)', 'skin (n)', 'skirt (n)', 'sky (n)', 'sleep (n & v)', 'sleeve (n)', 'slice (n)', 'slim (adj)', 'slip (v)', 'slow (adj)', 'slowly (adv)', 'small (adj)', 'smart (adj)', 'smell (n & v)', 'smile (n & v)', 'smoke (n & v)', 'smoking (n)', 'smooth (adj)', 'snack (n)', 'snake (n)', 'snow (n & v)', 'snowboard (n & v)', 'snowboarding (n)', 'so (adv & conj)', 'soap (n)', 'soap opera (n)', 'soccer (n)', 'sociable (adj)', 'social (adj)', 'society (n)', 'sock (n)', 'sofa (n)', 'soft (adj)', 'software (n)', 'soldier (n)', 'solution (n)', 'solve (v)', 'some (det & pron)', 'somebody (pron)', 'somehow (adv)', 'someone (pron)', 'something (pron)', 'sometimes (adv)', 'somewhere (adv)', 'son (n)', 'song (n)', 'soon (adv)', 'sore (adj)', 'sorry (adj)', 'sort (n)', 'soul (n)', 'sound (n & v)', 'soup (n)', 'sour (adj)', 'south (adj, adv & n)', 'southeast (adj & n)', 'southern (adj)', 'southwest (adj & n)', 'souvenir (n)', 'space (n)', 'spare (adj & v)', 'sparkling (adj)', 'speak (v)', 'speaker (n)', 'special (adj)', 'spectacular (adj)', 'speech (n)', 'speed (n)', 'spell (v)', 'spelling (n)', 'spend (v)', 'spice (n)', 'spicy (adj)', 'spill (v)', 'spinach (n)', 'spite (n)', 'spoil (v)', 'spoon (n)', 'sport (n)', 'sports centre (n)', 'spot (n)', 'spy (n)', 'square (adj & n)', 'squash (n)', 'stadium (n)', 'staff (n)', 'stage (n)', 'stairs (n)', 'stall (n)', 'stamp (n)', 'stand (v)', 'star (n)', 'start (n & v)', 'station (n)', 'statue (n)', 'stay (n & v)', 'steak (n)', 'steal (v)', 'steep (adj)', 'step (n)', 'stick (n & v)', 'sticky (adj)', 'still (adj & adv)', 'stir (v)', 'stomach (n)', 'stomach ache (n)', 'stone (n)', 'stop (n & v)', 'store (n)', 'storm (n)', 'story (n)', 'straight (adj & adv)', 'strange (adj)', 'stranger (n)', 'strawberry (n)', 'stream (n)', 'street (n)', 'stress (n)', 'stressed (adj)', 'stressful (adj)', 'strict (adj)', 'strike (n & v)', 'stripe (n)', 'strong (adj)', 'student (n)', 'studio (n)', 'studies (n)', 'study (n & v)', 'stuff (n)', 'stupid (adj)', 'style (n)', 'stylish (adj)', 'subject (n)', 'subtract (v)', 'subway (n)', 'succeed (v)', 'success (n)', 'successful (adj)', 'such (det)', 'sudden (adj)', 'suddenly (adv)', 'suffer (v)', 'sugar (n)', 'suggest (v)', 'suggestion (n)', 'suit (n & v)', 'suitable (adj)', 'suitcase (n)', 'sum (n)', 'sun (n)', 'sunbathe (v)', 'sunglasses (n)', 'sunny (adj)', 'sunrise (n)', 'sunset (n)', 'sunshine (n)', 'supermarket (n)', 'supper (n)', 'support (n & v)', 'supporter (n)', 'suppose (v)', 'sure (adj & adv)', 'surf (v)', 'surfboard (n)', 'surfing (n)', 'surname (n)', 'surprise (n & v)', 'surprised (adj)', 'surprising (adj)', 'surround (v)', 'sweater (n)', 'sweatshirt (n)', 'sweet (adj & n)', 'swim (n & v)', 'swimmer (n)', 'swimming (n)', 'swimming costume (n)', 'swimming pool (n)', 'swimsuit (n)', 'switch (n & v)', 'system (n)'],
    T: ['table (n)', 'table-cloth (n)', 'tablet (n)', 'table tennis (n)', 'take (v)', 'takeaway (n)', 'take care of (v)', 'take off (phr v)', 'take part (v)', 'take place (v)', 'take up (phr v)', 'talent (n)', 'talented (adj)', 'talk (n & v)', 'talk show (n)', 'tall (adj)', 'tap (n)', 'taste (n & v)', 'tasty (adj)', 'tax (n)', 'taxi (n)', 'tea (n)', 'teach (v)', 'teacher (n)', 'teaching (n)', 'team (n)', 'tear (n & v)', 'technique (n)', 'technology (n)', 'teenager (n)', 'telephone (n & v)', 'television (n)', 'tell (v)', 'temperature (n)', 'temporary (adj)', 'tennis (n)', 'tense (n)', 'tent (n)', 'term (n)', 'terrible (adj)', 'terribly (adv)', 'terrific (adj)', 'terrified (adj)', 'test (n & v)', 'text (n & v)', 'textbook (n)', 'text message (n)', 'than (conj & prep)', 'thank (v)', 'thanks (exclam)', 'that (conj, det & pron)', 'the (det)', 'theatre (n)', 'their (det)', 'theirs (pron)', 'them (pron)', 'themselves (pron)', 'then (adv)', 'there (adv)', 'therefore (adv)', 'these (det & pron)', 'they (pron)', 'thick (adj)', 'thief (n)', 'thin (adj)', 'thing (n)', 'think (v)', 'thirsty (adj)', 'this (det & pron)', 'those (det & pron)', 'though (conj)', 'thought (n)', 'thriller (n)', 'throat (n)', 'through (prep)', 'throw (v)', 'thumb (n)', 'thunder (n)', 'thunderstorm (n)', 'tick (n & v)', 'ticket (n)', 'tidy (adj & v)', 'tie (n & v)', 'tiger (n)', 'tight (adj)', 'tights (n)', 'till (conj & prep)', 'time (n & v)', 'timetable (n)', 'tin (n)', 'tiny (adj)', 'tip (n)', 'tired (adj)', 'tiring (adj)', 'tissue (n)', 'title (n)', 'to (prep)', 'toast (n)', 'today (adv & n)', 'toe (n)', 'together (adv)', 'toilet (n)', 'tomato (n)', 'tomorrow (adv & n)', 'tongue (n)', 'tonight (adv & n)', 'too (adv)', 'tooth (n)', 'toothache (n)', 'toothbrush (n)', 'toothpaste (n)', 'top (adj & n)', 'topic (n)', 'total (adj & n)', 'totally (adv)', 'touch (v)', 'tour (n & v)', 'tour guide (n)', 'tourism (n)', 'tourist (n)', 'tourist information centre (n)', 'tournament (n)', 'toward (prep)', 'towel (n)', 'tower (n)', 'town (n)', 'toy (n)', 'track (n)', 'tracksuit (n)', 'trade (n)', 'traditional (adj)', 'traffic (n)', 'traffic jam (n)', 'traffic light (n)', 'train (n & v)', 'trainer (n)', 'training (n)', 'tram (n)', 'transfer (v)', 'translate (v)', 'translation (n)', 'transport (n)', 'trash can (n)', 'travel (v)', 'travel agent (n)', 'tree (n)', 'trend (n)', 'trick (n)', 'trip (n)', 'trouble (n)', 'trousers (n)', 'truck (n)', 'trunk (n)', 'true (adj)', 'trumpet (n)', 'trust (v)', 'truth (n)', 'try (v)', 'T-shirt (n)', 'tube (n)', 'tuna (n)', 'tune (n)', 'tunnel (n)', 'turkey (n)', 'turn (n & v)', 'twice (adv)', 'twin (n)', 'type (n & v)', 'typical (adj)', 'typically (adv)', 'tyre (n)'],
    U: ['ugly (adj)', 'umbrella (n)', 'unable (adj)', 'unbelievable (adj)', 'uncle (n)', 'uncomfortable (adj)', 'under (prep)', 'underground (adj & n)', 'underline (v)', 'underneath (prep)', 'underpants (n)', 'understand (v)', 'underwear (n)', 'undress (v)', 'unemployed (adj)', 'unemployment (n)', 'unexpected (adj)', 'unfair (adj)', 'unfit (adj)', 'unforgettable (adj)', 'unfortunately (adv)', 'unfriendly (adj)', 'unhappy (adj)', 'unhealthy (adj)', 'uniform (n)', 'union (n)', 'unit (n)', 'unkind (adj)', 'unknown (adj)', 'unimportant (adj)', 'uninterested (adj)', 'uninteresting (adj)', 'universe (n)', 'university (n)', 'unless (conj)', 'unlikely (adj)', 'unlucky (adj)', 'unnecessary (adj)', 'unpack (v)', 'unpleasant (adj)', 'until (prep & conj)', 'unusual (adj)', 'unwell (adj)', 'up (adv & prep)', 'update (n & v)', 'upload (n & v)', 'upon (prep)', 'upper (adj)', 'upset (adj)', 'upstairs (adj & adv)', 'urgent (adj)', 'urgently (adv)', 'us (pron)', 'use (n & v)', 'useful (adj)', 'user (n)', 'usual (adj)', 'usually (adv)'],
    V: ['valley (n)', 'valuable (adj)', 'value (n)', 'van (n)', 'vanilla (n)', 'variety (n)', 'various (adj)', 'vase (n)', 'vegetable (n)', 'vegetarian (n & adj)', 'vehicle (n)', 'very (adv)', 'vet (n)', 'via (prep)', 'video (n & v)', 'video clip (n)', 'video game (n)', 'view (n)', 'village (n)', 'violin (n)', 'virus (n)', 'visa (n)', 'visit (n & v)', 'visitor (n)', 'vocabulary (n)', 'voice (n)', 'volleyball (n)', 'volume (n)', 'vote (n & v)', 'vowel (n)'],
    W: ['wage (n)', 'wait (n & v)', 'waiter (n)', 'waiting room (n)', 'waitress (n)', 'wake (v)', 'walk (n & v)', 'walking (n)', 'wall (n)', 'wallet (n)', 'want (v)', 'war (n)', 'wardrobe (n)', 'warm (adj)', 'warn (v)', 'warning (n)', 'wash (n & v)', 'washing machine (n)', 'waste (adj & v)', 'watch (n & v)', 'water (n & v)', 'waterfall (n)', 'wave (n & v)', 'way (n)', 'we (pron)', 'weak (adj)', 'wear (v)', 'weather (n)', 'weather forecast (n)', 'web (n)', 'webcam (n)', 'web page (n)', 'website (n)', 'wedding (n)', 'week (n)', 'weekday (n)', 'weekend (n)', 'weekly (adj & adv)', 'weigh (v)', 'weight (n)', 'welcome (n & v)', 'well (adj & adv)', 'well done (exclam)', 'well-dressed (adj)', 'well-known (adj)', 'west (adj, adv & n)', 'western (adj)', 'wet (adj)', 'whale (n)', 'what (det & pron)', 'whatever (pron & det)', 'wheel (n)', 'wheelchair (n)', 'when (adv)', 'whenever (conj)', 'where (adv & conj)', 'wherever (conj)', 'whether (conj)', 'which (pron & det)', 'while (conj)', 'white (adj)', 'who (pron)', 'whole (adj & n)', 'whose (det & pron)', 'why (adv)', 'wide (adj)', 'wife (n)', 'wild (adj)', 'wildlife (n)', 'will (mv)', 'willing (adj)', 'win (v)', 'wind (n)', 'window (n)', 'windscreen (n)', 'windsurfing (n)', 'windy (adj)', 'wing (n)', 'winner (n)', 'wise (adj)', 'wish (n & v)', 'with (prep)', 'within (prep)', 'without (prep)', 'woman (n)', 'wonder (v)', 'wonderful (adj)', 'wood (n)', 'wooden (adj)', 'wool (n)', 'word (n)', 'work (n & v)', 'worker (n)', 'working (adj)', 'workout (n)', 'world (n)', 'worried (adj)', 'worry (n & v)', 'worse (adj & adv)', 'worst (adj & adv)', 'worth (adj)', 'would (mv)', 'wow (exclam)', 'wrap (v)', 'write (v)', 'writer (n)', 'writing (n)', 'written (adj)', 'wrong (adj)'],
    X: ['X-ray (n & v)'],
    Y: ['yard (n)', 'yeah (exclam)', 'year (n)', 'yellow (adj)', 'yes (adv)', 'yesterday (adv)', 'yet (adv)', 'yoga (n)', 'yoghurt (n)', 'you (pron)', 'young (adj)', 'your (det)', 'yours (pron)', 'yourself (pron)', 'youth (n)'],
    Z: ['zebra (n)', 'zero (n)', 'zone (n)', 'zoo (n)']
  };

  const allWords = Object.values(sampleWords).flat();
  const currentWords = searchTerm.trim()
    ? allWords
    : (sampleWords[activeLetter] || []);

  const filteredWords = currentWords.filter(w => 
    w.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Red PDF Method Badge */}
            <div className="w-11 h-11 bg-rose-600/20 border border-rose-500/40 rounded-2xl flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[9px] font-black uppercase tracking-widest shrink-0">
                  PDF METHOD
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                  CAMBRIDGE ENGLISH
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white truncate tracking-tight mt-0.5">
                Cambridge English Vocabulary List (B1 Preliminary)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between gap-4 shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'reader'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Reader</span>
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'topics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Topic Lists & Appendix</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Resource Details</span>
            </button>
          </div>

          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search vocabulary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'reader' && (
            <div className="space-y-6">
              {/* PDF Document Header Notice */}
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <h3 className="text-sm font-bold text-white">Cambridge Vocabulary List (PDF Method)</h3>
                  </div>
                  <p className="text-xs text-rose-200/80">
                    Cambridge vocabulary list to help students improve their English vocabulary and prepare for Preliminary examinations.
                  </p>
                </div>
                <button
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PDF File</span>
                </button>
              </div>

              {/* A-Z Letter Selector Bar */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Select Alphabet Letter (A - Z):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {sampleAlphabet.map(letter => (
                    <button
                      key={letter}
                      onClick={() => {
                        setActiveLetter(letter);
                        setSearchTerm('');
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeLetter === letter && !searchTerm
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-500'
                          : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vocabulary Word Grid */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 font-extrabold text-xs flex items-center justify-center">
                      {activeLetter}
                    </span>
                    <span>Vocabulary Terms ({filteredWords.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">CEFR B1 Level</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {filteredWords.map((word, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 hover:border-rose-500/40 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-between"
                    >
                      <span>{word}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Appendix 2: Categorized Topic Lists
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Clothes & Accessories",
                    items: "backpack, belt, blouse, boot, bracelet, clothes, coat, collar, cotton, dress, earring, fashion, glasses, glove, jacket, jeans, jewelry, pocket, raincoat, scarf, shirt, shoe, shorts, silk, skirt, socks, suit, sweater, tie, tracksuit, umbrella, wallet, watch, wool"
                  },
                  {
                    title: "Communications & Technology",
                    items: "access, address, blog, blogger, calculator, camera, chat, click, computer, connect, connection, delete, digital, disc, dot, download, email, file, hardware, icon, information, install, internet, keyboard, laptop, message, mobile, online, password, PC, phone, print, printer, screen, software, website"
                  },
                  {
                    title: "Education & Learning",
                    items: "absent, advanced, beginner, biology, certificate, chemistry, class, classroom, college, degree, dictionary, diploma, essay, exam, geography, history, homework, laboratory, language, lesson, math, music, physics, practice, project, pupil, qualification, science, student, subject, teacher, university"
                  },
                  {
                    title: "Entertainment & Media",
                    items: "action, actor, actress, adventure, advertisement, art, article, audience, band, book, camera, cartoon, cinema, circus, comedy, concert, dance, director, drama, exhibition, festival, film, guitar, instrument, magazine, music, news, newspaper, painting, photo, radio, song, theater, TV"
                  },
                  {
                    title: "Food & Drink",
                    items: "apple, bake, banana, bean, biscuit, boiled, bread, breakfast, butter, cake, cheese, chicken, chocolate, coffee, cook, delicious, dessert, dinner, drink, egg, fish, food, fruit, garlic, glass, juice, kitchen, lemon, lunch, meat, milk, oil, pasta, pizza, rice, salad, soup, sugar, tea, vegetable, water"
                  },
                  {
                    title: "Health, Medicine & Exercise",
                    items: "accident, ache, ambulance, appointment, body, bone, doctor, exercise, fit, fitness, gym, headache, health, hospital, illness, injure, medicine, nurse, operation, pain, patient, pharmacy, prescription, sick, skin, stomach, stress, temperature, tired, tooth, walk"
                  }
                ].map((topic, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>{topic.title}</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {topic.items}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-slate-300 text-xs leading-relaxed">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black text-lg">
                  PDF
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cambridge English Language Assessment</h3>
                  <p className="text-xs text-rose-400 font-semibold">Preliminary Vocabulary List Document</p>
                </div>
              </div>

              <p>
                The Preliminary and Preliminary for Schools Vocabulary List was developed by Cambridge English in consultation with external educational consultants to guide students and teachers.
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">Document Highlights:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>CEFR B1 Level standard vocabulary.</li>
                  <li>Over 50+ pages of organized wordlists and topic sets.</li>
                  <li>Includes receptive and productive vocabulary.</li>
                  <li>Updated continuously by Cambridge Learner Corpus.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleDownloadPdf}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SVT Educational PDF Resource • Cambridge English Preliminary</span>
          </span>
          <button
            onClick={handleDownloadPdf}
            className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
          >
            Download PDF Document
          </button>
        </div>

      </div>
    </div>
  );
}
