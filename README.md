# AI Writer

A modern, elegant story writing application built with Next.js 16, React 19, and TipTap rich text editor. AI Writer helps you craft stories with organized chapters, characters, places, and items.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwind-css)

## Features

- 📝 **Rich Text Editor** - Powered by TipTap with a clean, distraction-free writing experience
- 📚 **Chapter Management** - Organize your story into structured chapters
- 🎭 **Story Elements** - Track characters, places, items, and other story entities
- 🎨 **Beautiful UI** - Modern design with smooth animations and dark mode support
- ⚡ **Real-time Updates** - See your changes instantly as you write
- 🔧 **Customizable Toolbar** - Access formatting tools when you need them

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Editor**: TipTap (rich text editor)
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-writer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start writing.

## Project Structure

```
ai-writer/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── favicon.ico        # Application icon
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Editor.tsx         # Main editor component
│   ├── ModelSelector.tsx  # Model selection UI
│   ├── StoryPanel.tsx     # Story management panel
│   └── Toolbar.tsx        # Editor toolbar
├── context/               # React Context providers
│   └── StoryContext.tsx   # Story state management
├── types/                 # TypeScript type definitions
│   └── story.ts           # Story-related types
├── public/                # Static assets
└── ...config files        # Configuration files
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Usage

### Writing Your Story

1. Click on the editor area to start writing
2. Use the toolbar for formatting options (bold, italic, lists, etc.)
3. Create new chapters using the Story Panel
4. Manage your story elements (characters, places, items) in the sidebar

### Keyboard Shortcuts

The editor supports standard rich text keyboard shortcuts:
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline
- And more...

## Configuration

### Tailwind CSS

This project uses Tailwind CSS v4 with the new configuration format. Custom styles are defined in `app/globals.css`.

### TypeScript

TypeScript configuration is located in `tsconfig.json`. The project uses strict type checking for better code quality.

### ESLint

ESLint configuration is in `eslint.config.mjs` following Next.js recommended settings.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [TipTap Documentation](https://tiptap.dev/docs) - Explore TipTap editor capabilities
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Master Tailwind CSS
- [React Documentation](https://react.dev/) - Deep dive into React

## Deploy on Vercel

The easiest way to deploy your AI Writer app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to a Git repository
2. Import your project to Vercel
3. Vercel will detect Next.js and configure the build automatically

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and TipTap
