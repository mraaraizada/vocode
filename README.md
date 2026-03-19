#  VOCODE - AI-Powered No-Code Website Builder

Turn your ideas into beautiful websites instantly using voice or text input. Powered by Gemini AI, VOCODE transforms natural language descriptions into production-ready React applications with stunning, modern designs.

---

##  Features

###  Voice & Text Input
- **Voice-First Design**: Speak your website idea naturally - the AI understands context and intent
- **Text Input Fallback**: Type your description for browsers without voice support
- **Auto-Detection**: Automatically detects when you finish speaking
- **Smart Progression**: Seamlessly moves to the next step without manual intervention

###  AI-Powered Design
- **AI Integration**: Leverages Google's advanced AI for intelligent design generation
- **Idea Refinement**: Converts raw input into structured, actionable concepts
- **Context Understanding**: Interprets design preferences, target audience, and functionality needs

###  Live Preview
- **Real-Time Rendering**: See your website come to life instantly
- **Interactive Preview**: Test functionality and interactions before export
- **Responsive Design**: Preview how your site looks on different devices

### 🎨 Multiple Design Plans
- ** Unique Options**: AI generates three distinct design approaches
- **Variety in Style**: Different layouts, color schemes, and component arrangements
- **Smart Recommendations**: Plans tailored to your specific requirements

### ✏️ Natural Language Editing
- **Conversational Commands**: "Make the header blue" or "Add a contact form"
- **Iterative Refinement**: Make unlimited changes with simple instructions
- **Context-Aware**: AI understands your previous edits and maintains consistency

### 📦 Export Code
- **Complete React Project**: Download fully functional, production-ready code
- **Clean Architecture**: Well-organized components and file structure
- **Ready to Deploy**: No additional setup required - just deploy

### 🚀 Auto-Progression
- **Seamless Flow**: Smooth transitions from idea to finished website
- **No Friction**: Minimal clicks and manual steps
- **Guided Experience**: Clear progress indicators at every stage

---

## 🎯 How It Works

### Step 1: Loading Screen
Wait for the app to initialize (2-3 seconds). The system loads AI models and prepares the generation environment.

**What's Happening:**
- Loading models
- Initializing voice recognition
- Setting up the generation pipeline
- Preparing the editor environment

### Step 2: Main Page - Choose Your Input Method

#### 🎤 Voice Input (Recommended)
1. Click the microphone button
2. Grant microphone permissions if prompted
3. Speak your website idea clearly
4. The AI automatically detects when you're done
5. Auto-progresses to plan generation

**Example Voice Inputs:**
- "Create a modern portfolio website for a photographer with a gallery and contact form"
- "Build an e-commerce site for handmade jewelry with product listings and shopping cart"
- "Make a landing page for a SaaS product with pricing tiers and testimonials"

#### ⌨️ Text Input
1. Type your website description in the text area
2. Be as detailed as possible about your vision
3. Click "Generate" to proceed

**Example Text Inputs:**
```
Create a high-end modern marketplace website UI with soft 3D clay-style 
illustrations, pastel gradient lighting, glassmorphism panels, and floating 
abstract shapes. Use a layered depth system with soft shadows and light 
reflections. Cards should have smooth hover animations and subtle glow effects.
```

### Step 3: Auto-Progression
After voice input completes, the app automatically:
- Processes your speech into text
- Refines the idea with AI
- Generates design plans
- Transitions to plan selection

**No button clicking required!**

### Step 4: Plan Selection
Choose from 3 AI-generated design plans:

- **Plan A**: Often the most balanced approach
- **Plan B**: Alternative style or layout direction
- **Plan C**: Creative or experimental option

Each plan includes:
- Visual preview
- Component breakdown
- Design philosophy
- Recommended use cases

### Step 5: Editor - View & Refine

#### Preview Mode
- See your website rendered in real-time
- Interact with components
- Test responsive behavior

