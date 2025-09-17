import osUtils from 'os-utils';
import fs from 'fs';
import os from 'os';

const POLL_INTERVAL = 500;

export function pollResources() {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        const ramUsage = getRamUsage();
        const storageData = getStorageData();
        console.log(`CPU Usage: ${(cpuUsage * 100).toFixed(2)}%`);
    }, POLL_INTERVAL);
}

export function getStaticData() {
    const totalStorage = getStorageData().total;
    const cpuModel = os.cpus()[0].model;
    const totalRam = Math.floor(os.totalmem() / (1024));
    
    return {
        totalStorage,
        cpuModel,
        totalRam,
    }
}

function getCpuUsage() {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve);
    });
}

function getRamUsage() {
    return 1 - osUtils.freememPercentage();
}

function getStorageData() {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C:/' : '/');
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree;

    return {
        total: Math.floor(total / (1024 * 1024)),
        usage: 1 - (free / total),
    }
}