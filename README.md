# Fro (Frocus OS)

Frocus is a productivity system that helps user live a life user always wanted to live. Frocus aims at delivering the most productive ecosystem to the user to stop them from procastinating. Among, the ecosystem;

FRO OS is a WebOS that anyone with Desktop/Laptop/Bigger Device can use and get to use features like Task system, Event management system, Note system, Productive Pomodoro sessions, Motivating Quotes, Weather insights to plan physical schedules (like touching grass, gym, exercise, jogging), Music app for listening to calm and peaceful music while working, Filesystem to organize notes, works, files, musics, code files, Browser for searching anything (and getting AI summary, Images, and Best links) as well as browsing productive sites (like wikipedia, gutenberg, desmos, zenpen, excalidraw, etc), calculator for calculating simple arithmetics to complex trigonometric functions (with keyboard shortcuts & memory), Terminal for fast operations (for devs), Launcher for customizations.

## Demo

[DEMO](https://drive.google.com/file/d/1kFF960pYAocFQeoBA-b5GE7_vaI3kfDo/view?usp=sharing)

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
   <img width="764" height="514" alt="image" src="https://github.com/user-attachments/assets/e6cfc13d-2753-484e-934a-44c965d90bad" />

2. Frottings (for Wallpaper change)
   <img width="767" height="510" alt="image" src="https://github.com/user-attachments/assets/41a3ae59-cc2f-4d2d-881f-bb97b3b12eb3" />

3. Frowser (Search via tavily, and browse via Iframe containerization)
   <img width="751" height="507" alt="image" src="https://github.com/user-attachments/assets/42a62ee0-0387-499c-b5f7-100a5c2a44bf" />

4. Frominal (with dozens of commands like ls, open [app], calc, type, fetch, hash, geo, random, note, task.[add | read | done], event.[add | read], append, write, etc)
   <img width="750" height="500" alt="image" src="https://github.com/user-attachments/assets/84241afa-9f4a-4602-bdfb-0c44232d570b" />

5. Froculator (Complex arithmetic & trigonometric calculations with memory system and shorcuts)
    <img width="744" height="506" alt="image" src="https://github.com/user-attachments/assets/72aef0ae-569d-426c-8c6f-14f2ffa77bcc" />

6. Frolendar (Event Management System featuring Day, Month, and Year view, with selection time blocking, drag n drop events)
    <img width="754" height="499" alt="image" src="https://github.com/user-attachments/assets/3a7fd3f3-c4c5-40cf-b1d9-d208490cac84" />

7. Frosic (Create your own playlist and Play youtube & local musics)
    <img width="754" height="500" alt="image" src="https://github.com/user-attachments/assets/a30c3b34-49ae-45f1-9357-9b986db6c297" />

8. Frotore (Add more widget instances)
    <img width="755" height="504" alt="image" src="https://github.com/user-attachments/assets/c11542f2-f001-4ae3-8f10-c038fa8e6017" />

9. Froxplorer (Create, Read, Update, Delete, Drag n Drop, Upload, Move, Add to desktop, the files, folders, and open or edit their content)
    <img width="750" height="501" alt="image" src="https://github.com/user-attachments/assets/36ea4e7f-ec80-4d65-aa2f-0a24ad724b85" />

10. Froncher (Launch any App, or Games (Supports HTML, CSS, JS and even some APIS via file with .html extension in Froxplorer))
    <img width="759" height="499" alt="image" src="https://github.com/user-attachments/assets/aafe0c2e-41da-4a3e-94f5-d51df123979b" />

---


## Launcher (Froncher)

<img width="1520" height="765" alt="image" src="https://github.com/user-attachments/assets/8aed9bd4-478f-4d18-a931-0f73ce92308d" />

---

1. FypeMaster (Type at the speed close to 99.99% of c)
2. Froview (Witness the pixels)
3. Frowebview (Witness the power of markups)
4. NOTFOUND (Are you f*#king kidding me? I meant Froking)

---

## Froxplorer's Filesystem and App system (Froncher or Other APP) supported extensions

- "calc": Calculator (Froculator) App associated
- "mp3", "wav", "frosic": Music (Frosic) App associated
- "md", "txt", "frote", "task", "todo": Note (Frote) App associated
- "script", "fromine", "brainfrok": Terminal (Frominal) App associated
- "png", "jpg", "jpeg", "svg": Image viewer (Froview) App associated
- "ftml", "ftm", "htm", "html": Web viewer (Frowebview) App associated
- "frocus", "fro": App Launcher (Froncher) associated
- "frowse": Browser (Frowser) associated

---

## Widgets

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/2cdd2896-a869-4062-b5ae-45c3846fde90" />

---

1. Weather (Shows the current weather through openweathermap)
2. Clock (Shows the current time)
3. Quote (Shows random quotes through zenquotes)
4. Tasks (Shows the tasks)
5. Pomodoro (Starts pomodoro timer)
6. Events (Shows the upcoming events)

---

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
