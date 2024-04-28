const baseUrl = "https://pay-test.raif.ru/api";
const accessToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJNQTYyMjk3NiIsImp0aSI6ImI1OTNkODRkLTk1MWYtNGIyZi05ZGViLTcxOWExNDM4NWVmZCJ9.si-87k3Aw5GN67orgJpoyTXC0C2OpWwRCKzLogRWawU";

function checkStatus({ qrId }) {
  const endpoint = "/sbp/v2/qrs/";

  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}${endpoint}${qrId.value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw Error(resp.statusText);
        }
        return resp.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((e) => {
        reject("QR-код не найден");
      });
  });
}

function handleSubmit(event) {
  event.preventDefault();
  const qrId = event.target.querySelector("[name=qrId]");

  checkStatus({ qrId })
    .then((result) => {
      const { qrStatus, qrId } = result;
      if (qrStatus === "PAID") {
        location.replace("./Web-app_Hackaton/html/paid.html");
      } else if (qrStatus === "NEW") {
        location.replace("./Web-app_Hackaton/html/not_paid.html");
      }
    })
    .catch((error) => {
      if (error === "QR-код не найден") {
        location.replace("./Web-app_Hackaton/html/404.html");
      } else {
        location.replace("./Web-app_Hackaton/html/not_paid.html");
      }
      // content.textContent = error;
    });
}

const form = document.querySelector(".form");
const content = document.querySelector(".content");

form.addEventListener("submit", handleSubmit);
