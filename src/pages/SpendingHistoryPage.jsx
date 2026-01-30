import "../styles/customer.css";
import "../styles/spendingHistory.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadTransactions() {
  try {
    const raw = localStorage.getItem("cinemaFlow_transactions");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTransactions(next) {
  localStorage.setItem("cinemaFlow_transactions", JSON.stringify(next));
}

// ✅ demo seed based on your screenshot
const SEED_TX = [
  { id: "T1", title: "The Last Adventure - 2 Tickets", date: "Jan 25, 2026", category: "Tickets", amount: 30.0, icon: "🎟️" },
  { id: "T2", title: "Large Popcorn & 2 Drinks", date: "Jan 25, 2026", category: "Concessions", amount: 18.0, icon: "🍿" },
  { id: "T3", title: "Hearts Entwined - 1 Ticket", date: "Jan 20, 2026", category: "Tickets", amount: 15.0, icon: "🎟️" },
  { id: "T4", title: "Premium Seat Upgrade", date: "Jan 15, 2026", category: "Premium Seats", amount: 8.0, icon: "💺" },
  { id: "T5", title: "Midnight Shadows - 3 Tickets", date: "Jan 15, 2026", category: "Tickets", amount: 54.0, icon: "🎟️" },
  { id: "T6", title: "Medium Popcorn", date: "Jan 15, 2026", category: "Concessions", amount: 7.0, icon: "🍿" },
  { id: "T7", title: "Laugh Out Loud - 1 Ticket", date: "Jan 10, 2026", category: "Tickets", amount: 12.0, icon: "🎟️" },
  { id: "T8", title: "Candy & Drink", date: "Jan 10, 2026", category: "Concessions", amount: 9.0, icon: "🍬" },
];

// try parse "Jan 25, 2026" -> Date
function parseDate(s) {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function monthKey(d) {
  const y = d.getFullYear();
  const m = d.getMonth(); // 0-11
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

function monthLabel(d) {
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default function SpendingHistoryPage() {
  const navigate = useNavigate();

  const user = useMemo(
    () => getUser() || { spent: 420, points: 750, memberSince: "November 2023" },
    []
  );

  const [tx] = useState(() => {
    const existing = loadTransactions();
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      saveTransactions(SEED_TX);
      return SEED_TX;
    }
    return existing;
  });

  const totals = useMemo(() => {
    const byCat = { Tickets: 0, Concessions: 0, "Premium Seats": 0 };

    (tx || []).forEach((t) => {
      const cat = t.category || "Tickets";
      const amt = Number(t.amount) || 0;
      byCat[cat] = (byCat[cat] || 0) + amt;
    });

    const total = Object.values(byCat).reduce((s, v) => s + v, 0);

    const itemsTickets = (tx || []).filter((t) => t.category === "Tickets").length;
    const itemsConc = (tx || []).filter((t) => t.category === "Concessions").length;
    const itemsPrem = (tx || []).filter((t) => t.category === "Premium Seats").length;

    return {
      total: total || Number(user.spent || 0),
      byCat,
      items: {
        Tickets: itemsTickets,
        Concessions: itemsConc,
        "Premium Seats": itemsPrem,
      },
    };
  }, [tx, user]);

  const pct = (value) => {
    const total = totals.total || 1;
    return Math.round((Number(value || 0) / total) * 100);
  };

  // ✅ Monthly computed from transactions
  const monthly = useMemo(() => {
    const map = new Map(); // key -> { label, amount, tx }
    (tx || []).forEach((t) => {
      const d = parseDate(t.date);
      if (!d) return;
      const key = monthKey(d);
      const cur = map.get(key) || { label: monthLabel(d), amount: 0, tx: 0 };
      cur.amount += Number(t.amount) || 0;
      cur.tx += 1;
      map.set(key, cur);
    });

    // sort latest first
    const sortedKeys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1));
    return sortedKeys.map((k) => ({ key: k, ...map.get(k) }));
  }, [tx]);

  // ✅ Stats computed (not hard-coded)
  const stats = useMemo(() => {
    const total = Number(totals.total || 0);
    const monthsCount = Math.max(monthly.length, 1);
    const avgMonthly = total / monthsCount;

    const visits = (tx || []).length || 1;
    const avgPerVisit = total / visits;

    return {
      avgMonthly,
      avgPerVisit,
      transactions: (tx || []).length,
    };
  }, [totals, monthly, tx]);

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* top */}
          <div className="sp-top">
            <button className="sp-back" type="button" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="sp-title">
              <span className="sp-ico">📈</span> Spending History
            </div>
          </div>

          {/* hero */}
          <div className="sp-hero">
            <div className="sp-heroLabel">Total Spent (All Time)</div>
            <div className="sp-heroValue">฿{Number(totals.total).toFixed(2)}</div>
            <div className="sp-heroSub">Member since {user.memberSince || "—"}</div>
          </div>

          {/* quick stats */}
          <div className="sp-stats">
            <div className="sp-stat sp-blue">
              <div className="sp-statLabel">Avg Monthly</div>
              <div className="sp-statValue">฿{stats.avgMonthly.toFixed(0)}</div>
            </div>

            <div className="sp-stat sp-purple">
              <div className="sp-statLabel">Avg Per Visit</div>
              <div className="sp-statValue">฿{stats.avgPerVisit.toFixed(0)}</div>
            </div>

            <div className="sp-stat sp-orange">
              <div className="sp-statLabel">Transactions</div>
              <div className="sp-statValue">{stats.transactions}</div>
            </div>
          </div>

          {/* spending by category */}
          <div className="sp-panel">
            <div className="sp-panelHead">
              <span className="sp-pie">🕒</span> Spending by Category
            </div>

            <div className="sp-catCards">
              <div className="sp-cat sp-blueCard">
                <div className="sp-catName">Tickets</div>
                <div className="sp-catMoney">฿{(totals.byCat["Tickets"] || 0).toFixed(2)}</div>
                <div className="sp-catSub">
                  {pct(totals.byCat["Tickets"])}% • {totals.items["Tickets"]} items
                </div>
              </div>

              <div className="sp-cat sp-orangeCard">
                <div className="sp-catName">Concessions</div>
                <div className="sp-catMoney">฿{(totals.byCat["Concessions"] || 0).toFixed(2)}</div>
                <div className="sp-catSub">
                  {pct(totals.byCat["Concessions"])}% • {totals.items["Concessions"]} items
                </div>
              </div>

              <div className="sp-cat sp-purpleCard">
                <div className="sp-catName">Premium Seats</div>
                <div className="sp-catMoney">฿{(totals.byCat["Premium Seats"] || 0).toFixed(2)}</div>
                <div className="sp-catSub">
                  {pct(totals.byCat["Premium Seats"])}% • {totals.items["Premium Seats"]} items
                </div>
              </div>
            </div>

            <div className="sp-bars">
              {[
                { name: "Tickets", val: totals.byCat["Tickets"] || 0 },
                { name: "Concessions", val: totals.byCat["Concessions"] || 0 },
                { name: "Premium Seats", val: totals.byCat["Premium Seats"] || 0 },
              ].map((x) => (
                <div key={x.name} className="sp-barRow">
                  <div className="sp-barLabel">{x.name}</div>
                  <div className="sp-barTrack">
                    <div className="sp-barFill" style={{ width: `${pct(x.val)}%` }} />
                  </div>
                  <div className="sp-barRight">
                    ฿{Number(x.val).toFixed(2)} ({pct(x.val)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* monthly spending */}
          <div className="sp-panel">
            <div className="sp-panelHead">
              <span className="sp-cal">📅</span> Monthly Spending
            </div>

            {monthly.length === 0 ? (
              <div className="sp-empty">No monthly data yet.</div>
            ) : (
              <div className="sp-monthGrid">
                {monthly.map((m) => (
                  <div key={m.key} className="sp-monthCard">
                    <div className="sp-monthName">{m.label}</div>
                    <div className="sp-monthMoney">฿{Number(m.amount).toFixed(2)}</div>
                    <div className="sp-monthSub">{m.tx} transactions</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* recent transactions */}
          <div className="sp-panel">
            <div className="sp-panelHead">
              <span className="sp-dollar">💲</span> Recent Transactions
            </div>

            {(tx || []).length === 0 ? (
              <div className="sp-empty">No transactions found.</div>
            ) : (
              <div className="sp-txList">
                {tx.map((t) => (
                  <div key={t.id} className="sp-txRow">
                    <div
                      className={`sp-txIcon ${
                        t.category === "Concessions"
                          ? "sp-icoOrange"
                          : t.category === "Premium Seats"
                          ? "sp-icoPurple"
                          : "sp-icoBlue"
                      }`}
                    >
                      {t.icon || "💳"}
                    </div>

                    <div className="sp-txMid">
                      <div className="sp-txTitle">{t.title}</div>
                      <div className="sp-txSub">
                        {t.date} • <span className="sp-tag">{t.category}</span>
                      </div>
                    </div>

                    <div className="sp-txMoney">฿{Number(t.amount || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* tips */}
          <div className="sp-panel sp-tipPanel">
            <div className="sp-panelHead">
              <span className="sp-star">⭐</span> Savings Tips
            </div>
            <div className="sp-tips">
              <div className="sp-tip">
                <div className="sp-tipTitle">💡 Use Loyalty Points</div>
                <div className="sp-tipDesc">
                  You have {Number(user.points || 750)} points! Redeem for discounts and free items.
                </div>
              </div>
              <div className="sp-tip">
                <div className="sp-tipTitle">🎟️ Matinee Shows</div>
                <div className="sp-tipDesc">
                  Save up to 30% by watching movies before 5 PM.
                </div>
              </div>
              <div className="sp-tip">
                <div className="sp-tipTitle">👑 Platinum Benefits</div>
                <div className="sp-tipDesc">
                  250 more points until Platinum tier with exclusive perks!
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
