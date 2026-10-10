
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Baby,
  Plus,
  Scale,
  TrendingUp,
  CalendarDays,
  Trash2,
} from "lucide-react";
import "./index.css";

type Measurement = {
  id: number;
  date: string;
  weight: number;
};

function App() {
  const [babyName, setBabyName] = useState("My baby");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("female");
  const [birthWeight, setBirthWeight] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [weight, setWeight] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const sorted = [...measurements].sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  const latest = sorted[sorted.length - 1];

  const previous = sorted[sorted.length - 2];

  const change =
    latest && previous ? latest.weight - previous.weight : null;

  function addMeasurement() {
    const value = Math.round(Number(weight) * 10) / 10;

    if (!date || !Number.isFinite(value) || value <= 0) {
      alert("Enter a valid date and weight.");
      return;
    }

    setMeasurements((items) => [
      ...items,
      { id: Date.now(), date, weight: value },
    ]);

    setWeight("");
  }

  function deleteMeasurement(id: number) {
    setMeasurements((items) => items.filter((m) => m.id !== id));
  }

  const chartData = sorted.map((m) => ({
    date: m.date,
    weight: m.weight,
  }));

  function saveProfile() {
    if (!babyName.trim() || !birthDate || !birthWeight) {
      alert("Please complete the baby's name, birth date and birth weight.");
      return;
    }
  
    const weightValue = Number(birthWeight);
  
    if (
      !Number.isFinite(weightValue) ||
      weightValue <= 0 ||
      new Date(birthDate) > new Date()
    ) {
      alert("Please enter valid profile details.");
      return;
    }
  
    setProfileSaved(true);
  }

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-icon"><Baby size={22} /></span>
          <span>little growth</span>
        </a>
        <span className="status">GROWTH JOURNAL</span>
      </header>
      {!profileSaved ? (
  <section className="setup-screen">
    <p className="eyebrow">WELCOME TO LITTLE GROWTH</p>
    <h1>Let's get started.</h1>
    <p className="muted">
      Set up your baby's profile to start tracking growth.
    </p>

    <section className="panel">
      <div className="form-grid">
        <label>
          Baby's name
          <input
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            placeholder="Baby's name"
            required
          />
        </label>

        <label>
          Date of birth
          <input
            type="date"
            value={birthDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </label>

        <label>
          Sex
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>

        <label>
          Birth weight (kg)
          <input
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={birthWeight}
            onChange={(e) => setBirthWeight(e.target.value)}
            placeholder="e.g. 3.5"
            required
          />
        </label>
      </div>

      <button className="primary-button save-profile" onClick={saveProfile}>
        Save profile and continue
      </button>
    </section>
  </section>
) : (
  <>

      <section className="intro">
        <p className="eyebrow">YOUR FAMILY DASHBOARD</p>
        <h1>Every little step.</h1>
        <p className="muted">
          A clear picture of your baby's growth, over time.
        </p>
      </section>

      <section className="profile panel">
        <div className="section-heading">
          <div className="section-icon"><Baby size={20} /></div>
          <div>
            <h2>Baby profile</h2>
            <p className="muted">Your baby's details</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Name
            <input
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Baby's name"
            />
          </label>

          <label>
            Date of birth
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </label>

          <label>
            Sex
            <select value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </label>

          <label>
            Birth weight (kg)
            <input
              type="number"
              min="0"
              step="0.1"
              value={birthWeight}
              onChange={(e) => setBirthWeight(e.target.value)}
              placeholder="e.g. 3.450"
            />
          </label>
        </div>
      </section>

      <section className="stats">
        <article className="stat-card">
          <div className="stat-label"><Scale size={16} /> LATEST WEIGHT</div>
          <div className="stat-value">
            {latest ? `${latest.weight.toFixed(1)} kg` : "—"}
          </div>
          <p className="muted">Most recent measurement</p>
        </article>

        <article className="stat-card">
          <div className="stat-label"><TrendingUp size={16} /> CHANGE</div>
          <div className="stat-value">
            {change === null
              ? "—"
              : `${change > 0 ? "+" : ""}${change.toFixed(2)} kg`}
          </div>
          <p className="muted">Since previous entry</p>
        </article>

        <article className="stat-card">
          <div className="stat-label"><CalendarDays size={16} /> RECORDS</div>
          <div className="stat-value">{measurements.length}</div>
          <p className="muted">Measurements recorded</p>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WEIGHT OVER TIME</p>
            <h2>Growth chart</h2>
          </div>
          <span className="chart-unit">kg</span>
        </div>

        {chartData.length > 0 ? (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 12, bottom: 5, left: 0 }}
              >
                <CartesianGrid stroke="#292d36" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  stroke="#858b98"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  stroke="#858b98"
                  tick={{ fontSize: 11 }}
                  width={42}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#191c23",
                    border: "1px solid #353a46",
                    borderRadius: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight"
                  stroke="#b5e4a8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#b5e4a8" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-chart">
            <TrendingUp size={30} />
            <p>No measurements yet</p>
            <span>Add your first measurement to see the chart.</span>
          </div>
        )}

        <p className="chart-note">
          This chart shows recorded measurements only. WHO reference
          percentiles will be added in a later step.
        </p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NEW ENTRY</p>
            <h2>Record weight</h2>
          </div>
        </div>

        <div className="entry-form">
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Weight (kg)
            <input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 6.250"
            />
          </label>
          <button className="primary-button" onClick={addMeasurement}>
            <Plus size={18} /> Add measurement
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HISTORY</p>
            <h2>Measurements</h2>
          </div>
          <span className="count">{measurements.length} entries</span>
        </div>

        {sorted.length === 0 ? (
          <p className="muted empty-history">
            Your recorded measurements will appear here.
          </p>
        ) : (
          <div className="history-list">
            {[...sorted].reverse().map((m) => (
              <div className="history-row" key={m.id}>
                <div>
                  <strong>{m.weight.toFixed(1)} kg</strong>
                  <p className="muted">{m.date}</p>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Delete measurement from ${m.date}`}
                  onClick={() => {
                    if (confirm("Delete this measurement?")) {
                      deleteMeasurement(m.id);
                    }
                  }}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer>
        <span>little growth</span>
        <span>Small steps, measured over time.</span>
      </footer>
      </>
)}
    </main>
  );
}

export default App;
