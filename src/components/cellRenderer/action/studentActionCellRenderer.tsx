import { MdOutlineDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router";
import api from "../../../config/axios.config";
import { toast } from "react-toastify";
import type { ICellRendererParams } from "ag-grid-community";
import type { IStudent } from "../../../@types/interface/student.interface";

function StudentActionCellRenderer({
  params,
}: {
  params: ICellRendererParams<IStudent>;
}) {
  const navigate = useNavigate();
  const { data, api:gridApi } = params;
  if (!data) return null;
  const handlePreviewClick = () => {
    navigate(`/students/${data.student_id}`);
  };

  const handleStudentDelete = async () => {
    const result = confirm(
      `Are you sure to delete this student [${data.student_id}]?`,
    );
    if (!result) return;
    console.log("This line works");

    try {
      const response = await api.delete(`/students/${data.student_id}`);
      if (response.status === 200) {
        toast("Student deleted successfully", { type: "success" });
        gridApi.applyTransaction({ remove: [data] });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={handlePreviewClick}
        title="View"
        className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
      >
        <MdOutlineRemoveRedEye size={18} />
      </button>

      <button
        onClick={handleStudentDelete}
        title="Delete"
        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
      >
        <MdOutlineDelete size={18} />
      </button>
    </div>
  );
}

export default StudentActionCellRenderer;