#### Code View
- Inspect generated React code
- Review component structure
- Understand implementation details

#### AI Editor
Make changes using natural language:
- "Change the background to a gradient"
- "Add a newsletter signup section"
- "Make the buttons larger"
- "Use a different font for headings"

#### Download Project
Export your complete React project:
- All components and assets
- Package.json with dependencies
- Ready-to-run configuration
- Deployment instructions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Microphone access (for voice input)
- Internet connection (for AI processing)
- Node.js 16+ and npm
- Gemini AI API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vocode.git

# Navigate to project directory
cd vocode

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key
```

### Environment Setup

1. Create a `.env.local` file in the root directory (already in `.gitignore`)
2. Add your API keys:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

3. **IMPORTANT**: Never commit the `.env.local` file to GitHub!

**Note**: For Next.js:
- Server-side variables: `GEMINI_API_KEY` (no prefix)
- Client-side variables: `NEXT_PUBLIC_*` prefix required

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests (if configured)
npm test
```

### Usage

1. Open the application in your browser
2. Wait for the loading screen to complete
3. Choose voice or text input
4. Describe your website idea
5. Select from generated design plans
6. Refine with natural language commands
7. Download your complete React project

---

## 🚀 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vocode)

### Manual Deployment

#### Step 1: Prepare Your Repository

```bash
# Make sure .gitignore is set up correctly
git add .gitignore .env.example vercel.json

# Commit your code (without .env file)
git add .
git commit -m "Initial commit"

# Push to GitHub
git push origin main
```

#### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Step 3: Add Environment Variables on Vercel

🔒 **CRITICAL**: Add your API keys in Vercel dashboard (NOT in GitHub)

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add the following variable for all environments (Production, Preview, Development):

| Name | Value | Environments |
|------|-------|--------------|
| `GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |

3. Click "Save"
4. **Redeploy** your project from the Deployments tab for changes to take effect

**Important**: 
- Server-side API keys (like `GEMINI_API_KEY`) should NOT have `NEXT_PUBLIC_` prefix
- They are only accessible in API routes and server components
- Never expose them to the client side

#### Step 4: Deploy

```bash
# Vercel will automatically deploy on every push to main branch
git push origin main
```

Or use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables Security

✅ **DO:**
- Keep `.env` in `.gitignore`
- Use `.env.example` as a template (without real keys)
- Add real API keys in Vercel dashboard
- Use different keys for development and production

❌ **DON'T:**
- Commit `.env` file to GitHub
- Share API keys in code or comments
- Hardcode API keys in source files
- Push sensitive data to public repositories

### Vercel Configuration

The `vercel.json` file is already configured for Next.js deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request
- **Development**: Every push to other branches

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 🔒 Security Best Practices

### API Key Management

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** for security
4. **Use different keys** for dev/staging/production
5. **Monitor API usage** to detect unauthorized access

### GitHub Security Checklist

- [x] `.env` file is in `.gitignore`
- [x] `.env.example` contains no real keys
- [x] No hardcoded API keys in source code
- [x] Sensitive files are excluded from commits
- [x] Repository secrets are used for CI/CD

### Vercel Security Checklist

- [x] Environment variables set in Vercel dashboard
- [x] Production and preview environments separated
- [x] API keys encrypted at rest
- [x] HTTPS enabled by default
- [x] Environment variables not exposed to client

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+
- **Frontend**: React 18+
- **AI Engine**: Google Gemini AI
- **Voice Recognition**: Web Speech API
- **Styling**: CSS3, Animations, Glassmorphism
- **Code Generation**: Custom AI-powered templates
- **Deployment**: Vercel

---

## 📋 Roadmap

- [ ] Multi-page website generation
- [ ] Custom component library
- [ ] Theme customization
- [ ] Direct deployment integration
- [ ] Collaboration features
- [ ] Version history and rollback
- [ ] Advanced animation controls
- [ ] CMS integration options

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---