# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - link [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
    - generic [ref=e139]:
      - button "RESTART" [ref=e140] [cursor=pointer]
      - button "PAUSE" [ref=e141] [cursor=pointer]
      - generic [ref=e142]: 0 Move
      - generic [ref=e143]: 00:00:05
  - generic:
    - generic:
      - generic:
        - button "Toggle Nuxt DevTools":
          - img
        - generic "Page load time":
          - generic: "350"
          - generic: ms
        - button "Toggle Component Inspector":
          - img
```