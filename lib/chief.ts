import {
  emails,
  highPriorityEmails,
  interviewEmails,
  openTasks,
  todayMeetings,
  unreadCount,
} from "./data";
import { timeAgo } from "./utils";

export interface ChiefReply {
  text: string;
  actions?: string[];
}

/**
 * A small intent engine that makes the Chief of Staff feel responsive without
 * a backend. In production this maps to GPT-5 + the connected integrations.
 */
export function askChief(raw: string): ChiefReply {
  const q = raw.toLowerCase();

  if (/interview|ascendion/.test(q)) {
    const i = interviewEmails[0];
    return {
      text: `Yes. You received an interview invitation from Ascendion for ${i.subject.replace(
        "Interview Invitation — ",
        ""
      )}. You haven't replied for ${timeAgo(i.receivedAt).replace(
        " ago",
        ""
      )}. Recommended action: reply today and confirm Thursday 2:00 PM.`,
      actions: ["Draft reply", "Add to calendar"],
    };
  }

  if (/important|anything|priorit|urgent/.test(q)) {
    const top = highPriorityEmails[0];
    return {
      text: `A few things need you today. The most pressing: "${top.subject}" from ${top.from} (${top.importance}/100). You also have ${todayMeetings.length} meetings and ${openTasks.length} open tasks. Recommended focus: finish the Kafi branding presentation.`,
      actions: ["Show urgent emails", "Plan my day"],
    };
  }

  if (/email|inbox|unread/.test(q)) {
    return {
      text: `You have ${unreadCount} unread emails — ${highPriorityEmails.length} are high priority. I'd start with Maya's urgent pitch request and the Ascendion interview invite.`,
      actions: ["Open inbox", "Summarize all"],
    };
  }

  if (/meeting|calendar|today|schedule/.test(q)) {
    const conflict = todayMeetings.find((e) => e.conflict);
    return {
      text: `You have ${todayMeetings.length} meetings today${
        conflict
          ? `, and a conflict at 2:00 PM — the Ascendion interview overlaps with Maya's slide review. I'd move the review to 3:00 PM.`
          : "."
      }`,
      actions: conflict ? ["Resolve conflict", "View calendar"] : ["View calendar"],
    };
  }

  if (/work on|focus|should i do|today/.test(q)) {
    return {
      text: `Your single highest-leverage task today is finishing the Kafi branding presentation — the board reviews it Friday and it's your top client. After that, reply to Ascendion and polish Maya's 4 pitch slides tonight.`,
      actions: ["Start focus block", "Show tasks"],
    };
  }

  if (/invoice|unpaid|finance|money/.test(q)) {
    return {
      text: `One invoice is overdue: INV-2041 to Kevson Cafe for £1,800, now 12 days late. Akash hasn't paid and the promo film is blocked behind it. I'd send a gentle follow-up today.`,
      actions: ["Draft follow-up", "View finance"],
    };
  }

  if (/draft|reply|respond/.test(q)) {
    const e = emails.find((x) => x.suggestedReply) ?? emails[0];
    return {
      text: `Here's a suggested reply to "${e.subject}":\n\n"${e.suggestedReply}"`,
      actions: ["Send", "Edit", "Discard"],
    };
  }

  if (/follow.?up|crm|people|contact/.test(q)) {
    return {
      text: `You haven't followed up with Akash from Kevson Cafe in 3 weeks, and Sarah from Ascendion is waiting on your interview reply. Want me to draft both?`,
      actions: ["Draft both", "Open People"],
    };
  }

  return {
    text: `I'm on it. I can brief you on emails, your calendar, interviews, invoices, follow-ups, or what to focus on. Try "Anything important?" or "What should I work on today?"`,
    actions: ["Anything important?", "Plan my day"],
  };
}

export const chiefSuggestions = [
  "Anything important?",
  "Any interviews?",
  "What should I work on today?",
  "Show unpaid invoices",
];
