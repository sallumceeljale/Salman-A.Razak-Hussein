import { CsTrack } from '../types/csLearning';

export const CS_LEARNING_TRACKS: CsTrack[] = [
  {
    id: 'computer-fundamentals',
    title: 'Computer Fundamentals',
    subtitle: 'Hardware, Operating Systems, Binary Logic & Networking',
    iconName: 'Cpu',
    overview: 'Demystify how modern computers and networks actually work under the hood. Learn how raw silicon translates electrical charges into binary logic, how operating systems coordinate hardware, and how data packets travel across the global internet.',
    prerequisites: [
      'No prior programming knowledge required',
      'Basic comfort with using a keyboard, mouse, and web browser',
      'Curiosity to understand how technology works behind the screen'
    ],
    learningObjectives: [
      'Explain the core roles of the CPU, RAM (memory), and persistent storage in executing programs',
      'Understand binary representation (bits and bytes) for text, numbers, and digital media',
      'Navigate file systems and execute basic command-line commands in a terminal',
      'Describe client-server network architecture, IP addressing, DNS resolution, and HTTP requests'
    ],
    estimatedTime: '1–2 weeks (3–4 hrs/week)',
    lessons: [
      {
        id: 'cf-1',
        number: 1,
        title: 'Hardware & Architecture: CPU, RAM, and Storage',
        estimatedMinutes: 20,
        summary: 'A computer is a machine that follows instructions. The Central Processing Unit (CPU) executes calculations through a continuous "fetch-decode-execute" cycle. To run fast, the CPU fetches active instructions and temporary data from Random Access Memory (RAM), which is extremely fast but volatile (erased when powered off). Long-term files, applications, and saved documents live in non-volatile storage (Solid State Drives or Hard Drives), where data persists permanently.',
        keyPoints: [
          'CPU (Processor): The brain that executes binary machine code instructions billions of times per second',
          'RAM (Primary Memory): Ultra-fast, temporary working memory used while applications are actively open',
          'Storage (SSD/HDD): Permanent file storage with higher capacity but slower access speeds than RAM',
          'Motherboard & Buses: The physical circuit board and data highways connecting all components together'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'The Classic Compute Cycle Flow',
          code: '1. User opens App   -> 2. OS loads binary from Storage into RAM\n3. CPU fetches code -> 4. CPU computes & updates RAM -> 5. OS writes changes to Storage'
        },
        conceptCheck: {
          question: 'If you are typing an unsaved document and your computer suddenly loses power, where was that unsaved text stored?',
          options: [
            'In permanent SSD storage',
            'In volatile RAM (working memory)',
            'In the computer BIOS firmware',
            'Inside the monitor display buffer'
          ],
          correctIndex: 1,
          explanation: 'Unsaved data resides in RAM (working memory). Because RAM is volatile, losing power clears its contents unless the software actively writes the data to persistent storage (SSD/HDD).'
        }
      },
      {
        id: 'cf-2',
        number: 2,
        title: 'Binary Representation: How Data is Encoded in Bits & Bytes',
        estimatedMinutes: 25,
        summary: 'At the physical transistor level, digital circuits only understand two states: high voltage (1) or low voltage (0). This base-2 system is called binary. A single 0 or 1 is a bit. Eight bits group together to form a byte (0 to 255). By standardizing encoding schemes (like ASCII and UTF-8 for text, RGB numbers for pixels, and IEEE floats for decimals), computers represent words, vibrant photos, sound waves, and 3D worlds entirely with ones and zeros.',
        keyPoints: [
          'Bit (Binary Digit): The fundamental unit of digital information (0 or 1)',
          'Byte: A grouping of 8 bits, capable of representing 256 unique values (2^8 = 256)',
          'ASCII & Unicode (UTF-8): Standardized mapping tables assigning unique numbers to characters and international alphabets',
          'Resolution & Color: Digital images are grids of pixels where each pixel color is defined by red, green, and blue byte values'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Binary to Decimal Calculation Example (Byte: 01000001)',
          code: 'Bit Place:   128  64  32  16   8   4   2   1\nBinary:        0   1   0   0   0   0   0   1\nCalculation: (64 * 1) + (1 * 1) = 65\nASCII Character for 65 = Letter "A"'
        },
        conceptCheck: {
          question: 'How many distinct character combinations can be represented by a single 8-bit byte?',
          options: [
            '8 combinations',
            '64 combinations',
            '256 combinations',
            '1,024 combinations'
          ],
          correctIndex: 2,
          explanation: 'Since each bit has 2 possible states (0 or 1), 8 bits provide 2^8 = 256 possible unique patterns (values from 0 to 255).'
        }
      },
      {
        id: 'cf-3',
        number: 3,
        title: 'Operating Systems & File Systems (Command Line Basics)',
        estimatedMinutes: 30,
        summary: 'An Operating System (Windows, macOS, Linux) manages hardware resources, isolates running programs, and provides a structured file system. While graphical desktops (GUI) let users click folders, the command-line interface (CLI / Terminal) allows direct, precise, and scriptable control over the system. Learning 5–6 fundamental terminal commands builds a massive advantage for any aspiring developer.',
        keyPoints: [
          'OS Kernel: The core software layer managing memory allocation, CPU scheduling, and security permissions',
          'File System Hierarchy: A tree-like organization of directories (folders) starting from root (/) or drive letters (C:\\)',
          'Absolute vs. Relative Paths: Absolute paths start from the drive root; relative paths start from your current working directory',
          'Command Line Utilities: Fast terminal commands like pwd (print working directory), ls/dir (list files), and cd (change directory)'
        ],
        codeExample: {
          language: 'bash',
          caption: 'Essential Terminal Commands for Navigating File Systems',
          code: '# Show where you currently are in the directory tree\npwd\n\n# List all files and sub-folders in the current folder\nls -la\n\n# Create a new directory for your study project\nmkdir student_planner\n\n# Move into that directory\ncd student_planner'
        },
        conceptCheck: {
          question: 'In command-line file navigation, what does the shorthand "cd .." do?',
          options: [
            'Deletes the current folder',
            'Moves up one level to the parent directory',
            'Creates a duplicate folder',
            'Clears the terminal screen'
          ],
          correctIndex: 1,
          explanation: 'In Unix and Windows file systems, ".." represents the parent directory. Running "cd .." moves your working directory one level higher in the folder tree.'
        }
      },
      {
        id: 'cf-4',
        number: 4,
        title: 'How the Internet Works: Packets, DNS, and Client-Server Model',
        estimatedMinutes: 25,
        summary: 'The internet is a global network of interconnected computers communicating via standardized protocols (TCP/IP). When you visit a website, your browser (the client) asks a Domain Name System (DNS) server to translate the human-readable domain name into an IP address. Your computer then sends an HTTP/HTTPS request, which gets broken down into small data packets, routed across fiber-optic cables and routers, and reassembled by the destination server.',
        keyPoints: [
          'Client-Server Architecture: Clients (browsers/apps) request resources; servers store data and respond to requests',
          'IP Address & DNS: IP is the numerical postal address of a computer; DNS acts as the phonebook translating names into IPs',
          'Packets: Large files and messages are sliced into small numbered packets that travel independently across network routes',
          'HTTP vs. HTTPS: HyperText Transfer Protocol; HTTPS includes TLS/SSL encryption to prevent eavesdropping and tampering'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Web Request Sequence',
          code: '1. You type: https://scholarsvolunteering.org\n2. DNS Query: "What is IP of scholarsvolunteering.org?" -> DNS answers: "198.51.100.42"\n3. Browser sends: GET / HTTP/1.1 to 198.51.100.42:443\n4. Server responds: HTTP/1.1 200 OK with HTML, CSS & JavaScript files'
        },
        conceptCheck: {
          question: 'What is the primary function of the Domain Name System (DNS)?',
          options: [
            'Encrypting passwords stored on web servers',
            'Translating human-readable names (like example.com) into numerical IP addresses',
            'Compiling Python code into machine language',
            'Physically boosting Wi-Fi signal range'
          ],
          correctIndex: 1,
          explanation: 'DNS acts as the internet directory, translating human-friendly domain names (e.g., example.com) into machine-routable IP addresses (e.g., 93.184.216.34).'
        }
      }
    ],
    practicalActivity: {
      title: 'Command-Line & Directory Navigation Drill',
      estimatedMinutes: 20,
      objective: 'Practice navigating directory structures, creating project folders, and inspecting file properties using either your local terminal or an online terminal emulator.',
      materialsNeeded: 'Your computer terminal (macOS Terminal, Linux Bash, or Windows PowerShell) OR a free browser-based terminal sandbox.',
      stepByStepGuide: [
        'Step 1: Open your terminal application and type `pwd` (or `Get-Location` on PowerShell) to see your current directory path.',
        'Step 2: Create a dedicated learning folder by typing `mkdir svt_learning_lab` and press Enter.',
        'Step 3: Move inside your new directory using `cd svt_learning_lab`.',
        'Step 4: Create two subfolders: `mkdir notes` and `mkdir exercises`.',
        'Step 5: Verify the folder structure by typing `ls` (or `dir` on Windows) to confirm both directories exist.',
        'Step 6: Move back up to the parent directory by typing `cd ..`.'
      ],
      expectedOutput: 'A clean directory named `svt_learning_lab` containing two subdirectories (`notes` and `exercises`), verified through command-line output.',
      proTip: 'Use the Tab key for auto-completion. When typing folder names, pressing Tab after 2–3 letters will auto-fill the full name without typos.'
    },
    project: {
      id: 'proj-resource-dir',
      title: 'Simple Resource Directory & Specs Mapper',
      type: 'Structured Organization Project',
      tagline: 'Design and document a clean digital directory hierarchy and system specs reference.',
      description: 'Create a well-documented directory structure and a clear Markdown/text reference guide that maps out system hardware specifications (CPU, RAM, storage), common command-line cheat-sheets, and categorized study resources.',
      keyFeatures: [
        'Organized file and folder taxonomy for study materials',
        'System architecture cheat-sheet documenting CPU type, RAM capacity, and drive storage',
        'Clean, human-readable README guide with folder conventions',
        'Interactive preview tool to explore curated student resources'
      ],
      starterSteps: [
        'Draft a tree diagram of how you want to organize your programming notes, test prep worksheets, and project files.',
        'Check your own computer specifications (Operating System, CPU model, RAM size, Storage space) and write them down.',
        'Document 8 essential command-line navigation shortcuts in a clean text file.',
        'Test your folder creation script by running it in a sandbox or local folder.'
      ],
      deliverableCriteria: [
        'Directory tree diagram with at least 3 logical tiers',
        'Accurate summary of computer hardware roles',
        'Tested terminal navigation command log'
      ],
      interactiveDemoId: 'resource-dir'
    },
    completionChecklist: [
      {
        id: 'cf-chk-1',
        title: 'Hardware Components Identified',
        description: 'I can explain the difference between volatile RAM and persistent storage to a friend.'
      },
      {
        id: 'cf-chk-2',
        title: 'Binary Representation Understood',
        description: 'I understand that 8 bits make 1 byte and how numbers/letters are encoded.'
      },
      {
        id: 'cf-chk-3',
        title: 'Terminal Navigation Practiced',
        description: 'I created and navigated folders using command-line commands without a mouse.'
      },
      {
        id: 'cf-chk-4',
        title: 'Networking Basics Clear',
        description: 'I can describe how a browser uses DNS to find an IP address and fetch a website via HTTP/HTTPS.'
      }
    ],
    verifiedResources: [
      {
        title: 'CS50: Understanding Technology',
        provider: 'Harvard University OpenCourseWare',
        url: 'https://cs50.harvard.edu/technology/',
        format: 'Free Open Video & Lecture Series',
        isFree: true,
        svtSummary: 'A fantastic, non-technical introduction to hardware, the internet, multimedia, security, and web development taught by Prof. David J. Malan. SVT recommends watching Lectures 1 and 2 for an intuitive visual explanation of bits and hardware.'
      },
      {
        title: 'CrashCourse Computer Science',
        provider: 'PBS Digital Studios & Carrie Anne Philbin',
        url: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo',
        format: 'Free Video Curriculum',
        isFree: true,
        svtSummary: 'An engaging 40-episode animated journey through the history of computing, from early transistors to modern AI. Episodes 1 through 7 provide the clearest visual demonstration of CPU logic gates and memory registers available online.'
      },
      {
        title: 'How Does the Internet Work?',
        provider: 'MDN Web Docs (Mozilla)',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work',
        format: 'Free Documentation & Illustrated Guide',
        isFree: true,
        svtSummary: 'Mozilla’s official, beginner-level explanation of cables, routers, modems, ISPs, and IP addressing. Clear, jargon-free diagrams that clarify what happens behind the browser search bar.'
      }
    ],
    nextStep: {
      title: 'Move to Programming & Problem Solving',
      recommendation: 'Now that you understand how computers execute instructions and manage memory, you are ready to learn how to write algorithmic steps and logic patterns.',
      suggestedTrackId: 'programming-problem-solving'
    }
  },
  {
    id: 'programming-problem-solving',
    title: 'Programming & Problem Solving',
    subtitle: 'Computational Thinking, Algorithmic Logic & Control Flow',
    iconName: 'Workflow',
    overview: 'Learn how software engineers analyze complex challenges, break problems into deterministic steps, and design robust algorithms. Master variables, branching logic (if/else), repetition (loops), and variable tracing before memorizing language-specific quirks.',
    prerequisites: [
      'Basic arithmetic (addition, subtraction, multiplication, division)',
      'Familiarity with Computer Fundamentals concepts (how programs execute in memory)'
    ],
    learningObjectives: [
      'Deconstruct ambiguous real-world problems into small, testable computational sub-problems',
      'Understand how variables store state and how data types (strings, integers, booleans) differ',
      'Construct conditional decision trees using Boolean operators (AND, OR, NOT)',
      'Trace loop execution on paper to identify edge cases, off-by-one errors, and infinite loops'
    ],
    estimatedTime: '2 weeks (3–5 hrs/week)',
    lessons: [
      {
        id: 'pps-1',
        number: 1,
        title: 'Computational Thinking: Decomposition & Pattern Recognition',
        estimatedMinutes: 20,
        summary: 'Programming is not typing code into an editor—it is the structured art of problem solving. Computational thinking relies on four pillars: Decomposition (breaking a big problem into tiny steps), Pattern Recognition (spotting similarities with previously solved problems), Abstraction (focusing only on essential details while filtering out noise), and Algorithm Design (creating step-by-step instructions).',
        keyPoints: [
          'Decomposition: If calculating volunteer hours seems difficult, break it into: (1) read input, (2) validate numbers, (3) sum totals, (4) format display',
          'Pattern Recognition: Recognize that searching a list or tallying items uses the exact same loop patterns across different applications',
          'Abstraction: A map abstracts away building heights and tree counts to focus solely on roads and directions',
          'Pseudocode: Writing plain-language logic drafts before committing to specific programming syntax'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Pseudocode Example: Checking Volunteer Badge Eligibility',
          code: 'PROMPT user for total_volunteer_hours\nIF total_volunteer_hours >= 50 THEN\n    AWARD "Community Champion Badge"\nELSE IF total_volunteer_hours >= 20 THEN\n    AWARD "Dedicated Volunteer Badge"\nELSE\n    AWARD "Active Contributor Badge"\nDISPLAY awarded badge to student'
        },
        conceptCheck: {
          question: 'What is the primary benefit of writing pseudocode before writing actual programming code?',
          options: [
            'It makes your computer run twice as fast',
            'It lets you focus on pure logic and edge cases without worrying about syntax errors',
            'It automatically creates a mobile app',
            'It replaces the need for software testing'
          ],
          correctIndex: 1,
          explanation: 'Pseudocode isolates problem logic from language-specific syntax rules, helping you spot algorithmic flaws and edge cases early in the design process.'
        }
      },
      {
        id: 'pps-2',
        number: 2,
        title: 'Variables, Data Types, and Program State',
        estimatedMinutes: 25,
        summary: 'Variables are labeled storage boxes in computer memory that hold data. Each variable has a name, a current value, and a data type. The most common primitive data types are: Integers (whole numbers), Floats (decimals), Strings (text enclosed in quotes), and Booleans (True or False). Understanding data types prevents unexpected bugs, such as adding the string "5" to "5" to get "55" instead of the number 10.',
        keyPoints: [
          'Variable Assignment: Storing a value in a named memory container (e.g., student_count = 24)',
          'Integers vs. Floats: Integers are whole numbers (e.g., 42); Floats handle decimal precision (e.g., 3.1415)',
          'Strings: Text sequences enclosed in single or double quotation marks (e.g., "Salma")',
          'Booleans: Logical flags with exactly two possible states: True or False'
        ],
        codeExample: {
          language: 'python',
          caption: 'Variable Types and Type Conversion',
          code: 'student_name = "Amina"      # String (str)\ncompleted_hours = 18        # Integer (int)\nhourly_rate = 1.5           # Float\nis_verified = True          # Boolean (bool)\n\n# Converting string to integer for calculation\ninput_str = "10"\ntotal = completed_hours + int(input_str) # Result: 28'
        },
        conceptCheck: {
          question: 'If variable x = "8" (a string) and variable y = "2" (a string), what does x + y produce in most programming languages?',
          options: [
            '10 (Integer)',
            '"82" (Concatenated string)',
            'Error: Cannot add numbers',
            '16 (Multiplication)'
          ],
          correctIndex: 1,
          explanation: 'When the + operator is applied to two strings, it performs string concatenation (joining them end-to-end), resulting in the string "82".'
        }
      },
      {
        id: 'pps-3',
        number: 3,
        title: 'Control Flow: Decisions (If / Else) & Repetition (Loops)',
        estimatedMinutes: 30,
        summary: 'Programs do not merely run top-to-bottom; they make decisions and repeat tasks. Branching (if, else if, else) executes specific code blocks only when a Boolean condition evaluates to True. Loops (for loops for known iteration counts, while loops for condition-based repetition) automate repetitive work, enabling a computer to process thousands of records in milliseconds.',
        keyPoints: [
          'Comparison Operators: == (equals), != (not equal), > (greater than), < (less than), >=, <=',
          'Logical Operators: and (both conditions true), or (at least one true), not (inverts truth value)',
          'For Loops: Iterating over a sequence of numbers, list of names, or set number of repetitions',
          'While Loops: Continuing execution as long as a condition remains True (must ensure an exit condition to avoid infinite loops)'
        ],
        codeExample: {
          language: 'python',
          caption: 'Branching and Loop Combination',
          code: 'study_sessions = [45, 60, 30, 90, 20] # minutes per session\ntotal_minutes = 0\n\nfor minutes in study_sessions:\n    if minutes >= 60:\n        print(f"Deep work session: {minutes} mins")\n    total_minutes = total_minutes + minutes\n\nprint(f"Total Study Time: {total_minutes} mins")'
        },
        conceptCheck: {
          question: 'What is an "infinite loop" and how can a developer prevent it in a while loop?',
          options: [
            'A loop that runs infinitely fast; prevented by cooling the CPU',
            'A loop whose exit condition is never reached; prevented by ensuring the loop variable updates towards termination',
            'A loop with more than 10 lines of code; prevented by using functions',
            'A loop that connects to the internet indefinitely'
          ],
          correctIndex: 1,
          explanation: 'An infinite loop occurs when the while condition always remains True. Developers prevent it by updating the condition variable inside the loop body so it eventually triggers termination.'
        }
      },
      {
        id: 'pps-4',
        number: 4,
        title: 'Algorithms & Tracing: Dry-Running Logic on Paper',
        estimatedMinutes: 25,
        summary: 'Before blaming the computer or language, master the technique of "dry running" or code tracing. By creating a trace table with columns for line numbers, variables, and outputs, you can step through code line by line just as a CPU would. This reveals exactly where your logic diverged from your intention and makes debugging straightforward.',
        keyPoints: [
          'Trace Table: A manual audit ledger recording variable values after each executed line',
          'Off-By-One Errors: Classic bugs where a loop executes one time too many or one time too few (e.g. index 0 vs 1)',
          'Edge Cases: Unusual inputs such as empty lists, zero, negative numbers, or extremely long strings',
          'Rubber Duck Debugging: Explaining your code line-by-line out loud to a rubber duck or peer to spot logic blind spots'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Trace Table for Finding Maximum Number in [3, 9, 2]',
          code: 'Step | Line | current_item | max_so_far | Condition (item > max)\n1    | Init | -            | 3          | -\n2    | Iter | 9            | 9          | 9 > 3 is TRUE -> max updated to 9\n3    | Iter | 2            | 9          | 2 > 9 is FALSE -> max stays 9\nFinal Result: 9'
        },
        conceptCheck: {
          question: 'Why is testing a function with "edge cases" (like an empty list or 0) critical in software development?',
          options: [
            'To make the code file size smaller',
            'Because algorithms frequently fail at boundary limits where assumptions break',
            'Because computers cannot process non-zero numbers',
            'To bypass compiler security checks'
          ],
          correctIndex: 1,
          explanation: 'Boundary and edge conditions (zero, empty data, extremes) often violate hidden assumptions in the programmer’s logic, causing crashes if not handled defensively.'
        }
      }
    ],
    practicalActivity: {
      title: 'Pseudocode Recipe & Step-by-Step Logic Trace',
      estimatedMinutes: 25,
      objective: 'Practice writing deterministic pseudocode for an everyday student process (such as GPA grade tiering or study schedule validation) and dry-run it with a trace table.',
      materialsNeeded: 'A notebook/paper and pencil OR a blank text document.',
      stepByStepGuide: [
        'Step 1: Choose a goal: "Calculate average quiz score from a list of 4 student scores and determine if the average passes (>= 75%)."',
        'Step 2: Write clear pseudocode specifying variables: `total_score = 0`, `score_count = 0`.',
        'Step 3: Write a loop that iterates through each score and adds to `total_score`.',
        'Step 4: Compute `average = total_score / score_count`.',
        'Step 5: Write an IF/ELSE condition: IF `average >= 75` DISPLAY "Passed" ELSE DISPLAY "Needs Review".',
        'Step 6: Draw a trace table with test scores `[80, 70, 90, 60]` and trace each step to verify the calculated average is 75.0% and output is "Passed".'
      ],
      expectedOutput: 'A verified 10-line pseudocode algorithm paired with a 5-row trace table proving correct step-by-step execution.',
      proTip: 'Always check what happens if the list of scores is empty (`score_count == 0`) to prevent dividing by zero.'
    },
    project: {
      id: 'proj-quiz-app',
      title: 'Interactive Academic Quiz Application',
      type: 'Logic & State Management Project',
      tagline: 'Design and build a multi-question quiz application with branching feedback and scoring.',
      description: 'Create an interactive quiz engine that presents questions, collects answers, validates user selections against correct answers, calculates a final percentage score, and gives tailored study advice based on performance.',
      keyFeatures: [
        'Structured list/array of question objects with options and correct answer indices',
        'Score accumulator and progress counter tracking active question index',
        'Immediate feedback explaining why an answer is correct or incorrect',
        'End-of-quiz score summary with performance tiering (e.g. Mastered vs Review Needed)'
      ],
      starterSteps: [
        'Design a data structure holding 4 questions, each with a question text, 4 choices, and a correct answer index.',
        'Write the logic flow for presenting question 1 and capturing user selection.',
        'Write the condition comparing user choice to the correct answer and incrementing score.',
        'Implement the loop/state transition to move to subsequent questions until all are completed.'
      ],
      deliverableCriteria: [
        'Working question progression logic',
        'Accurate score tally calculation',
        'Actionable end-of-quiz recommendations'
      ],
      interactiveDemoId: 'quiz'
    },
    completionChecklist: [
      {
        id: 'pps-chk-1',
        title: 'Problem Decomposition Mastered',
        description: 'I can break down a complex assignment into 4–5 small, logical computational steps.'
      },
      {
        id: 'pps-chk-2',
        title: 'Data Types & Variables Clear',
        description: 'I understand the difference between Strings, Integers, Floats, and Booleans.'
      },
      {
        id: 'pps-chk-3',
        title: 'Conditionals & Loops Practiced',
        description: 'I can write if/else branches and for/while loops without creating infinite loops.'
      },
      {
        id: 'pps-chk-4',
        title: 'Code Tracing Verified',
        description: 'I can step through an algorithm with a trace table on paper to verify its output.'
      }
    ],
    verifiedResources: [
      {
        title: 'CS50x: Introduction to Computer Science',
        provider: 'Harvard University (edX / OpenCourseWare)',
        url: 'https://cs50.harvard.edu/x/',
        format: 'Free Comprehensive University Course',
        isFree: true,
        svtSummary: 'Widely regarded as the gold standard introductory computer science course. Week 0 (Scratch) and Week 1 (C / Algorithm Logic) build foundational algorithmic thinking and problem decomposition better than any other open resource.'
      },
      {
        title: 'Introduction to Algorithms & Logic',
        provider: 'Khan Academy Computing',
        url: 'https://www.khanacademy.org/computing/computer-science/algorithms',
        format: 'Free Interactive Tutorials & Exercises',
        isFree: true,
        svtSummary: 'Visual, step-by-step breakdowns of sorting, searching, and algorithmic asymptotic complexity created in partnership with Dartmouth professors. Ideal for practicing variable tracing.'
      },
      {
        title: 'Basic Algorithm Scripting & Problem Solving',
        provider: 'freeCodeCamp.org',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        format: 'Free In-Browser Interactive Practice',
        isFree: true,
        svtSummary: 'Hands-on coding challenges that build confidence in converting written problem prompts into executable logic and debugging unexpected test cases.'
      }
    ],
    nextStep: {
      title: 'Step into Python Foundations',
      recommendation: 'Translate your algorithmic thinking into Python—the most readable, expressive, and versatile programming language in education, data science, and AI.',
      suggestedTrackId: 'python-foundations'
    }
  },
  {
    id: 'python-foundations',
    title: 'Python Foundations',
    subtitle: 'Syntax, Functions, Data Structures & File Automation',
    iconName: 'FileCode2',
    overview: 'Learn Python from the ground up. Master readable syntax, create modular reusable functions, manage data collections (lists, dictionaries, sets), read and write files, and write scripts that automate tedious real-world student tasks.',
    prerequisites: [
      'Understanding of variables, data types, and loops (from Programming & Problem Solving)',
      'Basic text editor or access to a free online Python runner (e.g., Python.org Shell, Replit, or VS Code)'
    ],
    learningObjectives: [
      'Write clean, readable Python code adhering to standard indentation and naming conventions',
      'Create reusable functions with input parameters, default arguments, and return values',
      'Manipulate complex collections using lists, tuples, dictionaries, and list comprehensions',
      'Perform file input/output (I/O) operations to read and save structured data locally'
    ],
    estimatedTime: '2–3 weeks (4–6 hrs/week)',
    lessons: [
      {
        id: 'py-1',
        number: 1,
        title: 'Python Syntax Basics: Clean Indentation, Variables & Formatting',
        estimatedMinutes: 25,
        summary: 'Python is famous for its clean, human-readable syntax that uses indentation (whitespace) rather than curly braces to define blocks of code. In this lesson, learn how to declare variables, perform arithmetic and string operations, accept user input via input(), and format clear console output using f-strings.',
        keyPoints: [
          'Indentation Matters: Python uses 4 spaces to define code blocks inside functions, loops, and if-statements',
          'Dynamic Typing: You do not need to explicitly declare variable types; Python infers them automatically',
          'User Input: input() captures user keystrokes as a string, requiring int() or float() conversion for numbers',
          'F-Strings: Modern string interpolation for embedding variables cleanly: f"Hello {name}, you have {hours} hours!"'
        ],
        codeExample: {
          language: 'python',
          caption: 'Python Input, Computation & F-String Formatting',
          code: '# Accept user input and calculate study pacing\nstudent_name = input("Enter your name: ")\ntarget_pages = int(input("How many textbook pages to read? "))\ndays_left = int(input("How many days until exam? "))\n\npages_per_day = target_pages / days_left\nprint(f"\\nHi {student_name}! You need to read {pages_per_day:.1f} pages each day.")'
        },
        conceptCheck: {
          question: 'What happens in Python if you forget to indent the code inside an if-statement or function definition?',
          options: [
            'Python will automatically guess where the block belongs',
            'Python raises an IndentationError and refuses to execute the file',
            'The code runs but only produces half the output',
            'The computer switches to C++ mode'
          ],
          correctIndex: 1,
          explanation: 'Because Python relies strictly on indentation to determine block hierarchy, missing or inconsistent whitespace results in an immediate IndentationError.'
        }
      },
      {
        id: 'py-2',
        number: 2,
        title: 'Functions: Parameters, Return Values & Scope',
        estimatedMinutes: 30,
        summary: 'Functions are self-contained mini-programs that accept inputs (parameters), perform calculations, and return a result. Functions embody the DRY principle (Don’t Repeat Yourself)—enabling you to write a calculation once and reuse it across multiple files. Understanding local vs. global scope ensures your variables do not accidentally overwrite each other.',
        keyPoints: [
          'def Keyword: Used to define a new function (e.g., def calculate_gpa(grades):)',
          'Parameters vs. Arguments: Parameters are variable names in the function definition; arguments are the real values passed when calling the function',
          'return Statement: Sends calculated data back to the caller; without return, functions yield None',
          'Variable Scope: Variables created inside a function are local to that function and cannot be accessed outside it'
        ],
        codeExample: {
          language: 'python',
          caption: 'Reusable Function with Parameters and Return Value',
          code: 'def convert_hours_to_minutes(hours: float) -> float:\n    """Convert decimal hours into total minutes."""\n    return hours * 60\n\ndef calculate_study_efficiency(completed_topics: int, study_hours: float) -> float:\n    """Calculate topics mastered per hour."""\n    if study_hours <= 0:\n        return 0.0\n    return round(completed_topics / study_hours, 2)\n\n# Calling the functions\nmins = convert_hours_to_minutes(2.5) # 150.0\nrate = calculate_study_efficiency(6, 2.5) # 2.4 topics/hr\nprint(f"Study duration: {mins} mins | Rate: {rate} topics/hr")'
        },
        conceptCheck: {
          question: 'What is the primary difference between using `print()` and using `return` inside a function?',
          options: [
            'print() is for numbers and return is for text',
            'print() displays text on the screen for the user, while return passes data back into the program for further calculation',
            'There is no difference; they are identical synonyms',
            'return only works inside while loops'
          ],
          correctIndex: 1,
          explanation: '`print()` merely sends a visual string to the terminal console, whereas `return` hands data back to the calling code so it can be saved in a variable or used in subsequent calculations.'
        }
      },
      {
        id: 'py-3',
        number: 3,
        title: 'Collections: Lists, Dictionaries, and Tuples',
        estimatedMinutes: 35,
        summary: 'Real-world data rarely comes in isolated variables. Python provides powerful built-in collection types: Lists (ordered, mutable sequences [1, 2, 3]), Tuples (ordered, immutable sequences (1, 2)), Sets (unordered unique items {1, 2}), and Dictionaries (key-value pairs {"name": "Sara", "hours": 24}). Master dictionary lookups and list methods to manage structured data effortlessly.',
        keyPoints: [
          'Lists: Defined with brackets `[]`; support `.append()`, `.remove()`, `.sort()`, and slicing `[0:3]`',
          'Dictionaries: Defined with curly braces `{key: value}`; fast lookups using unique keys',
          'Zero-Based Indexing: The first item in a Python list is at index 0, not index 1',
          'Iterating Over Dictionaries: Using `.items()`, `.keys()`, and `.values()` to loop through structured student records'
        ],
        codeExample: {
          language: 'python',
          caption: 'Working with a List of Volunteer Dictionaries',
          code: 'volunteers = [\n    {"name": "Mohamed", "department": "Peer Tutoring", "hours": 14},\n    {"name": "Sara", "department": "Resource Bank", "hours": 22},\n    {"name": "Salman", "department": "Community Outreach", "hours": 30}\n]\n\ntotal_team_hours = 0\nfor member in volunteers:\n    print(f"Volunteer: {member[\'name\']} ({member[\'department\']}) -> {member[\'hours\']} hrs")\n    total_team_hours += member["hours"]\n\nprint(f"\\nTotal Circle Service Hours: {total_team_hours}")'
        },
        conceptCheck: {
          question: 'Given the dictionary `student = {"name": "Lina", "grade": 11}`, how do you access Lina’s grade in Python?',
          options: [
            'student[1]',
            'student("grade")',
            'student["grade"]',
            'student.grade()'
          ],
          correctIndex: 2,
          explanation: 'Dictionary values are accessed using square brackets with the key name as a string: `student["grade"]`.'
        }
      },
      {
        id: 'py-4',
        number: 4,
        title: 'File Handling & Defensive Programming (Try / Except)',
        estimatedMinutes: 30,
        summary: 'Programs become genuinely useful when they can save state to disk and read existing files. Python’s `with open(...)` context manager provides a safe way to read and write text and CSV files without risk of memory leaks. Paired with `try / except` error handling, your scripts can gracefully handle missing files or invalid user input without crashing.',
        keyPoints: [
          'Context Manager (`with open(...)`): Automatically closes the file stream even if an unexpected error occurs',
          'File Modes: "r" for reading, "w" for overwriting/creating, "a" for appending new lines to the end',
          'Try / Except: Catch specific errors (like FileNotFoundError, ValueError, ZeroDivisionError) cleanly',
          'CSV Processing: Using Python’s built-in `csv` module to read and write spreadsheet tables'
        ],
        codeExample: {
          language: 'python',
          caption: 'Safe File Writing and Error Handling',
          code: '# Safely writing a study log to disk\nlog_entries = ["2026-09-01: 2 hrs Python Functions", "2026-09-02: 1.5 hrs Algorithmic Logic"]\n\ntry:\n    with open("study_log.txt", "w", encoding="utf-8") as file:\n        for entry in log_entries:\n            file.write(f"{entry}\\n")\n    print("Study log saved successfully!")\nexcept IOError as e:\n    print(f"Failed to write log file: {e}")'
        },
        conceptCheck: {
          question: 'Why is using `with open(...) as f:` preferred over manually calling `f = open(...)` and `f.close()` in Python?',
          options: [
            'Because `with` automatically closes the file even if an exception occurs mid-execution',
            'Because `with` encrypts the file with a military cipher',
            'Because `with` makes the script run in C++ mode',
            'Because `open()` is deprecated in Python 3'
          ],
          correctIndex: 0,
          explanation: 'The `with` statement creates a context manager that guarantees the file descriptor is properly closed and memory flushed, even if an error is raised during reading or writing.'
        }
      }
    ],
    practicalActivity: {
      title: 'Building a Modular Text-Based Calculator & String Formatter',
      estimatedMinutes: 30,
      objective: 'Write a clean, modular Python command-line utility with separate mathematical functions, input validation, and formatted terminal outputs.',
      materialsNeeded: 'Python 3 installed on your machine OR an online Python editor (like Python.org/shell or Google Colab).',
      stepByStepGuide: [
        'Step 1: Define four functions: `add(a, b)`, `subtract(a, b)`, `multiply(a, b)`, and `divide(a, b)`.',
        'Step 2: In `divide(a, b)`, add a defensive check: IF `b == 0` return "Error: Cannot divide by zero" instead of letting Python crash.',
        'Step 3: Create a main menu loop asking the user which operation they want to perform (1-4) or 5 to Quit.',
        'Step 4: Use `try / except ValueError` to ensure the user inputs valid numbers.',
        'Step 5: Print the formatted result using an f-string: `f"Result: {num1} {operator} {num2} = {result}"`.',
        'Step 6: Test all operations including dividing by zero to confirm the script handles errors gracefully.'
      ],
      expectedOutput: 'A working Python script that continuously performs calculations, protects against division by zero and invalid input, and exits cleanly.',
      proTip: 'Use type hints in your function definitions (e.g., `def add(a: float, b: float) -> float:`) to make your code self-documenting.'
    },
    project: {
      id: 'proj-volunteer-calc',
      title: 'Volunteer-Hours Calculator & Service Log Script',
      type: 'Automation & Data Processing Script',
      tagline: 'Build a Python tool that aggregates volunteer service hours and generates formatted summaries.',
      description: 'Create a Python script that records student volunteer contributions across different school and community circles, categorizes hours by activity type, calculates cumulative totals, and exports a clean summary log.',
      keyFeatures: [
        'Dictionary-based volunteer record storage with activity tags',
        'Automated total hours aggregation and category percentages',
        'Milestone threshold evaluator (e.g. 20-hour, 50-hour service awards)',
        'Formatted tabular report generation ready for printing or exporting'
      ],
      starterSteps: [
        'Initialize a list of dictionaries to store volunteer log entries (date, activity, circle, hours).',
        'Create a function `add_log_entry(activity, circle, hours)` to append validated records.',
        'Write an aggregation function `summarize_circle_hours(entries)` that calculates category totals.',
        'Format the output into a clean, human-readable terminal table.'
      ],
      deliverableCriteria: [
        'Accurate hours summation logic across multiple categories',
        'Defensive input validation for negative or non-numeric hours',
        'Clean, human-readable service summary output'
      ],
      interactiveDemoId: 'volunteer-calc'
    },
    completionChecklist: [
      {
        id: 'py-chk-1',
        title: 'Python Syntax & F-Strings Mastered',
        description: 'I can write Python scripts using proper 4-space indentation and formatted f-strings.'
      },
      {
        id: 'py-chk-2',
        title: 'Functions & Parameters Practiced',
        description: 'I can write reusable functions with parameters, return statements, and local scope.'
      },
      {
        id: 'py-chk-3',
        title: 'Lists & Dictionaries Utilized',
        description: 'I can store, access, and loop through structured data in lists and key-value dictionaries.'
      },
      {
        id: 'py-chk-4',
        title: 'File I/O & Defensive Handling Ready',
        description: 'I understand how to safely open files with context managers and catch exceptions.'
      }
    ],
    verifiedResources: [
      {
        title: 'Official Python 3 Beginner’s Guide & Tutorial',
        provider: 'Python Software Foundation (Python.org)',
        url: 'https://docs.python.org/3/tutorial/',
        format: 'Official Documentation & Walkthrough',
        isFree: true,
        svtSummary: 'The official tutorial written by the creators of Python. Chapters 3 (Informal Introduction), 4 (Control Flow), and 5 (Data Structures) provide authoritative, precise explanations of core language mechanics.'
      },
      {
        title: 'Automate the Boring Stuff with Python',
        provider: 'Al Sweigart (Free Online Creative Commons Edition)',
        url: 'https://automatetheboringstuff.com/',
        format: 'Free Comprehensive Book & Practical Projects',
        isFree: true,
        svtSummary: 'One of the most practical and student-friendly Python books ever published. Focuses on writing real automation scripts for text files, spreadsheets, and repetitive tasks right from chapter one.'
      },
      {
        title: 'Real Python Beginner Learning Path',
        provider: 'Real Python',
        url: 'https://realpython.com/start-here/',
        format: 'Curated Free Articles & Tutorials',
        isFree: true,
        svtSummary: 'High-quality, meticulously written tutorials explaining modern Python idioms, best practices, virtual environments, and debugging strategies.'
      }
    ],
    nextStep: {
      title: 'Branch into Web Development or AI Literacy',
      recommendation: 'Choose Web Development to build visual, interactive web apps for your tools, or explore AI Literacy & Responsible Use to understand machine learning models.',
      suggestedTrackId: 'web-development'
    }
  },
  {
    id: 'web-development',
    title: 'Web Development',
    subtitle: 'HTML5 Semantic Markup, CSS Flexbox/Grid & JavaScript DOM',
    iconName: 'Globe',
    overview: 'Learn how to build clean, fast, and accessible user interfaces for the modern web. Master semantic HTML5 document architecture, modern responsive CSS layouts (Flexbox & Grid), JavaScript event handling, and WCAG accessibility standards.',
    prerequisites: [
      'Basic text editing and file management skills (from Computer Fundamentals)',
      'A modern web browser (Chrome, Firefox, Safari, or Edge) with Developer Tools'
    ],
    learningObjectives: [
      'Structure accessible web documents using semantic HTML5 elements (header, nav, main, section, footer)',
      'Style responsive, mobile-first layouts using CSS Box Model, Flexbox, and CSS Grid',
      'Add dynamic interactivity and DOM manipulation using modern vanilla JavaScript (ES6+)',
      'Apply essential Web Content Accessibility Guidelines (WCAG) including color contrast, ARIA labels, and keyboard navigation'
    ],
    estimatedTime: '2–3 weeks (4–6 hrs/week)',
    lessons: [
      {
        id: 'wd-1',
        number: 1,
        title: 'HTML5 Semantic Structure & Document Hierarchy',
        estimatedMinutes: 25,
        summary: 'HTML (HyperText Markup Language) provides the structural skeleton of every web page. Semantic HTML means using elements that clearly describe their meaning to both browser render engines and assistive technologies (like screen readers). Instead of generic <div> tags everywhere, semantic markup uses <header>, <nav>, <main>, <article>, <section>, and <aside> to create an accessible document outline.',
        keyPoints: [
          'Document Skeleton: <!DOCTYPE html>, <html>, <head> (metadata, title, stylesheet links), and <body> (visible content)',
          'Heading Hierarchy: Strict sequential ordering (<h1> to <h6>) without skipping levels for screen reader navigability',
          'Semantic Landmark Elements: <nav>, <main>, <section>, <article>, <footer> for logical structure',
          'Essential Attributes: `alt` descriptions on images, `href` on anchors, `type` and `id` on form inputs'
        ],
        codeExample: {
          language: 'html',
          caption: 'Clean Semantic HTML5 Layout Skeleton',
          code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Student Study Tracker</title>\n</head>\n<body>\n  <header>\n    <h1>SVT Study Tracker</h1>\n    <nav aria-label="Main Navigation">\n      <a href="#planner">Planner</a>\n      <a href="#resources">Resources</a>\n    </nav>\n  </header>\n  <main>\n    <section id="planner">\n      <h2>Daily Study Goals</h2>\n      <p>Track your academic pacing with confidence.</p>\n    </section>\n  </main>\n  <footer>\n    <p>&copy; 2026 Scholars Volunteer Team</p>\n  </footer>\n</body>\n</html>'
        },
        conceptCheck: {
          question: 'Why should you use semantic elements like `<nav>` and `<main>` instead of standard `<div>` containers?',
          options: [
            'Because `<div>` is no longer supported in modern browsers',
            'Because semantic tags improve search indexing, code readability, and screen reader accessibility',
            'Because semantic tags make the web page load 10x faster automatically',
            'Because CSS cannot style `<div>` tags'
          ],
          correctIndex: 1,
          explanation: 'Semantic elements communicate structural roles to search engines, developers, and assistive devices (screen readers), making the web accessible to all users.'
        }
      },
      {
        id: 'wd-2',
        number: 2,
        title: 'CSS Styling: Box Model, Typography & Flexbox Layouts',
        estimatedMinutes: 30,
        summary: 'Cascading Style Sheets (CSS) control the visual presentation, typography, colors, and layout of HTML elements. Every element on a web page is treated as a rectangular box governed by the CSS Box Model: Content, Padding (space inside the border), Border, and Margin (space outside the border). Modern layouts rely on CSS Flexbox for 1-dimensional row/column alignment and CSS Grid for 2-dimensional layouts.',
        keyPoints: [
          'CSS Box Model: Content Area + Padding + Border + Margin (`box-sizing: border-box` ensures predictable sizing)',
          'Selectors & Cascade: Targeting elements via element tags, classes (`.card`), and IDs (`#header`) with specificity rules',
          'Flexbox Essentials: `display: flex`, `justify-content` (main axis alignment), `align-items` (cross axis alignment), and `flex-wrap`',
          'Responsive Units: Using `rem`, `%`, `vh/vw` alongside media queries (`@media (min-width: 768px)`) for mobile adaptation'
        ],
        codeExample: {
          language: 'css',
          caption: 'Modern Flexbox Card Layout with Clean Neutrals',
          code: '/* Global reset for consistent box sizing */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n.study-card {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 24px;\n  background-color: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 16px;\n}\n\n.badge-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}'
        },
        conceptCheck: {
          question: 'In the CSS Box Model, which layer represents the space between the element’s content and its border?',
          options: [
            'Margin',
            'Padding',
            'Outline',
            'Z-index'
          ],
          correctIndex: 1,
          explanation: 'Padding represents the internal breathing room between an element’s content and its bounding border, whereas margin controls the outer spacing between distinct elements.'
        }
      },
      {
        id: 'wd-3',
        number: 3,
        title: 'JavaScript & DOM Manipulation: Selecting, Events & State',
        estimatedMinutes: 35,
        summary: 'JavaScript breathes life into static HTML and CSS. The Document Object Model (DOM) is a tree-like programmatic representation of the web page. Using JavaScript methods like `document.querySelector()` and `addEventListener()`, you can listen for button clicks, read form inputs, toggle classes, and update text dynamically in real time without reloading the page.',
        keyPoints: [
          'DOM Tree: The object model representing HTML tags in browser memory as nodes',
          'Querying Elements: `document.querySelector(\'.btn\')` and `document.querySelectorAll(\'li\')`',
          'Event Listeners: `element.addEventListener(\'click\', (e) => { ... })` for user interaction',
          'Dynamic Modification: Changing text with `textContent`, classes with `classList.toggle()`, and attributes with `setAttribute()`'
        ],
        codeExample: {
          language: 'javascript',
          caption: 'Adding Interactive Task Completion with Vanilla JavaScript',
          code: '// Select DOM elements\nconst taskInput = document.querySelector(\'#task-input\');\nconst addBtn = document.querySelector(\'#add-task-btn\');\nconst taskList = document.querySelector(\'#task-list\');\n\n// Listen for button click\naddBtn.addEventListener(\'click\', () => {\n  const taskText = taskInput.value.trim();\n  if (!taskText) return;\n\n  const li = document.createElement(\'li\');\n  li.textContent = taskText;\n  li.className = \'task-item\';\n  \n  // Toggle completion state on click\n  li.addEventListener(\'click\', () => {\n    li.classList.toggle(\'completed\');\n  });\n\n  taskList.appendChild(li);\n  taskInput.value = \'\'; // Reset input\n});'
        },
        conceptCheck: {
          question: 'What is the recommended method to update text inside a DOM element securely without risking HTML injection?',
          options: [
            'element.innerHTML = newText',
            'element.textContent = newText',
            'document.write(newText)',
            'window.alert(newText)'
          ],
          correctIndex: 1,
          explanation: '`element.textContent` sets raw text without parsing HTML tags, preventing Cross-Site Scripting (XSS) and injection vulnerabilities associated with unvalidated `innerHTML`.'
        }
      },
      {
        id: 'wd-4',
        number: 4,
        title: 'Accessibility (a11y) & Responsive Mobile-First Design',
        estimatedMinutes: 25,
        summary: 'A great website is accessible to everyone, including users navigating via screen readers, keyboard-only inputs, or high-contrast modes on small mobile screens. Mobile-first design builds the lightweight mobile experience first, progressively enhancing layout features as screen width expands. Accessibility compliance ensures minimum 4.5:1 text contrast and minimum 44px touch targets.',
        keyPoints: [
          'WCAG Contrast: Minimum 4.5:1 contrast ratio for normal text against its background for readability',
          'Keyboard Navigability: Every interactive element (buttons, links, form inputs) must be focusable with visible focus rings',
          'Mobile Touch Targets: Minimum 44x44px clickable area for all buttons and interactive controls on touchscreens',
          'ARIA Labels: `aria-label`, `aria-expanded`, and `aria-controls` for conveying state to screen readers'
        ],
        codeExample: {
          language: 'html',
          caption: 'Accessible Button with High-Contrast State and ARIA Label',
          code: '<!-- Accessible Toggle Button with Touch Target and Visible Focus -->\n<button \n  type="button"\n  id="theme-toggle"\n  aria-label="Toggle High-Contrast Study Mode"\n  aria-pressed="false"\n  class="min-h-[44px] px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"\n>\n  <span>High-Contrast Mode</span>\n</button>'
        },
        conceptCheck: {
          question: 'What is the minimum recommended touch target size for mobile web controls to ensure comfortable tapping without errors?',
          options: [
            '10x10 pixels',
            '20x20 pixels',
            '44x44 pixels',
            '100x100 pixels'
          ],
          correctIndex: 2,
          explanation: 'Accessibility standards (WCAG 2.1 Success Criterion 2.5.5) recommend a minimum touch target size of 44x44 CSS pixels to accommodate physical finger tap accuracy on mobile devices.'
        }
      }
    ],
    practicalActivity: {
      title: 'Building a Responsive Student Profile & Goal Card',
      estimatedMinutes: 30,
      objective: 'Create a clean, responsive HTML and CSS card component with semantic tags, flexbox badge alignment, accessible color contrast, and an interactive study goal checklist.',
      materialsNeeded: 'A simple code editor (VS Code, CodePen, or JSFiddle) and a web browser.',
      stepByStepGuide: [
        'Step 1: Write semantic HTML: an `<article>` container holding a header with student avatar initials, an `<h2>` name, and a `<p>` bio.',
        'Step 2: Add a Flexbox container for study tags (`#Python`, `#SATPrep`, `#VolunteerLeadership`) with subtle padding and rounded borders.',
        'Step 3: Create an interactive unordered list of 3 weekly study goals with checkboxes.',
        'Step 4: Style with CSS: crisp white card background (`#ffffff`), subtle slate border (`#e2e8f0`), dark slate text (`#0f172a`), and generous padding (24px).',
        'Step 5: Write a simple 4-line JavaScript listener to strike through goals when checked.',
        'Step 6: Test responsiveness by resizing browser window down to 320px mobile width to confirm layout does not overflow.'
      ],
      expectedOutput: 'A clean, mobile-responsive card component with verified keyboard focusability, high contrast text, and functioning goal toggles.',
      proTip: 'Never use fixed pixel widths on container elements (e.g. `width: 600px;`). Use `max-width: 600px; width: 100%;` to allow graceful mobile shrinkage.'
    },
    project: {
      id: 'proj-study-planner',
      title: 'Personal Study Planner & Task Tracker',
      type: 'Interactive Web Application',
      tagline: 'Build a responsive, client-side study planner with subject tags and local persistence.',
      description: 'Design and code a clean, single-page web application where students can create study tasks, assign subject categories and estimated completion minutes, filter by priority, mark tasks complete, and persist state safely in browser localStorage.',
      keyFeatures: [
        'Task creation form with validation for subject, topic, and estimated minutes',
        'Subject category badge filters (e.g. CS & AI, Math, English, Volunteer)',
        'Progress bar visualizing completed tasks percentage in real-time',
        'Local storage persistence so study tasks survive page reloads without requiring an account'
      ],
      starterSteps: [
        'Build the semantic HTML layout with header, task input form, filter tab bar, and task list container.',
        'Apply responsive CSS styles using the SVT white-first aesthetic with slate borders and indigo accents.',
        'Write JavaScript state management functions: `addTask()`, `toggleTask()`, `deleteTask()`, and `filterTasks()`.',
        'Integrate `localStorage.getItem()` and `localStorage.setItem()` to maintain persistent task state.'
      ],
      deliverableCriteria: [
        'Fully working task CRUD (create, read, toggle complete, delete) flow',
        'Zero horizontal overflow on screens from 320px to 1440px',
        'Passing WCAG color contrast and keyboard tab navigation'
      ],
      interactiveDemoId: 'study-planner'
    },
    completionChecklist: [
      {
        id: 'wd-chk-1',
        title: 'Semantic HTML5 Architecture Mastered',
        description: 'I can structure accessible web pages with proper heading hierarchy and landmark tags.'
      },
      {
        id: 'wd-chk-2',
        title: 'CSS Box Model & Flexbox Practiced',
        description: 'I can align elements and build responsive layouts using modern CSS Flexbox and Grid.'
      },
      {
        id: 'wd-chk-3',
        title: 'JavaScript DOM Events Integrated',
        description: 'I can attach event listeners, manipulate DOM nodes, and manage client-side state.'
      },
      {
        id: 'wd-chk-4',
        title: 'Accessibility Standards Applied',
        description: 'I understand WCAG contrast requirements, keyboard focus states, and minimum touch target sizes.'
      }
    ],
    verifiedResources: [
      {
        title: 'MDN Web Docs: Learn Web Development',
        provider: 'Mozilla Developer Network (MDN)',
        url: 'https://developer.mozilla.org/en-US/docs/Learn',
        format: 'Official Web Documentation & Comprehensive Curriculum',
        isFree: true,
        svtSummary: 'The undisputed official reference manual for HTML, CSS, and JavaScript. MDN’s "Getting Started with the Web" modules offer the highest-standard explanations of web standards and cross-browser behavior.'
      },
      {
        title: 'W3C Web Accessibility Tutorials',
        provider: 'World Wide Web Consortium (W3C / WAI)',
        url: 'https://www.w3.org/WAI/tutorials/',
        format: 'Official Accessibility Guidelines & Code Examples',
        isFree: true,
        svtSummary: 'Authoritative guidance on building accessible menus, forms, tables, and page structures. Essential reading for ensuring web applications work smoothly for all users.'
      },
      {
        title: 'Responsive Web Design Certification',
        provider: 'freeCodeCamp.org',
        url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
        format: 'Free In-Browser Interactive Projects',
        isFree: true,
        svtSummary: 'A hands-on, project-based curriculum covering modern CSS Flexbox, Grid, pseudo-selectors, and responsive typography through interactive exercises.'
      }
    ],
    nextStep: {
      title: 'Explore AI Literacy & Responsible Use',
      recommendation: 'Now that you can build interactive web interfaces, learn how modern AI models operate and how to apply ethical guidelines when augmenting your coding and study workflows.',
      suggestedTrackId: 'ai-literacy-responsible-use'
    }
  },
  {
    id: 'ai-literacy-responsible-use',
    title: 'AI Literacy & Responsible Use',
    subtitle: 'Machine Learning Concepts, LLMs, Ethical Principles & Prompting',
    iconName: 'Sparkles',
    overview: 'Demystify modern Artificial Intelligence, Machine Learning, and Large Language Models (LLMs). Understand how pattern recognition works, recognize hallucinations and biases, practice strict data privacy hygiene, and adopt the SVT AI Use Principles to accelerate learning without replacing critical thinking.',
    prerequisites: [
      'Basic digital literacy and familiarity with computer concepts',
      'No prior advanced math or machine learning knowledge required'
    ],
    learningObjectives: [
      'Explain how machine learning differs from traditional rule-based software programming',
      'Understand how Large Language Models generate text using statistical probability (token prediction)',
      'Recognize AI hallucinations, outdated knowledge boundaries, and bias in training datasets',
      'Master the 6 SVT AI Use Principles: verification, privacy, comprehension, attribution, cognitive integrity, and bias auditing'
    ],
    estimatedTime: '1–2 weeks (3–4 hrs/week)',
    lessons: [
      {
        id: 'ai-1',
        number: 1,
        title: 'What is AI? Traditional Code vs. Machine Learning & LLMs',
        estimatedMinutes: 20,
        summary: 'In traditional programming, human developers write explicit, deterministic rules (IF input X, THEN do Y). In Machine Learning (ML), algorithms analyze vast amounts of sample data to identify statistical patterns and generate a mathematical model. Large Language Models (LLMs) are deep neural networks trained on billions of text sequences to predict the most statistically probable next word (token) given a preceding prompt.',
        keyPoints: [
          'Rule-Based Software vs. ML: Rules are handcrafted by humans; ML models learn patterns inductively from data',
          'Tokenization: Text is chopped into numerical fragments (tokens—roughly 3/4 of an English word)',
          'Probabilistic Prediction: LLMs do not "know" or "think" in human terms; they calculate probability distributions over tokens',
          'Training vs. Inference: Training requires massive computing power to tune weights; inference is generating a response from a trained model'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Traditional Logic vs Machine Learning Pattern Recognition',
          code: 'Traditional Rule: IF temperature > 37.5 THEN status = "Fever"\n\nMachine Learning: Model examines 100,000 patient vitals -> Finds nuanced correlations -> Predicts risk score with 94% statistical confidence'
        },
        conceptCheck: {
          question: 'What is a Large Language Model (LLM) fundamentally doing when it writes a response to your question?',
          options: [
            'Searching Google in secret and copying the first search result',
            'Predicting the most statistically probable sequence of tokens based on patterns learned during training',
            'Thinking consciously like a human tutor',
            'Retrieving pre-written answers from a hard drive encyclopedia'
          ],
          correctIndex: 1,
          explanation: 'LLMs are advanced probabilistic models that predict the most likely subsequent tokens based on statistical weights established during massive training phases.'
        }
      },
      {
        id: 'ai-2',
        number: 2,
        title: 'Capabilities, Hallucinations & Critical Verification',
        estimatedMinutes: 25,
        summary: 'While modern AI models excel at brainstorming, summarizing lengthy passages, translating languages, and explaining complex programming concepts, they possess critical limitations. The most dangerous failure mode is "hallucination"—generating plausible-sounding statements, citations, or code functions that are factually false or nonexistent. Students must treat AI output as a draft from a knowledgeable peer that always requires verification.',
        keyPoints: [
          'Strengths: Rapid idea generation, drafting outlines, translating prose, debugging syntax errors, and explaining difficult analogies',
          'Hallucinations: Generating non-existent book titles, fake academic papers, or incorrect math calculations with complete confidence',
          'Knowledge Cutoffs: Models only know information present up to their training date or accessible through real-time search tools',
          'Verification Rule: Never rely on an AI claim for factual, historical, medical, or legal citations without verifying against primary sources'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Example of an AI Hallucination Trap',
          code: 'User: "Can you give me the 2024 paper by Dr. Smith on Quantum Photosynthesis?"\nAI (Hallucinating): "Certainly! Dr. Smith published \'Quantum Mechanics in Green Algae\' in Nature, Vol 412, pp. 88-92."\nReality: Neither that paper nor volume exists—the model hallucinated plausible title and citation details!'
        },
        conceptCheck: {
          question: 'What is an "AI hallucination" in the context of Large Language Models?',
          options: [
            'When the model server overheats and shuts down',
            'When an AI generates plausible-sounding statements or facts that are entirely made up or inaccurate',
            'When the computer monitor displays visual artifacts',
            'When an AI model translates English into Spanish'
          ],
          correctIndex: 1,
          explanation: 'Hallucination refers to instances where an AI generates confident, articulate assertions that are factually untrue, fabricated, or mathematically flawed.'
        }
      },
      {
        id: 'ai-3',
        number: 3,
        title: 'AI Use Principles: The 6 SVT Core Guidelines for Students',
        estimatedMinutes: 30,
        summary: 'To empower students while safeguarding academic integrity and cognitive development, the Scholars Volunteer Team (SVT) establishes six foundational AI Use Principles. Every student and volunteer must uphold these principles when using generative AI tools in academic, volunteer, or technical projects.',
        keyPoints: [
          '1. Verify Important Information: Cross-check every key factual claim, statistic, date, or formula against authoritative primary sources (e.g. textbooks, official docs, peer-reviewed publications).',
          '2. Protect Personal Information: Never paste student names, contact details, grades, passwords, private application credentials, or sensitive institutional records into public AI prompts.',
          '3. Do Not Submit AI Output Without Understanding It: You must be able to explain every single line of code, paragraph of an essay, or calculation step in your own words without AI assistance.',
          '4. Cite Sources When Required: Disclose AI assistance transparently in accordance with your school or team academic integrity policies (e.g. "Drafted with assistance from Gemini for outline structuring").',
          '5. Use AI to Support Learning, Not Replace Thinking: Use AI as a Socratic sparring partner, brainstorming tool, or code explainer—never as a tool to bypass the hard cognitive work of learning.',
          '6. Check for Bias and Mistakes: Be aware that AI training datasets reflect human societal biases, historical skews, and logical blind spots. Audit generated content actively for fairness and accuracy.'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'The 6 SVT AI Use Principles Summary Card',
          code: '┌─────────────────────────────────────────────────────────────┐\n│            SVT CORE AI USE PRINCIPLES FOR STUDENTS          │\n├─────────────────────────────────────────────────────────────┤\n│ 1. VERIFY: Always cross-check facts against primary sources │\n│ 2. PROTECT: Never input private, student, or secret data    │\n│ 3. UNDERSTAND: Never submit output you cannot explain alone │\n│ 4. CITE: Transparently disclose AI tool assistance          │\n│ 5. THINK: Use AI to sharpen your mind, not replace effort   │\n│ 6. AUDIT: Screen for training bias, stereotypes & errors   │\n└─────────────────────────────────────────────────────────────┘'
        },
        conceptCheck: {
          question: 'According to SVT AI Use Principle #3, what is required before you submit any AI-assisted code or essay?',
          options: [
            'You must run the output through a paid grammar checker',
            'You must fully understand and be capable of explaining every line or paragraph in your own words',
            'You must ask the AI to grade itself',
            'You must delete all comments from the code'
          ],
          correctIndex: 1,
          explanation: 'Principle #3 requires that you maintain complete intellectual ownership: you must never submit any code or text that you cannot explain and defend independently.'
        }
      },
      {
        id: 'ai-4',
        number: 4,
        title: 'Effective Prompt Crafting for Learning (The Socratic Method)',
        estimatedMinutes: 25,
        summary: 'The difference between using AI as a cognitive crutch versus a powerful tutor lies in prompt engineering. Avoid "answer-seeking prompts" (e.g., "Write my homework assignment"). Instead, use "concept-mastery prompts" (e.g., "Explain how Python list slicing works using a pizza analogy", or "Review this function and point out where my logic fails without giving me the final answer").',
        keyPoints: [
          'Socratic Prompting: Prompting the AI to ask you guiding questions rather than giving immediate answers',
          'Providing Role & Context: "Act as a patient computer science tutor for a high school beginner"',
          'Requesting Alternative Explanations: "Show me 2 different ways to structure this loop with pros and cons of each"',
          'Step-by-Step Breakdown: "Walk me through how the CPU registers execute this logic step-by-step"'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Weak Prompt vs. High-Impact Learning Prompt',
          code: '❌ WEAK (Replaces Thinking):\n"Write a Python script that calculates volunteer hours."\n\n✅ HIGH-IMPACT (Supports Learning):\n"I am writing a Python script to sum volunteer hours from a dictionary. Here is my current draft: [paste code]. Can you review my approach, identify where my error handling might fail, and ask me 2 guiding questions to help me fix it myself?"'
        },
        conceptCheck: {
          question: 'Which of the following prompts represents the best use of AI as an active learning partner?',
          options: [
            '"Write my entire essay on climate change so I can turn it in."',
            '"Here is my outline for an essay on climate change. What are 2 counter-arguments I should address to make my analysis stronger?"',
            '"Give me 5 fake sources for my research paper."',
            '"Solve my math test questions 1 through 10."'
          ],
          correctIndex: 1,
          explanation: 'Asking for counter-arguments encourages critical reflection, deeper analysis, and active intellectual engagement without replacing the student’s own writing.'
        }
      },
      {
        id: 'ai-5',
        number: 5,
        title: 'Data Ethics, Intellectual Property & Societal Impact',
        estimatedMinutes: 25,
        summary: 'AI technology impacts society profoundly. Understanding data provenance (where training data came from), copyright implications, environmental energy consumption of data centers, and algorithmic fairness is essential for any responsible digital citizen. When building software that incorporates AI APIs, developers bear ethical responsibility for the outputs their applications present to users.',
        keyPoints: [
          'Training Data Provenance: Large models are trained on scraped web data, raising important intellectual property and consent questions',
          'Algorithmic Bias: Models trained on historical data can perpetuate and amplify gender, racial, and cultural stereotypes',
          'Environmental Footprint: Training state-of-the-art models consumes substantial electrical power and water cooling resources',
          'Human-in-the-Loop: Critical systems (healthcare, judicial, grading, admissions) must always maintain human oversight'
        ],
        codeExample: {
          language: 'plaintext',
          caption: 'Ethical Checklist for AI-Powered Applications',
          code: '1. Does this feature protect user privacy and confidentiality?\n2. Is there a clear human appeal/override process for automated decisions?\n3. Are users explicitly informed when they are interacting with an AI system?\n4. Have we tested for bias across diverse student demographic scenarios?'
        },
        conceptCheck: {
          question: 'What is meant by the principle of "Human-in-the-Loop" in AI systems?',
          options: [
            'Humans must physically pedal bicycles to generate power for the AI servers',
            'Critical decisions (such as student admissions, grading, or healthcare) must have human review rather than being fully automated',
            'AI models must be programmed in human languages rather than binary',
            'Users must click a button every 5 seconds to keep the AI active'
          ],
          correctIndex: 1,
          explanation: 'Human-in-the-Loop ensures that automated systems do not make irreversible, high-stakes decisions without qualified human oversight, discretion, and accountability.'
        }
      }
    ],
    practicalActivity: {
      title: 'AI Output Fact-Checking & Bias Audit Drill',
      estimatedMinutes: 25,
      objective: 'Audit an AI-generated study summary containing subtle factual and logical errors, locate the inaccuracies, verify against primary documentation, and write a corrected version.',
      materialsNeeded: 'A text editor or notebook, and access to official documentation or verified reference sites.',
      stepByStepGuide: [
        'Step 1: Read this sample AI-generated claim: "Python was created by James Gosling in 1995 and uses curly braces to define code blocks."',
        'Step 2: Check the official Python documentation (python.org) to identify the 2 major errors (Guido van Rossum created Python in 1991; it uses indentation, not curly braces—Gosling created Java).',
        'Step 3: Read a second sample claim: "All standard computers use 16-bit bytes to store ASCII characters."',
        'Step 4: Check Computer Fundamentals facts to identify the error (Bytes are 8 bits; ASCII traditionally uses 7–8 bits).',
        'Step 5: Write down the corrected summary in your own words, citing the official source URLs where you confirmed the facts.',
        'Step 6: Reflect on why the AI generated plausible-sounding phrasing despite being completely incorrect.'
      ],
      expectedOutput: 'A documented audit log showing original incorrect claims, primary source verification links, and a rewritten, factually accurate summary.',
      proTip: 'When an AI uses words like "obviously", "always", or "universally", treat that as an indicator to double-check the claim against primary references.'
    },
    project: {
      id: 'proj-ai-checklist',
      title: 'Responsible-AI Student Verification Utility',
      type: 'Ethical Audit & Verification Tool',
      tagline: 'Build an interactive checklist tool to audit AI-assisted assignments before submission.',
      description: 'Create an interactive digital checklist and verification tool that guides students step-by-step through the 6 SVT AI Use Principles. The tool allows students to paste their prompt and AI output, answer verification checks (fact-checking, privacy, comprehension, attribution), and generate an ethical compliance badge.',
      keyFeatures: [
        '6-Step interactive compliance audit mapped directly to the SVT AI Use Principles',
        'Data privacy sanitizer check (detecting accidental paste of names, emails, or credentials)',
        'Attribution and disclosure statement generator (e.g. formatted academic citation)',
        'Local browser storage with zero sensitive learning data or personal records collected'
      ],
      starterSteps: [
        'Map out the 6 essential audit questions based on the SVT AI Use Principles.',
        'Build the user interface with interactive verification toggles and progress indicator.',
        'Add a text helper that generates a clean, transparent disclosure statement.',
        'Ensure the tool saves non-sensitive completion state locally without sending data to servers.'
      ],
      deliverableCriteria: [
        'Interactive checklist covering all 6 SVT principles',
        'Working disclosure citation template builder',
        'Zero personal data collection or external API transmission'
      ],
      interactiveDemoId: 'ai-checklist'
    },
    completionChecklist: [
      {
        id: 'ai-chk-1',
        title: 'Machine Learning & LLM Mechanics Understood',
        description: 'I can explain that LLMs predict probable tokens based on training data patterns.'
      },
      {
        id: 'ai-chk-2',
        title: 'Hallucination Awareness Established',
        description: 'I know how to spot confident AI hallucinations and verify facts with primary sources.'
      },
      {
        id: 'ai-chk-3',
        title: 'The 6 SVT AI Use Principles Mastered',
        description: 'I uphold verification, privacy protection, full comprehension, citation, critical thinking, and bias checks.'
      },
      {
        id: 'ai-chk-4',
        title: 'Socratic Prompting Practiced',
        description: 'I know how to craft prompts that help me learn and understand rather than merely copying answers.'
      }
    ],
    verifiedResources: [
      {
        title: 'Elements of AI: Introduction to AI',
        provider: 'University of Helsinki & MinnaLearn',
        url: 'https://www.elementsofai.com/',
        format: 'Free Open Online Course & Certificate Track',
        isFree: true,
        svtSummary: 'Widely celebrated as one of the best introductory AI courses in the world. Zero coding or advanced math required. Covers the philosophy of AI, neural networks, machine learning, and societal implications.'
      },
      {
        title: 'Google AI Education & Responsible AI Practices',
        provider: 'Google AI Research',
        url: 'https://ai.google/education/',
        format: 'Free Guides, Visualizations & Research Papers',
        isFree: true,
        svtSummary: 'Provides accessible visual guides explaining fairness, interpretability, transparency, and safety guidelines when designing machine learning systems.'
      },
      {
        title: 'UNESCO Guidance for Generative AI in Education and Research',
        provider: 'UNESCO (United Nations Educational, Scientific and Cultural Organization)',
        url: 'https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research',
        format: 'Official Global Policy Framework & Ethical Guidelines',
        isFree: true,
        svtSummary: 'The international benchmark framework for human agency, student privacy protection, age-appropriate AI use, and intellectual integrity in schools worldwide.'
      }
    ],
    nextStep: {
      title: 'Build Integrated Real-World Projects',
      recommendation: 'Combine your knowledge from all 5 tracks: use Computer Fundamentals and Python to write backend logic, Web Development to build responsive UIs, and Responsible AI principles to enhance your workflows ethically.',
      suggestedTrackId: 'computer-fundamentals'
    }
  }
];
