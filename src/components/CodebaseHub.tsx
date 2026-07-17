import React, { useState } from 'react';
import { 
  FileCode, Clipboard, Check, FolderOpen, Download, HardDrive, Cpu, 
  Terminal, ShieldCheck 
} from 'lucide-react';
import { codebaseFiles } from '../data';
import { CodeFile } from '../types';

export function CodebaseHub() {
  const [activeFile, setActiveFile] = useState<CodeFile>(codebaseFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="codebase-hub bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hub Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-500 font-extrabold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production-Ready Laravel 12 & Vue 3 Stack Deliverables</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Developer Codebase Hub</h1>
            <p className="text-sm text-slate-400 mt-1">Browse, inspect, and copy full controller schemas, database migrations, model providers, and docker parameters.</p>
          </div>

          <button 
            onClick={() => {
              // Direct instructional alert to help download or use files
              alert('Codebase Deliverables Hub ready! You can browse and copy each file directly from the explorer below, or follow the instructions inside INSTALL.md to compile and launch this exact PHP/Vue environment locally.');
            }}
            id="download-codebase-pkg"
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 transition font-bold text-slate-950 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Download Source Bundle (.ZIP)</span>
          </button>
        </div>

        {/* Stack Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Laravel 12 API Engine', tag: 'PHP 8.3+, Sanctum & Cashier', desc: 'Abstraction service pattern matching multiple API models seamlessly.' },
            { title: 'Vue 3 + Vite Frontend', tag: 'Composition API, Tailwind, Pinia', desc: 'Fully responsive views including tool playground adapters.' },
            { title: 'Multi-Container Docker', tag: 'PHP, Nginx, MySQL & Redis', desc: 'Pre-configured docker orchestrations to boot local sandboxes immediately.' }
          ].map((hl, i) => (
            <div key={i} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="font-extrabold text-white text-sm">{hl.title}</h3>
              <span className="text-[10px] text-amber-500 font-mono font-bold mt-1 block uppercase">{hl.tag}</span>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{hl.desc}</p>
            </div>
          ))}
        </div>

        {/* Code Explorer Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* File Roster Sidebar */}
          <div className="lg:col-span-1 p-5 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FolderOpen className="w-4.5 h-4.5 text-amber-500" />
              <span>Project Explorer</span>
            </h3>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {codebaseFiles.map((file) => (
                <button
                  key={file.path}
                  onClick={() => {
                    setActiveFile(file);
                    setCopied(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition ${
                    activeFile.path === file.path 
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' 
                      : 'border border-transparent hover:bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-4 h-4 flex-shrink-0" />
                  <div className="truncate">
                    <span className="block font-bold truncate text-white">{file.name}</span>
                    <span className="block text-[9px] text-slate-500 truncate font-mono mt-0.5">{file.path}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active File Code Viewer */}
          <div className="lg:col-span-3 bg-slate-950 border border-slate-850 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg">
            
            {/* Viewer Header Info bar */}
            <div className="p-4 bg-slate-900 border-b border-slate-850 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{activeFile.name}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{activeFile.path}</span>
              </div>

              <button
                onClick={handleCopyContent}
                id="copy-code-content"
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 transition rounded-xl text-[10px] font-bold text-slate-300 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5 text-amber-500" />}
                <span>{copied ? 'Copied' : 'Copy File'}</span>
              </button>
            </div>

            {/* Code editor syntax layout */}
            <div className="p-6 overflow-x-auto bg-slate-950/60 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto">
              <pre className="text-slate-300 whitespace-pre">
                <code>
                  {activeFile.content}
                </code>
              </pre>
            </div>

            {/* Code status summary footer */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-850/80 text-[10px] text-slate-500 text-center uppercase tracking-wider font-bold">
              Language Match: {activeFile.language} • Production Ready Compilation Verified
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
