# Ramadhan Ibadah Tracker

A beautiful, full-stack React web application to help Muslims track their ibadah (worship) consistently throughout 30 days of Ramadhan. Features an AI-powered Todo Generator using Groq API.

## Features

- 📱 **Daily Ibadah Tracking** - Track 6 core ibadah: Puasa, Sholat, Tarawih, Tadarus, Sedekah, Dzikir
- 📊 **Progress Visualization** - Charts and progress bars showing your consistency
- 📅 **30-Day Calendar** - Visual calendar view with color-coded completion status
- 🔥 **Streak Tracker** - Track your daily consistency streak
- 🤖 **AI Todo Generator** - Generate Ramadhan-related todo lists using Groq AI
- 💾 **Offline Support** - All data stored locally using localStorage
- 📱 **Mobile-First Design** - Beautiful, responsive UI optimized for mobile devices

## Tech Stack

- **React** - Functional components with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart visualization library
- **date-fns** - Date manipulation utilities
- **lucide-react** - Icon library
- **groq-sdk** - AI integration for todo generation
- **localStorage** - Client-side data persistence

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ramadhan-ibadah-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (server):
```bash
copy env.template .env
```

Edit `.env` and add your Groq API key (DO NOT put this in client-side `VITE_` env vars):
```
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from [Groq Console](https://console.groq.com/)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BottomNav.jsx
│   ├── IbadahCard.jsx
│   ├── ProgressBar.jsx
│   └── StreakBadge.jsx
├── pages/              # Page components
│   ├── LandingPage.jsx
│   ├── SetupPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProgressPage.jsx
│   ├── CalendarPage.jsx
│   ├── SummaryPage.jsx
│   └── AITodoPage.jsx
├── hooks/              # Custom React hooks
│   └── useRamadhanData.js
├── utils/              # Utility functions
│   ├── storage.js      # localStorage operations
│   └── ai.js           # Groq AI integration
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Usage

### Initial Setup

1. On first launch, you'll see the landing page
2. Click "Mulai Sekarang" to start setup
3. Select your Ramadhan start date
4. Set targets for each ibadah (default: 30 days for most)
5. Start tracking!

### Daily Tracking

- Navigate to Dashboard to check off completed ibadah
- Tap any ibadah card to toggle completion
- View your daily progress summary at the top

### AI Todo Generator

1. Go to "AI Todo" tab
2. Enter a prompt (e.g., "Buatkan saya todo Ramadhan hari ini")
3. Click "Generate dengan AI"
4. Review the generated todos
5. Click "Import ke Tracker" to add them to today's log

The AI will automatically map tasks to ibadah:
- Tasks mentioning "puasa" → Puasa
- Tasks mentioning "sholat" → Sholat
- Tasks mentioning "tarawih" → Tarawih
- etc.

Other tasks will be added to "Extra Todos"

### Viewing Progress

- **Progress Tab**: See detailed progress bars and charts for each ibadah
- **Calendar Tab**: Visual 30-day grid with color-coded completion
- **Summary Tab**: End-of-Ramadhan report with overall statistics

## Data Storage

All data is stored locally in your browser's localStorage under the key `ramadhan_tracker_data`. No backend or database required!

Data structure:
```json
{
  "setupComplete": true,
  "ramadhanStartDate": "2025-03-01",
  "targets": {
    "puasa": 30,
    "sholat": 30,
    "tarawih": 30,
    "tadarus": 30,
    "sedekah": 15,
    "dzikir": 30
  },
  "dailyLogs": {
    "2025-03-01": {
      "puasa": true,
      "sholat": true,
      "tarawih": false,
      "tadarus": true,
      "sedekah": false,
      "dzikir": true,
      "extraTodos": []
    }
  }
}
```

## Design

- **Color Scheme**: Dark green (#1a3a2a) base with gold (#d4a843) accents
- **Typography**: Playfair Display (headings) + Lato (body)
- **Animations**: Smooth fade-ins, checkbox animations, progress bar fills
- **Theme**: Premium Islamic journaling app aesthetic

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Notes

- The app works offline except for the AI Todo Generator feature (requires internet for Groq API)
- Data persists across browser sessions via localStorage
- Reset functionality available in Summary page
- Mobile-first responsive design

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

