export default {
  async fetch(request) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const url = "https://www.truenas.com/docs/softwarestatus/";

    let res;
    try {
      res = await fetch(url, {
        headers: { "User-Agent": "TRMNL-TrueNAS-Plugin/1.0" },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ merge_variables: { error: "Failed to fetch TrueNAS page" } }),
        { headers }
      );
    }

    if (!res.ok) {
      return new Response(
        JSON.stringify({ merge_variables: { error: `TrueNAS page returned ${res.status}` } }),
        { headers }
      );
    }

    const html = await res.text();
    const versions = parseRecommendedVersions(html);

    return new Response(
      JSON.stringify({
        merge_variables: {
          versions,
          refreshed_at: new Date().toLocaleString("en-US", {
            timeZone: "UTC",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          }),
        },
      }),
      { headers }
    );
  },
};

/**
 * Parse the recommended versions table from the TrueNAS software status page.
 *
 * The table sits under the "which-truenas-version-is-recommended" heading and has the structure:
 *   | User Type | Enterprise | Community |
 *   | Developer | ... | ... |
 *   | Early Adopter | ... | ... |
 *   | General | ... | ... |
 *   | Mission Critical | ... | ... |
 */
function parseRecommendedVersions(html) {
  // Find the section around the recommended versions heading
  const anchor = html.indexOf("which-truenas-version-is-recommended");
  if (anchor === -1) {
    return [{ profile: "Error", enterprise: "Could not find recommended versions section", community: "" }];
  }

  // Find the first <table> after the anchor
  const tableStart = html.indexOf("<table", anchor);
  const tableEnd = html.indexOf("</table>", tableStart);
  if (tableStart === -1 || tableEnd === -1) {
    return [{ profile: "Error", enterprise: "Could not find versions table", community: "" }];
  }

  const tableHtml = html.slice(tableStart, tableEnd + "</table>".length);

  // Extract all rows
  const rows = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
    const cells = [];
    const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      // Strip HTML tags and decode entities, keep text content
      const text = cellMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      cells.push(text);
    }
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  // Skip the header row, map remaining rows to objects
  const versions = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    versions.push({
      profile: row[0] || "",
      enterprise: row[1] || "",
      community: row[2] || "",
    });
  }

  return versions.length > 0
    ? versions
    : [{ profile: "Error", enterprise: "No version rows found", community: "" }];
}
