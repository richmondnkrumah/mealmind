
<div align="center">
  <img src="[YOUR_LOGO_URL]" alt="MealMind Logo" width="150"/>
  <h1>MealMind</h1>
  <p><strong>An AI-powered meal prep assistant, currently under active development.</strong></p>
  
  <p>
    <img alt="Status" src="https://img.shields.io/badge/status-in%20progress-yellow"/>
    <img alt="License" src="https://img.shields.io/badge/license-MIT-blue"/>
    <img alt="Contributions" src="https://img.shields.io/badge/contributions-welcome-orange"/>
  </p>
</div>

<br>

<div align="center">
  <!-- INSTRUCTION: Replace this with a GIF of the current app state. -->
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBoY2o1ZzU5bnBtc2M2emJiaXU4emc4bmEwZW1oNHNzbjc2aDlkcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyE/giphy.gif" alt="MealMind App Current Progress" width="300"/>
</div>

---

## 🎯 The Vision: Solving "What's for Dinner?"

The goal of MealMind is to leverage modern AI to restore calm and intention to the kitchen. This repository documents the journey of building an intelligent system that automates the most tedious parts of meal planning—from recipe discovery to smart shopping lists.

**This is a living project.** The features and setup instructions will evolve. The goal is to build transparently, sharing the process of creating a full-stack, AI-powered mobile application from the ground up.

## ✨ Feature Roadmap

This project is being built iteratively. Here is a look at the current features and what's planned next.

#### ✅ **Core Features (Implemented)**
*   **User Onboarding Flow:** A smooth, 3-step introduction to the app's value.
*   **Authentication:** Secure user sign-up and login using Supabase Auth.
*   **UI Foundation:** A robust 5-tab navigation structure built with Expo.
*   **Profile Management:** Basic user profile creation and preference storage in PostgreSQL.

#### 🚀 **Up Next (In Progress & Planned)**
*   **AI Meal Plan Generation:** Integrating with a Text AI to generate the first meal plans.
*   **AI Vision Pantry Scanner:** Integrating the Clarifai API to enable inventory scanning.
*   **Smart Shopping List Logic:** Building the system to compare the meal plan with the pantry.
*   **Plan History:** Saving and viewing previously generated meal plans.

## 🛠️ Tech Stack

MealMind is being built on a modern, full-stack serverless architecture.

| Component | Technology |
| :--- | :--- |
| **Mobile Frontend** | Expo (React Native), TypeScript |
| **Backend & Auth** | Supabase (Auth, Postgres, Storage) |
| **Serverless Logic** | Supabase Edge Functions (Deno) |
| **Vision AI** | Clarifai API |
| **Text Generation** | OpenAI GPT API |

## 🚀 Initial Setup

> **Note:** As this project is under active development, these steps may change. This guide covers the initial setup to get the foundational app running.

### Prerequisites

*   Node.js (v18 or higher) & NPM/Yarn
*   Supabase Account & CLI

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mealmind.git
    cd mealmind
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Supabase:**
    *   Link your project using the Supabase CLI: `supabase link --project-ref <your-project-ref>`
    *   Push the initial database schema: `supabase db push`

4.  **Environment Variables:**
    *   Create a `.env` file by copying `.env.example`.
    *   Fill in your Supabase URL and Anon Key. This is all that's needed to run the UI and authentication.
    ```
    EXPO_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    EXPO_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

5.  **Run the application:**
    ```bash
    npx expo start
    ```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! As this project is a learning journey, feedback from the community is highly encouraged. Please feel free to open an issue to discuss what you would like to change.

