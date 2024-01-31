// Function to create and show the button
function showButton() {
  const button = document.createElement("button");
  button.textContent = "Send Data";
  button.style.position = "fixed";
  button.style.bottom = "160px";
  button.style.right = "20px";
  button.style.backgroundColor = "#481310";
  button.style.borderRadius = "10px";

  document.body.appendChild(button);

  return button;
}

// Function for Saphire
function saphireExtractData() {
  console.log("Extracting data from the page...");

  // const title = document.querySelector(".t4s-product__title")
  //   ? document.querySelector(".t4s-product__title").textContent
  //   : "";
  const title = document.title.replace(" – SapphireOnline Store", "").trim();

  const content = document.querySelector("#content1")
    ? document.querySelector("#content1").innerHTML
    : "";
  const regularPrice = document.querySelector(".t4s-product-price .money")
    ? document.querySelector(".t4s-product-price .money").textContent
    : "";

  const regularPriceNumeric = regularPrice
    ? parseInt(regularPrice.replace(/[^\d]/g, "")) / 100
    : 0;

  const salePrice = regularPriceNumeric < 50 ? 0 : regularPriceNumeric - 50;

  const sku = document.querySelector(".t4s-sku-wrapper .t4s-sku-value")
    ? document.querySelector(".t4s-sku-wrapper .t4s-sku-value").textContent
    : "";
  const imgElement = document.querySelector(".t4s-lz--fadeIn.lazyloadt4sed");
  let featureImage = "";
  if (imgElement) {
    featureImage = imgElement.getAttribute("data-master") || "";
    featureImage = featureImage.replace(/^\/\//, "");
  }
  const imageElements = document.querySelectorAll(
    ".t4s-lz--fadeIn.lazyloadt4sed"
  );
  const imageUrls = Array.from(imageElements)
    .map((img) => {
      const dataMaster = img.getAttribute("data-master");
      return dataMaster ? dataMaster.replace(/^\/\//, "") : null;
    })
    .filter((url) => url !== null);

  const data = {
    title: title,
    content: content,
    regularPrice: parseFloat(regularPriceNumeric).toFixed(2),
    salePrice: parseFloat(salePrice).toFixed(2),
    sku: sku,
    featuredImage: featureImage,
    images: imageUrls,
    category: ["Sapphire"],
    store_link: window.location.href,
  };

  console.log("Extracted data:", data);

  return data;
}

// Function for Alkaram
function alkaramExtractData() {
  console.log("Extracting data from the page...");

  const titleElement = document.querySelector(".t4s-product__title");
  const title = titleElement ? titleElement.textContent.trim() : "";

  // Assuming Alkaram structure is similar, adjust selectors as needed
  const content = document.querySelector(
    "#t4s-tab-destemplate--16004768891060__main"
  )
    ? document
        .querySelector("#t4s-tab-destemplate--16004768891060__main")
        .innerHTML.trim()
    : "";

  const priceElement = document.querySelector(".t4s-product-price");
  const priceText = priceElement ? priceElement.textContent.trim() : "";
  console.log(priceText); // Just to verify the extracted text

  const priceMatch = priceText.match(/PKR\s*([\d,]+)/); // Match PKR followed by numerical values and commas
  console.log(priceMatch);
  const regularPriceNumeric = priceMatch
    ? parseFloat(priceMatch[1].replace(/,/g, ""))
    : 0; // Extract and remove commas
  const salePrice = regularPriceNumeric < 50 ? 0 : regularPriceNumeric - 50;

  const sku = document.querySelector(".t4s-sku-wrapper .t4s-sku-value")
    ? document.querySelector(".t4s-sku-wrapper .t4s-sku-value").textContent
    : "";

  const imgElement = document.querySelector(".t4s-lz--fadeIn.lazyloadt4sed");
  let featureImage = "";
  if (imgElement) {
    featureImage = imgElement.getAttribute("data-master") || "";
    featureImage = featureImage.replace(/^\/\//, "");
  }

  const imageElements = document.querySelectorAll(
    ".t4s-lz--fadeIn.lazyloadt4sed"
  );
  const imageUrls = Array.from(imageElements)
    .map((img) => {
      const dataMaster = img.getAttribute("data-master");
      return dataMaster ? dataMaster.replace(/^\/\//, "") : null;
    })
    .filter((url) => url !== null);

  const data = {
    title: title,
    content: content,
    regularPrice: parseFloat(regularPriceNumeric).toFixed(2),
    salePrice: parseFloat(salePrice).toFixed(2),
    sku: sku,
    featuredImage: featureImage,
    images: imageUrls,
    category: ["Alkaram"],
    store_link: window.location.href,
  };

  console.log("Extracted data:", data);

  return data;
}

// Validating page and sending data accordingly
function init() {
  const currentUrl = window.location.href;

  // Check saphire params
  const collectionPatternSaphire =
    /\/collections\/.*\/products\/[a-zA-Z0-9-]+$/;
  const specificPatternSaphire = /\/products\/[a-zA-Z0-9-]+$/;
  const isProductDetailPageSaphire =
    collectionPatternSaphire.test(currentUrl) ||
    specificPatternSaphire.test(currentUrl);
  const isSapphirePage = currentUrl.includes("sapphire");

  // Check Alkaram params
  const collectionPatternAlkaram =
    /\/collections\/.*\/products\/[a-zA-Z0-9-]+\?variant=\d+$/;
  const specificPatternAlkaram = /\/products\/[a-zA-Z0-9-]+\?variant=\d+$/;
  const isProductDetailPageAlkaram =
    collectionPatternAlkaram.test(currentUrl) ||
    specificPatternAlkaram.test(currentUrl);
  const isAlkaramPage = currentUrl.includes("alkaram");

  // Adding condition on params
  if (isProductDetailPageSaphire && isSapphirePage) {
    const sendButton = showButton();

    sendButton.addEventListener("click", function () {
      const extractedData = saphireExtractData();
      sendDataToAPI(extractedData);
    });
  } else if (isProductDetailPageAlkaram && isAlkaramPage) {
    const sendButton = showButton();

    sendButton.addEventListener("click", function () {
      const extractedData = alkaramExtractData();
      sendDataToAPI(extractedData);
    });
  } else {
    console.log(
      "Button not shown. Either not a product detail page or 'sapphire' not found in URL."
    );
  }
}

// Function to send data to the API endpoint
function sendDataToAPI(data) {
  console.log("Sending data to API...");

  const apiUrl = "https://92brands.com/wp-json/gl-custom/v1/create-product/";

  const apiData = {
    title: data.title,
    content: data.content,
    regular_price: data.regularPrice,
    sale_price: data.salePrice,
    sku: data.sku,
    // featured_image: data.featuredImage,
    images: data.images,
    category: data.category,
    store_link: data.store_link,
  };

  console.log("api data", apiData);

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to create product");
      }
    })
    .then((responseData) => {
      console.log(responseData);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

// Call the main function to initialize
init();
