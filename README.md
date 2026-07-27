# Fro (Frocus OS)

Frocus is a productivity system that helps user live a life user always wanted to live. Frocus aims at delivering the most productive ecosystem to the user to stop them from procastinating. Among, the ecosystem;

FRO OS is a WebOS that anyone with Desktop/Laptop/Bigger Device can use and get to use features like Task system, Event management system, Note system, Productive Pomodoro sessions, Motivating Quotes, Weather insights to plan physical schedules (like touching grass, gym, exercise, jogging), Music app for listening to calm and peaceful music while working, Filesystem to organize notes, works, files, musics, code files, Browser for searching anything (and getting AI summary, Images, and Best links) as well as browsing productive sites (like wikipedia, gutenberg, desmos, zenpen, excalidraw, etc), calculator for calculating simple arithmetics to complex trigonometric functions (with keyboard shortcuts & memory), Terminal for fast operations (for devs), Launcher for customizations.

## Tech Stack

- Tanstack Start
- React (w/ compiler)
- Tailwind CSS
- Zustand (w/ immer)
- React-RND
- Biome
- Shadcn
- Mathjs
- React (Youtube, Markdown, Dropzone)
- Chrono-node & ms
- Tavily
- ffmpeg

## Apps

1. Frotes (Tab system, Task system, Markdown support, Multi-Tab, Storage system)
2. Frottings (for Wallpaper change)
3. Frowser (Search via tavily, and browse via Iframe containerization)
4. Frominal (with dozens of commands like ls, open [app], calc, type, fetch, hash, geo, random, note, task.[add | read | done], event.[add | read], append, write, etc)
5. Froculator (Complex arithmetic & trigonometric calculations with memory system and shorcuts)
6. Frolendar (Event Management System featuring Day, Month, and Year view, with selection time blocking, drag n drop events)
7. Frosic (Create your own playlist and Play youtube & local musics)
8. Frotore (Add more widget instances)
9. Froxplorer (Create, Read, Update, Delete, Drag n Drop, Upload, Move, Add to desktop, the files, folders, and open or edit their content)
10. Froncher (Launch any App, or Games (Supports HTML, CSS, JS and even some APIS via file with .html extension in Froxplorer))

## Launcher (Froncher)

1. FypeMaster (Type at the speed close to 99.99% of c)
2. Froview (Witness the pixels)
3. Frowebview (Witness the power of markups)
4. NOTFOUND (Are you f*#king kidding me? I meant Froking)

## Froxplorer's Filesystem and App system (Froncher or Other APP) supported extensions

- "calc": Calculator (Froculator) App associated
- "mp3", "wav", "frosic": Music (Frosic) App associated
- "md", "txt", "frote", "task", "todo": Note (Frote) App associated
- "script", "fromine", "brainfrok": Terminal (Frominal) App associated
- "png", "jpg", "jpeg", "svg": Image viewer (Froview) App associated
- "ftml", "ftm", "htm", "html": Web viewer (Frowebview) App associated
- "frocus", "fro": App Launcher (Froncher) associated
- "frowse": Browser (Frowser) associated

## Widgets

1. Weather (Shows the current weather through openweathermap)
2. Clock (Shows the current time)
3. Quote (Shows random quotes through zenquotes)
4. Tasks (Shows the tasks)
5. Pomodoro (Starts pomodoro timer)
6. Events (Shows the upcoming events)

## Get started with contribution

Step 1: Clone
```bash
git clone https://github.com/BurningFlamesss/fro
```

Step 2: Install deps
```bash
npm i
```

Step 3: Rename `.env.example` to `.env.local` and change the variables

Step 4: Run either the dev server or the production server
```bash
npm run dev
npm run build
```

Step 5 (Optional): 
1. If you want to add a widget or application:
- Goto src/widgets or src/apps to create own widget or application and then,
- Register that in /src/constants/widgets and /src/constants/widgetsAppDefinition (for widgets) or /src/constants/apps (for application),
2. Else, you can also goto /src/store/launcher to add your Froncher compatible application.

## AI Declarations

- to ideate about the data structure to be use for the apps and windows, to use react-rnd to manage the maximum viewport a window could occupy, to make the preview of window cheap in computation, to make the drag n drop of the apps from taskbar to desired position working efficiently
- to have a starting point for the UI of Frotting, Frowser, and Frosic
- to make the frolendar app work seemlessly with the selected time block, and event management properly
- in froxplorer to make the upload of the file and folder logic intact
- to resolve and add the working logic for YouTube music in Frosic
- Widgets drag n drop functionality
- to investigate the issue of the todo tasks, note and fs not working properly but eventually I found an elegant solution so it's not actually AI that did the task

- **The place where I used excessively is Frolendar (Calendar) and Frosic (Music Player).** 

I had also stated the AI Generated code in the commit message as well as in the top of the file (if applicable).
I may have used AI on approximately 3-4 hours of my project.