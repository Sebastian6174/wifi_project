import { useState, useCallback } from "react";
import { DEFAULT_STEPS } from "../utils/mockPlanData";
import { strategyService } from "../services/strategyService";

const DEFAULT_META = {
  title: "",
  description: "",
  zone: "",
  focus: "maintenance",
  priority: "medium",
};

const DEFAULT_BUDGET_ITEM = () => ({
  id: Date.now(),
  category: "hardware",
  description: "",
  qty: 1,
  unitCost: 0,
});

export default function usePlanForm() {
  const [meta, setMeta] = useState(DEFAULT_META);
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [budgetItems, setBudgetItems] = useState([DEFAULT_BUDGET_ITEM()]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // ── Meta ──────────────────────────────────────────────────────────────────
  const updateMeta = useCallback((field, value) => {
    setSaved(false);
    setMeta((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ── Steps ─────────────────────────────────────────────────────────────────
  const updateStep = useCallback((id, field, value) => {
    setSaved(false);
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }, []);

  const addStep = useCallback(() => {
    setSaved(false);
    setSteps((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        owner: "",
        startDate: "",
        endDate: "",
        hours: 4,
        status: "pending",
        notes: "",
      },
    ]);
  }, []);

  const removeStep = useCallback((id) => {
    setSaved(false);
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const moveStep = useCallback((id, direction) => {
    setSaved(false);
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }, []);

  // ── Budget ────────────────────────────────────────────────────────────────
  const updateBudgetItem = useCallback((id, field, value) => {
    setSaved(false);
    setBudgetItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: field === "qty" || field === "unitCost" ? Number(value) : value } : r))
    );
  }, []);

  const addBudgetItem = useCallback(() => {
    setSaved(false);
    setBudgetItems((prev) => [...prev, DEFAULT_BUDGET_ITEM()]);
  }, []);

  const removeBudgetItem = useCallback((id) => {
    setSaved(false);
    setBudgetItems((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const subtotal = budgetItems.reduce((acc, r) => acc + r.qty * r.unitCost, 0);
  const contingency = subtotal * 0.1;
  const grandTotal = subtotal + contingency;

  const totalHours = steps.reduce((a, s) => a + Number(s.hours || 0), 0);

  // ── Save (Supabase) ───────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await strategyService.savePlan({
        meta,
        steps,
        budgetItems,
        subtotal,
        contingency,
        grandTotal,
        totalHours,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save plan:", err);
      setError("Error al guardar el plan estratégico");
    } finally {
      setLoading(false);
    }
  }, [meta, steps, budgetItems, subtotal, contingency, grandTotal, totalHours]);

  const resetForm = useCallback(() => {
    setMeta(DEFAULT_META);
    setSteps(DEFAULT_STEPS);
    setBudgetItems([DEFAULT_BUDGET_ITEM()]);
    setSaved(false);
    setError(null);
  }, []);

  return {
    meta, updateMeta,
    steps, updateStep, addStep, removeStep, moveStep,
    budgetItems, updateBudgetItem, addBudgetItem, removeBudgetItem,
    subtotal, contingency, grandTotal, totalHours,
    loading, error, saved, handleSave, resetForm,
  };
}
