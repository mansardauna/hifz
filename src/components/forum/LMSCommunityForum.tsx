import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  CheckCircle2,
  Award,
  Pin,
  Filter,
  Send,
  User,
  Clock,
  Sparkles,
  Tag,
  Mic,
  FileText,
  ChevronRight,
  ArrowLeft,
  Share2,
  Trash2,
  Check
} from 'lucide-react';

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: 'student' | 'instructor' | 'admin';
  authorAvatar?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isUpvoted?: boolean;
  isAcceptedAnswer?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  content: string;
  authorName: string;
  authorRole: 'student' | 'instructor' | 'admin';
  authorAvatar?: string;
  createdAt: string;
  repliesCount: number;
  upvotes: number;
  isUpvoted?: boolean;
  isPinned?: boolean;
  isSolved?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  audioUrl?: string;
  replies: ForumReply[];
}

interface LMSCommunityForumProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LMSCommunityForum: React.FC<LMSCommunityForumProps> = ({ onAddToast }) => {
  const { tenant, language, direction } = useTenant();
  const { user } = useAuth();
  const isAr = language === 'ar';

  const isCodingNiche = tenant.niche === 'coding' || tenant.subdomain.includes('code');

  const CATEGORIES = isCodingNiche
    ? [
        { id: 'all', label: 'All Channels', labelAr: 'جميع القنوات', icon: '🌐' },
        { id: 'general', label: 'General Discussion', labelAr: 'النقاش العام', icon: '💬' },
        { id: 'frontend', label: 'React & Next.js Lab', labelAr: 'مختبر رياكت ونكست', icon: '⚛️' },
        { id: 'backend', label: 'Cloud Architecture & DBs', labelAr: 'السحابة وقواعد البيانات', icon: '☁️' },
        { id: 'homework', label: 'Code Review & Assignments', labelAr: 'مراجعة الأكواد والواجبات', icon: '💻' },
        { id: 'career', label: 'Tech Career & Portfolio', labelAr: 'التوظيف والمشاريع', icon: '🚀' },
      ]
    : [
        { id: 'all', label: 'All Halaqahs', labelAr: 'جميع الحلقات', icon: '🕌' },
        { id: 'general', label: 'General Reflections & Halaqah', labelAr: 'تأملات ونقاش عام', icon: '📖' },
        { id: 'tajweed', label: 'Tajweed Rules & Makharij', labelAr: 'أحكام التجويد والمخارج', icon: '🎙️' },
        { id: 'hifz', label: 'Hifz & Muraja\'ah Techniques', labelAr: 'تقنيات الحفظ والمراجعة', icon: '🧠' },
        { id: 'homework', label: 'Recitation Submissions & Feedback', labelAr: 'واجبات التلاوة وتصحيحها', icon: '🎧' },
        { id: 'qiraat', label: 'Sanad & Ten Qira\'at Studies', labelAr: 'دراسات السند والقراءات', icon: '📜' },
      ];

