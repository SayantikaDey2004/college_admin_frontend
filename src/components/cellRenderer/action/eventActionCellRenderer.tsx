import api from "../../../config/axios.config";
import { toast } from "react-toastify";
import { MdOutlineRemoveRedEye, MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router";
import type { ICellRendererParams } from "ag-grid-community";
import type { IEvent } from "../../../@types/interface/event.interface";

function EventActionCellRenderer({
  params,
}: {
  params: ICellRendererParams<IEvent>;
}) {
  const navigate = useNavigate();
  const { data, api: gridApi } = params;
  if (!data) return null;
    const handlePreviewClick = () => {
      navigate(`/events/${data.event_id}`);
    };

    const handleEventDelete = async () => {
      const result = confirm(
        `Are you sure to delete this event [${data.event_id}]?`,
      );
      if (!result) return;
      console.log("This line works")
      
        try {
            const response = await api.delete(`/event/${data.event_id}`);
            if (response.status === 200) {
                toast("Event deleted successfully", { type: "success" });
                gridApi.applyTransaction({ remove: [data] });
            }
        } catch (error) {
            console.log(error);
        }
    };
 return (
    <div className="flex justify-center items-center gap-2">
      {/* View Button */}
      <button
        onClick={handlePreviewClick}
        title="View"
        className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
      >
        <MdOutlineRemoveRedEye size={18} />
      </button>
      {/* Delete Button */}               
        <button
        onClick={handleEventDelete}
        title="Delete"
        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
      >
        <MdOutlineDelete size={18} />
      </button>
    </div>
  );
}   

export default EventActionCellRenderer;