import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { CopyCheck, Copy } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <pre className={`code-block ${className || ''}`}>
      <button
        onClick={handleCopy}
        className="code-copy-button"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <CopyCheck className="inline w-4 h-4 mr-1" />
            Copied
          </>
        ) : (
          <>
            <Copy className="inline w-4 h-4 mr-1" />
            Copy
          </>
        )}
      </button>
      <code>{children}</code>
    </pre>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code({ node, className, children, ...props }: any) {
            const inline = !className;
            if (inline) {
              return <code className="inline-code" {...props}>{children}</code>;
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          a({ node, children, href, ...props }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          img({ node, src, alt, ...props }) {
            return <img src={src} alt={alt || ''} loading="lazy" {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
