# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - link [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
    - generic [ref=e121]:
      - button "RESTART" [ref=e122] [cursor=pointer]
      - button "PAUSE" [ref=e123] [cursor=pointer]
      - generic [ref=e124]: 0 Move
      - generic [ref=e125]: 00:00:01
  - generic:
    - generic:
      - generic:
        - button "Toggle Nuxt DevTools":
          - img
        - generic "Page load time":
          - generic: "533"
          - generic: ms
        - button "Toggle Component Inspector":
          - img
```