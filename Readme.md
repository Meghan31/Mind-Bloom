# **Mental Health Affirmation Journal**

## **Overview**

The **Mental Health Affirmation Journal** is a web-based platform aimed at promoting mindfulness and self-reflection through daily affirmations and journaling. The project is designed to foster a simple, yet powerful daily habit, providing users with a space to reflect on their emotions and boost mental well-being. Rather than being a full mental health application, it focuses on a straightforward, accessible approach to self-care.

## **Key Features (MVP)**

### **1. Daily Affirmations**

- Users receive a **new affirmation or inspirational quote** every 24 hours.
- Affirmations are dynamically selected from a curated database, offering variety and relevance.
- **Personalized affirmations** tailored to the user's mood rating.

### **2. Private Journal Entries**

- Users can write **private journal entries** to express and reflect on their emotions.
- Entries are **only visible to the logged-in user** for privacy.
- **Editing and deletion** of journal entries are allowed only within **24 hours** of creation.

### **3. Calendar View**

- A **visual representation of journal entries** across days, providing users with a holistic view of their emotional journey.
- Users can browse through past entries, fostering deeper self-reflection.

## **User Flow**

### **Authentication**

- **Registration Page**: New users can create an account to start their journaling journey.
- **Login Page**: Existing users can log in to access their private journal and affirmations.

### **Home Page**

- Users are prompted to **rate their mood** on a 5-star scale (1 = very sad, 5 = very happy).
- Based on the mood rating:
  - **Low mood (1-2)** → A **cheerful affirmation** is provided to help uplift the user.
  - **High mood (4-5)** → A **happy affirmation** reinforces their positivity and well-being.
- The home page also features the **Journal Section**, where users can record their thoughts.

### **Navigation**

- The **Navbar** includes a link to the **Calendar View**, allowing users to easily navigate and revisit past journal entries.

---

## **API Endpoints**

### **Authentication Routes**

- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Authenticate user and return a JWT token for session management.

### **Journal Routes**

- `POST /api/journal` – Create a new journal entry. _(Accessible from the Journal Section.)_
- `GET /api/journal` – Retrieve all journal entries for the logged-in user. _(Displayed in the Calendar View.)_
- `GET /api/journal/:id` – Fetch a specific journal entry by ID. _(Displayed in the Calendar View.)_
- `PUT /api/journal/:id` – Edit an entry (allowed only within **24 hours** of creation). _(Available in the Journal Section.)_
- `DELETE /api/journal/:id` – Delete an entry (allowed only within **24 hours** of creation). _(Available in the Journal Section.)_

### **Affirmation Routes**

- `GET /api/affirmation/random` – Returns a **random affirmation** before the user makes a journal entry.
- `GET /api/affirmation/today` – Returns the **daily affirmation** after a journal entry is submitted.

---

## **Technology Stack**

### **Frontend**

- **Vite**: A fast and modern build tool for a streamlined development experience.
- **React (TypeScript)**: A flexible and scalable UI library for building the front-end with type safety.

### **Backend**

- **Node.js** with **Express**: For implementing the backend services, including authentication, journal management, and affirmations.
- **JWT**: For managing user authentication and session control.
- **Knex.js** and **PostgreSQL**: For efficient database management, particularly for storing user journal entries.

---
