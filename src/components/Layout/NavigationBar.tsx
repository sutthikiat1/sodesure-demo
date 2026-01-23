import { ShieldCheck, ClipboardList, Store } from "lucide-react";

interface NavigationBarProps {
  activeTab?: "check" | "history" | "store";
  onTabChange?: (tab: "check" | "history" | "store") => void;
}

function NavigationBar({
  activeTab = "check",
  onTabChange,
}: NavigationBarProps) {
  const tabs = [
    {
      id: "check" as const,
      icon: ShieldCheck,
      label: "ตรวจสอบสด",
    },
    {
      id: "history" as const,
      icon: ClipboardList,
      label: "ประวัติการสแกน",
    },
    {
      id: "store" as const,
      icon: Store,
      label: "ร้านค้าใกล้เคียง",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 max-w-[500px] mx-auto">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 ${isActive ? "text-primary" : ""}`}
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NavigationBar;
