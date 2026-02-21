import {
  MdOutlineChat,
  MdOutlineDashboard,
  MdOutlineEvent,
  MdOutlineEventAvailable,
  MdOutlineFormatListBulleted,
  MdOutlineNoteAdd,
  MdOutlinePerson2,
  MdOutlinePersonAddAlt1,
} from "react-icons/md";

const sidebarMenuItems = [
  {
    title: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/dashboard",
    children: [],
  },
  {
    title: "Faculty",
    icon: MdOutlinePerson2,
    children: [
      {
        title: "Add Faculty",
        path: "/faculty/add",
        icon: MdOutlinePersonAddAlt1,
      },
      {
        title: "Faculty List",
        path: "/faculty/list",
        icon: MdOutlineFormatListBulleted,
      },
    ],
  },
  {
    title: "Students",
    icon: MdOutlinePerson2,
    children: [
      {
        title: "Add Student",
        path: "/students/add",
        icon: MdOutlinePersonAddAlt1,
      },
      {
        title: "Student List",
        path: "/students/list",
        icon: MdOutlineFormatListBulleted,
      },
    ],
  },
  {
    title: "Notices",
    icon: MdOutlineChat,
    children: [
      {
        title: "Add Notice",
        path: "/notices/add",
        icon: MdOutlineNoteAdd,
      },

      {
        title: "Notice List",
        path: "/notices/list",
        icon: MdOutlineFormatListBulleted,
      },
    ],
  },
  {
    title: "Events",
    icon: MdOutlineEvent,
    children: [
      {
        title: "Add Event",
        path: "/events/add",
        icon: MdOutlineEventAvailable,
      },

      {
        title: "Event List",
        path: "/events/list",
        icon: MdOutlineFormatListBulleted,
      },
    ],
  },
  /*{
    title: "Contact Us",
    icon:MdCall,
    path: "/contact-us",
    children:[],
  },*/
];

export default sidebarMenuItems;
