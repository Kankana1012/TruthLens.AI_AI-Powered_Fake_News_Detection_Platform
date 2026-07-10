export const SAMPLE_ARTICLES = [
  "Big Tech faces new scrutiny over data privacy practices. Several government agencies are investigating how user data is collected, stored, and potentially misused by social media platforms. The companies argue that they provide valuable services and that users agree to terms and conditions. However, critics say the terms are too complex and that users are not fully informed about how their information is shared with third parties.",
  "Scientists at a leading university announced today a breakthrough in renewable battery storage technology, claiming it could triple the lifespan of current lithium-ion batteries. Peer-reviewed results were published in a respected scientific journal, and independent researchers have been invited to replicate the findings before wide-scale adoption is considered.",
  "You won't believe this one weird trick that doctors don't want you to know! Local mom discovers secret remedy that cures all diseases overnight using only a common kitchen ingredient. Share before this gets taken down by the government and big pharma companies who don't want you to feel this good.",
  "The central bank announced a quarter-point interest rate change following its policy meeting today, citing steady employment figures and inflation trending toward its long-term target. Analysts largely expected the decision, and markets reacted with modest gains across major indices.",
];

export const getRandomSample = () =>
  SAMPLE_ARTICLES[Math.floor(Math.random() * SAMPLE_ARTICLES.length)];
