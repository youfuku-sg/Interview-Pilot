## ADDED Requirements

### Requirement: Main overlay window is always draggable by mouse
The main overlay window's grip handle SHALL be draggable with the mouse to reposition the window, regardless of `hasActiveLicense` state. Since this fork has no license-activation flow and `hasActiveLicense` is always `false`, dragging MUST NOT be conditioned on that flag.

#### Scenario: User drags the window from the grip handle
- **WHEN** the user presses the mouse button on the grip handle in the main overlay and moves the mouse
- **THEN** the window follows the mouse movement (native OS window drag), regardless of license state

#### Scenario: No license-required prompt on the grip handle
- **WHEN** the user clicks the grip handle
- **THEN** no "有効なライセンスが必要です" popover or license-purchase call-to-action is shown
