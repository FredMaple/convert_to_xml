$(document).ready(function () {
  
  // Lägg till ny användare
  $("#userForm").on("submit", function (e) {
    e.preventDefault();

    const förnamn = $("#förnamn").val();
    const efternamn = $("#efternamn").val();
    const adress = $("#adress").val();
    const telefon = $("#telefon").val();
    const personnummer = $("#personnummer").val();

    const userCard = $(`
      <div class="border p-3 bg-white shadow-sm position-relative user-card">
        <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 delete-btn">🗑</button>
        <p><strong>Förnamn:</strong> <span class="editable" contenteditable="true">${förnamn}</span></p>
        <p><strong>Efternamn:</strong> <span class="editable" contenteditable="true">${efternamn}</span></p>
        <p><strong>Adress:</strong> <span class="editable" contenteditable="true">${adress}</span></p>
        <p><strong>Telefon:</strong> <span class="editable" contenteditable="true">${telefon}</span></p>
        <p><strong>Personnummer:</strong> <span class="editable" contenteditable="true">${personnummer}</span></p>

        <h6>Familjemedlemmar:</h6>
        <div class="familyMembers"></div>
        <button type="button" class="btn btn-outline-secondary btn-sm mt-2 openFamilyModal" data-bs-toggle="modal" data-bs-target="#familyModal">+ Lägg till familjemedlem</button>

      </div>
    `);

    $("#userList").append(userCard);
    this.reset(); // Rensa formuläret
  });

  // //ta bort familjemedlem
  $(document).on("click", ".removeFamilyBtn", function () {
    $(this).closest(".family-member").remove();
  });

  let currentUserCard = null;

  $("#userList").on("click", ".openFamilyModal", function () {
    currentUserCard = $(this).closest(".user-card");
    // Rensa formuläret i modalen varje gång
    $("#familyForm")[0].reset();
  });

  // När formuläret i modalen skickas in
  $("#familyForm").on("submit", function (e) {
    e.preventDefault();

    const name = $("#famNamn").val().trim();
    const born = $("#famBorn").val().trim();
    const address = $("#famAdress").val().trim();
    const phone = $("#famTelefon").val().trim();

    const familyHtml = `
      <div class="family-member border p-3 mb-2 position-relative">
        <button type="button" class="btn-close position-absolute top-0 end-0 removeFamilyBtn" aria-label="Ta bort"></button>
        <p><strong>Namn:</strong> <span>${name}</span></p>
        <p><strong>Födelseår:</strong> <span>${born}</span></p>
        <p><strong>Adress:</strong> <span>${address}</span></p>
        <p><strong>Telefon:</strong> <span>${phone}</span></p>
      </div>
    `;

    currentUserCard.find(".familyMembers").append(familyHtml);
    const modal = bootstrap.Modal.getInstance(document.getElementById('familyModal'));
    modal.hide(); // Stäng modalen efter inmatning
  });

  // Ta bort användare
  $("#userList").on("click", ".delete-btn", function () {
    $(this).closest(".user-card").remove();
  });

  // Exportera till XML
  $("#exportBtn").click(function () {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Personer>\n';

    $(".user-card").each(function () {
      const f = $(this).find("p:eq(0) span").text().trim();
      const e = $(this).find("p:eq(1) span").text().trim();
      const a = $(this).find("p:eq(2) span").text().trim();
      const t = $(this).find("p:eq(3) span").text().trim();
      const p = $(this).find("p:eq(4) span").text().trim();

      xml += `  <Person>\n`;
      xml += `    <Förnamn>${f}</Förnamn>\n`;
      xml += `    <Efternamn>${e}</Efternamn>\n`;
      xml += `    <Adress>${a}</Adress>\n`;
      xml += `    <Telefon>${t}</Telefon>\n`;
      xml += `    <Personnummer>${p}</Personnummer>\n`;

      // Familjemedlemmar
      $(this).find(".family-member").each(function () {
        const famName = $(this).find("p:eq(0) span").text().trim();
        const famBorn = $(this).find("p:eq(1) span").text().trim();
        const famAddress = $(this).find("p:eq(2) span").text().trim();
        const famPhone = $(this).find("p:eq(3) span").text().trim();

        xml += `    <Family>\n`;
        xml += `      <Name>${famName}</Name>\n`;
        xml += `      <Born>${famBorn}</Born>\n`;
        if (famAddress) xml += `      <Address>${famAddress}</Address>\n`;
        if (famPhone) xml += `      <Phone>${famPhone}</Phone>\n`;
        xml += `    </Family>\n`;
      });

      xml += `  </Person>\n`;
    });

    xml += "</Personer>";
    $("#xmlOutput").text(xml).show();
  });
});