  const INITIAL_POSTS: ForumPost[] = isCodingNiche
    ? [
        {
          id: 'post-c1',
          title: 'How to optimize Next.js 15 Server Actions with optimistic UI updates?',
          category: 'frontend',
          categoryName: 'React & Next.js Lab',
          content: 'I am building a live submission table and trying to use `useOptimistic` hook with Server Actions for immediate latency-free updates. Has anyone implemented this with custom error rollback?',
          authorName: 'Alex Morgan',
          authorRole: 'student',
          createdAt: '2 hours ago',
          repliesCount: 4,
          upvotes: 12,
          isPinned: true,
          isSolved: true,
          tags: ['nextjs', 'react19', 'optimistic-ui'],
          replies: [
            {
              id: 'rep-c1',
              authorName: 'Eng. Sarah Jenkins',
              authorRole: 'instructor',
              content: 'Great question! In Next.js 15, pair `useOptimistic` with `useActionState`. Wrap the mutation inside `startTransition` so React preserves the optimistic state until the server action returns.',
              createdAt: '1 hour ago',
              upvotes: 9,
              isAcceptedAnswer: true,
            },
            {
              id: 'rep-c2',
              authorName: 'Tariq Vance',
              authorRole: 'student',
              content: 'This helped me a lot too! Remember to provide a rollback payload in case the fetch rejects.',
              createdAt: '45 mins ago',
              upvotes: 3,
            }
          ]
        },
        {
          id: 'post-c2',
          title: 'PostgreSQL connection pooling strategy in Serverless Prisma edge workers',
          category: 'backend',
          categoryName: 'Cloud Architecture & DBs',
          content: 'When deploying Prisma client on Vercel Edge Functions, what connection pool size should we configure for Supabase transaction pooler on port 6543?',
          authorName: 'David Chen',
          authorRole: 'student',
          createdAt: '1 day ago',
          repliesCount: 2,
          upvotes: 7,
          tags: ['prisma', 'postgresql', 'supabase'],
          replies: [
            {
              id: 'rep-c3',
              authorName: 'Dr. Michael Roberts',
              authorRole: 'instructor',
              content: 'Set `connection_limit=1` on edge functions because each serverless isolate creates its own instance. The PgBouncer transaction pooler handles tenant concurrency gracefully.',
              createdAt: '18 hours ago',
              upvotes: 5,
              isAcceptedAnswer: true,
            }
          ]
        }
      ]
    : [
        {
          id: 'post-q1',
          title: 'Practical techniques to eliminate hesitation in Mutashabihat (Similar Ayahs) in Surah Al-Baqarah & Al-Imran?',
          category: 'hifz',
          categoryName: 'Hifz & Muraja\'ah Techniques',
          content: 'Assalamu alaykum. While doing Muraja\'ah between Surah Al-Baqarah (Ayah 61 vs 126) and Al-Imran, I sometimes mix up the wording of "فَادْعُ لَنَا رَبَّكَ" and ending phrases. What system of mnemonic rules or comparison tables do our instructors recommend?',
          authorName: 'Zaid Al-Harithi',
          authorRole: 'student',
          createdAt: '3 hours ago',
          repliesCount: 5,
          upvotes: 18,
          isPinned: true,
          isSolved: true,
          tags: ['mutashabihat', 'al-baqarah', 'murajaah-system'],
          replies: [
            {
              id: 'rep-q1',
              authorName: 'Shaykh Dr. Abdul Rahman (Sanad Al-Azhar)',
              authorRole: 'instructor',
              content: 'Wa alaykumu as-salam wa rahmatullah. A golden principle in Mutashabihat: Memorize the singular exception rather than the common rule. In Surah Al-Baqarah Ayah 61, note "مِمَّا تُنبِتُ الأَرْضُ" which is unique. Also, always practice reciting the 3 Ayahs before and 3 Ayahs after without looking.',
              createdAt: '2 hours ago',
              upvotes: 14,
              isAcceptedAnswer: true,
            },
            {
              id: 'rep-q2',
              authorName: 'Amina Khatun',
              authorRole: 'student',
              content: 'Jazakallahu khayran Shaykh! Writing both verses side by side on a notebook also helped me cement the visual memory.',
              createdAt: '1 hour ago',
              upvotes: 6,
            }
          ]
        },
        {
          id: 'post-q2',
          title: 'Clarification on Madd Lazim Kalimi Muthaqqal vs Mukhaffaf in Matn Tuhfat al-Atfal',
          category: 'tajweed',
          categoryName: 'Tajweed Rules & Makharij',
          content: 'In the chapter of Madd in Tuhfat al-Atfal, the author mentions the condition of Sukoon following a Harf Madd. Can we review why "الآنَ" in Surah Yunus is the only example of Mukhaffaf in Hafs \'an \'Asim?',
          authorName: 'Bilal Faris',
          authorRole: 'student',
          createdAt: 'Yesterday',
          repliesCount: 3,
          upvotes: 11,
          isSolved: true,
          tags: ['tuhfat-al-atfal', 'madd-lazim', 'tajweed-theory'],
          replies: [
            {
              id: 'rep-q3',
              authorName: 'Ustadh Omar Al-Madani',
              authorRole: 'instructor',
              content: 'Indeed! In "الآنَ", the Sukoon on the Lam (لْ) is unvoweled and not followed by a Shaddah (un-geminated), making it Mukhaffaf (lightened). In words like "الضَّالِّينَ", the Lam has a Shaddah, making it Muthaqqal (heavy).',
              createdAt: '16 hours ago',
              upvotes: 8,
              isAcceptedAnswer: true,
            }
          ]
        },
        {
          id: 'post-q3',
          title: 'Daily Muraja\'ah Schedule: Balancing 5 Juz New Memorization with Old Retention',
          category: 'general',
          categoryName: 'General Reflections & Halaqah',
          content: 'What is the most sustainable daily halaqah routine when managing university studies alongside a 1 Juz daily revision quota?',
          authorName: 'Tariq Mansoor',
          authorRole: 'student',
          createdAt: '2 days ago',
          repliesCount: 2,
          upvotes: 8,
          tags: ['routine', 'time-management', 'daily-halaqah'],
          replies: [
            {
              id: 'rep-q4',
              authorName: 'Sarah Al-Ghamdi',
              authorRole: 'student',
              content: 'I split the revision into 2 sessions: 1/2 Juz after Fajr (fresh mind) and 1/2 Juz after Maghrib before sleeping. Consistency beats quantity!',
              createdAt: '1 day ago',
              upvotes: 4,
            }
          ]
        }
      ];

  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // New Post Modal State
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>(CATEGORIES[1]?.id || 'general');
  const [newContent, setNewContent] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('');

