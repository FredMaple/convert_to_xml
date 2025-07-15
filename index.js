$("#convertBtn").click(function () {
    const lines = $("#input").val().trim().split("\n");
    let xml = "<people>\n";
    let currentPerson = null;
    let currentFamily = null;

    function escapeXml(str) {
        if (!str) return "";
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    for (let line of lines) {
        const parts = line.split("|");
        const tag = parts[0];

        if (tag === "P") {
            if (currentFamily) currentPerson += currentFamily + "    </family>\n";
            if (currentPerson) xml += currentPerson + "  </person>\n";
            currentPerson = `  <person>\n    <firstname>${escapeXml(parts[1])}</firstname>\n    <lastname>${escapeXml(parts[2])}</lastname>\n`;
            currentFamily = null;
        } else if (tag === "T") {
            const phoneXml = `    <phone>\n      <mobile>${escapeXml(parts[1])}</mobile>\n      <landline>${escapeXml(parts[2])}</landline>\n    </phone>\n`;
            if (currentFamily) {
                currentFamily += phoneXml;
            } else {
                currentPerson += phoneXml;
            }
        } else if (tag === "A") {
            const street = parts[1] || "";
            const city = parts[2] || "";
            const zip = parts[3] || "";
            const addressXml = `    <address>\n      <street>${escapeXml(street)}</street>\n      <city>${escapeXml(city)}</city>\n      <zip>${escapeXml(zip)}</zip>\n    </address>\n`;
            if (currentFamily) {
                currentFamily += addressXml;
            } else {
                currentPerson += addressXml;
            }
        } else if (tag === "F") {
            if (currentFamily) currentPerson += currentFamily + "    </family>\n";
            currentFamily = `    <family>\n      <name>${escapeXml(parts[1])}</name>\n      <born>${escapeXml(parts[2])}</born>\n`;
        }
    }

    if (currentFamily) currentPerson += currentFamily + "    </family>\n";
    if (currentPerson) xml += currentPerson + "  </person>\n";
    xml += "</people>";

    $("#output").text(xml);
});
