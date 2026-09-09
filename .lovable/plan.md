# Dense hotel workspace update

## What will change

- Turn Health, Identity, People, Legal & billing, Service, and Links into true content tabs. Only the selected cluster will render, so People and Legal open at the top of the workspace without scrolling.
- Replace the three healthy-state diagnostic cards with one compact status strip summarizing overall health, feature coverage, and latest sync. Onboarding, unhealthy, churned, and sparse records will continue to show the expanded health, connection, and onboarding detail.
- Remove the duplicate global “Edit hotel” controls. Each tab will expose only the edit action for the data currently shown.
- Convert quick actions into a compact sticky toolbar beneath the page header/tabs. Keep the most-used actions first, and make Hotel emails open an inline list with copy controls.
- Remove explanatory card subtitles and tighten label/value rows and panel spacing for higher daily-use density.
- Add honest unavailable states for actions such as OTP and status checks on records where they do not apply. Keep “Check hotel status” visible as a prototype action, with a code note that ticket 30282 is not yet shipped.

## State behavior

- **Active / healthy:** compact green summary strip; expanded diagnostic cards hidden by default with a clear “View details” action.
- **Onboarding, mixed/unhealthy, churned, sparse:** expanded health, connection, and onboarding information shown immediately on the Health tab.
- **Hotel emails:** popover lists available contacts and copy buttons; empty hotels show an unavailable state rather than navigating elsewhere.
- **OTP:** unavailable for churned or sparse records; other states keep the existing retrieval interaction.

## Technical details

- Replace scroll-position tab tracking and anchor scrolling with local active-tab state and conditional rendering.
- Reuse the existing dialogs, status calculations, scenario switcher, and semantic design tokens.
- Keep the main application header sticky; place the tabs and quick actions in the sticky workspace area without overlapping content on desktop or mobile.
- Validate all five scenario states at desktop and mobile sizes, including tab switching, sticky behavior, email copying, and action disabled states.
