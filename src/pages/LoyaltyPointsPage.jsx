import "../styles/customer.css";
import "../styles/loyaltyPoints.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";

function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadLoyalty() {
  try {
    const raw = localStorage.getItem("cinemaFlow_loyalty");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const SEED = {
  tier: "Gold Member",
  points: 750,
  nextTier: "Platinum",
  nextTierTarget: 1000,
  pointsEarned: 425,
  pointsRedeemed: 250,
  rewardsUsed: 12,
  history: [
    { id: "h1", type: "EARN", title: "Ticket Purchase - The Last Adventure", date: "Jan 25, 2026", amount: +50 },
    { id: "h2", type: "EARN", title: "Birthday Bonus", date: "Jan 20, 2026", amount: +100 },
    { id: "h3", type: "REDEEM", title: "Redeemed for ฿10 Discount", date: "Jan 15, 2026", amount: -200 },
    { id: "h4", type: "EARN", title: "Ticket Purchase - Midnight Shadows", date: "Jan 10, 2026", amount: +50 },
    { id: "h5", type: "EARN", title: "Referral Bonus", date: "Jan 5, 2026", amount: +150 },
    { id: "h6", type: "REDEEM", title: "Redeemed for Free Popcorn", date: "Dec 28, 2025", amount: -50 },
    { id: "h7", type: "EARN", title: "Ticket Purchase - Galactic Wars", date: "Dec 30, 2025", amount: +50 },
  ],
};

const REWARDS = [
  { id: "r1", title: "฿5 Ticket Discount", desc: "Save ฿5 on your next ticket purchase", cost: 100, emoji: "🎟️" },
  { id: "r2", title: "฿10 Ticket Discount", desc: "Save ฿10 on your next ticket purchase", cost: 200, emoji: "🎫" },
  { id: "r3", title: "Free Small Popcorn", desc: "Get a free small popcorn with any purchase", cost: 50, emoji: "🍿" },
  { id: "r4", title: "Free Medium Drink", desc: "Get a free medium drink with any purchase", cost: 75, emoji: "🥤" },
  { id: "r5", title: "Premium Seat Upgrade", desc: "Upgrade to premium seating for free", cost: 150, emoji: "💺" },
  { id: "r6", title: "IMAX Ticket", desc: "Get a free IMAX movie ticket", cost: 300, emoji: "🎬" },
];

export default function LoyaltyPointsPage() {
  const navigate = useNavigate();

  const initial = useMemo(() => {
    const saved = loadLoyalty();
    if (saved) return saved;

    // if user has points stored in cinemaFlow_user, prefer it
    const u = getUser();
    if (u && typeof u.points === "number") {
      return { ...SEED, points: u.points, tier: u.tier || SEED.tier };
    }
    return SEED;
  }, []);

  const [data, setData] = useState(initial);
  const [toast, setToast] = useState("");

  const progress = useMemo(() => {
    const target = Number(data.nextTierTarget) || 1000;
    const pts = Number(data.points) || 0;
    const pct = Math.max(0, Math.min(100, Math.round((pts / target) * 100)));
    return { target, pts, pct, remaining: Math.max(0, target - pts) };
  }, [data.points, data.nextTierTarget]);

  function persist(next) {
    setData(next);
    localStorage.setItem("cinemaFlow_loyalty", JSON.stringify(next));

    // keep user.points and user.tier in sync too
    const u = getUser();
    if (u) {
      const updatedUser = { ...u, points: next.points, tier: next.tier };
      localStorage.setItem("cinemaFlow_user", JSON.stringify(updatedUser));
    }
  }

  function showToast(msg) {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 1800);
  }

  function redeem(reward) {
    const pts = Number(data.points) || 0;
    if (pts < reward.cost) {
      alert("Not enough points to redeem this reward.");
      return;
    }

    const ok = window.confirm(`Redeem "${reward.title}" for ${reward.cost} points?`);
    if (!ok) return;

    const now = new Date();
    const dateText = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

    const next = {
      ...data,
      points: pts - reward.cost,
      pointsRedeemed: (Number(data.pointsRedeemed) || 0) + reward.cost,
      rewardsUsed: (Number(data.rewardsUsed) || 0) + 1,
      history: [
        {
          id: `h_${Date.now()}`,
          type: "REDEEM",
          title: `Redeemed for ${reward.title}`,
          date: dateText,
          amount: -reward.cost,
        },
        ...(data.history || []),
      ],
    };

    persist(next);
    showToast("Reward redeemed ✅");
  }

  return (
    <div className="cf-page">
      <Navbar />
      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* Top row */}
          <div className="lp-top">
            <button className="lp-back" type="button" onClick={() => navigate(-1)}>
              ←
            </button>

            <div className="lp-title">
              <span className="lp-titleIcon">⭐</span>
              Loyalty Points
            </div>
          </div>

          {/* Hero balance card */}
          <div className="lp-hero">
            <div className="lp-heroInner">
              <div className="lp-heroLabel">Your Points Balance</div>
              <div className="lp-heroValue">{Number(data.points) || 0}</div>

              <div className="lp-tierPill">🏅 {data.tier || "Member"}</div>

              <div className="lp-progressCard">
                <div className="lp-progressTop">
                  <div className="lp-progressTitle">Progress to {data.nextTier || "Next Tier"}</div>
                  <div className="lp-progressRight">
                    {progress.pts} / {progress.target} points
                  </div>
                </div>

                <div className="lp-bar">
                  <div className="lp-barFill" style={{ width: `${progress.pct}%` }} />
                </div>

                <div className="lp-progressSub">{progress.remaining} points until next tier</div>
              </div>
            </div>
          </div>

          {/* 3 stat cards */}
          <div className="lp-stats">
            <div className="lp-stat lp-green">
              <div className="lp-statTop">⬆️ Points Earned</div>
              <div className="lp-statValue">{Number(data.pointsEarned) || 0}</div>
            </div>

            <div className="lp-stat lp-red">
              <div className="lp-statTop">⬇️ Points Redeemed</div>
              <div className="lp-statValue">{Number(data.pointsRedeemed) || 0}</div>
            </div>

            <div className="lp-stat lp-purple">
              <div className="lp-statTop">🎁 Rewards Used</div>
              <div className="lp-statValue">{Number(data.rewardsUsed) || 0}</div>
            </div>
          </div>

          {/* Rewards grid */}
          <div className="lp-panel">
            <div className="lp-panelHead">
              <div className="lp-panelTitle">🎁 Available Rewards</div>
            </div>

            <div className="lp-rewardGrid">
              {REWARDS.map((r) => {
                const affordable = (Number(data.points) || 0) >= r.cost;
                return (
                  <div key={r.id} className="lp-rewardCard">
                    <div className="lp-rewardEmoji">{r.emoji}</div>
                    <div className="lp-rewardTitle">{r.title}</div>
                    <div className="lp-rewardDesc">{r.desc}</div>

                    <div className="lp-rewardCost">⭐ {r.cost} points</div>

                    <button
                      className={`lp-redeemBtn ${!affordable ? "lp-redeemBtnDisabled" : ""}`}
                      type="button"
                      onClick={() => redeem(r)}
                      disabled={!affordable}
                    >
                      Redeem Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points history */}
          <div className="lp-panel">
            <div className="lp-panelHead">
              <div className="lp-panelTitle">📈 Points History</div>
            </div>

            <div className="lp-history">
              {(data.history || []).map((h) => (
                <div key={h.id} className="lp-row">
                  <div className={`lp-dot ${h.type === "REDEEM" ? "lp-dotRed" : "lp-dotGreen"}`}>
                    {h.type === "REDEEM" ? "⬇️" : "⬆️"}
                  </div>

                  <div className="lp-rowMid">
                    <div className="lp-rowTitle">{h.title}</div>
                    <div className="lp-rowDate">📅 {h.date}</div>
                  </div>

                  <div className={`lp-amt ${Number(h.amount) < 0 ? "lp-amtRed" : "lp-amtGreen"}`}>
                    {Number(h.amount) > 0 ? `+${h.amount}` : h.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* toast */}
          {toast && <div className="lp-toast">{toast}</div>}
        </div>
      </main>
    </div>
  );
}
