import type { FakePost } from "../fakeContent";

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const AVATAR_COLORS = [
  "#ff4500","#ff585b","#ffd635","#46d160","#0dd3bb",
  "#25b79f","#46a508","#0079d3","#7193ff","#ff66ac",
];

function avatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function Avatar({ name, size = 8 }: { name: string; size?: number }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold`}
      style={{ background: avatarColor(name), fontSize: size * 2 }}
    >
      {name[0].toUpperCase()}
    </div>
  );
}

const AWARDS = [
  { emoji: "🏅", label: "Silver" },
  { emoji: "🥇", label: "Gold" },
  { emoji: "🏆", label: "Platinum" },
  { emoji: "❤️", label: "Helpful" },
  { emoji: "✨", label: "Wholesome" },
  { emoji: "🤯", label: "Mind Blown" },
];

function randomAwards(seed: string): typeof AWARDS {
  const n = seed.charCodeAt(0) % 4;
  if (n === 0) return [];
  return AWARDS.slice(0, n);
}

const FLAIRS = ["Discussion", "Question", "Rant", "Advice Needed", "Story Time", "Hot Take", "PSA", "Meta"];
function randomFlair(seed: string): string {
  return FLAIRS[seed.charCodeAt(1) % FLAIRS.length];
}

const COMMENT_VOTES = [2, 4, 7, 11, 15, 23, 38, 42, 67, 112, 234, 891];
function commentVotes(seed: string): number {
  return COMMENT_VOTES[seed.charCodeAt(0) % COMMENT_VOTES.length];
}

const MEMBER_COUNTS = ["1.2M", "3.4M", "892K", "156K", "4.7M", "22.3K", "501K", "2.1M"];
const ONLINE_COUNTS = ["4.2K", "1.1K", "892", "3.7K", "12.4K", "214", "8.9K", "2.3K"];

function subStats(sub: string) {
  const i = sub.charCodeAt(2) % MEMBER_COUNTS.length;
  return { members: MEMBER_COUNTS[i], online: ONLINE_COUNTS[i] };
}

export default function MockReddit({ post }: { post: FakePost }) {
  const awards = randomAwards(post.username);
  const flair = randomFlair(post.username);
  const { members, online } = subStats(post.subreddit ?? "r/all");
  const upvotePct = 88 + (post.username.charCodeAt(0) % 11);

  return (
    <div className="bg-[#dae0e6] min-h-screen font-sans text-[#1c1c1c] text-sm select-none">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-[#edeff1] h-12 flex items-center px-4 gap-4 sticky top-0 z-10">
        {/* Reddit logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-8 h-8 bg-[#ff4500] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-black">r/</span>
          </div>
          <span className="font-bold text-[#1c1c1c] text-base hidden sm:block">reddit</span>
        </div>

        {/* search bar */}
        <div className="flex-1 max-w-lg">
          <div className="flex items-center bg-[#f6f7f8] border border-[#edeff1] rounded-full px-3 py-1.5 gap-2 hover:border-[#0079d3] hover:bg-white">
            <span className="text-[#878a8c] text-xs">🔍</span>
            <span className="text-[#878a8c] text-xs">Search Reddit</span>
          </div>
        </div>

        {/* right nav */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <button className="hidden sm:block text-xs text-[#0079d3] border border-[#0079d3] rounded-full px-3 py-1 font-bold hover:bg-[#e8f0fe]">Log In</button>
          <button className="text-xs bg-[#ff4500] text-white rounded-full px-3 py-1 font-bold hover:bg-[#e03d00]">Sign Up</button>
          <span className="text-[#878a8c] text-lg cursor-pointer">⋯</span>
        </div>
      </nav>

      {/* ── Page body ── */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 pt-4 flex gap-6">

        {/* ── Main column ── */}
        <div className="flex-1 min-w-0">

          {/* Post card */}
          <div className="bg-white border border-[#ccc] rounded-md hover:border-[#898989] mb-3">
            <div className="flex">

              {/* Vote column */}
              <div className="bg-[#f8f9fa] w-10 flex-shrink-0 flex flex-col items-center pt-3 gap-0.5 rounded-l-md">
                <button className="text-[#878a8c] hover:text-[#ff4500] text-base leading-none p-0.5">▲</button>
                <span className="text-xs font-bold text-[#1c1c1c]">{formatNum(post.upvotes!)}</span>
                <button className="text-[#878a8c] hover:text-[#7193ff] text-base leading-none p-0.5">▼</button>
              </div>

              {/* Content */}
              <div className="flex-1 p-2 min-w-0">
                {/* meta line */}
                <div className="flex items-center gap-1 text-xs text-[#878a8c] flex-wrap mb-1">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-[#ff4500] rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">r/</span>
                    </div>
                    <span className="font-bold text-[#1c1c1c] hover:underline cursor-pointer">{post.subreddit}</span>
                  </div>
                  <span>•</span>
                  <span>Posted by</span>
                  <span className="hover:underline cursor-pointer">u/{post.username}</span>
                  <span>{post.timeAgo}</span>
                  {awards.length > 0 && (
                    <span className="flex items-center gap-0.5 ml-1">
                      {awards.map((a, i) => (
                        <span key={i} title={a.label} className="text-xs">{a.emoji}</span>
                      ))}
                    </span>
                  )}
                </div>

                {/* title */}
                <div className="flex items-start gap-2 mb-2">
                  <h1 className="text-base font-medium text-[#1c1c1c] leading-snug flex-1">{post.body}</h1>
                  <span className="text-[10px] bg-[#0079d3] text-white px-1.5 py-0.5 rounded flex-shrink-0 font-medium">{flair}</span>
                </div>

                {/* action bar */}
                <div className="flex items-center gap-1 text-xs text-[#878a8c] flex-wrap">
                  <button className="flex items-center gap-1 hover:bg-[#f6f7f8] px-2 py-1 rounded font-bold">
                    💬 {post.replies.length} Comments
                  </button>
                  <button className="flex items-center gap-1 hover:bg-[#f6f7f8] px-2 py-1 rounded font-bold">
                    🔗 Share
                  </button>
                  <button className="flex items-center gap-1 hover:bg-[#f6f7f8] px-2 py-1 rounded font-bold">
                    ⭐ Save
                  </button>
                  <button className="flex items-center gap-1 hover:bg-[#f6f7f8] px-2 py-1 rounded font-bold">
                    ··· More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment box */}
          <div className="bg-white border border-[#ccc] rounded-md p-4 mb-3">
            <div className="text-xs text-[#878a8c] mb-2">
              Comment as <span className="text-[#0079d3] font-medium">u/you</span>
            </div>
            <div className="border border-[#edeff1] rounded bg-[#f6f7f8] h-20 w-full" />
            <div className="flex justify-end mt-2">
              <button className="text-xs bg-[#edeff1] text-[#878a8c] rounded-full px-3 py-1 font-bold cursor-not-allowed">Comment</button>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-white border border-[#ccc] rounded-md p-4">
            {/* sort row */}
            <div className="flex items-center gap-3 mb-4 text-xs text-[#878a8c]">
              <span className="font-bold text-[#1c1c1c]">Sort by:</span>
              {["Best", "Top", "New", "Controversial", "Old"].map((s, i) => (
                <button
                  key={s}
                  className={`hover:bg-[#f6f7f8] px-2 py-1 rounded ${i === 0 ? "text-[#1c1c1c] font-bold" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* comments */}
            <div className="space-y-4">
              {post.replies.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex flex-col items-center gap-0 flex-shrink-0">
                    <Avatar name={r.username} size={8} />
                    <div className="w-0.5 flex-1 bg-[#edeff1] mt-1 ml-0" />
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    {/* comment header */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1 text-xs">
                      <span className="font-bold text-[#1c1c1c] hover:underline cursor-pointer">{r.username}</span>
                      <span className="text-[#878a8c]">•</span>
                      <span className="text-[#878a8c]">{r.timeAgo}</span>
                    </div>
                    {/* comment body */}
                    <p className="text-sm text-[#1c1c1c] leading-relaxed mb-1.5">{r.body}</p>
                    {/* comment actions */}
                    <div className="flex items-center gap-0.5 text-[#878a8c]">
                      <button className="hover:text-[#ff4500] p-1 text-sm">▲</button>
                      <span className="text-xs font-bold text-[#1c1c1c] px-0.5">{commentVotes(r.username)}</span>
                      <button className="hover:text-[#7193ff] p-1 text-sm">▼</button>
                      <button className="text-xs font-bold hover:bg-[#f6f7f8] px-2 py-1 rounded ml-1">Reply</button>
                      <button className="text-xs font-bold hover:bg-[#f6f7f8] px-2 py-1 rounded">Share</button>
                      <button className="text-xs font-bold hover:bg-[#f6f7f8] px-2 py-1 rounded">Report</button>
                      <button className="text-xs font-bold hover:bg-[#f6f7f8] px-2 py-1 rounded">···</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="hidden lg:flex flex-col gap-3 w-72 flex-shrink-0">
          {/* About community */}
          <div className="bg-white border border-[#ccc] rounded-md overflow-hidden">
            <div className="bg-[#0079d3] h-16" />
            <div className="p-3">
              <div className="flex items-center gap-2 -mt-5 mb-2">
                <div className="w-10 h-10 bg-[#ff4500] rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-black">r/</span>
                </div>
                <span className="font-bold text-[#1c1c1c] text-sm mt-4">{post.subreddit}</span>
              </div>
              <p className="text-xs text-[#878a8c] mb-3">A place for open discussion, sharing experiences, and connecting with others.</p>
              <div className="flex gap-6 mb-3">
                <div>
                  <div className="font-bold text-sm text-[#1c1c1c]">{members}</div>
                  <div className="text-xs text-[#878a8c]">Members</div>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#46d160]">● {online}</div>
                  <div className="text-xs text-[#878a8c]">Online</div>
                </div>
              </div>
              <div className="text-xs text-[#878a8c] mb-3">
                <span className="font-medium text-[#1c1c1c]">{upvotePct}%</span> of posts upvoted
              </div>
              <button className="w-full bg-[#ff4500] text-white rounded-full py-1.5 text-sm font-bold hover:bg-[#e03d00]">
                Join
              </button>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white border border-[#ccc] rounded-md p-3">
            <h3 className="font-bold text-sm text-[#1c1c1c] mb-2">r/{post.subreddit?.replace("r/", "")} Rules</h3>
            {["Be respectful", "No spam", "Stay on topic", "No personal info", "Use spoiler tags"].map((rule, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-t border-[#edeff1] text-xs text-[#1c1c1c]">
                <span className="text-[#878a8c]">{i + 1}.</span>
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
