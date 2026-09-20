// ⚠️ STEP 1: Paste your Google Apps Script Web App URL here after deploying it.
// It looks like: https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw6mGsVHU5oAwMN58_TOQScXqp4nkWPF2YIen66dsEbzQFBdmrR36ukpcjxiRbuILdx/exec";

const form = document.getElementById("userForm");
const statusMsg = document.getElementById("statusMsg");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    department: document.getElementById("department").value.trim(),
    gender: document.getElementById("gender").value,
    city: document.getElementById("city").value.trim(),
  };

  if (!data.name || !data.department || !data.gender || !data.city) {
    showStatus("Please fill in all fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  showStatus("", "");

  fetch(SCRIPT_URL, {
    method: "POST",
    // Apps Script Web Apps don't handle preflighted JSON requests well from
    // the browser, so we send it as text/plain to keep it a "simple request"
    // and avoid CORS issues. Code.gs parses it as JSON on the other side.
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.result === "success") {
        showStatus("✅ Submitted successfully!", "success");
        form.reset();
      } else {
        showStatus("❌ Something went wrong: " + (result.message || "unknown error"), "error");
      }
    })
    .catch((err) => {
      console.error(err);
      showStatus("❌ Could not reach the server. Check the Web App URL.", "error");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    });
});

function showStatus(text, type) {
  statusMsg.textContent = text;
  statusMsg.className = type;
}
