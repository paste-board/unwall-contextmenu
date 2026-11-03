const MENU_ID = "open-in-unwall";

// https://example.com/a/b?x=1#y  ->  https://unwall.app/example.com/a/b?x=1#y
function toUnwall(raw) {
  let u;
  try {
    u = new URL((raw || "").trim());
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  return "https://unwall.app/" + u.host + u.pathname + u.search + u.hash;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Open link in Unwall",
    contexts: ["link"],
    targetUrlPatterns: ["http://*/*", "https://*/*"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  const target = toUnwall(info.linkUrl);
  if (!target) return;
  chrome.tabs.create({
    url: target,
    active: false,
    index: tab ? tab.index + 1 : undefined,
    openerTabId: tab ? tab.id : undefined,
  });
});
