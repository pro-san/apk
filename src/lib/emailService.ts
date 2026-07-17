import { AITool, Order } from '../types';

export interface MockEmail {
  id: string;
  to: string;
  subject: string;
  bodyHtml: string;
  sentAt: string;
  type: 'welcome' | 'purchase';
  read: boolean;
}

// Simple pub/sub system to notify UI when a new email is "sent" in the sandbox
type EmailListener = (email: MockEmail) => void;
const listeners: Set<EmailListener> = new Set();

export const subscribeToEmails = (listener: EmailListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (email: MockEmail) => {
  listeners.forEach(l => l(email));
};

export const getSentEmails = (): MockEmail[] => {
  const data = localStorage.getItem('lumina_mock_emails');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveEmails = (emails: MockEmail[]) => {
  localStorage.setItem('lumina_mock_emails', JSON.stringify(emails));
};

export const clearEmails = () => {
  localStorage.setItem('lumina_mock_emails', '[]');
  // Refresh listeners
};

export const sendWelcomeEmail = (user: { name: string; email: string; role: string }) => {
  const id = `EML-${Math.floor(100000 + Math.random() * 900000)}`;
  const sentAt = new Date().toLocaleString();
  
  const bodyHtml = `
    <div style="font-family: system-ui, sans-serif; background-color: #020617; color: #f1f5f9; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
      <!-- Header -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
        <span style="font-size: 20px; font-weight: 800; color: #ffffff;">Lumina</span>
        <span style="font-size: 20px; font-weight: 800; color: #f59e0b;">AI</span>
        <span style="font-size: 10px; font-weight: bold; background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(245, 158, 11, 0.2); margin-left: auto;">MARKETPLACE</span>
      </div>

      <!-- Hero Banner -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); border: 1px solid #312e81; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.025em;">Welcome to the Multi-Model Frontier, ${user.name}!</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5;">Your account is active and ready. Discover, purchase, and route dynamic AI models using secure API proxies.</p>
      </div>

      <!-- Account Details -->
      <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
        <h3 style="color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Account Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #64748b; padding: 6px 0;">Username:</td>
            <td style="color: #f1f5f9; text-align: right; font-weight: 600;">${user.name}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 6px 0;">Email Address:</td>
            <td style="color: #f1f5f9; text-align: right; font-weight: 600; font-family: monospace;">${user.email}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 6px 0;">Account Purpose:</td>
            <td style="color: #f59e0b; text-align: right; font-weight: bold; text-transform: capitalize;">${user.role}</td>
          </tr>
        </table>
      </div>

      <!-- Tips section -->
      <h3 style="color: #ffffff; font-size: 13px; font-weight: 800; margin: 0 0 12px 0;">Getting Started Checklist</h3>
      <div style="font-size: 12px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
        <div style="margin-bottom: 12px; display: flex; gap: 8px;">
          <span style="color: #f59e0b; font-weight: bold;">✓</span>
          <div>
            <strong style="color: #ffffff;">Explore Marketplace:</strong> Browse multi-category SaaS tools, try interactive chat modules, and purchase licensing tiers.
          </div>
        </div>
        <div style="margin-bottom: 12px; display: flex; gap: 8px;">
          <span style="color: #f59e0b; font-weight: bold;">✓</span>
          <div>
            <strong style="color: #ffffff;">Test Playgrounds:</strong> Open direct play tunnels for active tools, adjust settings, and evaluate responses.
          </div>
        </div>
        <div style="margin-bottom: 12px; display: flex; gap: 8px;">
          <span style="color: #f59e0b; font-weight: bold;">✓</span>
          <div>
            <strong style="color: #ffffff;">Activate Multi-Factor (2FA):</strong> Navigate to the <strong>Security</strong> subtab under your dashboard and scan our virtual authenticator code to fully lock down key rotations.
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="#user-dash" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #020617; font-weight: 800; font-size: 13px; text-decoration: none; border-radius: 8px; transition: background-color 0.2s;">
          Configure API Dashboard
        </a>
      </div>

      <!-- Footer -->
      <div style="border-t: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #475569; text-align: center;">
        <p style="margin: 0 0 4px 0;">This is an automated sandbox simulation email from Lumina AI.</p>
        <p style="margin: 0;">© 2026 Lumina AI Inc. 3000 Ingress Avenue, Cloud Run Container Sandbox.</p>
      </div>
    </div>
  `;

  const newEmail: MockEmail = {
    id,
    to: user.email,
    subject: `⚡ Welcome to Lumina AI: Your Sandbox environment is active, ${user.name}!`,
    bodyHtml,
    sentAt,
    type: 'welcome',
    read: false
  };

  const existing = getSentEmails();
  const updated = [newEmail, ...existing];
  saveEmails(updated);
  notifyListeners(newEmail);
};

export const sendPurchaseConfirmationEmail = (
  user: { name: string; email: string },
  tool: AITool,
  order: Order
) => {
  const id = `EML-${Math.floor(100000 + Math.random() * 900000)}`;
  const sentAt = new Date().toLocaleString();

  const bodyHtml = `
    <div style="font-family: system-ui, sans-serif; background-color: #020617; color: #f1f5f9; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
      <!-- Header -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
        <span style="font-size: 20px; font-weight: 800; color: #ffffff;">Lumina</span>
        <span style="font-size: 20px; font-weight: 800; color: #f59e0b;">AI</span>
        <span style="font-size: 10px; font-weight: bold; background-color: rgba(16, 185, 129, 0.1); color: #10b981; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.2); margin-left: auto;">TRANSACTION INVOICE</span>
      </div>

      <!-- Confirmed Banner -->
      <div style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); border: 1px solid #065f46; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 32px; margin-bottom: 8px;">✓</div>
        <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.025em;">Payment Confirmed!</h1>
        <p style="color: #a7f3d0; font-size: 12px; margin: 0; font-family: monospace;">Order Transaction ID: ${order.id}</p>
      </div>

      <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
        Hi ${user.name},<br/><br/>
        Thank you for your purchase! Your billing transaction cleared successfully through our payment gateway. Your license is fully provisioned and the central API proxy routes have been configured on your active bearer token.
      </p>

      <!-- Invoice Table -->
      <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 18px; border-radius: 12px; margin-bottom: 24px;">
        <h3 style="color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 14px 0; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Order Details</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 14px;">
          <thead>
            <tr style="text-align: left; color: #64748b; font-size: 11px; font-weight: bold;">
              <th style="padding-bottom: 8px;">Product/Service</th>
              <th style="padding-bottom: 8px; text-align: right;">Billing Type</th>
              <th style="padding-bottom: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${tool.name}</td>
              <td style="padding: 10px 0; color: #cbd5e1; text-align: right; text-transform: capitalize;">${tool.pricingType}</td>
              <td style="padding: 10px 0; color: #ffffff; font-weight: bold; text-align: right;">$${tool.price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Payment Method:</td>
            <td style="color: #cbd5e1; text-align: right; font-weight: 600; text-transform: uppercase;">${order.paymentMethod}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Transaction Date:</td>
            <td style="color: #cbd5e1; text-align: right; font-weight: 600;">${order.date}</td>
          </tr>
          <tr style="border-top: 1px solid #1e293b;">
            <td style="color: #ffffff; font-weight: bold; padding: 10px 0 0 0; font-size: 14px;">Total Charged:</td>
            <td style="color: #f59e0b; font-weight: 800; text-align: right; padding: 10px 0 0 0; font-size: 16px;">$${tool.price.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <!-- Action Panel -->
      <div style="background-color: #0c0a09; border: 1px solid #292524; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h4 style="color: #f59e0b; font-size: 12px; font-weight: bold; margin: 0 0 6px 0; text-transform: uppercase;">License Activated!</h4>
        <p style="color: #a8a29e; font-size: 11px; margin: 0 0 12px 0; line-height: 1.5;">
          You can immediately query this model using our sandbox console or test dynamic code hooks on our unified playground.
        </p>
        <a href="#user-dash" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: #020617; font-weight: 800; font-size: 12px; text-decoration: none; border-radius: 6px;">
          Launch Service Playground
        </a>
      </div>

      <!-- Footer -->
      <div style="border-t: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #475569; text-align: center;">
        <p style="margin: 0 0 4px 0;">Have billing questions? File an urgent support ticket inside the buyer center.</p>
        <p style="margin: 0;">© 2026 Lumina AI Inc. 3000 Ingress Avenue, Cloud Run Container Sandbox.</p>
      </div>
    </div>
  `;

  const newEmail: MockEmail = {
    id,
    to: user.email,
    subject: `🧾 Invoice and Confirmation: Your active license for ${tool.name}`,
    bodyHtml,
    sentAt,
    type: 'purchase',
    read: false
  };

  const existing = getSentEmails();
  const updated = [newEmail, ...existing];
  saveEmails(updated);
  notifyListeners(newEmail);
};
