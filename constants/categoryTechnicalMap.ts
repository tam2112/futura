// lib/categoryTechnicalMap.ts
export const categoryTechnicalMap: Record<string, string[]> = {
    computers: ['brand', 'color', 'cpu', 'storage', 'screenSize', 'batteryHealth', 'ram'],
    smartphones: ['brand', 'color', 'storage', 'connectivity', 'simSlot', 'batteryHealth', 'ram'],
    'accessories & bundles': ['brand', 'color', 'cpu', 'type', 'storage', 'screenSize', 'connectivity', 'ram'],
    laptops: ['brand', 'color', 'cpu', 'storage', 'screenSize', 'connectivity', 'batteryHealth', 'ram'],
    audio: ['brand', 'color', 'storage'],
    smartwatches: ['brand', 'color', 'type', 'storage', 'connectivity', 'batteryHealth'],
    tablets: ['brand', 'color', 'cpu', 'storage', 'screenSize', 'connectivity', 'simSlot', 'batteryHealth', 'ram'],
    'cameras & drones': ['brand', 'color', 'storage'],
    printers: ['brand', 'color'],
    video: ['brand', 'color', 'storage'],
    televisions: ['brand', 'color', 'storage', 'screenSize'],
    'home audio': ['brand', 'color'],
};
