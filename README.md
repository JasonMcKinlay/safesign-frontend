# SafeSign

SafeSign is a mobile real-time, ultra-low latency ASL translation service created for medical emergencies and crisis aversion.

The `safesign-frontend` repository functions as the main front-end for the application.

***Notice**: SafeSign is currently a work-in-progress; we are excited for the future and can't wait to implement full functionality with our custom-built machine learning model, TTS capabilities, and more.* 

## Intended Features

- **High-Speed Translation**: SafeSign uses your mobile camera and our machine learning model for deaf and hard-of-hearing (DHH) individuals and first responders alike to translate real ASL gestures quickly.
- **Live Transcript:** An active chat-log of the entire conversation is kept, with every next sentence being added in order to minimize miscommunication and provide context to others.
- **Offline Only:** SafeSign stays offline and doesn't require an internet connection; no matter where you are in times of need, SafeSign's functionality is there for you.
- **Dual-Mode Conversation:** In addition to ASL translation, spoken English will automatically be detected and typed on-screen to allow for conversations between both parties to flow as quickly and realistically as possible.
- **Text-to-Speech:** Translations will play text-to-speech (TTS) audio for the other speakers in the conversation to quickly hear the live ASL translations.
- **Accessibility & Settings**: In-app settings allow users to customize text size and other features to increase accessibility for all users.

## Tech Stack

- Next.js
- Tailwind CSS
- TypeScript
- MediaPipe
