export type SiteContent = {
  name: string;
  headline: string;
  cta: string;
};

export function getPortfolioContent(): SiteContent {
  return {
    name: "Naman Mehra",
    headline: "Designer · Builder · Storyteller",
    cta: "Explore My Journey",
  };
}
