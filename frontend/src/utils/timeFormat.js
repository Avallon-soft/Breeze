export function formatRelativeTime(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));

  if (diffMinutes < 1) {
    return "à l'instant";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (hours < 24) {
    return remainingMinutes === 0 ? `${hours} h` : `${hours} h ${remainingMinutes.toString().padStart(2, "0")}`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? "1 j" : `${days} j`;
}

export function formatTimeLeft(expiresAt) {
  if (!expiresAt) {
    return null;
  }

  const expiryDate = new Date(expiresAt);
  if (Number.isNaN(expiryDate.getTime())) {
    return null;
  }

  const remainingMinutes = Math.max(0, Math.floor((expiryDate.getTime() - Date.now()) / 60000));

  if (remainingMinutes < 60) {
    return `${remainingMinutes} min`;
  }

  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes.toString().padStart(2, "0")}`;
}

const DAY_IN_MINUTES = 24 * 60;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function computeProgress(post) {
  if (typeof post.progress === "number") {
    return clamp(post.progress, 0, 1);
  }

  const createdAt = post.createdAt || post.created_at;
  const expiresAt = post.expiresAt || post.expireAt || post.expires_at;

  if (createdAt && expiresAt) {
    const start = new Date(createdAt).getTime();
    const end = new Date(expiresAt).getTime();

    if (!Number.isNaN(start) && !Number.isNaN(end) && end > start) {
      const remaining = clamp((end - Date.now()) / (end - start), 0, 1);
      return 1 - remaining;
    }
  }

  if (createdAt) {
    const date = new Date(createdAt);
    if (!Number.isNaN(date.getTime())) {
      const ageMinutes = Math.max(0, (Date.now() - date.getTime()) / 60000);
      return clamp(ageMinutes / DAY_IN_MINUTES, 0, 1);
    }
  }

  return 0;
}
