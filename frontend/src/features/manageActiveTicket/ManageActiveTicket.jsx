import { useState } from "react";
import { MOCK_ACTIVE_TICKET } from "./utils/mockTicketData";
import TechnicianLayout from "./components/TechnicianLayout";
import EmptyTicketState from "./components/EmptyTicketState";
import TicketHeaderStats from "./components/TicketHeaderStats";
import TicketDetailsLeft from "./components/TicketDetailsLeft";
import TicketMapRoute from "./components/TicketMapRoute";
import TicketWorkLog from "./components/TicketWorkLog";

export default function ManageActiveTicket() {
  // En un caso real esto se llenaría con una llamada a la API. 
  // Null significa que no hay ticket activo validando el Empty State que pidieron.
  const [activeTicket, setActiveTicket] = useState(MOCK_ACTIVE_TICKET); 

  return (
    <TechnicianLayout>
      <div className="animate-fade-in relative z-10 w-full h-full pb-20 md:pb-6">
        
        {!activeTicket ? (
          <EmptyTicketState />
        ) : (
          <div className="max-w-[1200px] mx-auto w-full">
            <TicketHeaderStats ticket={activeTicket} />

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column */}
              <TicketDetailsLeft ticket={activeTicket} />

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-4">
                <TicketMapRoute start={activeTicket.routeData.start} end={activeTicket.routeData.end} />
                <TicketWorkLog worklog={activeTicket.worklog} />
              </div>
              
            </div>
            
            {/* Contextual FAB Camera Button - Fixed position inside Layout */}
            <button className="fixed bottom-24 right-6 md:bottom-8 w-12 h-12 bg-amber-500 text-white rounded-full shadow-2xl shadow-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            </button>
          </div>
        )}

      </div>
    </TechnicianLayout>
  );
}
