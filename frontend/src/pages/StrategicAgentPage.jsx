import ManageStrategicAgent from "../features/manageStrategicAgent/ManageStrategicAgent";

export default function StrategicAgentPage() {
  return (
    <div className="w-full">
      {/* 
        Strategic background pattern - minimal to allow content to breathe
        Matches the "salsa-path-bg" concept without overriding React layout flows 
      */}
      <div 
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(0, 72, 81, 1) 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
      />
      <ManageStrategicAgent />
    </div>
  );
}
