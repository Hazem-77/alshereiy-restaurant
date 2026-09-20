async function testServer() {
  const res = await fetch("http://localhost:3000");
  console.log("Status Code:", res.status);
  const text = await res.text();
  console.log("HTML length:", text.length);
  console.log("Found Restaurant Name:", text.includes("مطعم الشريعى"));
  console.log("Found RTL:", text.includes('dir="rtl"'));
  console.log("Found Cairo Font:", text.includes("font-cairo"));
  console.log("Found WhatsApp Number:", text.includes("01208696419"));
  console.log("Found Best-Seller Dish:", text.includes("ساندوتش هرم فراخ"));
  console.log("Found Offer System:", text.includes("عرض القرمشة الملكي"));
  console.log("Found JSON-LD:", text.includes("application/ld+json"));

  // Check image status
  const imgRes = await fetch("http://localhost:3000/images/logo/logo-emblem.jpg");
  console.log("Logo image status:", imgRes.status);
  const foodImgRes = await fetch("http://localhost:3000/images/menu/chicken-pyramid.jpg");
  console.log("Food image status:", foodImgRes.status);
  const facadeImgRes = await fetch("http://localhost:3000/images/storefront/facade.jpg");
  console.log("Facade image status:", facadeImgRes.status);

  // Check robots and sitemap
  const robotsRes = await fetch("http://localhost:3000/robots.txt");
  console.log("robots.txt status:", robotsRes.status);
  const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
  console.log("sitemap.xml status:", sitemapRes.status);
}

testServer().catch(console.error);
