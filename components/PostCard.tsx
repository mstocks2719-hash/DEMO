import React from 'react';
import { RefreshCw, Check, Copy, Share2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onRegenerateImage: (post: Post) => void;
  onPost: (post: Post) => void;
  isConnected: boolean;
  platformName: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onRegenerateImage,
  onPost,
  isConnected,
  platformName
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `${post.headline}\n\n${post.body}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      {/* Image Area */}
      <div className="relative bg-gray-100 aspect-square w-full group overflow-hidden">
        {post.isGeneratingImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs font-medium">Generating visual...</span>
          </div>
        ) : post.imageUrl ? (
          <>
            <img 
              src={post.imageUrl} 
              alt={post.headline} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <button
              onClick={() => onRegenerateImage(post)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0"
              title="Regenerate Image"
            >
              <RefreshCw size={14} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-xs">Image failed</span>
            <button 
                onClick={() => onRegenerateImage(post)}
                className="mt-2 text-indigo-600 text-xs hover:underline"
            >
                Try Again
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 leading-tight mb-2">{post.headline}</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{post.body}</p>
        </div>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1 mb-4">
            {post.hashtags.map(tag => (
              <span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                #{tag.replace('#', '')}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              onClick={() => onPost(post)}
              disabled={!isConnected || post.posted}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                post.posted 
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : !isConnected 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md shadow-gray-200'
              }`}
            >
              {post.posted ? (
                <>
                  <Check size={14} /> Posted
                </>
              ) : (
                <>
                  <Share2 size={14} /> {isConnected ? `Post to ${platformName}` : 'Connect Account'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};