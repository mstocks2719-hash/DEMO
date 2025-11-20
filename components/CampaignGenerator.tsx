import React, { useState } from 'react';
import { Wand2, Loader2, Layout, Target, MessageCircle, Layers, Instagram, Linkedin, Twitter, Facebook, Link2 } from 'lucide-react';
import { Campaign, Post, SocialAccount } from '../types';
import { generateCampaignStrategy, generateImage } from '../services/gemini';
import { PostCard } from './PostCard';

const simpleId = () => Math.random().toString(36).substring(2, 11);

export const CampaignGenerator: React.FC = () => {
  const [loadingStep, setLoadingStep] = useState<'idle' | 'strategy' | 'images'>('idle');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  
  // Form State
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [platform, setPlatform] = useState('Instagram');

  // Social Accounts State
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { platform: 'Instagram', username: '@market_mind', connected: false, icon: Instagram },
    { platform: 'LinkedIn', username: 'MarketMind Inc.', connected: false, icon: Linkedin },
    { platform: 'Twitter', username: '@marketmind_ai', connected: false, icon: Twitter },
    { platform: 'Facebook', username: 'MarketMind AI', connected: false, icon: Facebook },
  ]);

  const toggleAccount = (targetPlatform: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.platform === targetPlatform 
        ? { ...acc, connected: !acc.connected } 
        : acc
    ));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoadingStep('strategy');
    setCampaign(null);

    try {
      // 1. Generate Text Strategy
      const strategyData = await generateCampaignStrategy(topic, audience || 'General Public', tone || 'Professional', platform);
      
      const newPosts: Post[] = strategyData.posts.map((p: any) => ({
        id: simpleId(),
        headline: p.headline,
        body: p.body,
        hashtags: p.hashtags,
        imagePrompt: p.imagePrompt,
        isGeneratingImage: true, 
        posted: false
      }));

      const newCampaign: Campaign = {
        id: simpleId(),
        title: strategyData.campaignTitle,
        description: topic,
        targetAudience: audience,
        platform: platform,
        posts: newPosts,
        createdAt: new Date(),
      };

      setCampaign(newCampaign);
      setLoadingStep('images');

      // 2. Generate Images in Parallel
      await Promise.all(newPosts.map(async (post) => {
        try {
          const imgResult = await generateImage(post.imagePrompt);
          const imageUrl = `data:${imgResult.mimeType};base64,${imgResult.base64}`;
          
          setCampaign(prev => {
            if (!prev) return null;
            return {
              ...prev,
              posts: prev.posts.map(p => 
                p.id === post.id 
                  ? { ...p, imageUrl, isGeneratingImage: false } 
                  : p
              )
            };
          });
        } catch (err) {
            console.error(`Failed to generate image for post ${post.id}`, err);
            setCampaign(prev => {
                if (!prev) return null;
                return {
                  ...prev,
                  posts: prev.posts.map(p => 
                    p.id === post.id 
                      ? { ...p, isGeneratingImage: false } 
                      : p
                  )
                };
              });
        }
      }));
      
      setLoadingStep('idle');

    } catch (error) {
      console.error("Campaign generation failed", error);
      setLoadingStep('idle');
      alert("Failed to generate campaign. Please ensure your API KEY is set correctly.");
    }
  };

  const regenerateImageForPost = async (post: Post) => {
    if (!campaign) return;

    setCampaign(prev => {
        if (!prev) return null;
        return {
            ...prev,
            posts: prev.posts.map(p => p.id === post.id ? { ...p, isGeneratingImage: true } : p)
        };
    });

    try {
        const imgResult = await generateImage(post.imagePrompt);
        const imageUrl = `data:${imgResult.mimeType};base64,${imgResult.base64}`;

        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                posts: prev.posts.map(p => p.id === post.id ? { ...p, imageUrl, isGeneratingImage: false } : p)
            };
        });
    } catch (e) {
        console.error(e);
        setCampaign(prev => {
            if (!prev) return null;
            return {
                ...prev,
                posts: prev.posts.map(p => p.id === post.id ? { ...p, isGeneratingImage: false } : p)
            };
        });
    }
  };

  const handlePostContent = (post: Post) => {
    setCampaign(prev => {
      if (!prev) return null;
      return {
        ...prev,
        posts: prev.posts.map(p => p.id === post.id ? { ...p, posted: true } : p)
      };
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Left Sidebar - Controls */}
      <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Layers className="text-indigo-600" size={20} />
              Campaign Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">Define your marketing goals</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Product</label>
              <textarea
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm min-h-[80px] outline-none transition-shadow"
                placeholder="e.g. Summer launch of a new organic cold brew coffee..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <div className="relative">
                <Target size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm outline-none transition-shadow"
                  placeholder="e.g. Young professionals"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <div className="relative">
                    <MessageCircle size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm outline-none transition-shadow"
                    placeholder="e.g. Witty"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white outline-none"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingStep !== 'idle' || !topic}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${
                loadingStep !== 'idle' 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {loadingStep === 'idle' ? (
                <>
                  <Wand2 size={18} />
                  Generate Campaign
                </>
              ) : (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {loadingStep === 'strategy' ? 'Drafting Strategy...' : 'Creating Visuals...'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Social Integrations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Link2 className="text-indigo-600" size={18} />
              Connected Accounts
            </h2>
          </div>
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div key={acc.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${acc.connected ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                    <acc.icon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-700">{acc.platform}</div>
                    <div className="text-[10px] text-gray-500">{acc.connected ? acc.username : 'Not connected'}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleAccount(acc.platform)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    acc.connected 
                      ? 'bg-white border-red-200 text-red-500 hover:bg-red-50' 
                      : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {acc.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - Results */}
      <div className="flex-1 min-h-[500px]">
        {!campaign && loadingStep === 'idle' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Layout size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Ready to create?</p>
            <p className="text-sm">Fill out the details to generate your campaign.</p>
          </div>
        )}

        {campaign && (
            <div className="animate-fadeIn pb-12">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{campaign.title}</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold uppercase">{campaign.platform}</span>
                            Targeting: {campaign.targetAudience}
                        </p>
                    </div>
                    {loadingStep === 'images' && (
                        <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            <Loader2 size={14} className="animate-spin" />
                            Generating visuals...
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {campaign.posts.map((post) => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onRegenerateImage={regenerateImageForPost}
                            onPost={handlePostContent}
                            isConnected={accounts.find(a => a.platform === campaign.platform || (campaign.platform === 'Twitter' && a.platform === 'Twitter'))?.connected || false}
                            platformName={campaign.platform}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};