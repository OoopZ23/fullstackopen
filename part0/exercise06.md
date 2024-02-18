```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
Note right of browser: Payload: {content: "who am I", date: "2024-02-13T10:37:27.684Z"}
    server-->>browser: Response: {"message":"note created"}
    deactivate server
```
