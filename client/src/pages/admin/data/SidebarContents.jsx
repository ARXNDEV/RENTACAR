
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart } from 'react-icons/fi';
import { BsKanban, BsBarChart  } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { IoHomeOutline } from "react-icons/io5";
import { GiLouvrePyramid } from 'react-icons/gi';




import { LuNavigation } from 'react-icons/lu';
export const links = [
    {
      title: 'Dashboard',
      links: [
        {
          name:'adminHome',
          icon:<IoHomeOutline />,
        },
        {
          name: 'allProduct',
          icon: <FiShoppingBag />,
        },
        {
          name: 'vendorVehicleRequests',
          icon: <FiShoppingBag />,
        },
        {
          name: 'locations',
          icon: <LuNavigation />,
        },
      ],
    },
    {
      title: 'Pages',
      links: [
        {
          name: 'orders',
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: 'allUsers',
          icon: <RiContactsLine />,
        },
        {
          name: 'allVendors',
          icon: <IoMdContacts />,
        },
        {
          name: 'profile',
          icon: <RiContactsLine />,
        },
      ],
    }
];