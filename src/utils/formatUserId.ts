export function fillUserId(userId: number): string {
  if (!userId) return '000000000000000';
  return userId.toString().padStart(15, '0');
}

export function fillBannerId(bannerId: number): string {
  if (!bannerId) return '000000000000000';
  return bannerId.toString().padStart(15, '0');
}

export function fillProfileId(profileId: number | string): string {
  if (!profileId) return '';
  return profileId.toString().padStart(8, '0');
}
