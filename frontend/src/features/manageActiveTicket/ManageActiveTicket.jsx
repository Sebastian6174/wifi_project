import { useState } from "react";
import { MOCK_ACTIVE_TICKET } from "./utils/mockTicketData";
import TechnicianLayout from "./components/TechnicianLayout";
import EmptyTicketState from "./components/EmptyTicketState";
import TicketHeaderStats from "./components/TicketHeaderStats";
import TicketDetailsLeft from "./components/TicketDetailsLeft";
import TicketMapRoute from "./components/TicketMapRoute";
import TicketWorkLog from "./components/TicketWorkLog";

export default function ManageActiveTicket() {
  const [activeTicket, setActiveTicket] = useState(MOCK_ACTIVE_TICKET); 

  const handleComplete = () => {
    setActiveTicket(null);
  };

  return (
    <TechnicianLayout>
      <div className="animate-fade-in relative z-10 w-full h-full pb-20 md:pb-6">
        
        {!activeTicket ? (
          <EmptyTicketState />
        ) : (
          <div className="max-w-[1200px] mx-auto w-full">
            <TicketHeaderStats ticket={activeTicket} onComplete={handleComplete} />

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column */}
              <TicketDetailsLeft ticket={activeTicket} />

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-4">
                <TicketMapRoute end={activeTicket.routeData.end} />
                <TicketWorkLog worklog={activeTicket.worklog} />
              </div>
              
            </div>
          </div>
        )}

      </div>
    </TechnicianLayout>
  );
}
