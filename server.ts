import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazy initialize Gemini AI client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not configured in Secrets settings.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Status & Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  // Execute Dynamic AI Tool Demo
  app.post('/api/tools/demo', async (req, res) => {
    const { prompt, demoType, options } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
      const client = getGeminiClient();

      if (demoType === 'image') {
        const ar = options?.aspectRatio || '1:1';
        const response = await client.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: {
              aspectRatio: ar as any,
            },
          },
        });

        let imageUrl = '';
        const candidates = response.candidates;
        if (candidates && candidates[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (!imageUrl) {
          throw new Error('Image generation completed but no image parts were returned.');
        }

        return res.json({ success: true, imageUrl });
      } else if (demoType === 'audio') {
        // Text to Speech
        const voice = options?.voice || 'Kore';
        const response = await client.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: [{ parts: [{ text: `Say cheerfully: ${prompt}` }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
            },
          },
        });

        let audioUrl = '';
        const candidates = response.candidates;
        if (candidates && candidates[0]?.content?.parts?.[0]?.inlineData?.data) {
          const base64Audio = candidates[0].content.parts[0].inlineData.data;
          audioUrl = `data:audio/wav;base64,${base64Audio}`;
        }

        if (!audioUrl) {
          throw new Error('Speech synthesis succeeded but no audio parts were found.');
        }

        return res.json({ success: true, audioUrl });
      } else {
        // Standard text completion (Chat, Copywriter, etc.)
        let systemInstruction = 'You are a helpful AI assistant in an AI SaaS Marketplace dashboard.';
        if (demoType === 'copywriter') {
          systemInstruction = 'You are ScribeSaaS Copywriter, a premium marketing assistant trained to create high-converting promotional copies, emails, and blogs using AIDA/PAS frameworks.';
        } else if (demoType === 'chat') {
          systemInstruction = `You are OmniChat Pro, an elite context-aware conversational AI tool. Format response elegantly with Markdown if needed. Current local time is ${new Date().toISOString()}`;
        }

        const response = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });

        const textOutput = response.text || 'No response generated.';
        return res.json({ success: true, text: textOutput });
      }
    } catch (error: any) {
      console.error('Gemini Execution Error:', error);
      
      // Provide an educational simulated fallback if the API key is not configured or fails
      const isMissingKey = error.message.includes('GEMINI_API_KEY') || error.message.includes('API key not valid');
      
      if (isMissingKey) {
        let simulatedText = '';
        let simulatedImage = '';
        let simulatedAudio = '';

        if (demoType === 'image') {
          simulatedImage = 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80';
        } else if (demoType === 'audio') {
          simulatedAudio = 'simulated';
        } else if (demoType === 'copywriter') {
          simulatedText = `### ScribeSaaS Copywriter [Key Configuration Sandbox Mode]
Here is a simulated high-converting AIDA marketing copy for: **"${prompt.substring(0, 40)}"**

*   **Attention**: Stop bleeding leads and waste hours on manual copywriting. Discover our automated system.
*   **Interest**: Empower your sales team with an AI trained specifically on 12 million high-performing landing pages.
*   **Desire**: Create fully optimized email campaigns, social ad scripts, and SEO blogs in under 45 seconds.
*   **Action**: Try ScribeSaaS today. Add your Gemini API Key in the settings panel to enable real, production-ready AI outputs!`;
        } else {
          simulatedText = `### OmniChat Pro [Key Configuration Sandbox Mode]
Hello there! It appears your \`GEMINI_API_KEY\` is not configured or is invalid. I am responding in local sandbox mode.

To unlock real, dynamic AI generations powered by Gemini:
1. Open the **Settings > Secrets** panel in the AI Studio UI.
2. Add your \`GEMINI_API_KEY\`.
3. Hit **Save** and refresh!

Your current prompt was: *"${prompt}"*`;
        }

        return res.json({
          success: true,
          text: simulatedText,
          imageUrl: simulatedImage,
          audioUrl: simulatedAudio,
          sandboxNotice: true,
        });
      }

      return res.status(500).json({ error: error.message || 'Server error occurred' });
    }
  });

  // Mount Vite middleware in development or serve static folder in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express dev server running on http://localhost:${PORT}`);
  });
}

startServer();
