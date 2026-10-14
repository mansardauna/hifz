import React, { useState, useEffect, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { isDemoTenant } from '../../lib/tenants';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../ui/Toast';
import {
  getClassroomConfig,
  saveClassroomConfig,
  detectTenantNicheType,
  ForumChannelConfig
} from '../../services/classroomCustomizationService';
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
  Trash2,
  Check,
  Globe,
  Code2,
  Server,
  Laptop,
  Rocket,
  BookOpen,
  Book,
  Headphones
} from 'lucide-react';

const getCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Globe': return <Globe className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'Code2': return <Code2 className={className} />;
    case 'Server': return <Server className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'Rocket': return <Rocket className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Book': return <Book className={className} />;
    case 'Mic': return <Mic className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'Award': return <Award className={className} />;
    default: return <MessageSquare className={className} />;
  }
};

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: 'student' | 'instructor' | 'admin';
  authorAvatar?: string;
  content: string;
  createdAt: string;
  upvotes?: number;
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
  const { tenant, updateTenantConfig, language, direction } = useTenant();
  const { user } = useAuth();
  const isAr = language === 'ar';

  const nicheType = detectTenantNicheType(tenant);
  const isCodingNiche = nicheType === 'coding';
  const isQuranNiche = nicheType === 'quran';

  const classroomConfig = getClassroomConfig(tenant);
  const [categories, setCategories] = useState<ForumChannelConfig[]>(() => classroomConfig.forumChannels);

  useEffect(() => {
    const cfg = getClassroomConfig(tenant);
    setCategories(cfg.forumChannels);
  }, [tenant]);

  // Channel Creation Modal State
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
  const [newChannelLabel, setNewChannelLabel] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelIcon, setNewChannelIcon] = useState('MessageSquare');

  const INITIAL_POSTS: ForumPost[] = useMemo(() => {
    if (isCodingNiche) {
      return [
        {
          id: 'post-c1',
          title: 'How to optimize Next.js 15 Server Actions with optimistic UI updates?',
          category: 'frontend',
          categoryName: 'Frontend & UI Engineering',
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
          categoryName: 'Backend & Cloud DBs',
          content: 'When deploying Prisma client on Vercel Edge Functions, what connection pool size should we configure for the PgBouncer transaction pooler on port 6543?',
          authorName: 'David Chen',
          authorRole: 'student',
          createdAt: '1 day ago',
          repliesCount: 2,
          upvotes: 7,
          tags: ['prisma', 'postgresql', 'pgbouncer'],
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
      ];
    }

    if (nicheType === 'school') {
      return [
        {
          id: 'post-s1',
          title: 'Derivation techniques for multivariable integration and vector fields',
          category: 'stem',
          categoryName: 'Mathematics & Science Hall',
          content: 'In our advanced mathematics module, what is the most intuitive method for setting up triple integrals over spherical coordinate volumes?',
          authorName: 'Liam Davis',
          authorRole: 'student',
          createdAt: '3 hours ago',
          repliesCount: 3,
          upvotes: 14,
          isPinned: true,
          isSolved: true,
          tags: ['calculus', 'stem', 'mathematics'],
          replies: [
            {
              id: 'rep-s1',
              authorName: 'Dr. Evelyn Reed',
              authorRole: 'instructor',
              content: 'Always draw the cross-sectional projection onto the xy-plane first. Once theta and phi boundaries are established, integrate the radial distance rho from inner to outer boundary.',
              createdAt: '2 hours ago',
              upvotes: 11,
              isAcceptedAnswer: true,
            }
          ]
        },
        {
          id: 'post-s2',
          title: 'Midterm Research Paper Outline & Primary Source Citations',
          category: 'humanities',
          categoryName: 'Humanities & Literature',
          content: 'Are Chicago Manual of Style notes and bibliography preferred over APA formatting for our comparative history research submissions?',
          authorName: 'Emily Watson',
          authorRole: 'student',
          createdAt: 'Yesterday',
          repliesCount: 2,
          upvotes: 6,
          tags: ['history', 'citations', 'research'],
          replies: [
            {
              id: 'rep-s2',
              authorName: 'Prof. Julian Vance',
              authorRole: 'instructor',
              content: 'Yes, please adhere to Chicago 17th Edition Notes and Bibliography format for all primary source citations.',
              createdAt: '18 hours ago',
              upvotes: 7,
              isAcceptedAnswer: true,
            }
          ]
        }
      ];
    }

    if (isQuranNiche) {
      return [
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
    }

    // GENERAL ACADEMY POSTS
    return [
      {
        id: 'post-g1',
        title: 'Effective methodology for completing practical coursework assignments',
        category: 'lessons',
        categoryName: 'Lessons & Coursework Q&A',
        content: 'When completing our weekly competency case study, what documentation structure provides the most thorough evidence of foundational understanding?',
        authorName: 'Jordan Taylor',
        authorRole: 'student',
        createdAt: '3 hours ago',
        repliesCount: 3,
        upvotes: 10,
        isPinned: true,
        isSolved: true,
        tags: ['coursework', 'methodology', 'assignments'],
        replies: [
          {
            id: 'rep-g1',
            authorName: 'Lead Instructor Davis',
            authorRole: 'instructor',
            content: 'Follow the 3-step synthesis framework: state the baseline parameters, outline your step-by-step methodology, and summarize findings with objective metrics.',
            createdAt: '2 hours ago',
            upvotes: 8,
            isAcceptedAnswer: true,
          }
        ]
      },
      {
        id: 'post-g2',
        title: 'Study group coordination for upcoming module review and evaluation',
        category: 'study_groups',
        categoryName: 'Study Groups & Peer Support',
        content: 'Would anyone like to schedule a peer study session this Thursday evening to prepare for the upcoming module evaluation?',
        authorName: 'Samira Vance',
        authorRole: 'student',
        createdAt: 'Yesterday',
        repliesCount: 2,
        upvotes: 6,
        tags: ['study-group', 'review', 'collaboration'],
        replies: [
          {
            id: 'rep-g2',
            authorName: 'Alex Morgan',
            authorRole: 'student',
            content: 'Count me in! Thursday at 6:00 PM works perfectly. Let us review the rubric criteria together.',
            createdAt: '14 hours ago',
            upvotes: 5,
            isAcceptedAnswer: true,
          }
        ]
      }
    ];
  }, [isCodingNiche, nicheType, isQuranNiche]);

  const isDemo = isDemoTenant(tenant.subdomain);

  const [posts, setPosts] = useState<ForumPost[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`tenant_forum_posts_${tenant.subdomain}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return isDemo ? INITIAL_POSTS : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // New Post Modal State
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>(categories[1]?.id || 'general');
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
          if (Array.isArray(parsed)) {
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

    const catObj = categories.find((c) => c.id === newCategory) || categories[1] || { label: 'General' };
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
      tags: tagsArray.length > 0 ? tagsArray : [isQuranNiche ? 'halaqah' : 'course', 'general'],
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
      message: `Your topic is now active in the "${catObj.label}" channel.`,
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

  const handleAddChannel = () => {
    const trimmed = newChannelLabel.trim();
    if (!trimmed) return;
    const newId = trimmed.toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
    const newChan: ForumChannelConfig = {
      id: newId,
      label: trimmed,
      description: newChannelDesc.trim() || undefined,
      icon: newChannelIcon,
    };
    const updated = [...categories, newChan];
    setCategories(updated);
    saveClassroomConfig(tenant, { forumChannels: updated }, updateTenantConfig);
    setIsAddChannelModalOpen(false);
    setNewChannelLabel('');
    setNewChannelDesc('');
    onAddToast({ type: 'success', title: 'Channel Created', message: `Channel "${trimmed}" has been added.` });
  };

  const handleRemoveChannel = (chanId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chanId === 'all') return;
    const updated = categories.filter((c) => c.id !== chanId);
    setCategories(updated);
    saveClassroomConfig(tenant, { forumChannels: updated }, updateTenantConfig);
    if (selectedCategory === chanId) {
      setSelectedCategory('all');
    }
    onAddToast({ type: 'info', title: 'Channel Removed', message: 'Channel deleted successfully.' });
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 animate-in fade-in duration-200">
      {/* 1. Header Banner & Action Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                {isCodingNiche ? 'Community Developer Forum' : isQuranNiche ? 'Halaqah Community & Q&A Forum' : `${tenant.name || 'Academy'} Community Forum`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {isCodingNiche
                  ? 'Ask code questions, share architecture reviews, and collaborate with mentors.'
                  : isQuranNiche
                  ? 'Discuss Tajweed rules, Muraja\'ah strategies, and receive verified answers from our Sanad scholars.'
                  : 'Engage with fellow students and instructors, ask questions, and share insights across course channels.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-primary,#047857)] hover:brightness-95 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 outline-none"
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
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 capitalize tracking-wider flex items-center justify-between">
              <span>Discussion Channels</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-semibold text-slate-600">
                  {categories.filter((c) => c.id !== 'all').length} Channels
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddChannelModalOpen(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Add Channel"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? posts.length
                  : posts.filter((p) => p.category === cat.id).length;

              return (
                <div key={cat.id} className="group relative flex items-center">
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActivePostId(null);
                    }}
                    className={`flex-1 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {getCategoryIcon(cat.icon || 'MessageSquare', isSelected ? 'w-4 h-4 text-blue-600' : 'w-4 h-4 text-slate-400')}
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-blue-200/70 text-blue-900' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                  {cat.id !== 'all' && (user?.role === 'admin' || !user) && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveChannel(cat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-opacity ml-1 cursor-pointer"
                      title="Delete channel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="font-semibold text-xs">Community Etiquette</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isQuranNiche
                ? 'Tag questions with specific Surahs, Tajweed terms, or halaqah topics so teachers and peers can assist rapidly.'
                : isCodingNiche
                ? 'Tag questions with specific frameworks, error logs, or code stacks so mentors and peers can assist rapidly.'
                : 'Tag questions with specific course modules, lesson topics, or concepts so instructors and peers can assist rapidly.'}
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
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Discussions</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-semibold">
                    {activePost.categoryName}
                  </span>
                  {activePost.isSolved && (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-semibold inline-flex items-center gap-1">
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
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-snug">
                      {activePost.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{activePost.authorName}</span>
                      {activePost.authorRole === 'instructor' && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-semibold rounded-full">
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
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
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
                  <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
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
                            <span className="font-semibold text-xs text-slate-900">
                              {reply.authorName}
                            </span>
                            {reply.authorRole === 'instructor' && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-semibold rounded-md flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Teacher
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">&bull; {reply.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {reply.isAcceptedAnswer && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified Solution
                              </span>
                            )}
                            <button
                              onClick={() => handleToggleReplyUpvote(reply.id)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
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
                  <label className="block text-xs font-semibold text-slate-800">
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
                      className="px-5 py-2.5 bg-[var(--color-primary,#047857)] hover:brightness-95 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer outline-none"
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
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary,#047857)]/10 text-[var(--color-primary,#047857)] flex items-center justify-center mx-auto font-semibold shadow-xs">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-slate-900">No discussions yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Be the first to start a conversation, ask a question, or post an announcement in this academy channel.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewPostModalOpen(true)}
                    className="px-5 py-2.5 bg-[var(--color-primary,#047857)] hover:brightness-95 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2 outline-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start First Discussion</span>
                  </button>
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
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-semibold">
                          {post.categoryName}
                        </span>
                        {post.isPinned && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-semibold flex items-center gap-1">
                            <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Pinned
                          </span>
                        )}
                        {post.isSolved && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-semibold flex items-center gap-1">
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
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
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
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                            post.isUpvoted ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.upvotes}</span>
                        </button>

                        <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
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
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Start New Community Discussion</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-semibold text-xs"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Discussion Channel</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  {categories.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Topic Title / Question</label>
                <input
                  type="text"
                  placeholder={isQuranNiche ? "e.g. Question on Madd Arid Li-Sukoon rules in Surah Al-Kahf" : isCodingNiche ? "e.g. Next.js 15 Server Actions error handling" : "e.g. Question on Module 2 practical exercises"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Description & Context</label>
                <textarea
                  rows={4}
                  placeholder={isQuranNiche ? "Explain your question with specific Ayahs, notes, or background..." : "Explain your question or discussion context..."}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder={isQuranNiche ? "e.g. tajweed, surah-kahf, recitation" : isCodingNiche ? "e.g. react, nextjs, api" : "e.g. module1, coursework, practical"}
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--color-primary,#047857)] hover:brightness-95 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer outline-none"
                >
                  Publish Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD DISCUSSION CHANNEL MODAL */}
      {isAddChannelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-primary,#047857)]/10 text-[var(--color-primary,#047857)] flex items-center justify-center font-semibold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Create Discussion Channel</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddChannelModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-semibold text-xs outline-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Channel Name / Label</label>
                <input
                  type="text"
                  placeholder="e.g. Study Groups & Peer Help"
                  value={newChannelLabel}
                  onChange={(e) => setNewChannelLabel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#047857)]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Channel Purpose / Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of discussions suited for this channel..."
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#047857)]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Channel Icon</label>
                <select
                  value={newChannelIcon}
                  onChange={(e) => setNewChannelIcon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:outline-none"
                >
                  <option value="MessageSquare">MessageSquare (Discussion)</option>
                  <option value="BookOpen">BookOpen (Academics / Curriculum)</option>
                  <option value="Laptop">Laptop (Homework / Assignments)</option>
                  <option value="Rocket">Rocket (Projects / Career)</option>
                  <option value="Sparkles">Sparkles (Techniques / Highlights)</option>
                  <option value="Award">Award (Certificates / Office Hours)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddChannelModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors cursor-pointer outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddChannel}
                  className="px-6 py-2.5 bg-[var(--color-primary,#047857)] hover:brightness-95 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer outline-none"
                >
                  Create Channel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
