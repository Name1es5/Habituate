import type { FakePost } from "../fakeContent";

function formatNum(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function MockReddit({ post }: { post: FakePost }) {
  return (
    <div className="bg-[#1a1a1b] border border-[#343536] rounded-md font-sans text-left max-w-2xl mx-auto">
      {/* header bar */}
      <div className="flex items-center gap-2 px-3 pt-3 text-xs text-[#818384]">
        <span className="font-bold text-[#d7dadc]">{post.subreddit}</span>
        <span>• Posted by</span>
        <span className="hover:underline cursor-pointer text-[#818384]">u/{post.username}</span>
      </div>

      {/* vote + content */}
      <div className="flex gap-2 p-3">
        {/* vote column */}
        <div className="flex flex-col items-center gap-1 text-[#818384] text-xs min-w-[32px]">
          <button className="text-lg leading-none hover:text-[#ff4500]">▲</button>
          <span className="font-bold text-[#d7dadc]">{formatNum(post.upvotes!)}</span>
          <button className="text-lg leading-none hover:text-[#7193ff]">▼</button>
        </div>

        {/* main content */}
        <div className="flex-1">
          <p className="text-[#d7dadc] text-sm font-medium mb-3 leading-snug">{post.body}</p>

          {/* action row */}
          <div className="flex gap-4 text-xs text-[#818384]">
            <button className="flex items-center gap-1 hover:bg-[#272729] px-2 py-1 rounded">
              💬 {post.replies.length} Comments
            </button>
            <button className="flex items-center gap-1 hover:bg-[#272729] px-2 py-1 rounded">
              🔗 Share
            </button>
            <button className="flex items-center gap-1 hover:bg-[#272729] px-2 py-1 rounded">
              ⭐ Save
            </button>
          </div>

          {/* comments */}
          <div className="mt-4 space-y-3 border-t border-[#343536] pt-3">
            {post.replies.map((r, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#ff4500] flex-shrink-0 mt-0.5 text-white text-xs flex items-center justify-center">
                  {r.username[0].toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#ff4500] mr-2">u/{r.username}</span>
                  <span className="text-xs text-[#818384]">• {Math.floor(Math.random() * 12) + 1}h ago</span>
                  <p className="text-sm text-[#d7dadc] mt-0.5">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
