import { Category, AITool, Review, CodeFile } from './types';

export const categories: Category[] = [
  { id: 'chat', name: 'AI Chat', icon: 'MessageSquare', description: 'Conversational assistants, chatbots, and localized custom models', count: 18 },
  { id: 'image', name: 'AI Image', icon: 'Image', description: 'Text-to-image generators, photo editors, and vector creators', count: 24 },
  { id: 'writing', name: 'AI Writing', icon: 'FileText', description: 'Copywriting, blog builders, SEO optimizers, and content generators', count: 15 },
  { id: 'audio', name: 'AI Audio', icon: 'Mic', description: 'Voiceovers, text-to-speech, transcription, and sound design', count: 12 },
  { id: 'music', name: 'AI Music', icon: 'Music', description: 'Soundtrack builders, loop creators, and lyric generators', count: 8 },
  { id: 'productivity', name: 'AI Productivity', icon: 'Cpu', description: 'PDF summarizers, calendar planners, and automated assistants', count: 14 },
];

export const aiTools: AITool[] = [
  {
    id: '1',
    name: 'OmniChat Pro',
    slug: 'omnichat-pro',
    tagline: 'Enterprise-grade conversation powered by Gemini 3.5 & Claude',
    description: 'A versatile, context-aware conversational AI that assists with brainstorming, programming, data analysis, and copywriting. Features multi-modal file attachments and customizable system personalities.',
    features: [
      'Dual-model support (Gemini & Claude abstraction)',
      'Rich text markdown, math equations, and code syntax highlighting',
      'Context size up to 100K tokens with automated pruning',
      'Export chat history in PDF, Markdown, and JSON formats',
      'Shareable dialogue link generation'
    ],
    category: 'chat',
    rating: 4.8,
    ratingCount: 342,
    price: 15,
    pricingType: 'subscription',
    billingPeriod: 'monthly',
    isFeatured: true,
    isTrending: true,
    iconName: 'MessageSquare',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80'
    ],
    demoType: 'chat',
    documentation: 'To use OmniChat Pro, navigate to the Chat tab, select your preferred system role, and begin conversing. Use the system parameters on the right sidebar to fine-tune temperature, topP, and system instructions. Integration via API requires obtaining a Bearer Token from your dashboard under API Keys.',
    reviewsCount: 184,
    author: 'Velo Labs',
    provider: 'Google Gemini'
  },
  {
    id: '2',
    name: 'NovaArt Canvas',
    slug: 'novaart-canvas',
    tagline: 'High-fidelity cinematic text-to-image generation engine',
    description: 'Transform textual concepts into high-resolution visual masterpieces. NovaArt Canvas utilizes Google Gemini Image models to produce stunning 1:1, 16:9, and 9:16 aspect ratio assets perfect for web assets, marketing, and editorial layouts.',
    features: [
      'Text-to-image with prebuilt lighting styles (Cinematic, Anime, Claymation, Oil)',
      'Negative prompt and styling weight configurations',
      'Aspect ratio custom canvas options (1:1, 16:9, 9:16)',
      'Inpainting and image outpainting editors',
      'High-quality PNG downloads with embedded metadata'
    ],
    category: 'image',
    rating: 4.9,
    ratingCount: 512,
    price: 29,
    pricingType: 'one-time',
    isFeatured: true,
    isTrending: true,
    iconName: 'Image',
    gallery: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
    ],
    demoType: 'image',
    documentation: 'Provide a rich descriptive prompt outlining the subject, setting, style, camera angle, and color palette. Click Generate to invoke the Image Engine. For advanced users, add style presets like "3D Render" or "Vaporwave" to customize outputs.',
    reviewsCount: 228,
    author: 'PixelTech AI',
    provider: 'Gemini Image Engine'
  },
  {
    id: '3',
    name: 'ScribeSaaS Copywriter',
    slug: 'scribesaas-copywriter',
    tagline: 'AI Marketing Copy and high-converting SEO content architect',
    description: 'An advanced copywriting suite that generates persuasive, high-converting copy for blogs, social media, landing pages, and email sequences. Features built-in framework templates such as AIDA, PAS, and FAB.',
    features: [
      'AIDA (Attention, Interest, Desire, Action) marketing generation',
      'SEO meta-description and header optimization analyzer',
      'Tone of voice adjustments (Professional, Witty, Conversational, Bold)',
      'Multi-language output with localized phrasing systems',
      'Built-in plagiarism scanning API'
    ],
    category: 'writing',
    rating: 4.6,
    ratingCount: 198,
    price: 9,
    pricingType: 'subscription',
    billingPeriod: 'monthly',
    isFeatured: false,
    isTrending: true,
    iconName: 'FileText',
    gallery: [
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80'
    ],
    demoType: 'copywriter',
    documentation: 'Select a template type from the dropdown, fill out the Product/Service Name, describe the audience, and define the brand voice. The model returns three unique variants categorized by emotional resonance, informational clarity, and action orientation.',
    reviewsCount: 94,
    author: 'Cambia Write',
    provider: 'Google Gemini'
  },
  {
    id: '4',
    name: 'VoxSynthesize TTS',
    slug: 'voxsynthesize-tts',
    tagline: 'Multi-character emotional text-to-speech voice generator',
    description: 'Premium text-to-speech voice generator that transforms text into natural, lifelike vocal performances. Perfect for audiobooks, podcasts, localized translations, and tutorial narrations.',
    features: [
      'Selection of 5 prebuilt studio voices (Puck, Charon, Kore, Fenrir, Zephyr)',
      'Emotion & speed adjustment markers',
      'Multi-character conversation scripting interface',
      '24kHz high-fidelity WAV and MP3 streaming',
      'Commercial usage distribution license'
    ],
    category: 'audio',
    rating: 4.7,
    ratingCount: 154,
    price: 19,
    pricingType: 'one-time',
    isFeatured: false,
    isTrending: false,
    iconName: 'Mic',
    gallery: [
      'https://images.unsplash.com/photo-1484755560695-a4c7300c5629?auto=format&fit=crop&w=800&q=80'
    ],
    demoType: 'audio',
    documentation: 'Type or paste the script into the voice editor. Use conversational formatting tags, or choose a voice persona to speak the prompt. Review synthetic wave patterns before downloading the high-quality 24kHz audio file.',
    reviewsCount: 72,
    author: 'Vocalic Tech',
    provider: 'Gemini Speech Synth'
  }
];

