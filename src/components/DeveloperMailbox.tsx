import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  X, 
  Trash2, 
  Clock, 
  User, 
  ExternalLink, 
  Check, 
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import { getSentEmails, subscribeToEmails, clearEmails, MockEmail } from '../lib/emailService';

export function DeveloperMailbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<MockEmail | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedText, setCopiedText] = useState(false);

  // Sync emails on load and subscribe to new mock emails
  useEffect(() => {
    setEmails(getSentEmails());
    
    const unsubscribe = subscribeToEmails((newEmail) => {
      setEmails(prev => [newEmail, ...prev]);
      setUnreadCount(c => c + 1);
      // Auto-open mailbox to show the email being "sent" in real-time, or trigger a toast!
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unread = emails.filter(e => !e.read).length;
    setUnreadCount(unread);
    if (emails.length > 0 && !selectedEmail) {
      setSelectedEmail(emails[0]);
    }
  }, [emails]);

  const handleOpen = () => {
    setIsOpen(true);
    // Mark all as read
    const updated = emails.map(e => ({ ...e, read: true }));
    setEmails(updated);
    localStorage.setItem('lumina_mock_emails', JSON.stringify(updated));
    setUnreadCount(0);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear the simulation email log?')) {
      clearEmails();
      setEmails([]);
      setSelectedEmail(null);
    }
  };

  const handleCopySubject = (subject: string) => {
    navigator.clipboard.writeText(subject);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <button
        onClick={handleOpen}
        id="dev-mailbox-trigger"
        className="fixed bottom-6 right-6 z-50 p-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-amber-400 group"
        title="Open Sandbox Developer Mailbox"
      >
        <Mail className="w-6 h-6 animate-pulse" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-slate-950 animate-bounce">
            {unreadCount}
          </span>
        )}
        <span className="absolute right-14 bg-slate-900 text-white border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap tracking-wider">
          DEVELOPER MAILBOX
        </span>
      </button>

      {/* INBOX EXPANDED PANEL MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div 
            id="dev-mailbox-container"
            className="w-full max-w-5xl h-[80vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header section */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <span>Developer Mailbox Simulator</span>
                    <span className="inline-flex items-center text-[9px] font-black tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                      Sandbox Mode
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Capture, inspect, and test outgoing transactional email flows from registration and purchases.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {emails.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="p-2 bg-slate-950 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    title="Clear Mailbox Logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear Inbox</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Screen Mailbox Container */}
            <div className="flex-grow flex overflow-hidden">
              {emails.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950/20">
                  <Mail className="w-16 h-16 text-slate-800 mb-4" />
                  <h4 className="text-base font-extrabold text-slate-300">Mailbox is currently empty</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                    Once you complete a <strong>new account registration</strong> or <strong>purchase an AI tool</strong>, the automated notification service will dispatch real-time transactional HTML receipts here.
                  </p>
                  <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl max-w-md text-[11px] text-indigo-400/90 leading-relaxed text-left">
                    <strong className="block text-indigo-300 uppercase font-bold text-[10px] mb-1">💡 Live Test Guide:</strong>
                    1. Try logging out and creating a new registration credentials block in the "Sign Up" modal.<br/>
                    2. Browse the marketplace catalogue, select any AI SaaS model, and purchase a mock billing tier.
                  </div>
                </div>
              ) : (
                <>
                  {/* Left panel: Email Listing (1/3rd width) */}
                  <div className="w-full sm:w-80 md:w-96 border-r border-slate-800 overflow-y-auto bg-slate-950/40 shrink-0">
                    <div className="divide-y divide-slate-850">
                      {emails.map((e) => {
                        const isSelected = selectedEmail?.id === e.id;
                        return (
                          <div
                            key={e.id}
                            onClick={() => setSelectedEmail(e)}
                            className={`p-4 text-left transition cursor-pointer relative border-l-2 ${
                              isSelected 
                                ? 'bg-amber-500/5 border-l-amber-500' 
                                : 'border-l-transparent hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${
                                e.type === 'welcome' 
                                  ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' 
                                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              }`}>
                                {e.type === 'welcome' ? 'Welcome' : 'Purchase'}
                              </span>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium font-mono">
                                <Clock className="w-3 h-3" />
                                <span>{e.sentAt.split(',')[1]?.trim() || e.sentAt}</span>
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-white leading-snug line-clamp-1">
                              {e.subject.replace(/⚡|🧾/, '').trim()}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-1 truncate">
                              To: <span className="font-mono text-slate-300">{e.to}</span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right panel: Full Email Viewer (2/3rds width) */}
                  <div className="flex-grow flex flex-col bg-slate-900 overflow-hidden">
                    {selectedEmail ? (
                      <div className="h-full flex flex-col">
                        {/* Selected email headers */}
                        <div className="p-5 border-b border-slate-800 bg-slate-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1 text-left">
                            <h4 className="text-sm font-extrabold text-white leading-tight">
                              {selectedEmail.subject}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                              <span>From: <strong className="text-slate-300">Lumina AI Platform &lt;no-reply@lumina.ai&gt;</strong></span>
                              <span>•</span>
                              <span>To: <strong className="text-amber-500 font-mono">{selectedEmail.to}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                            <button
                              onClick={() => handleCopySubject(selectedEmail.subject)}
                              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold border border-slate-800 transition flex items-center gap-1.5"
                            >
                              {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3" />}
                              <span>{copiedText ? 'Copied' : 'Copy Subject'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Interactive HTML Body Container */}
                        <div className="flex-grow p-6 overflow-y-auto bg-slate-950/30 flex items-start justify-center">
                          <div 
                            className="w-full max-w-2xl bg-[#020617] border border-slate-800 rounded-2xl shadow-lg p-1"
                            dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8">
                        <Mail className="w-12 h-12 text-slate-800 mb-3" />
                        <p className="text-xs">Select an email from the inbox list to inspect its contents.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer diagnostic tracker */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-500 font-bold flex items-center justify-between px-6">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Channels: Registration Trigger & stripe_checkout.session.completed</span>
              </span>
              <span>Total Simulated: {emails.length} Logs</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
