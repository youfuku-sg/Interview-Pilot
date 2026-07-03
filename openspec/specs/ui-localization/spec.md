## Purpose

Interview Pilot targets Japanese-speaking users exclusively. The application UI is displayed entirely in Japanese, in place, without a runtime language-switching mechanism.

## Requirements

### Requirement: Japanese-only UI text
The application SHALL display all user-facing text — JSX-rendered copy, `placeholder`/`title`/`aria-label`/`alt` attributes, toast/notification messages, and validation/error messages — in Japanese, with no runtime language-switching mechanism.

#### Scenario: Viewing any screen
- **WHEN** a user navigates to any page or component in the application (e.g. dashboard, settings, app/recording screens, dialogs)
- **THEN** every piece of user-facing text on that screen is rendered in Japanese

#### Scenario: Interacting with form controls
- **WHEN** a user views an input, button, tooltip, or menu item
- **THEN** its visible label, placeholder text, and accessible name (`title`/`aria-label`) are in Japanese

#### Scenario: Triggering a toast or error message
- **WHEN** the application shows a toast notification, dialog message, or validation/error message in response to a user action
- **THEN** the message text is in Japanese

### Requirement: Non-UI text remains unaffected
The localization SHALL NOT change developer-facing text that is not rendered to end users, including source code comments, console/log output, and internal identifiers.

#### Scenario: Reviewing source after localization
- **WHEN** a developer inspects the codebase after the localization change
- **THEN** code comments, log statements, and non-UI identifiers remain in their original (English) form