  // Reply Input State
  const [replyText, setReplyText] = useState<string>('');

  // Local storage persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`tenant_forum_posts_${tenant.subdomain}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch (e) {
        console.warn('Error loading forum posts:', e);
      }
    }
  }, [tenant.subdomain]);

  const persistPosts = (updatedPosts: ForumPost[]) => {
    setPosts(updatedPosts);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`tenant_forum_posts_${tenant.subdomain}`, JSON.stringify(updatedPosts));
      } catch (e) {
        console.warn('Error saving forum posts:', e);
      }
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const activePost = posts.find((p) => p.id === activePostId) || null;

  // Handle Post Upvote
  const handleTogglePostUpvote = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isCurrentlyUpvoted = p.isUpvoted;
        return {
          ...p,
          isUpvoted: !isCurrentlyUpvoted,
          upvotes: isCurrentlyUpvoted ? p.upvotes - 1 : p.upvotes + 1,
        };
      }
      return p;
    });
    persistPosts(updated);
  };

  // Handle Reply Upvote
  const handleToggleReplyUpvote = (replyId: string) => {
    if (!activePostId) return;
    const updated = posts.map((p) => {
      if (p.id === activePostId) {
        return {
          ...p,
          replies: p.replies.map((r) => {
            if (r.id === replyId) {
              const isCurrentlyUpvoted = r.isUpvoted;
              return {
                ...r,
                isUpvoted: !isCurrentlyUpvoted,
                upvotes: isCurrentlyUpvoted ? r.upvotes - 1 : r.upvotes + 1,
              };
            }
            return r;
          }),
        };
      }
      return p;
    });
    persistPosts(updated);
  };

  // Submit New Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      onAddToast({ type: 'error', title: 'Missing Information', message: 'Title and content are required.' });
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === newCategory) || CATEGORIES[1];
    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''))
      .filter(Boolean);

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryName: catObj.label,
      content: newContent.trim(),
      authorName: user?.name || 'Academy Student',
      authorRole: (user?.role as any) || 'student',
      createdAt: 'Just now',
      repliesCount: 0,
      upvotes: 1,
      isUpvoted: true,
      tags: tagsArray.length > 0 ? tagsArray : ['halaqah', 'general'],
      replies: [],
    };

    const updated = [newPost, ...posts];
    persistPosts(updated);
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setActivePostId(newPost.id);

    onAddToast({
      type: 'success',
      title: 'Discussion Published',
      message: 'Your topic is now active in the community halaqah channel.',
    });
  };

  // Submit Reply
  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activePostId) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      authorName: user?.name || (user?.role === 'admin' ? 'Shaykh / Instructor' : 'Academy Student'),
      authorRole: (user?.role as any) || 'student',
      content: replyText.trim(),
      createdAt: 'Just now',
      upvotes: 0,
    };

    const updated = posts.map((p) => {
      if (p.id === activePostId) {
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          replies: [...p.replies, newReply],
        };
      }
      return p;
    });

    persistPosts(updated);
    setReplyText('');
    onAddToast({
      type: 'success',
      title: 'Reply Posted',
      message: 'Your contribution has been added to the discussion.',
    });
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 animate-in fade-in duration-200">
      {/* 1. Header Banner & Action Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {isCodingNiche ? 'Community Developer Forum' : 'Halaqah Community & Q&A Forum'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {isCodingNiche
                  ? 'Ask code questions, share architecture reviews, and collaborate with mentors.'
                  : 'Discuss Tajweed rules, Muraja\'ah strategies, and receive verified answers from our Sanad scholars.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>
        </div>
      </div>

      {/* 2. Main Forum Layout (Split Channels Sidebar + Posts / Thread View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Channels & Categories */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, questions, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs"
            />
          </div>

          {/* Channels List */}
          <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Discussion Channels</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">
                {CATEGORIES.length - 1} Channels
              </span>
            </div>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? posts.length
                  : posts.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActivePostId(null);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-blue-200/70 text-blue-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Guidance Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="font-extrabold text-xs">Community Etiquette</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Tag questions with specific Surahs, Tajweed terms, or code stacks so teachers and peers can assist rapidly.
            </p>
          </div>
        </div>

        {/* Right Content Area: Either Post Detail View OR Posts Feed */}
        <div className="lg:col-span-8 space-y-4">
          {activePost ? (
            /* 3. ACTIVE THREAD DETAIL VIEW */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Back Bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <button
                  onClick={() => setActivePostId(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Discussions</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold">
                    {activePost.categoryName}
                  </span>
                  {activePost.isSolved && (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Solved
                    </span>
                  )}
                </div>
              </div>

              {/* Main Post Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {activePost.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-800">{activePost.authorName}</span>
                      {activePost.authorRole === 'instructor' && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">
                          Verified Instructor
                        </span>
                      )}
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activePost.createdAt}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePostUpvote(activePost.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      activePost.isUpvoted
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{activePost.upvotes}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {activePost.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Replies Section */}
              <div className="p-6 bg-slate-50/80 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span>Replies & Answers ({activePost.replies.length})</span>
                  </h3>
                </div>

                {activePost.replies.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No replies yet. Be the first to answer this question!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activePost.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-2xl bg-white border transition-all ${
                          reply.isAcceptedAnswer
                            ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs'
                            : 'border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">
                              {reply.authorName}
                            </span>
                            {reply.authorRole === 'instructor' && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold rounded-md flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Teacher
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">&bull; {reply.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {reply.isAcceptedAnswer && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified Solution
                              </span>
                            )}
                            <button
                              onClick={() => handleToggleReplyUpvote(reply.id)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                reply.isUpvoted
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{reply.upvotes}</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form Input */}
                <form onSubmit={handleAddReply} className="pt-3 space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Write Your Answer / Contribution
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share an explanation, reference an Ayah or code solution..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* 4. POSTS FEED LIST VIEW */
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-bold">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">No discussions found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching with another keyword or start a new topic in this channel.
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setActivePostId(post.id)}
                    className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
                  >
                    {/* Top Row: Category + Author + Solved Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold">
                          {post.categoryName}
                        </span>
                        {post.isPinned && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold flex items-center gap-1">
                            <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Pinned
                          </span>
                        )}
                        {post.isSolved && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Solved
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.createdAt}
                      </span>
                    </div>

                    {/* Title & Preview */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Bottom Row: Tags + Stats */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleTogglePostUpvote(post.id, e)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                            post.isUpvoted ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.upvotes}</span>
                        </button>

                        <span className="inline-flex items-center gap-1 font-bold text-slate-600">
                          <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>{post.repliesCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. NEW DISCUSSION TOPIC MODAL */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Start New Community Discussion</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Discussion Channel</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Topic Title / Question</label>
                <input
                  type="text"
                  placeholder="e.g. Question on Madd Arid Li-Sukoon rules in Surah Al-Kahf"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Description & Context</label>
                <textarea
                  rows={4}
                  placeholder="Explain your question with specific Ayahs, notes, or background..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. tajweed, surah-kahf, recitation"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Publish Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
