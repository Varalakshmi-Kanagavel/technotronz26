import Link from "next/link"
import { cookies } from "next/headers"
import { getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import UserPayment from "@/models/UserPayment"
import EventDetailsClient from "./EventDetailsClient"

// Event data mapping
const eventData: Record<
  string,
  {
    title: string
    description: string[]
    rounds?: { name: string; description: string }[]
    venue: string
    dateTime: string
    rules: string[]
    coordinators: { name: string; phone: string }[]
    fileCode: string
    topics?: string[]
    mode?: string  
  }
> = {
  "workshop-1": {
    title: "LoRa Based IoT Application Development",
    description: [
      "This workshop provides participants with a solid introduction to Internet of Things (IoT) technology through a blend of conceptual learning and hands-on experience.","It covers embedded systems, microcontrollers, sensors, and key communication protocols used in real-world IoT applications.","Participants will work with platforms such as Arduino and thingZkit Mini, along with wireless technologies like LoRa and LoRaWAN.", "The workshop also introduces cloud integration and data visualization for complete IoT solutions.", "By the end, participants will gain practical skills to work with modern hardware, collaborate ethically in teams or individually, and design innovative IoT solutions tailored to industry and client needs.",
    ],
   
    venue: "E-Block Lab 204",
    dateTime: "February 07, 2026 — 9:00 AM to 4:00 PM",
    rules: [
      "Participation : Individual",   
    ],
    "mode":"Offline",
    coordinators: [
      { name: "Murali", phone: "93426 28687" },
      { name: "Prahalya", phone: "93451 32434" },
    ],
    fileCode: "FILE-001",
  },
  "workshop-2": {
    title: "ModelCraft with MATLAB - Simulink for Industrial Applications",
    description: [
     "This workshop introduces Model-Based Development using MATLAB and Simulink for industrial applications, offering a systematic approach to designing, simulating, and validating complex systems. Participants will learn how mathematical models form the foundation of system development, enabling early testing, analysis, and optimization before hardware implementation. The workshop covers building dynamic models, performance evaluation, and automatic code generation for real-time and embedded systems. Industry-focused examples from control systems, automotive engineering, power electronics, and automation are explored. Through guided demonstrations and hands-on exercises, participants will understand how model-based design improves accuracy, reduces development time, and enhances reliability, preparing them for modern, industry-standard engineering workflows.",
    ],
  
    venue: "Tech Hub - Room 302",
    dateTime: "February 7, 2026 — 9.00 AMto 4:00 PM",
    "mode":"Offline",
    rules: [
      "Participation : Individual",
    ],
    coordinators: [
      { name: "Pavithran S Y ", phone: "93456 93986" },
      { name: " Nishanth ", phone: "73058 54418" },
    ],
    fileCode: "FILE-002",
  },
  "workshop-3": {
    title: "WORKSHOP 3",
    description: [
      "Unlock hidden potentials in the realm of tech where the impossible becomes inevitable.",
      "Secrets from the Upside Down revealed to those who dare to look beyond the surface.",
      "Transform your understanding of technology in ways that defy conventional explanation.",
    ],
    rounds: [
      { name: "Round 1", description: "Initiation - Enter the realm of advanced concepts" },
      { name: "Round 2", description: "Mastery - Prove your worth in the final challenge" },
    ],
    venue: "Innovation Center - Hall A",
    dateTime: "March 1, 2025 — 9:00 AM to 12:00 PM",
    rules: [
      "Pre-registration mandatory",
      "Bring government-issued ID for verification",
      "Limited seats available - first come, first served",
      "No photography or recording allowed",
    ],
    coordinators: [
      { name: "Dustin Henderson", phone: "9876543214" },
      { name: "Lucas Sinclair", phone: "9876543215" },
    ],
    fileCode: "FILE-003",
  },
  hackathon: {
    title: "HACKATHON",
    description: [
      "48 hours in the Upside Down. Build or be consumed by the void of infinite possibilities.",
      "Push the boundaries of creation as time warps around you in this ultimate coding challenge.",
      "Only the strongest minds will survive the darkness and emerge with solutions to save the world.",
    ],
    rounds: [
      { name: "Round 1", description: "Ideation Phase - Pitch your concept to the council" },
      { name: "Round 2", description: "Development Sprint - 24 hours of intense building" },
      { name: "Round 3", description: "Final Presentation - Showcase your creation" },
    ],
    venue: "Main Auditorium & Computer Labs",
    dateTime: "February 28-29, 2025 — 48 Hours Non-Stop",
    rules: [
      "Team size: 3-4 members",
      "Original work only - no pre-built solutions",
      "Must use at least one API from sponsors",
      "Sleeping bags and refreshments allowed",
      "Mentors available throughout the event",
    ],
    coordinators: [
      { name: "Steve Harrington", phone: "9876543216" },
      { name: "Nancy Wheeler", phone: "9876543217" },
    ],
    fileCode: "FILE-004",
  },
  codeathon: {
    title: "CODEATHON",
    description: [
      "Race against time in the shadow realm of algorithms where every second counts.",
      "Solve puzzles that twist reality and challenge your perception of what's possible.",
      "The clock ticks down as you navigate through increasingly complex challenges.",
    ],
    rounds: [
      { name: "Round 1", description: "Warm-up Challenges - Easy to Medium difficulty" },
      { name: "Round 2", description: "Final Battle - Hard problems only" },
    ],
    venue: "Computer Science Lab 101",
    dateTime: "March 1, 2025 — 2:00 PM to 6:00 PM",
    rules: [
      "Individual participation",
      "Languages allowed: C, C++, Java, Python",
      "Internet access prohibited during contest",
      "Plagiarism results in immediate disqualification",
    ],
    coordinators: [
      { name: "Robin Buckley", phone: "9876543218" },
      { name: "Eddie Munson", phone: "9876543219" },
    ],
    fileCode: "FILE-005",
  },
  "bot-1": {
    title: "PATHTRONIX",
    description: [
    "PathTronix is an exciting Line Following Robot Challenge that invites participants to design and program autonomous robots capable of navigating a predefined track using intelligent line-following techniques.","The event unfolds across multiple rounds, each testing precision, speed ,adaptability, and control.","From sharp curves and intersections to ramps and obstacles, teams must showcase robust design and smart .",
    ],
    rounds: [
      { name: "Round 1:Tracron ", description: "This round tests the robot’s ability to handle a dynamic track filled with straight and dashed lines, sharp turns, false paths, and misleading trails.Precision sensing, quick correction, and intelligent path selection are crucial to avoid distractions.Teams must strike the perfect balance between speed and accuracy, as smooth navigation can be the key to advancing further." },
      { name: "Round 2: SmackBot", description: "The challenge escalates with the introduction of ramps and solid obstacles. Robots must maintain stability and line tracking while tackling elevation changes and physical barriers. Strong mechanical design, proper traction, and efficient obstacle-handling strategies are essential. This round pushes teams to demonstrate resilience, recovery skills, and advanced navigation under tougher conditions." },
    ],
    venue: "Robotics Arena - Ground Floor",
    dateTime: "February 8, 2026 - 9:00 AM to 1:00 PM",
    "mode" : "Offline",
    rules: [
    "Participation : Individual / Team of maximum 4 members",
    "The practice track and the actual competition track will be different",
    "The time recorded by the organizers will be taken as final for scoring",
    "If a robot goes off the line, it must restart from the nearest checkpoint already crossed",
    "Robots must not damage the track or leave marks on it; any damage will lead to immediate disqualification",
    "The maximum time allowed per run is 3 to 5 minutes, depending on the round",
    "Bot Requirements:",
    "Only fully autonomous robots are allowed; remote-controlled robots are not permitted",
    "Robots must run only on onboard power (no external power supply)",
    "Robot size must not exceed 20 × 20 × 10  (L × W × H) in cm",
    "Track length will be 15 to 20 meters, depending on the round",
    "Line width will be 20 to 25 mm",
    "Obstacles will be 10 cm cubes weighing 20 to 50 grams",
    "Ramp inclination will be 20 to 25 degrees",
    "Gaps in dashed lines will be 20 to 25 mm",
    ],
    coordinators: [
      { name: "Jayasri Rani S ", phone: "9360737144" },
      { name: "Pavithran S Y ", phone: "93456 93986" },
    ],
    fileCode: "FILE-006",
  },
  "bot-ba": {
    title: "BOT BA",
    description: [
      "Battle arena where machines clash in supernatural combat from another dimension.",
      "Build your warrior to dominate the arena and destroy all opposition.",
      "Only one will emerge victorious from the chaos of the Upside Down battleground.",
    ],
    rounds: [
      { name: "Round 1", description: "Qualifying Battles - Prove your bot's worth" },
      { name: "Round 2", description: "Semi-Finals - The survivors clash" },
      { name: "Round 3", description: "Grand Final - Champion crowned" },
    ],
    venue: "Robotics Arena - Ground Floor",
    dateTime: "March 1, 2025 — 3:00 PM to 7:00 PM",
    rules: [
      "Weight limit: 5kg maximum",
      "No projectiles or flammable materials",
      "Wireless control mandatory",
      "Safety inspection required before competition",
    ],
    coordinators: [
      { name: "Murray Bauman", phone: "9876543222" },
      { name: "Dmitri Antonov", phone: "9876543223" },
    ],
    fileCode: "FILE-007",
  },
  "design-event": {
    title: "DESIGN EVENT",
    description: [
      "Create visuals that transcend dimensions and bend reality to your artistic will.",
      "Channel the supernatural energy of the Upside Down into your designs.",
      "Show us visions that exist beyond the veil of ordinary perception.",
    ],
    rounds: [
      { name: "Round 1", description: "Theme Reveal - 2 hours to create" },
      { name: "Round 2", description: "Presentation - Defend your vision" },
    ],
    venue: "Design Studio - Block C",
    dateTime: "February 28, 2025 — 11:00 AM to 3:00 PM",
    rules: [
      "Software: Adobe Suite or Figma only",
      "Original artwork required",
      "Submit in PNG/PDF format",
      "Theme revealed at event start",
    ],
    coordinators: [
      { name: "Max Mayfield", phone: "9876543224" },
      { name: "Erica Sinclair", phone: "9876543225" },
    ],
    fileCode: "FILE-008",
  },
  quiz: {
    title: "QUIZ",
    description: [
      "Test your knowledge of the mysteries that lurk beyond ordinary understanding.",
      "Questions that probe the depths of technology, science, and the unknown.",
      "Only those with minds sharp as Demogorgon claws will prevail.",
    ],
    rounds: [
      { name: "Round 1", description: "Written Prelims - Top 20 qualify" },
      { name: "Round 2", description: "Buzzer Round - Quick-fire questions" },
      { name: "Round 3", description: "Final Showdown - The ultimate test" },
    ],
    venue: "Seminar Hall 2",
    dateTime: "March 1, 2025 — 11:00 AM to 1:00 PM",
    rules: [
      "Team size: 2 members",
      "No electronic devices allowed",
      "Questions in English only",
      "Judge's decision is final",
    ],
    coordinators: [
      { name: "Will Byers", phone: "9876543226" },
      { name: "Joyce Byers", phone: "9876543227" },
    ],
    fileCode: "FILE-009",
  },
  "non-tech-1": {
    title: "NON TECH 1",
    description: [
      "Activities from another dimension where technology takes a back seat.",
      "Challenge your mind and body in ways that defy conventional competition.",
      "The Upside Down has more mysteries than just circuits and code.",
    ],
    rounds: [
      { name: "Round 1", description: "Elimination Games" },
      { name: "Round 2", description: "Finals" },
    ],
    venue: "Open Air Theatre",
    dateTime: "February 28, 2025 — 4:00 PM to 6:00 PM",
    rules: ["Individual participation", "Comfortable clothing recommended", "Rules explained at venue", "Have fun!"],
    coordinators: [
      { name: "Hopper", phone: "9876543228" },
      { name: "Karen Wheeler", phone: "9876543229" },
    ],
    fileCode: "FILE-010",
  },
  "non-tech-2": {
    title: "NON TECH 2",
    description: [
      "More supernatural challenges await the brave souls who venture here.",
      "Leave your laptops behind and embrace the chaos of the unknown.",
      "Sometimes the greatest adventures require no technology at all.",
    ],
    rounds: [
      { name: "Round 1", description: "Team Challenges" },
      { name: "Round 2", description: "Individual Finals" },
    ],
    venue: "Sports Complex",
    dateTime: "March 1, 2025 — 4:00 PM to 6:00 PM",
    rules: ["Team size: 4 members", "Sportswear mandatory", "ID cards required", "Spirit of sportsmanship expected"],
    coordinators: [
      { name: "Bob Newby", phone: "9876543230" },
      { name: "Barb Holland", phone: "9876543231" },
    ],
    fileCode: "FILE-011",
  },
  tech: {
    title: "TECH",
    description: [
      "Technical challenges that push the boundaries of reality and possibility.",
      "Prove your mastery over machines and code in this ultimate test.",
      "The Upside Down rewards those who understand its technological secrets.",
    ],
    rounds: [
      { name: "Round 1", description: "Technical Quiz" },
      { name: "Round 2", description: "Hands-on Challenge" },
    ],
    venue: "Tech Hub - Main Hall",
    dateTime: "February 28, 2025 — 1:00 PM to 4:00 PM",
    rules: [
      "Individual participation",
      "Bring your own laptop",
      "Internet access provided",
      "Multiple domains covered",
    ],
    coordinators: [
      { name: "Dr. Brenner", phone: "9876543232" },
      { name: "Dr. Owens", phone: "9876543233" },
    ],
    fileCode: "FILE-012",
  },
  flagship: {
    title: "FLAGSHIP",
    description: [
      "The ultimate event. Face the Demogorgon of all challenges and emerge victorious.",
      "Every skill you possess will be tested in this legendary competition.",
      "Only the chosen ones will conquer the flagship and claim eternal glory.",
    ],
    rounds: [
      { name: "Round 1", description: "Qualifier - Survival of the fittest" },
      { name: "Round 2", description: "Semi-Final - The elite clash" },
      { name: "Round 3", description: "Grand Finale - Legend is born" },
    ],
    venue: "Main Auditorium",
    dateTime: "March 1, 2025 — All Day Event",
    rules: [
      "Team size: 3-5 members",
      "Multi-disciplinary challenges",
      "Surprise elements throughout",
      "Flagship trophy + cash prize for winners",
      "Registration closes 24 hours before event",
    ],
    coordinators: [
      { name: "Vecna", phone: "9876543234" },
      { name: "Mind Flayer", phone: "9876543235" },
    ],
    fileCode: "FILE-013",
  },
  "paper-presentation-1": {
    title: "UPSPIRE",
    description: [
     "Upspire, the Paper Presentation event of Technotronz’26, invites participants into an Upside Down of innovation and imagination. Inspired by sci fi themes, it explores communication systems, embedded tech, sustainability, and IoT. Through a two stage process, ideas evolve into impactful presentations, guided by expert feedback, creativity, and discussions as electrifying as Hawkins."
    ],
    rounds: [
      { name: "Round 1:Pitchkinz", description: "Pitchkinz, the initial screening phase of Upspire, requires teams to select an approved topic and submit a concise abstract outlining concept, objectives, and technical approach. Emphasizing clarity, originality, and relevance, submissions are reviewed for innovation and alignment, with only strong ideas advancing." },
      { name: "Round 2:Demodownz", description: "Demodownz, the final stage of Upspire, requires shortlisted teams to deliver a 8 minute structured presentation followed by a 2 minute Q&A session with the judges. Evaluation emphasizes innovation, technical depth, feasibility, clarity, and impact, with the most compelling presentations earning recognition." },
    ],
    venue: "Conference Room - Block A",
    dateTime: "February 7, 2026 - 9:00 AM to 12:00 PM",
    rules: [
      "Individual / Team of maximum 4 members",
      "Abstract submission deadline : 01/02/2026",
      "Submission mail id : technotronz26pp1iete@gmail.com",
      "For round 1:Only participants who have completed the general registration process will be considered for evaluation. Abstracts must be submitted within the specified deadline to qualify for shortlisting.",
     
    ],
   
  "topics": [
  "SignalSphere - Advancements in Long-Range Wireless Communication for Smarter Connectivity",
  "EtherLink Networks - Next-Generation Communication Protocols Enhancing Low-Power IoT Systems",
  "AeroComm Dynamics - Wireless Sensor Networks for Reliable Environmental Monitoring",
  "EmbedX Dynamics - Real-Time Embedded Architectures for Intelligent Control Systems",
  "ControlMatrix - Adaptive Embedded Control for Automation and Smart Devices",
  "GreenCircuit Solutions - Low-Power Electronic Design for Sustainable Technology",
  "IoT Nexus - Cloud-Connected IoT Platforms for Smarter Urban Innovations",
  "EcoSense Networks - IoT-Enabled Smart Monitoring for Environmental Conservation",
  "RenewEdge Systems - Embedded and IoT Approaches for Enhancing Renewable Energy Applications",
  "SustainGrid - Smart Energy Management Using Sensor Networks and Automation"
],
"mode": "Round 1: Online screening, Round 2: Offline",
    coordinators: [
      { name: "P. U. Jagadhish Kumaar ", phone: "9952513520" },
      { name: "Vishal ", phone: "8523944845" },
    ],
    fileCode: "FILE-014",
  },
  "paper-presentation-2": {
    title: "INQUISTA",
    description: [
     "Inquista is the Paper Presentation event of Technotronz’26, offering a dynamic platform for students to explore innovation through research, technical analysis, and creative problem-solving. The event focuses on both hardware and software domains through a structured two-round format, participants refine their concepts and present them before an experienced panel of judges, emphasizing originality, clarity, and technical depth."
    ],
    rounds: [
      { name: "Round 1 : Technix", description: "Technix, the preliminary screening round of Upspire, requires participants to choose an approved topic and submit an abstract detailing idea, objectives, and technical approach. Emphasizing clarity, relevance, feasibility, and innovation, only teams with strong foundational concepts are shortlisted for the next stage." },
      { name: "Round 2 : Explora", description: "Explora, the final round of Upspire, requires shortlisted teams to present their work in detail before judges. Each team delivers an 8 minute structured presentation followed by a 2 minute Q&A. Evaluation focuses on technical depth, clarity, presentation quality, and real world relevance." },
    ],
    venue: "Conference Room - Block B",
    dateTime: "February 7, 2026 - 9:00 AM to 12:00 PM",
    rules: [
      "Participation : Individual / Team of maximum 4 members",
      "Abstract submission deadline : 01/02/2026",
      "Submission mail id : technotronz26pp2iete@gmail.com",
      "For round 1:Only participants who have completed the general registration process will be considered for evaluation. Abstracts must be submitted within the specified deadline to qualify for shortlisting. ",
    ],
    "topics":["Artificial Intelligence - Basics and Real-World Applications","Machine Learning - Algorithms and Practical Applications","Cyber Security -Threats, Attacks, and Protection Techniques","Cloud Computing - Architecture and Service Models (IaaS, PaaS, SaaS)","Blockchain Technology - Secure and Decentralized Digital Systems","VLSI Design Flow - From Specification to Fabrication","5G Technology - Architecture, Features, and Applications","Internet of Things (IoT) - Architecture and Smart Applications","Sensors and Actuators - Core Building Blocks of Robotic Systems","PID Control Systems - Control of Mobile and Autonomous Robots"],
    "mode":"Round 1 - Online screening Round 2 - Offline",

    coordinators: [
      { name: "Rohini", phone: "8838619825" },
      { name: "Lijith", phone: "6382145569" },
    ],
    fileCode: "FILE-015",
  },
}

// Default event for unknown IDs
const defaultEvent = {
  title: "CLASSIFIED EVENT",
  description: [
    "This event file has been sealed by Hawkins National Laboratory.",
    "The contents remain classified until further notice from the Department.",
    "Unauthorized access will result in immediate termination of clearance.",
  ],
  rounds: [
    { name: "Round 1", description: "Information Redacted" },
    { name: "Round 2", description: "Information Redacted" },
  ],
  venue: "Location Classified",
  dateTime: "Date & Time TBD",
  rules: ["Clearance Level 4 required", "Non-disclosure agreement mandatory", "Await further instructions"],
  coordinators: [{ name: "Agent [REDACTED]", phone: "CLASSIFIED" }],
  fileCode: "FILE-XXX",
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = eventData[id] || defaultEvent

  // Server-side: Fetch session and user data using JWT
  const cookieStore = await cookies()
  const auth = getAuthFromCookies(cookieStore)
  let isRegistered = false
  let eventFeePaid = false
  const isAuthenticated = !!auth

  if (isAuthenticated && auth) {
    try {
      await connectDB()

      // Fetch user data by userId from JWT
      const user = await User.findById(auth.userId)
      
      if (user) {
        // Check if user is registered for this event
        isRegistered = user.eventsRegistered?.includes(id) || false

        // Fetch payment status
        const userPayment = await UserPayment.findOne({ userId: auth.userId })
        if (userPayment) {
          eventFeePaid = userPayment.eventFeePaid
        }
      }
    } catch (error) {
      console.error("[EventDetailsPage] Error fetching user data:", error)
      // Continue with default values on error
    }
  }

  return (
    <EventDetailsClient
      eventId={id}
      event={event}
      isRegistered={isRegistered}
      eventFeePaid={eventFeePaid}
      isAuthenticated={isAuthenticated}
    />
  )
}
