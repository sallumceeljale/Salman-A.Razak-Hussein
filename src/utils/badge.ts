import { VolunteerHourLog, Post } from '../types';

export interface BadgeInfo {
  text: 'Top Contributor' | 'Rising Star';
  colorClass: string;
  icon: string;
  reason: string;
}

/**
 * Automatically assigns badges based on volunteer participation metrics.
 * - 'Top Contributor' for members with >= 10 hours logged or >= 5 bulletin posts.
 * - 'Rising Star' for members with >= 3 hours logged or >= 2 bulletin posts.
 */
export function getMemberBadge(
  memberId: string,
  logs: VolunteerHourLog[],
  posts: Post[]
): BadgeInfo | null {
  if (!memberId) return null;

  // 1. Calculate total approved hours logged by this member
  // Match by either userId or email if appropriate, but userId is the primary identifier
  const memberApprovedLogs = logs.filter(log => log && log.userId === memberId && log.status === 'approved');
  const totalApprovedMinutes = memberApprovedLogs.reduce((sum, log) => {
    const mins = typeof log.minutes === 'number' ? log.minutes : Math.round(Number(log.hours || 0) * 60);
    return sum + mins;
  }, 0);
  const totalHours = totalApprovedMinutes / 60;

  // 2. Calculate number of bulletin posts created by this member
  const totalPosts = posts.filter(post => post && post.authorUID === memberId).length;

  if (totalHours >= 10 || totalPosts >= 5) {
    let reason = '';
    if (totalHours >= 10 && totalPosts >= 5) {
      reason = `${totalHours.toFixed(1)}h logged & ${totalPosts} posts`;
    } else if (totalHours >= 10) {
      reason = `${totalHours.toFixed(1)}h logged`;
    } else {
      reason = `${totalPosts} bulletin posts`;
    }

    return {
      text: 'Top Contributor',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
      icon: '🔥',
      reason,
    };
  } else if (totalHours >= 3 || totalPosts >= 2) {
    let reason = '';
    if (totalHours >= 3 && totalPosts >= 2) {
      reason = `${totalHours.toFixed(1)}h logged & ${totalPosts} posts`;
    } else if (totalHours >= 3) {
      reason = `${totalHours.toFixed(1)}h logged`;
    } else {
      reason = `${totalPosts} posts`;
    }

    return {
      text: 'Rising Star',
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10',
      icon: '⭐',
      reason,
    };
  }

  return null;
}
