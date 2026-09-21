import { cardStyle } from "./styles";

export function SettingsSkeleton() {
  return (
    <div>
      <div
        className="flex items-center justify-between gap-4 bg-[#fafafa] border-b border-[#511f29]/10"
        style={{ padding: "24px 40px" }}
      >
        <div>
          <div className="h-6 w-24 bg-[#eeeeec] animate-pulse mb-2" />
          <div className="h-4 w-48 bg-[#eeeeec] animate-pulse" />
        </div>
        <div className="h-11 w-32 bg-[#eeeeec] animate-pulse" />
      </div>

      <div style={{ padding: "32px 40px" }}>
        <div className="flex gap-8">
          <div className="w-56 shrink-0 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-[#fafafa] animate-pulse" />
            ))}
          </div>
          <div className="flex-1 max-w-2xl">
            <div className="bg-white" style={cardStyle}>
              <div className="h-6 w-48 bg-[#eeeeec] animate-pulse mb-2" />
              <div className="h-4 w-64 bg-[#eeeeec] animate-pulse mb-8" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-32 bg-[#eeeeec] animate-pulse mb-2" />
                    <div className="h-12 bg-[#fafafa] animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