export const reviews: Review[] = [
  { id: '101', toolId: '1', userName: 'Alice Seng', rating: 5, comment: 'Outstanding conversational capability! We migrated our customer onboarding scripts over to OmniChat API and customer satisfaction score shot up by 32%. Highly recommend!', date: 'July 14, 2026' },
  { id: '102', toolId: '1', userName: 'John Doe', rating: 4, comment: 'Very responsive, formatting works great on markdown equations. Support was helpful when setting up keys.', date: 'July 10, 2026' },
  { id: '103', toolId: '2', userName: 'Maya Chen', rating: 5, comment: 'NovaArt produces incredible photo-realistic assets. The aspect ratio controls are crucial for our mobile marketing layouts. Worth every cent.', date: 'July 16, 2026' },
  { id: '104', toolId: '3', userName: 'Sokha Ly', rating: 4, comment: 'ScribeSaaS has saved us countless hours drafting social media copies and email lists. Very intuitive UI!', date: 'July 05, 2026' }
];

export const faqs = [
  { q: 'How do I purchase or subscribe to AI Tools?', a: 'You can explore our marketplace, select a tool, and choose to purchase its license (for one-time tools) or subscribe monthly. Payments are processed securely via Stripe or PayPal directly on our platform, providing instant access on your User Dashboard.' },
  { q: 'Can I integrate these tools into my own applications?', a: 'Yes! Subscribed tools grant you access to our centralized API gateway. You can generate custom API keys on your dashboard and route requests through our unified REST endpoints, removing the need to manage dozens of separate accounts.' },
  { q: 'How do I publish my own AI tool as a creator?', a: 'Simply switch to your Vendor Dashboard, fill out the Tool Registration form with your gallery assets, pricing model, and documentation, and submit for review. Once approved, your tool goes live to thousands of active buyers instantly.' },
  { q: 'Is there a unified billing dashboard?', a: 'Absolutely. On your user profile dashboard, you can view your active subscriptions, monthly usage metrics, past invoices, and easily update or cancel plans with a single click.' }
];

