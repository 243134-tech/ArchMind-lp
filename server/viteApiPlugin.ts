import type { Plugin } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';
import {
  analyzeSpaceWithGemini,
  generateDesignConcepts,
  refineDesignWithGemini,
  chatWithCopilot,
} from './geminiService';

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // limit body to 20MB for images
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

export function archMindApiPlugin(): Plugin {
  return {
    name: 'archmind-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (!url || !url.startsWith('/api/')) {
          return next();
        }

        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          });
          res.end();
          return;
        }

        try {
          // 1. Health check
          if (url === '/api/health' && req.method === 'GET') {
            return sendJson(res, 200, {
              status: 'operational',
              service: 'ArchMind AI Engine',
              hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
              timestamp: new Date().toISOString(),
            });
          }

          // 2. Multimodal space analysis
          if (url === '/api/ai/analyze-space' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const result = await analyzeSpaceWithGemini(
              body.imageBase64 || '',
              body.roomType || 'Living Room',
              body.preferences || ''
            );
            return sendJson(res, 200, result);
          }

          // 3. AI Design Generation
          if (url === '/api/ai/generate-design' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const result = await generateDesignConcepts({
              imageBase64: body.imageBase64 || '',
              roomType: body.roomType || 'Living Room',
              style: body.style || 'Modern',
              colorPreferences: body.colorPreferences || ['Neutral'],
              budgetMin: body.budgetMin || 10000,
              budgetMax: body.budgetMax || 30000,
              functionalNeeds: body.functionalNeeds || ['Relaxation'],
              itemsToRetain: body.itemsToRetain || [],
              additionalInstructions: body.additionalInstructions || '',
              projectId: body.projectId || 'proj_modern_terrace',
            });
            return sendJson(res, 200, result);
          }

          // 4. Conversational Design Refinement
          if (url === '/api/ai/refine-design' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const result = await refineDesignWithGemini({
              baseImageUrl: body.baseImageUrl || '',
              refinementPrompt: body.refinementPrompt || '',
              variationName: body.variationName || 'Natural Modern',
              currentVersionNumber: body.currentVersionNumber || 1,
            });
            return sendJson(res, 200, result);
          }

          // 5. Copilot Conversational Assistant
          if (url === '/api/ai/copilot' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const result = await chatWithCopilot({
              messages: body.messages || [],
              projectContext: body.projectContext,
            });
            return sendJson(res, 200, result);
          }

          // Not found
          sendJson(res, 404, { error: `Endpoint ${url} not found` });
        } catch (error: any) {
          console.error('API Error:', error);
          sendJson(res, 500, {
            error: error.message || 'Internal Server Error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          });
        }
      });
    },
  };
}
