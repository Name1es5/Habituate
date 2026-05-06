import type { FakePost } from "../fakeContent";

const ROLE_COLORS = ["#5865f2","#57f287","#fee75c","#eb459e","#ed4245","#ff914d","#00d5ff"];

function roleColor(username: string): string {
  return ROLE_COLORS[username.charCodeAt(0) % ROLE_COLORS.length];
}

const SIDEBAR_CHANNELS = ["#general","#off-topic","#random","#memes","#introductions","#advice","#vent","#daily-chat","#hot-takes","#music"];

export default function MockDiscord({ post }: { post: FakePost }) {
  const allMessages = [
    { username: post.username, body: post.body, timeAgo: post.timeAgo, isMain: true },
    ...post.replies.map((r) => ({ ...r, isMain: false })),
  ];

  return (
    <div className="bg-[#313338] rounded-lg font-sans text-left w-full mx-auto flex overflow-hidden" style={{ minHeight: 380 }}>

      {/* server sidebar — hidden on mobile */}
      <div className="hidden sm:flex bg-[#1e1f22] w-14 flex-shrink-0 flex-col items-center pt-3 gap-2">
        <div className="w-9 h-9 rounded-[14px] bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold">
          {post.server![0]}
        </div>
        <div className="w-8 border-t border-[#35363c] my-1" />
        {["A","B","C"].map((l) => (
          <div key={l} className="w-9 h-9 rounded-full bg-[#313338] hover:rounded-[14px] flex items-center justify-center text-[#dbdee1] text-xs cursor-pointer">
            {l}
          </div>
        ))}
      </div>

      {/* channel sidebar — hidden on mobile */}
      <div className="hidden md:flex bg-[#2b2d31] w-44 flex-shrink-0 flex-col">
        <div className="px-3 py-3 border-b border-[#1e1f22]">
          <span className="text-white text-sm font-semibold truncate block">{post.server}</span>
        </div>
        <div className="flex-1 px-2 pt-2 space-y-0.5">
          {SIDEBAR_CHANNELS.map((ch) => (
            <div
              key={ch}
              className={`px-2 py-1 rounded text-sm cursor-pointer ${ch === post.channel ? "bg-[#404249] text-white" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#35373c]"}`}
            >
              {ch}
            </div>
          ))}
        </div>
      </div>

      {/* main chat — always visible */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* channel header */}
        <div className="px-3 sm:px-4 py-3 border-b border-[#1e1f22] flex items-center gap-2">
          {/* hamburger hint on mobile */}
          <span className="text-[#949ba4] text-lg sm:hidden">☰</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[#949ba4] text-lg">#</span>
            <span className="text-white font-semibold text-sm truncate">{post.channel!.replace("#", "")}</span>
          </div>
          {/* server name on mobile since sidebar is hidden */}
          <span className="ml-auto text-xs text-[#949ba4] sm:hidden truncate max-w-[120px]">{post.server}</span>
        </div>

        {/* messages */}
        <div className="flex-1 px-3 sm:px-4 py-3 space-y-4 overflow-y-auto">
          {allMessages.map((msg, i) => (
            <div key={i} className="flex gap-2 sm:gap-3">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{ background: roleColor(msg.username) }}
              >
                {msg.username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: roleColor(msg.username) }}>
                    {msg.username}
                  </span>
                  <span className="text-[#949ba4] text-xs">{msg.timeAgo}</span>
                </div>
                <p className="text-[#dbdee1] text-sm mt-0.5 break-words">{msg.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* input bar */}
        <div className="px-3 sm:px-4 pb-4">
          <div className="bg-[#383a40] rounded-lg px-3 sm:px-4 py-2.5 text-[#949ba4] text-sm truncate">
            Message {post.channel}
          </div>
        </div>
      </div>
    </div>
  );
}