export const blogPosts = [
  {
    id: '1',
    title: 'How Laravel 12 & Vue 3 Are Revolutionizing SaaS Marketplaces',
    excerpt: 'Explore the key performance and scalability architectures of building a modern unified SaaS platform with Laravel 12 APIs, Redis queues, and Vue 3 Pinia frontends.',
    category: 'Development',
    date: 'July 15, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'The Rise of Multi-Model Abstraction Layers in AI Products',
    excerpt: 'Why hardcoding your product to a single AI provider is a critical mistake. Learn how to architect clean provider adapters for Gemini, Claude, and OpenAI.',
    category: 'AI Architecture',
    date: 'July 12, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80'
  }
];

export const codebaseFiles: CodeFile[] = [
  {
    name: 'AIService.php',
    path: 'backend/app/Services/AIService.php',
    language: 'php',
    content: `<?php

namespace App\\Services;

use App\\Services\\Providers\\GeminiProvider;
use App\\Services\\Providers\\OpenAIProvider;
use App\\Services\\Providers\\AnthropicProvider;
use Exception;

/**
 * Class AIService
 * Provider abstraction layer for swapping and managing multiple AI models seamlessly.
 */
class AIService
{
    protected array $providers = [];
    protected string $defaultProvider;

    public function __construct()
    {
        // Bind dynamic model adapters
        $this->providers['gemini'] = new GeminiProvider(config('services.gemini.key'));
        $this->providers['openai'] = new OpenAIProvider(config('services.openai.key'));
        $this->providers['claude'] = new AnthropicProvider(config('services.anthropic.key'));
        
        $this->defaultProvider = config('services.ai.default_provider', 'gemini');
    }

    /**
     * Resolve a provider and call generation.
     */
    public function generateText(string $prompt, array $options = [], ?string $provider = null): string
    {
        $resolvedProvider = $provider ?? $this->defaultProvider;
        
        if (!isset($this->providers[$resolvedProvider])) {
            throw new Exception("AI Provider [\$resolvedProvider] is not supported.");
        }

        return $this->providers[$resolvedProvider]->completeText($prompt, $options);
    }

    /**
     * Resolve provider and generate Image.
     */
    public function generateImage(string $prompt, array $options = [], ?string $provider = null): string
    {
        $resolvedProvider = $provider ?? $this->defaultProvider;

        if (!isset($this->providers[$resolvedProvider])) {
            throw new Exception("AI Provider [\$resolvedProvider] is not supported.");
        }

        return $this->providers[$resolvedProvider]->createImage($prompt, $options);
    }
}
`
  },
  {
    name: 'GeminiProvider.php',
    path: 'backend/app/Services/Providers/GeminiProvider.php',
    language: 'php',
    content: `<?php

namespace App\\Services\\Providers;

use Illuminate\\Support\\Facades\\Http;
use Exception;

class GeminiProvider
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function completeText(string $prompt, array $options = []): string
    {
        $model = $options['model'] ?? 'gemini-3.5-flash';
        $temperature = $options['temperature'] ?? 1.0;
        $systemInstruction = $options['system_instruction'] ?? null;

        $payload = [
            'contents' => [
                'parts' => [
                    ['text' => $prompt]
                ]
            ],
            'generationConfig' => [
                'temperature' => $temperature
            ]
        ];

        if ($systemInstruction) {
            $payload['systemInstruction'] = [
                'parts' => [['text' => $systemInstruction]]
            ];
        }

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'User-Agent' => 'aistudio-build'
        ])->post("\$this->baseUrl/models/\$model:generateContent?key=\$this->apiKey", $payload);

        if ($response->failed()) {
            throw new Exception("Gemini API request failed: " . $response->body());
        }

        return $response->json('candidates.0.content.parts.0.text') ?? '';
    }

    public function createImage(string $prompt, array $options = []): string
    {
        $model = $options['model'] ?? 'gemini-3.1-flash-lite-image';
        $aspectRatio = $options['aspect_ratio'] ?? '1:1';

        $payload = [
            'contents' => [
                'parts' => [
                    ['text' => $prompt]
                ]
            ],
            'generationConfig' => [
                'imageConfig' => [
                    'aspectRatio' => $aspectRatio
                ]
            ]
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post("\$this->baseUrl/models/\$model:generateContent?key=\$this->apiKey", $payload);

        if ($response->failed()) {
            throw new Exception("Gemini Image generation failed: " . $response->body());
        }

        $parts = $response->json('candidates.0.content.parts');
        foreach ($parts as $part) {
            if (isset($part['inlineData'])) {
                return 'data:image/png;base64,' . $part['inlineData']['data'];
            }
        }

        throw new Exception("No image binary found in API response.");
    }
}
`
  },
  {
    name: 'ToolController.php',
    path: 'backend/app/Http/Controllers/Api/ToolController.php',
    language: 'php',
    content: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\AITool;
use App\\Services\\AIService;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class ToolController extends Controller
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * List, filter, search products in the marketplace.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AITool::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function (\$q) use (\$search) {
                \$q->where('name', 'LIKE', "%\$search%")
                  ->orWhere('tagline', 'LIKE', "%\$search%")
                  ->orWhere('description', 'LIKE', "%\$search%");
            });
        }

        if ($request->has('pricing_type')) {
            $query->where('pricing_type', $request->pricing_type);
        }

        if ($request->has('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        $tools = $query->paginate(12);

        return response()->json($tools);
    }

    /**
     * Get specific tool detail.
     */
    public function show(AITool $tool): JsonResponse
    {
        $tool->load('reviews');
        return response()->json($tool);
    }

    /**
     * Execute live tool playground demo.
     */
    public function demo(Request $request, AITool $tool): JsonResponse
    {
        $request->validate([
            'prompt' => 'required|string|max:5000',
            'aspect_ratio' => 'nullable|string|in:1:1,16:9,9:16',
        ]);

        try {
            if ($tool->demo_type === 'image') {
                $output = $this->aiService->generateImage($request->prompt, [
                    'model' => 'gemini-3.1-flash-lite-image',
                    'aspect_ratio' => $request->aspect_ratio ?? '1:1'
                ], 'gemini');
                return response()->json(['success' => true, 'output_url' => $output]);
            } else {
                $output = $this->aiService->generateText($request->prompt, [
                    'model' => 'gemini-3.5-flash',
                    'temperature' => 0.7
                ], 'gemini');
                return response()->json(['success' => true, 'text' => $output]);
            }
        } catch (\\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
`
  },
  {
    name: 'OrderController.php',
    path: 'backend/app/Http/Controllers/Api/OrderController.php',
    language: 'php',
    content: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\AITool;
use App\\Models\\Order;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;
use Stripe\\Stripe;
use Stripe\\Checkout\\Session;
use Exception;

class OrderController extends Controller
{
    /**
     * Create checkout session with Cashier.
     */
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $request->validate([
            'tool_id' => 'required|exists:ai_tools,id',
            'payment_method' => 'required|in:stripe,paypal',
            'billing_period' => 'nullable|in:monthly,yearly',
        ]);

        $user = $request->user();
        $tool = AITool::findOrFail($request->tool_id);

        if ($request->payment_method === 'stripe') {
            Stripe::setApiKey(config('cashier.secret'));

            try {
                // If subscription based
                if ($tool->pricing_type === 'subscription') {
                    $checkoutSession = $user->newSubscription($tool->slug, $tool->stripe_plan_id)
                        ->checkout([
                            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                            'cancel_url' => route('checkout.cancel'),
                        ]);
                } else {
                    // One-time payment session
                    $checkoutSession = Session::create([
                        'payment_method_types' => ['card'],
                        'line_items' => [[
                            'price_data' => [
                                'currency' => 'usd',
                                'product_data' => [
                                    'name' => $tool->name,
                                    'description' => $tool->tagline,
                                ],
                                'unit_amount' => $tool->price * 100,
                            ],
                            'quantity' => 1,
                        ]],
                        'mode' => 'payment',
                        'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                        'cancel_url' => route('checkout.cancel'),
                    ]);
                }

                return response()->json([
                    'checkout_url' => $checkoutSession->url
                ]);
            } catch (Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }

        // Handle PayPal flows or custom processors...
        return response()->json(['message' => 'PayPal redirect simulated.'], 200);
    }
}
`
  },
  {
    name: 'api.php',
    path: 'backend/routes/api.php',
    language: 'php',
    content: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\ToolController;
use App\\Http\\Controllers\\Api\\OrderController;
use App\\Http\\Controllers\\Api\\VendorController;
use App\\Http\\Controllers\\Api\\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes for Lumina AI Marketplace
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/tools', [ToolController::class, 'index']);
Route::get('/tools/{tool}', [ToolController::class, 'show']);
Route::post('/tools/{tool}/demo', [ToolController::class, 'demo']);

// Protected User Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [AuthController::class, 'profile']);
    Route::post('/user/checkout', [OrderController::class, 'createCheckoutSession']);
    Route::get('/user/purchases', [OrderController::class, 'purchasedTools']);
    Route::get('/user/usage', [OrderController::class, 'usageStats']);
    Route::post('/user/tickets', [OrderController::class, 'createTicket']);
    
    // Vendor Specific Routes
    Route::middleware('role:vendor')->group(function () {
        Route::get('/vendor/analytics', [VendorController::class, 'analytics']);
        Route::post('/vendor/tools', [VendorController::class, 'store']);
        Route::put('/vendor/tools/{tool}', [VendorController::class, 'update']);
        Route::get('/vendor/sales', [VendorController::class, 'sales']);
    });

    // Admin Specific Routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/analytics', [AdminController::class, 'analytics']);
        Route::put('/admin/settings', [AdminController::class, 'updateSettings']);
    });
});
`
  },
  {
    name: 'create_ai_tools_table.php',
    path: 'backend/database/migrations/create_ai_tools_table.php',
    language: 'php',
    content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_tools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Author/Creator
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tagline');
            $table->text('description');
            $table->json('features');
            $table->string('category');
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->integer('rating_count')->default(0);
            $table->decimal('price', 10, 2);
            $table->enum('pricing_type', ['free', 'one-time', 'subscription']);
            $table->string('stripe_plan_id')->nullable();
            $table->string('demo_type')->default('chat'); // chat, image, voice, etc.
            $table->text('documentation')->nullable();
            $table->string('icon_name')->default('Cpu');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_trending')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_tools');
    }
};
`
  },
  {
    name: 'ToolDetail.vue',
    path: 'frontend/src/views/ToolDetail.vue',
    language: 'javascript',
    content: `<template>
  <div class="tool-detail-view py-8 px-4 max-w-7xl mx-auto dark:bg-slate-900 text-slate-100">
    <!-- Breadcrumbs -->
    <nav class="mb-6 text-sm text-slate-400">
      <router-link to="/tools" class="hover:text-amber-500">Marketplace</router-link> /
      <span class="text-slate-200 capitalize">{{ tool.category }}</span> /
      <span class="text-slate-500">{{ tool.name }}</span>
    </nav>

    <!-- Header Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div class="lg:col-span-2">
        <div class="flex items-start gap-4">
          <div class="p-4 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20">
            <component :is="tool.icon_name" class="w-12 h-12" />
          </div>
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight">{{ tool.name }}</h1>
            <p class="text-lg text-slate-400 mt-1">{{ tool.tagline }}</p>
            <div class="flex items-center gap-4 mt-3 text-sm">
              <span class="text-amber-500 font-semibold">★ {{ tool.rating }} ({{ tool.rating_count }} reviews)</span>
              <span class="text-slate-500">By {{ tool.author }}</span>
            </div>
          </div>
        </div>

        <!-- Gallery -->
        <div class="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <img :src="activeImage" class="w-full h-96 object-cover" />
        </div>
      </div>

      <!-- Purchasing Card -->
      <div class="p-6 bg-slate-950/40 rounded-3xl border border-slate-800 flex flex-col justify-between h-fit">
        <div>
          <span class="text-xs uppercase font-bold text-amber-500 tracking-wider">License Offer</span>
          <div class="text-4xl font-extrabold mt-2 text-white">
            $\{{ tool.price }}<span class="text-sm font-normal text-slate-500" v-if="tool.pricing_type === 'subscription'">/mo</span>
          </div>
          <p class="text-sm text-slate-400 mt-3">{{ tool.description }}</p>

          <ul class="space-y-2 mt-6">
            <li v-for="feat in tool.features" :key="feat" class="text-xs text-slate-300 flex items-center gap-2">
              <span class="text-emerald-500">✔</span> \{{ feat }}
            </li>
          </ul>
        </div>

        <button @click="purchase" class="w-full py-4 bg-amber-500 hover:bg-amber-600 transition font-bold text-slate-950 rounded-2xl mt-8">
          Get Started Now
        </button>
      </div>
    </div>

    <!-- Playground & Docs Tabs -->
    <div class="border-t border-slate-800 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <h2 class="text-2xl font-bold mb-4">Interactive Demo</h2>
        <!-- Simple interactive form calling dynamic AI model proxy -->
        <div class="p-6 bg-slate-950 border border-slate-800 rounded-2xl">
          <textarea v-model="prompt" placeholder="Input prompt..." class="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-4 focus:outline-none focus:border-amber-500 h-24 mb-4"></textarea>
          <button @click="runDemo" :disabled="loading" class="px-6 py-2 bg-amber-500 hover:bg-amber-600 transition font-semibold text-slate-950 rounded-xl disabled:opacity-50">
            \{{ loading ? 'Processing...' : 'Run Live Demo' }}
          </button>

          <!-- Response Container -->
          <div v-if="response" class="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800">
            <h3 class="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Result</h3>
            <p class="text-slate-300">\{{ response }}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-4">Documentation</h2>
        <div class="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-sm leading-relaxed text-slate-400">
          \{{ tool.documentation }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
  tool: { type: Object, required: true }
});

const activeImage = ref(props.tool.gallery[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe');
const prompt = ref('');
const response = ref('');
const loading = ref(false);

async function runDemo() {
  if (!prompt.value) return;
  loading.value = true;
  try {
    const res = await axios.post(\`/api/tools/\${props.tool.id}/demo\`, { prompt: prompt.value });
    response.value = res.data.text || 'Success';
  } catch (err) {
    response.value = 'Failed to execute demo: ' + err.message;
  } finally {
    loading.value = false;
  }
}
</script>
`
  },
  {
    name: 'docker-compose.yml',
    path: 'docker-compose.yml',
    language: 'yaml',
    content: `version: '3.8'

services:
  # Laravel App Container
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: lumina-ai-marketplace
    restart: unless-stopped
    tty: true
    environment:
      SERVICE_NAME: app
      APP_ENV: production
      APP_DEBUG: 'false'
      DB_CONNECTION: mysql
      DB_HOST: mysql
      DB_PORT: 3306
      DB_DATABASE: lumina_marketplace
      DB_USERNAME: db_user
      DB_PASSWORD: db_secure_password
      REDIS_HOST: redis
    volumes:
      - ./:/var/www
    networks:
      - lumina-net

  # Nginx Web Server
  webserver:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./:/var/www
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    networks:
      - lumina-net

  # MySQL Database
  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: lumina_marketplace
      MYSQL_USER: db_user
      MYSQL_PASSWORD: db_secure_password
      MYSQL_ROOT_PASSWORD: db_root_password
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - lumina-net

  # Redis Cache & Queue
  redis:
    image: redis:alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - lumina-net

networks:
  lumina-net:
    driver: bridge

volumes:
  dbdata:
    driver: local
`
  },
  {
    name: 'INSTALL.md',
    path: 'INSTALL.md',
    language: 'markdown',
    content: `# Lumina AI Marketplace SaaS Installation & Setup

Production-ready installer instructions to launch the Laravel 12 API backend and Vue.js 3 Vite SPA frontend.

## Prerequisites
- **PHP 8.3+** with extensions (OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath, Curl, Zip)
- **Composer** (v2.6+)
- **Node.js** (v20+) & **npm** / **Yarn**
- **MySQL** (v8.0+) or PostgreSQL
- **Redis** (Optional but highly recommended for task caching & Horizon queue monitoring)

---

## 1. Backend Setup (Laravel 12)

1. **Clone the project & Navigate into the server folder**:
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install PHP dependencies**:
   \`\`\`bash
   composer install --no-dev --optimize-autoloader
   \`\`\`

3. **Configure Environment variables**:
   Copy \`.env.example\` to \`.env\`, and specify your system parameters:
   \`\`\`bash
   cp .env.example .env
   php artisan key:generate
   \`\`\`

   Configure your database parameters, Redis settings, and API secrets:
   \`\`\`env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=lumina_marketplace
   DB_USERNAME=root
   DB_PASSWORD=your_password

   # Multi-Model Secrets
   GEMINI_API_KEY="your_gemini_api_key"
   OPENAI_API_KEY="your_openai_api_key"
   CLAUDE_API_KEY="your_anthropic_api_key"

   # Cashier Payment Integrations
   STRIPE_KEY="pk_live_..."
   STRIPE_SECRET="sk_live_..."
   CASHIER_CURRENCY=usd
   \`\`\`

4. **Run Database Migrations & Seeders**:
   Propagate database architecture and initial tool categories:
   \`\`\`bash
   php artisan migrate --force
   php artisan db:seed --class=MarketplaceSeeder
   \`\`\`

5. **Start Laravel Queues & Scheduler**:
   Ensure subscriptions, billing periods, invoices, and analytics logs are updated in the background:
   \`\`\`bash
   # Run the queue worker
   php artisan queue:work --queue=high,default

   # Setup the cron scheduler
   * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
   \`\`\`

6. **Serve the API application**:
   \`\`\`bash
   php artisan serve --port=8000
   \`\`\`

---

## 2. Frontend Setup (Vue.js 3 + Vite)

1. **Navigate into the frontend folder**:
   \`\`\`bash
   cd ../frontend
   \`\`\`

2. **Install node dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure API target route**:
   Create a \`.env\` file:
   \`\`\`env
   VITE_API_URL="http://localhost:8000/api"
   VITE_APP_NAME="Lumina AI Marketplace"
   \`\`\`

4. **Compile and compile modules**:
   \`\`\`bash
   # Run development dev server
   npm run dev

   # Compile production assets
   npm run build
   \`\`\`

---

## 3. Docker Launch (Quickstart)
To run the entire system with Docker Compose:
\`\`\`bash
docker-compose up -d --build
docker-compose exec app php artisan migrate --seed
\`\`\`
The frontend will bind to \`http://localhost\` served via Nginx.
`
  }
];
