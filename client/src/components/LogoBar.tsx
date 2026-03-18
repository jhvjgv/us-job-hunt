/*
 * LogoBar - Company logos scroll strip
 * Design: 白底，灰色 logo，无限滚动动画
 */

const companies = [
  { name: "Google", abbr: "G" },
  { name: "Meta", abbr: "M" },
  { name: "Amazon", abbr: "A" },
  { name: "Apple", abbr: "" },
  { name: "Netflix", abbr: "N" },
  { name: "Microsoft", abbr: "MS" },
  { name: "Stripe", abbr: "S" },
  { name: "Airbnb", abbr: "Ab" },
  { name: "Uber", abbr: "U" },
  { name: "Lyft", abbr: "L" },
  { name: "Salesforce", abbr: "SF" },
  { name: "OpenAI", abbr: "OA" },
];

// Duplicate for seamless loop
const doubled = [...companies, ...companies];

export default function LogoBar() {
  return (
    <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="container mb-6">
        <p className="font-dm-sans text-sm text-center text-gray-400 font-medium tracking-widest uppercase">
          学员已成功入职以下公司
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-12 items-center"
          style={{
            animation: "scrollLeft 30s linear infinite",
            width: "max-content",
          }}
        >
          {doubled.map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold font-dm-sans">
                {company.abbr || company.name[0]}
              </div>
              <span className="font-dm-sans font-semibold text-base">{company.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
