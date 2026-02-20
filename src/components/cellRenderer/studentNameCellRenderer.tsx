import { IoPersonOutline } from "react-icons/io5";
import getFullName from "../../utils/getFullName";
import { Link } from "react-router";
import type { IStudent } from "../../@types/interface/student.interface";

function StudentNameCellRenderer({ data }: { data?: IStudent }) {
  console.log(data);
  if (!data) return null;
  const fullName = getFullName(
    data.first_name,
    data.last_name,
    data.middle_name,
  );
  return (
    <div className="flex items-center gap-2">
      {data.profile_picture_url ? (
        <img
          src={data.profile_picture_url}
          alt={fullName}
          className="rounded-full h-8 w-8 object-cover"
        />
      ) : (
        <div className="rounded-full  p-2.5 flex justify-center items-center bg-gray-200" >

        <IoPersonOutline  className="h-[7]! w-[7]!"/>
        </div>
      )}
      <Link to={`/students/${data.student_id}`}><h4 className="hover:underline">{fullName}</h4></Link>
    </div>
  );
}

export default StudentNameCellRenderer;
