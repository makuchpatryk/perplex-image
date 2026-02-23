# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - link [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
    - generic [ref=e8]:
      - generic [ref=e9]: A tile-sliding picture game.
      - generic [ref=e10]: Rearrange tiles by dragging to put the image together.
      - generic [ref=e11]:
        - img [ref=e12]
        - generic [ref=e13]:
          - button "Shuffle picture" [ref=e14] [cursor=pointer]:
            - paragraph [ref=e15]: Shuffle picture
            - img [ref=e16]
          - button "Choose manually" [ref=e18] [cursor=pointer]
          - generic [ref=e19]:
            - generic [ref=e21] [cursor=pointer]: 9x13
            - generic [ref=e23] [cursor=pointer]: 15x23
            - generic [ref=e25] [cursor=pointer]: 18x26
      - button "Play" [ref=e26] [cursor=pointer]
  - generic:
    - generic:
      - generic:
        - button "Toggle Nuxt DevTools":
          - img
        - generic "Page load time":
          - generic: "157"
          - generic: ms
        - button "Toggle Component Inspector":
          - img
```