import { CiBoxes, CiDiscount1, CiHome, CiPenpot, CiUnlock, CiUser, CiWavePulse1 } from 'react-icons/ci';
import { GiSmartphone } from 'react-icons/gi';
import { PiGearThin, PiUserCircleThin } from 'react-icons/pi';

export const sidebarMenuLinks = [
    { name: 'Home', icon: <CiHome width={18} height={18} />, path: '/admin' },
    { name: 'User', icon: <CiUser width={18} height={18} />, path: '/admin/user/list' },
    { name: 'Category', icon: <CiPenpot width={18} height={18} />, path: '/admin/category/list' },
    { name: 'Product', icon: <GiSmartphone width={18} height={18} />, path: '/admin/product/list' },
    { name: 'Promotion', icon: <CiDiscount1 width={18} height={18} />, path: '/admin/promotion/list' },
    { name: 'Order', icon: <CiBoxes width={18} height={18} />, path: '/admin/order/list' },
    { name: 'Status', icon: <CiWavePulse1 width={18} height={18} />, path: '/admin/status/list' },
    { name: 'Role', icon: <CiUnlock width={18} height={18} />, path: '/admin/role/list' },
];

export const sidebarOtherLinks = [
    { name: 'Profile', icon: <PiUserCircleThin width={18} height={18} />, path: '/admin/profile' },
    { name: 'Settings', icon: <PiGearThin width={18} height={18} />, path: '/admin/settings' },
];

export const technicalLinks = [
    { name: 'Brand', path: '/admin/technical/brand/list' },
    { name: 'Color', path: '/admin/technical/color/list' },
    { name: 'Storage', path: '/admin/technical/storage/list' },
    { name: 'Connectivity', path: '/admin/technical/connectivity/list' },
    { name: 'Sim slot', path: '/admin/technical/sim-slot/list' },
    { name: 'Battery health', path: '/admin/technical/battery-health/list' },
    { name: 'RAM', path: '/admin/technical/ram/list' },
    { name: 'CPU', path: '/admin/technical/cpu/list' },
    { name: 'Screen size', path: '/admin/technical/screen-size/list' },
    { name: 'Type', path: '/admin/technical/type/list' },
];
