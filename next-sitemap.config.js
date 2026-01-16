/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.stanect.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/dashbaord/*"],
};
