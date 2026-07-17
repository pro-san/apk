import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Send, 
  ExternalLink 
} from 'lucide-react';
import { AITool } from '../types';

interface ShareMenuProps {
  tool: AITool;
}

export function ShareMenu({ tool }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getShareDetails = () => {
    const url = `${window.location.origin}${window.location.pathname}?tool=${tool.id}`;
    const title = `Lumina AI - ${tool.name}`;
    const text = `Check out ${tool.name} on Lumina AI! ${tool.tagline}`;
    return { url, title, text };
  };

  const handleNativeShare = async () => {
    const { url, title, text } = getShareDetails();
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.log('Error sharing via Native Web Share API:', err);
      }
    } else {
      // Fallback
      setIsOpen(!isOpen);
    }
  };

  const handleCopyLink = async () => {
    const { url } = getShareDetails();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const { url, title, text } = getShareDetails();

  // Social Links mapping
  const socialShares = [
    {
      name: 'Twitter / X',
      icon: Twitter,
      colorClass: 'text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/30',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      colorClass: 'text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/30',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      colorClass: 'text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      colorClass: 'text-indigo-500 hover:bg-indigo-500/10 hover:border-indigo-500/30',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      colorClass: 'text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\nPermalink: ${url}`)}`,
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef} id={`share-container-${tool.id}`}>
      {/* Dynamic toggle checks if native share is active, else opens dropdown menu */}
      <button
        onClick={navigator.share ? handleNativeShare : () => setIsOpen(!isOpen)}
        id="share-tool-btn"
        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition duration-200 cursor-pointer shadow-lg active:scale-95"
        title={navigator.share ? 'Share with mobile native app sheet' : 'Open custom social sharing links'}
      >
        <Share2 className="w-3.5 h-3.5 text-amber-500" />
        <span>Share AI Tool</span>
      </button>

      {/* DROPDOWN POP-OVER */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-slate-900 border border-slate-800 p-3 shadow-2xl z-50 animate-fadeIn"
          style={{ transformOrigin: 'top right' }}
          id="share-dropdown-menu"
        >
          <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider px-2.5 py-1.5 border-b border-slate-850/60 mb-2">
            Share Capability
          </div>

          {/* Quick Copy Link Row */}
          <button
            onClick={handleCopyLink}
            id="share-copy-permalink"
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-950/60 border border-transparent hover:border-slate-800 text-left transition duration-200 group mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold text-slate-200">
                {copied ? 'Copied to Clipboard!' : 'Copy Permalink'}
              </span>
            </div>
            {!copied && <span className="text-[9px] text-slate-600 font-mono">LINK</span>}
          </button>

          {/* Individual Social Targets */}
          <div className="space-y-1">
            {socialShares.map((social) => {
              const IconComp = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-2 rounded-xl border border-transparent text-left transition duration-200 ${social.colorClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4" />
                    <span className="text-xs text-slate-300 font-medium">{social.name}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-850/60 text-[8px] text-slate-500 text-center leading-relaxed">
            Shares the live interactive sandbox link.
          </div>
        </div>
      )}
    </div>
  );
}
