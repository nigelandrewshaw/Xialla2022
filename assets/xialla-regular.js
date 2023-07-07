// Immediately execute the code
(function () {
  // Check if the current URL matches the desired URL
  if (window.location.href === "https://xialla.com/products/xialla") {
    // Get the variant ID of the desired variant
    var variantID = "31215755493469";

    // Construct the new URL with the variant parameter
    var newURL = "https://xialla.com/products/xialla?variant=" + variantID;

    // Modify the current URL without reloading the page
    window.history.replaceState(null, null, newURL);

    // Refresh the page to apply the variant selection
    window.location.reload();
  }
})();
