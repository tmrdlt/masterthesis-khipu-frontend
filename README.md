# Khipu
Khipu is a Kanban board-based task management tool developed by Timo Erdelt for his __Masters Thesis__ at the Institute for Informatics,
Ludwig-Maximilian University of Munich. The repository contains the frontend written in TypeScript. 

- The backend can be found [here](https://github.com/tmrdlt/masterthesis-khipu).
- The tool was evaluated in a user study. The evaluation can be found [here](https://github.com/tmrdlt/masterthesis-evaluation).


## Libraries used

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [react-datepicker](https://github.com/Hacker0x01/react-datepicker)
- [react-tabs](https://reactcommunity.org/react-tabs/)
- [react-popper-tooltip](https://popper.js.org/react-popper/v2/)
- [react-textarea-autosize](https://github.com/Andarist/react-textarea-autosize)
- [axios](https://github.com/axios/axios)
- [swr](https://swr.vercel.app/)
- [immer](https://immerjs.github.io/immer/)
- Icons from [heroicons](https://heroicons.com/)

## Requirements
- Node.js v16.xx.x (can be installed via [nvm](https://github.com/nvm-sh/nvm)):
  ```bash
  nvm install
  nvm use
  ```

## Development
- Run dev server on `http://localhost:3000/`:
```bash
npm run dev
```

- Expose via cloudflared tunnel:
  - (if not already installed) `brew install cloudflare/cloudflare/cloudflared`
  - Replace host in `workflow-api.ts` with cloudflared backend link 
  - `cloudflared tunnel --url http://localhost:3000`
