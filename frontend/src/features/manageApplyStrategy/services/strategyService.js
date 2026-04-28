import { supabase } from "@/services/supabase";

export const strategyService = {
  async savePlan(planData) {
    const { meta, steps, budgetItems, subtotal, contingency, grandTotal, totalHours } = planData;

    // 1. Insert/Update Main Plan
    const { data: plan, error: planError } = await supabase
      .from("strategic_plans")
      .upsert({
        title: meta.title,
        description: meta.description,
        zone: meta.zone,
        focus: meta.focus,
        priority: meta.priority,
        total_hours: totalHours,
        subtotal,
        contingency,
        grand_total: grandTotal,
      })
      .select()
      .single();

    if (planError) throw planError;

    const planId = plan.id;

    // 2. Clear existing steps and budget items if updating (or just insert if new)
    // Note: In a production app, you might want more surgical updates.
    await supabase.from("plan_steps").delete().eq("plan_id", planId);
    await supabase.from("plan_budget_items").delete().eq("plan_id", planId);

    // 3. Insert Steps
    if (steps.length > 0) {
      const { error: stepsError } = await supabase.from("plan_steps").insert(
        steps.map((s, index) => ({
          plan_id: planId,
          position: index,
          title: s.title,
          owner: s.owner,
          start_date: s.startDate || null,
          end_date: s.endDate || null,
          hours: s.hours,
          status: s.status,
          notes: s.notes,
        }))
      );
      if (stepsError) throw stepsError;
    }

    // 4. Insert Budget Items
    if (budgetItems.length > 0) {
      const { error: budgetError } = await supabase.from("plan_budget_items").insert(
        budgetItems.map((item) => ({
          plan_id: planId,
          category: item.category,
          description: item.description,
          qty: item.qty,
          unit_cost: item.unitCost,
        }))
      );
      if (budgetError) throw budgetError;
    }

    return plan;
  },

  async getPlan(id) {
    const { data: plan, error: planError } = await supabase
      .from("strategic_plans")
      .select(`
        *,
        plan_steps (*),
        plan_budget_items (*)
      `)
      .eq("id", id)
      .single();

    if (planError) throw planError;

    // Map back to frontend structure
    return {
      meta: {
        title: plan.title,
        description: plan.description,
        zone: plan.zone,
        focus: plan.focus,
        priority: plan.priority,
      },
      steps: plan.plan_steps.sort((a, b) => a.position - b.position).map(s => ({
        id: s.id,
        title: s.title,
        owner: s.owner,
        startDate: s.start_date,
        endDate: s.end_date,
        hours: s.hours,
        status: s.status,
        notes: s.notes,
      })),
      budgetItems: plan.plan_budget_items.map(item => ({
        id: item.id,
        category: item.category,
        description: item.description,
        qty: item.qty,
        unitCost: item.unit_cost,
      })),
    };
  }
};
