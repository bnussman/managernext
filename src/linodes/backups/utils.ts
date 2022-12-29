import { LinodeBackupDisk } from "@linode/api-v4";

/**
 * gets the sum of all backup disks sizes
 * @param disks List of backup disks
 * @returns total size of all disks in MB
 */
export function getBackupDisksTotalSize(disks: LinodeBackupDisk[]) {
  return disks.reduce((acc, disk) => {
    acc += disk.size;
    return acc;
  }, 0);
}