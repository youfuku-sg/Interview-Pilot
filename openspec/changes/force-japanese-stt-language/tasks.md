## 1. STT Request Behavior

- [ ] 1.1 Update `fetchSTT` multipart/form-data request construction to append `language=ja` when no explicit language field is present.
- [ ] 1.2 Ensure explicit provider language settings are preserved and not overwritten during form construction.
- [ ] 1.3 Keep binary and JSON request handling compatible with existing providers.

## 2. Provider Templates and UI

- [ ] 2.1 Update bundled STT provider curl templates to use Japanese language codes (`ja` / `ja-JP`) where supported.
- [ ] 2.2 Update Dev Space STT custom-provider placeholder/example to include `language=ja` for OpenAI-compatible transcription endpoints.
- [ ] 2.3 Review Japanese UI copy around STT setup so the Japanese-fixed default is understandable.

## 3. Verification

- [ ] 3.1 Add or update focused tests/checks for STT form construction with and without an existing language field if an appropriate test harness exists.
- [ ] 3.2 Run `npm run typecheck` to confirm TypeScript changes compile.
- [ ] 3.3 Run `npm run build` or the nearest available build check to confirm the app still builds.
- [ ] 3.4 Manually verify, with a local OpenAI-compatible STT endpoint or request inspection, that long Japanese audio transcription requests include `language=ja`.
