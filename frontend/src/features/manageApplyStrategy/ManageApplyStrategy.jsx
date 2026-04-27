import usePlanForm from "./hooks/usePlanForm";
import PlanHeader from "./components/PlanHeader";
import PlanIdentityForm from "./components/PlanIdentityForm";
import ExecutionSteps from "./components/ExecutionSteps";
import BudgetEstimator from "./components/BudgetEstimator";
import AIRecommendationsPanel from "./components/AIRecommendationsPanel";
import ExportActions from "./components/ExportActions";

export default function ManageApplyStrategy() {
  const {
    meta, updateMeta,
    steps, updateStep, addStep, removeStep, moveStep,
    budgetItems, updateBudgetItem, addBudgetItem, removeBudgetItem,
    subtotal, contingency, grandTotal, totalHours,
    saved, handleSave,
  } = usePlanForm();

  // When AI suggests a step, add it as a note to a new step
  const handleAISuggestion = (suggestion) => {
    addStep();
    // In a real implementation this would pre-fill the new step's notes
  };

  return (
    <div className="min-h-full p-4 md:p-6 relative">
      {/* Subtle dot grid background */}
      <div
        className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #004851 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-[1200px] mx-auto">
        <PlanHeader
          meta={meta}
          totalHours={totalHours}
          grandTotal={grandTotal}
          saved={saved}
          onSave={handleSave}
        />

        {/* Main Grid: 8 col content + 4 col sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ── Left: main content column ── */}
          <div className="lg:col-span-8 space-y-5">
            <PlanIdentityForm meta={meta} onUpdate={updateMeta} />

            <ExecutionSteps
              steps={steps}
              onUpdate={updateStep}
              onAdd={addStep}
              onRemove={removeStep}
              onMove={moveStep}
              totalHours={totalHours}
            />

            <BudgetEstimator
              items={budgetItems}
              subtotal={subtotal}
              contingency={contingency}
              grandTotal={grandTotal}
              onUpdate={updateBudgetItem}
              onAdd={addBudgetItem}
              onRemove={removeBudgetItem}
            />
          </div>

          {/* ── Right: sidebar ── */}
          <div className="lg:col-span-4 space-y-4">
            <AIRecommendationsPanel
              focus={meta.focus}
              onApplySuggestion={handleAISuggestion}
            />
            <ExportActions
              meta={meta}
              steps={steps}
              budgetItems={budgetItems}
              grandTotal={grandTotal}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
