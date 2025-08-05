"use client";
import { useEffect, useState } from "react";
import Select, { MultiValue, ActionMeta } from "react-select";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { twMerge } from "tailwind-merge";

// Tipe opsi sektor
type SectorOption = { label: string; value: string };

export default function Traffic() {
  // State management
  const [sectorOptions, setSectorOptions] = useState<SectorOption[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<SectorOption[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [primaryDataKey, setPrimaryDataKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter tanggal & range valid database
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [alert, setAlert] = useState<string | null>(null);

  // Palet warna chart (dark mode style)
  const sectorColors = ["#8b5cf6", "#22d3ee", "#f43f5e"];

  // 1. Ambil tanggal paling awal & akhir dari API
 useEffect(() => {
  fetch("/api/traffic-date-range")
    .then(res => res.json())
    .then(data => {
      setDateRange({ min: data.earliest, max: data.latest });
      setStartDate(data.earliest); // << all time default
      setEndDate(data.latest);
    });
}, []);


  // 2. Fetch options & data default (saat tanggal berubah)
  useEffect(() => {
    if (!startDate || !endDate) return;
    fetch(`/api/traffic?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => res.json())
      .then((data) => {
        setSectorOptions(data.sectors);
        // Jangan reset sektor jika sudah ada!
        if (selectedSectors.length === 0) {
          setSelectedSectors(data.sectors.slice(0, 3));
        }
        setChartData(data.data);
        setPrimaryDataKey(data.primaryDataKey);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch initial data:", error);
        setLoading(false);
      });
  // eslint-disable-next-line
  }, [startDate, endDate]);

  // 3. Fetch data setiap filter sektor/tanggal berubah
  useEffect(() => {
    if (loading && selectedSectors.length === 0) return;
    if (!startDate || !endDate) return;
    if (selectedSectors.length === 0) {
      setChartData([]);
      setPrimaryDataKey(null);
      return;
    }
    setLoading(true);
    const params = [
      ...selectedSectors.map((s) => `sector[]=${encodeURIComponent(s.value)}`),
      `startDate=${startDate}`,
      `endDate=${endDate}`,
    ].join("&");
    fetch(`/api/traffic?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data.data);
        setPrimaryDataKey(data.primaryDataKey);

        // Remap selectedSectors jadi array object
        if (data.sectors) {
          setSectorOptions(data.sectors);
          const optionMap: Record<string, SectorOption> = {};
          data.sectors.forEach((opt: SectorOption) => optionMap[opt.value] = opt);
          const currentSelected = selectedSectors
            .map((s) => optionMap[s.value])
            .filter(Boolean)
            .slice(0, 3);
          setSelectedSectors(currentSelected);
        }

        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch updated data:", error);
        setLoading(false);
      });
  // eslint-disable-next-line
  }, [selectedSectors.map(s => s.value).join(","), startDate, endDate]);

  // Handler pilih sektor
  const handleSectorChange = (
    vals: MultiValue<SectorOption>,
    _action: ActionMeta<SectorOption>
  ) => {
    setSelectedSectors(Array.from(vals as SectorOption[]).slice(0, 3));
  };

  // Handler date change (cek range dan alert)
  const handleDateChange = (val: string, type: "start" | "end") => {
    if (!val) return;
    if (type === "start") {
      if (dateRange.min && val < dateRange.min) {
        setStartDate(dateRange.min);
        setAlert(`Data hanya tersedia mulai ${formatIndo(dateRange.min)}`);
      } else if (dateRange.max && val > dateRange.max) {
        setStartDate(dateRange.max);
        setAlert(`Data hanya tersedia sampai ${formatIndo(dateRange.max)}`);
      } else {
        setStartDate(val);
        setAlert(null);
      }
    } else {
      if (dateRange.max && val > dateRange.max) {
        setEndDate(dateRange.max);
        setAlert(`Data hanya tersedia sampai ${formatIndo(dateRange.max)}`);
      } else if (dateRange.min && val < dateRange.min) {
        setEndDate(dateRange.min);
        setAlert(`Data hanya tersedia mulai ${formatIndo(dateRange.min)}`);
      } else {
        setEndDate(val);
        setAlert(null);
      }
    }
  };

  // Utility tanggal Indonesia
  function formatIndo(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  }

  const secondarySectors = selectedSectors.filter(s => s.value !== primaryDataKey);

  const formatLargeNumber = (value: any) => {
    const num = Number(value);
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div
      className={twMerge(
        "rounded-2xl border bg-white/10 border-white/20 transition-all duration-300 flex flex-col p-4 md:p-5 hover:shadow-2xl hover:scale-[1.03] cursor-pointer"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="font-bold text-lg md:text-xl mb-3 sm:mb-0 text-white">
          Traffic
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {/* FILTER TANGGAL */}
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={startDate}
              min={dateRange.min}
              max={endDate || dateRange.max}
              onChange={e => handleDateChange(e.target.value, "start")}
              className="rounded border border-[#33334a] px-2 py-1 text-xs bg-[#222238] text-white"
            />
            <span className="mx-1 text-xs text-gray-400">sampai</span>
            <input
              type="date"
              value={endDate}
              min={startDate || dateRange.min}
              max={dateRange.max}
              onChange={e => handleDateChange(e.target.value, "end")}
              className="rounded border border-[#33334a] px-2 py-1 text-xs bg-[#222238] text-white"
            />
          </div>
          {/* FILTER SEKTOR */}
          <Select
            isMulti
            options={sectorOptions}
            value={selectedSectors}
            onChange={handleSectorChange}
            closeMenuOnSelect={false}
            className="min-w-[200px] max-w-full sm:max-w-[420px] text-xs"
            classNamePrefix="react-select"
            placeholder="Pilih hingga 3 sektor..."
            isOptionDisabled={(_option, selectedValues) => selectedValues.length >= 3}
            noOptionsMessage={() => "Semua opsi telah dipilih"}
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: 38,
                background: "#1b1b2c",
                borderColor: state.isFocused ? '#8b5cf6' : '#33334a',
                boxShadow: state.isFocused ? '0 0 0 1px #8b5cf6' : 'none',
                borderRadius: '0.5rem',
                color: "#fff",
                '&:hover': { borderColor: '#8b5cf6' },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 30,
                background: "#24243a",
                borderRadius: '0.5rem',
                color: "#fff",
              }),
              option: (base, state) => ({
                ...base,
                background: state.isSelected ? '#8b5cf6' : state.isFocused ? "#29294a" : 'transparent',
                color: state.isSelected ? '#fff' : "#e5e7eb",
              }),
              multiValue: (base) => ({
                ...base,
                background: "#33334a",
                borderRadius: '0.375rem',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "#f9fafb",
                fontWeight: 500,
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "#d1d5db",
                '&:hover': {
                  backgroundColor: '#f43f5e',
                  color: 'white',
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
              input: (base) => ({
                ...base,
                color: "#fff",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#aaa",
              }),
            }}
          />
        </div>
      </div>

      {/* ALERT RANGE */}
      {alert && (
        <div className="mb-3 rounded bg-yellow-800/70 border border-yellow-700 px-3 py-2 text-xs text-yellow-100">
          {alert}<br />
          <span>
            Data tersedia dari <b>{formatIndo(dateRange.min)}</b> sampai <b>{formatIndo(dateRange.max)}</b>
          </span>
        </div>
      )}

      <div className="w-full flex-1 min-h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Memuat data chart...
          </div>
        ) : !chartData || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Tidak ada data untuk ditampilkan. Silakan pilih sektor.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232335" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={formatLargeNumber}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatLargeNumber}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(139, 92, 246, 0.09)' }}
                contentStyle={{
                  background: "rgb(31 41 55 / 0.93)",
                  color: "#fff",
                  borderRadius: "0.75rem",
                  border: "1px solid #4b5563",
                  backdropFilter: 'blur(4px)',
                  fontSize: "0.875rem",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                }}
                labelFormatter={(label) => `Tanggal: ${new Date(label).toLocaleDateString("id-ID", { dateStyle: 'long' })}`}
                formatter={(value: any, name: string) => [`${Number(value).toLocaleString("id-ID", { maximumFractionDigits: 2 })} GB`, name]}
              />
              <Legend iconSize={10} wrapperStyle={{ paddingTop: '15px', color: "#fff" }} />

              {/* Render Bar untuk data primer */}
              {primaryDataKey && (
                <Bar
                  yAxisId="left"
                  key={primaryDataKey}
                  dataKey={primaryDataKey}
                  name={sectorOptions.find(s => s.value === primaryDataKey)?.label || primaryDataKey}
                  fill={sectorColors[0]}
                  radius={[4, 4, 0, 0]}
                />
              )}

              {/* Render Line untuk data sekunder */}
              {secondarySectors.map((sector, index) => (
                <Line
                  yAxisId="right"
                  key={sector.value}
                  type="monotone"
                  dataKey={sector.value}
                  name={sector.label}
                  stroke={sectorColors[index + 1]}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: "#151523" }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
