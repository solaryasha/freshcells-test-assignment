# Login & Account Details Application

This project implements a simple web application with two core screens: a **Login Screen** and an **Account Details Screen**. It demonstrates user authentication, data fetching via GraphQL, and incorporates several best practices for a robust and user-friendly experience.

---

## Features

* **Login Screen:**
    * Input fields for **Email** and **Password**.
    * **Client-side validation** for email format (required) and password (required).
    * Triggers a **GraphQL mutation** with provided credentials upon successful validation.
    * Handles **backend errors** gracefully (e.g., incorrect credentials).
    * Navigates to the Account Screen upon successful login.

* **Account Screen:**
    * Displays the logged-in user's **First Name** and **Last Name** in non-editable fields.
    * Fetches user data using a **GraphQL query**.
    * **Logout button** that clears user session and returns to the Login Screen.

---

## Preferences Implemented

The following "plus" preferences were integrated into the application:

### 1. TypeScript

The entire application is developed using **TypeScript**, providing static type checking, improved code readability, and better maintainability. This helps catch errors early in the development cycle and enhances the overall developer experience.

### 2. SPA Navigation

The application utilizes **Single Page Application (SPA) navigation** with the React Router v7. Transitions between the Login and Account screens are smooth and do not require full page reloads, providing a faster and more fluid user experience. This is achieved using a routing mechanism that dynamically renders components based on the application's state or URL.

### 3. Localization

The application includes basic **localization support** with the React i18n package. Text elements (e.g., button labels, error messages) are managed through a localization framework, allowing for easy translation into multiple languages. While only English might be present by default, the architecture supports adding more locales effortlessly.

### 4. Uncaught Error Handling

A global **uncaught error handling mechanism** is in place. This ensures that unexpected runtime errors are gracefully caught, logged, and potentially presented to the user in a user-friendly manner, preventing the application from crashing silently.

### 5. UX Feedback (Loading States, Error Notifications)

Comprehensive UX feedback is provided to the user:

* **Loading States:** Visual indicators (e.g., spinners, disabled buttons) are displayed during asynchronous operations (like login or data fetching) to inform the user that an action is in progress.
* **Error Notifications:** Clear, non-intrusive error messages are displayed to the user for both client-side validation failures and backend API errors (e.g., "Invalid email format," "Incorrect credentials," "Network error"). These notifications are typically transient and user-friendly.

### 6. Clean UI

The user interface is designed with Material UI. A minimalist aesthetic, consistent spacing, legible typography, and intuitive layouts contribute to a pleasant user experience. The design prioritizes usability and clarity over excessive visual complexity.

### 7. Unit Tests

The codebase includes **unit tests** written using react-testing-library and jest  for critical components and functionalities. These tests ensure the reliability of the validation logic, GraphQL interactions (mocked), and component rendering, contributing to a stable and maintainable application.

---

## Getting Started

To set up and run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd [project-directory]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure GraphQL Endpoint:**
    * Ensure your GraphQL endpoint is correctly configured in the application's environment variables or configuration file.

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or a similar port).
