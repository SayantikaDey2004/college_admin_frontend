import { MdOutlineDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router";
import api from "../../../config/axios.config";
import { toast } from "react-toastify";
import type { ICellRendererParams } from "ag-grid-community";
import type { INotice } from "../../../@types/interface/notice.interface";

function NoticeActionCellRenderer({
  params,
}: {
  params: ICellRendererParams<INotice>;
}) {
  const navigate = useNavigate();
  const { data, api:gridApi } = params;
  if (!data) return null;
  const handlePreviewClick = () => {
    navigate(`/notices/${data.notice_id}`);
  };

  const handleNoticeDelete = async () => {
    const result = confirm(
      `Are you sure to delete this notice [${data.notice_id}]?`,
    );
    if (!result) return;
    console.log("This line works");

    try {
      const response = await api.delete(`/notice/${data.notice_id}`);
      if (response.status === 200) {
        toast("Notice deleted successfully", { type: "success" });
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

      {/* Edit Button
      <button
          onClick={()=>{}}
          title="Edit"
          className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
          >
        <BiEdit size={18} />
      </button> */}

      {/* Delete Button */}
      <button
        onClick={handleNoticeDelete}
        title="Delete"
        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
      >
        <MdOutlineDelete size={18} />
      </button>
    </div>
  );
}

export default NoticeActionCellRenderer;
