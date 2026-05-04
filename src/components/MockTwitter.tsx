import type { FakePost } from "../fakeContent";

function formatNum(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

const AVATAR_COLORS = ["#1da1f2","#f4212e","#00ba7c","#ff7008","#794bc4","#ff3ca0"];

function avatarColor(username: string): string {
  return AVATAR_COLORS[username.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function MockTwitter({ post }: { post: FakePost }) {
  return (
    <div className="bg-black border border-[#2f3336] rounded-xl font-sans text-left max-w-xl mx-auto">
      {/* main tweet */}
      <div className="p-4">
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ background: avatarColor(post.username) }}
          >
            {post.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-white text-sm">{post.username}</span>
              <span className="text-[#71767b] text-sm">@{post.username.toLowerCase().replace(/\s/g, "_")}</span>
              <span className="text-[#71767b] text-sm">·</span>
              <span className="text-[#71767b] text-sm">{Math.floor(Math.random() * 20) + 1}h</span>
            </div>
            <p className="text-white text-sm mt-1 leading-relaxed">{post.body}</p>

            {/* action row */}
            <div className="flex justify-between mt-3 text-[#71767b] text-sm max-w-xs">
              <button className="flex items-center gap-1 hover:text-[#1da1f2]">
                💬 <span>{post.replies.length}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-[#00ba7c]">
                🔁 <span>{formatNum(post.retweets!)}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-[#f4212e]">
                ❤️ <span>{formatNum(post.likes!)}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-[#1da1f2]">
                📤
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* replies */}
      {post.replies.map((r, i) => (
        <div key={i} className="border-t border-[#2f3336] p-4 flex gap-3">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ background: avatarColor(r.username) }}
          >
            {r.username[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-white text-xs">{r.username}</span>
              <span className="text-[#71767b] text-xs">@{r.username.toLowerCase()}</span>
              <span className="text-[#71767b] text-xs">· {Math.floor(Math.random() * 10) + 1}h</span>
            </div>
            <p className="text-white text-sm mt-0.5">{r.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
