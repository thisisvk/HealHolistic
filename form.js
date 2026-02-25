let currentStep = 0;

function showStep(step) {
    const allSteps = document.querySelectorAll(".form-step");
    allSteps.forEach((stepDiv, index) => {
        stepDiv.classList.remove("active");
        if (index === step) {
            stepDiv.classList.add("active");
        }
    });
    currentStep = step;
}

function nextStep() {
    const totalSteps = document.querySelectorAll(".form-step").length;
    if (currentStep < totalSteps - 1) {
        showStep(currentStep + 1);
    }
}

function previousStep() {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
}

function submitForm() {
    const submitBtn = document.getElementById("submitBtn");
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const data = new URLSearchParams();
    data.append("name", document.getElementById("name").value.trim());
    data.append("email", document.getElementById("email").value.trim());
    data.append("whatsapp", document.getElementById("whatsapp").value.trim());
    data.append("age", document.querySelector('input[name="age"]:checked')?.value || "");
    data.append("energy", document.querySelector('input[name="energy"]:checked')?.value || "");
    data.append("challenge", document.querySelector('input[name="challenge"]:checked')?.value || "");
    data.append("purpose", document.querySelector('input[name="purpose"]:checked')?.value || "");

    if (!data.get("name") || !data.get("email") || !data.get("whatsapp") || !data.get("age") || !data.get("energy") || !data.get("challenge") || !data.get("purpose")) {
        alert("Please complete all steps before submitting.");
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
    }

    const endpoint = "https://script.google.com/macros/s/AKfycbwJvT1lVUj1TuH_zOuEMZ4jsXj85us9hGoTlpsahGN82KKTvkK3XaERQfLh2-NutP6IaA/exec";
    fetch(endpoint, {
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === "success") {
            showStep(5);
        } else {
            alert("Submission failed: " + (res.message || "Unknown error"));
        }
    })
    .catch(err => {
        console.error("Form submission error:", err);
        alert("An error occurred. Please try again.");
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    showStep(0);
});
